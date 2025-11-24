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
  targetId: string;
  reason: string;
  description?: string;
  contact?: string;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Pets
export async function createPet(doc: PetInput) {
  const ref = await addDoc(collection(db, 'pets'), {
    ...doc,
    createdAt: serverTimestamp(),
    isActive: true,
  });
  return ref.id;
}

export async function getPets() {
  const q = query(collection(db, 'pets'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as PetInput), createdAt: d.get('createdAt') as Timestamp }));
}

// Campaigns
export async function createCampaign(doc: CampaignInput) {
  const ref = await addDoc(collection(db, 'campaigns'), {
    ...doc,
    amountRaised: 0,
    status: doc.status ?? 'ativa',
    createdAt: serverTimestamp(),
    isActive: true,
  });
  return ref.id;
}

export async function getCampaigns() {
  const q = query(collection(db, 'campaigns'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as CampaignInput),
    createdAt: d.get('createdAt') as Timestamp,
  }));
}

// Reports
export async function createReport(doc: ReportInput) {
  const ref = await addDoc(collection(db, 'reports'), {
    ...doc,
    createdAt: serverTimestamp(),
    resolved: false,
  });
  return ref.id;
}

export async function getReports() {
  const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as ReportInput),
    createdAt: d.get('createdAt') as Timestamp,
  }));
}
