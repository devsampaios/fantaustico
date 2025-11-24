export type PetType = 'perdido' | 'encontrado' | 'adocao' | 'denuncia';
export type PetStatus = 'perdido' | 'encontrado' | 'para_adocao';
export type CampaignStatus = 'ativa' | 'pausada' | 'encerrada';

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
