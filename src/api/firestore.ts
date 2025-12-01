import { initializeApp, getApps } from 'firebase/app';
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

type PetType = 'perdido' | 'encontrado' | 'adocao' | 'denuncia';
type PetStatus = 'perdido' | 'encontrado' | 'para_adocao';
type CampaignStatus = 'ativa' | 'pausada' | 'encerrada';

export interface PetInput {
  type: PetType;
  status: PetStatus;
  name: string;
  species: string;
  breed?: string;
  ageLabel?: string;
  location: string;
  contact: string;
  contactName?: string;
  contactEmail?: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
}

export interface CampaignInput {
  orgName: string;
  title: string;
  description: string;
  goal: number;
  pixKey?: string;
  contact: string;
  imageUrl?: string;
  status?: CampaignStatus;
}

export interface ReportInput {
  targetType: 'pet' | 'campaign';
  targetId?: string;
  reason: string;
  description?: string;
  contact?: string;
  // Campos adicionais para casos de pets (perdido/denúncia)
  type?: PetType;
  status?: PetStatus;
  name?: string;
  species?: string;
  breed?: string;
  ageLabel?: string;
  location?: string;
  imageUrl?: string;
  contactName?: string;
  contactEmail?: string;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const missingFirebaseKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseKeys.length) {
  console.warn('Firebase não configurado. Variáveis faltando:', missingFirebaseKeys.join(', '));
}

const isFirebaseEnabled = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);
const app = isFirebaseEnabled ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) : null;
const db = app ? getFirestore(app) : null;
const storage = app ? getStorage(app) : null;

const FIRESTORE_TIMEOUT_MS = 10000;

function ensureDb() {
  if (!db) {
    throw new Error('Firebase não configurado. Preencha as variáveis de ambiente.');
  }
  return db;
}

function ensureStorage() {
  if (!storage) {
    throw new Error('Firebase Storage não configurado. Preencha as variáveis de ambiente.');
  }
  return storage;
}

async function runWithTimeout<T>(promise: Promise<T>, context: string, fallback?: T): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`${context} expirou após ${FIRESTORE_TIMEOUT_MS / 1000}s.`)), FIRESTORE_TIMEOUT_MS),
  );

  try {
    return (await Promise.race([promise, timeout])) as T;
  } catch (error) {
    const normalizedError = error instanceof Error ? error : new Error('Erro desconhecido no Firestore');
    if (fallback !== undefined) {
      console.error(`Erro no Firestore (${context})`, normalizedError);
      return fallback;
    }
    normalizedError.message = `${context}: ${normalizedError.message}`;
    throw normalizedError;
  }
}

// Pets
export async function createPet(doc: PetInput) {
  try {
    const database = ensureDb();
    const ref = await runWithTimeout(
      addDoc(collection(database, 'pets'), {
        ...doc,
        createdAt: serverTimestamp(),
        isActive: true,
      }),
      'criar pet',
    );
    return ref.id;
  } catch (error) {
    console.error('Erro ao criar pet', error);
    throw new Error('Não foi possível salvar o pet. Tente novamente em instantes.');
  }
}

export async function getPets() {
  if (!db) {
    console.warn('Firebase não configurado. Retornando lista vazia.');
    return Promise.resolve<PetInput[]>([]);
  }
  try {
    const q = query(collection(db, 'pets'), orderBy('createdAt', 'desc'));
    const snap = await runWithTimeout(getDocs(q), 'listar pets');
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as PetInput),
      createdAt: d.get('createdAt') as Timestamp,
    }));
  } catch (error) {
    console.error('Erro ao buscar pets', error);
    return [];
  }
}

// Campaigns
export async function createCampaign(doc: CampaignInput) {
  try {
    const database = ensureDb();
    const ref = await runWithTimeout(
      addDoc(collection(database, 'campaigns'), {
        ...doc,
        amountRaised: 0,
        status: doc.status ?? 'ativa',
        createdAt: serverTimestamp(),
        isActive: true,
      }),
      'criar campanha',
    );
    return ref.id;
  } catch (error) {
    console.error('Erro ao criar campanha', error);
    throw new Error('Não foi possível salvar a campanha. Tente novamente em instantes.');
  }
}

export async function getCampaigns() {
  if (!db) {
    console.warn('Firebase não configurado. Retornando lista vazia.');
    return Promise.resolve<CampaignInput[]>([]);
  }
  try {
    const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
    const snap = await runWithTimeout(getDocs(q), 'listar campanhas');
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as CampaignInput),
      createdAt: d.get('createdAt') as Timestamp,
    }));
  } catch (error) {
    console.error('Erro ao buscar campanhas', error);
    return [];
  }
}

// Reports
export async function createReport(doc: ReportInput) {
  try {
    const database = ensureDb();
    const ref = await runWithTimeout(
      addDoc(collection(database, 'reports'), {
        ...doc,
        createdAt: serverTimestamp(),
        resolved: false,
      }),
      'criar denúncia/relato',
    );
    return ref.id;
  } catch (error) {
    console.error('Erro ao criar relato', error);
    throw new Error('Não foi possível salvar o relato. Tente novamente em instantes.');
  }
}

export async function getReports() {
  if (!db) {
    console.warn('Firebase não configurado. Retornando lista vazia.');
    return Promise.resolve<ReportInput[]>([]);
  }
  try {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    const snap = await runWithTimeout(getDocs(q), 'listar relatos');
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as ReportInput),
      createdAt: d.get('createdAt') as Timestamp,
    }));
  } catch (error) {
    console.error('Erro ao buscar relatos', error);
    return [];
  }
}

// Storage uploads
export async function uploadPetImage(file: File) {
  try {
    const firebaseStorage = ensureStorage();
    const path = `pets/${Date.now()}-${file.name}`;
    const storageRef = ref(firebaseStorage, path);
    await runWithTimeout(uploadBytes(storageRef, file), 'upload de imagem de pet');
    return runWithTimeout(getDownloadURL(storageRef), 'URL de imagem de pet');
  } catch (error) {
    console.error('Erro ao fazer upload da imagem do pet', error);
    throw new Error('Falha ao enviar imagem do pet.');
  }
}

export async function uploadCampaignImage(file: File) {
  try {
    const firebaseStorage = ensureStorage();
    const path = `campaigns/${Date.now()}-${file.name}`;
    const storageRef = ref(firebaseStorage, path);
    await runWithTimeout(uploadBytes(storageRef, file), 'upload de imagem de campanha');
    return runWithTimeout(getDownloadURL(storageRef), 'URL de imagem de campanha');
  } catch (error) {
    console.error('Erro ao fazer upload da imagem da campanha', error);
    throw new Error('Falha ao enviar imagem da campanha.');
  }
}
