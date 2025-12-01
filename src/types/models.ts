export type PetType = 'perdido' | 'encontrado' | 'adocao' | 'denuncia';
export type PetStatus = 'perdido' | 'encontrado' | 'para_adocao';
export type CampaignStatus = 'ativa' | 'pausada' | 'encerrada';
export type ReportTargetType = 'pet' | 'campaign';

export interface Pet {
  id: string;
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
  createdAt?: unknown;
}

export interface Campaign {
  id: string;
  orgName: string;
  title: string;
  description: string;
  goal: number;
  amountRaised: number;
  pixKey?: string;
  contact: string;
  imageUrl?: string;
  status?: CampaignStatus;
  createdAt?: unknown;
}

export interface Report {
  id: string;
  targetType: ReportTargetType;
  targetId?: string;
  reason: string;
  description?: string;
  contact?: string;
  resolved?: boolean;
  createdAt?: unknown;
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
