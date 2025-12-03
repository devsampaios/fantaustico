import { getApps, initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  getDocs,
  initializeFirestore,
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
  console.warn('[Firestore] Firebase não configurado. Variáveis faltando:', missingFirebaseKeys.join(', '));
} else {
  console.info('[Firestore] Todas as variáveis Firebase encontradas.');
}

const hasFirebaseConfig = missingFirebaseKeys.length === 0;

const app = hasFirebaseConfig ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) : null;
const db = app
  ? initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
      useFetchStreams: false,
    })
  : null;
const storage = app ? getStorage(app) : null;

if (app) {
  console.info('[Firestore] App inicializado com projeto:', firebaseConfig.projectId);
} else {
  console.warn('[Firestore] App não inicializado. Verifique configuração.');
}

type WithId<T> = T & { id: string; createdAt?: Timestamp | null };

function ensureDb() {
  if (!db) {
    throw new Error('Firebase não configurado. Preencha as variáveis VITE_FIREBASE_*.');
  }
  console.info('[Firestore] db disponível para uso.');
  return db;
}

function ensureStorage() {
  if (!storage) {
    throw new Error('Firebase Storage não configurado. Preencha as variáveis VITE_FIREBASE_*.');
  }
  console.info('[Firestore] storage disponível para uso.');
  return storage;
}

async function safeCall<T>(fn: () => Promise<T>, context: string, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.error(`Erro no Firestore (${context})`, error);
    return fallback;
  }
}

// Pets
export async function createPet(doc: PetInput) {
  const database = ensureDb();
  console.info('[Firestore] createPet payload:', doc);
  try {
    const ref = await addDoc(collection(database, 'pets'), {
      ...doc,
      createdAt: serverTimestamp(),
      isActive: true,
    });
    return ref.id;
  } catch (error) {
    console.error('Erro ao criar pet', error);
    throw new Error('Não foi possível salvar o pet. Verifique sua conexão ou tente novamente.');
  }
}

export async function getPets() {
  if (!db) {
    console.warn('Firebase não configurado. Retornando lista vazia.');
    return [];
  }
  console.info('[Firestore] getPets disparado.');

  return safeCall<WithId<PetInput>[]>(async () => {
    const q = query(collection(db, 'pets'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    console.info('[Firestore] getPets retornou docs:', snap.size);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as PetInput),
      createdAt: (d.get('createdAt') as Timestamp | null) ?? null,
    }));
  }, 'listar pets', []);
}

// Campaigns
export async function createCampaign(doc: CampaignInput) {
  const database = ensureDb();
  console.info('[Firestore] createCampaign payload:', doc);
  try {
    const ref = await addDoc(collection(database, 'campaigns'), {
      ...doc,
      amountRaised: 0,
      status: doc.status ?? 'ativa',
      createdAt: serverTimestamp(),
      isActive: true,
    });
    return ref.id;
  } catch (error) {
    console.error('Erro ao criar campanha', error);
    throw new Error('Não foi possível salvar a campanha. Verifique sua conexão ou tente novamente.');
  }
}

export async function getCampaigns() {
  if (!db) {
    console.warn('Firebase não configurado. Retornando lista vazia.');
    return [];
  }
  console.info('[Firestore] getCampaigns disparado.');

  return safeCall<WithId<CampaignInput>[]>(async () => {
    const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    console.info('[Firestore] getCampaigns retornou docs:', snap.size);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as CampaignInput),
      createdAt: (d.get('createdAt') as Timestamp | null) ?? null,
    }));
  }, 'listar campanhas', []);
}

// Reports
export async function createReport(doc: ReportInput) {
  const database = ensureDb();
  console.info('[Firestore] createReport payload:', doc);
  try {
    const ref = await addDoc(collection(database, 'reports'), {
      ...doc,
      createdAt: serverTimestamp(),
      resolved: false,
    });
    return ref.id;
  } catch (error) {
    console.error('Erro ao criar relato', error);
    throw new Error('Não foi possível salvar o relato. Verifique sua conexão ou tente novamente.');
  }
}

export async function getReports() {
  if (!db) {
    console.warn('Firebase não configurado. Retornando lista vazia.');
    return [];
  }
  console.info('[Firestore] getReports disparado.');

  return safeCall<WithId<ReportInput>[]>(async () => {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    console.info('[Firestore] getReports retornou docs:', snap.size);
    return snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as ReportInput),
      createdAt: (d.get('createdAt') as Timestamp | null) ?? null,
    }));
  }, 'listar relatos', []);
}

// Storage uploads
export async function uploadPetImage(file: File) {
  const firebaseStorage = ensureStorage();
  console.info('[Firestore] uploadPetImage arquivo:', file.name, file.size, file.type);
  try {
    const path = `pets/${Date.now()}-${file.name}`;
    const storageRef = ref(firebaseStorage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  } catch (error) {
    console.error('Erro ao fazer upload da imagem do pet', error);
    throw new Error('Falha ao enviar imagem do pet.');
  }
}

export async function uploadCampaignImage(file: File) {
  const firebaseStorage = ensureStorage();
  console.info('[Firestore] uploadCampaignImage arquivo:', file.name, file.size, file.type);
  try {
    const path = `campaigns/${Date.now()}-${file.name}`;
    const storageRef = ref(firebaseStorage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  } catch (error) {
    console.error('Erro ao fazer upload da imagem da campanha', error);
    throw new Error('Falha ao enviar imagem da campanha.');
  }
}
