export type EquipmentStatus = 'disponible' | 'affecte' | 'maintenance' | 'hors_service';

export interface Equipment {
  id: number;
  reference: string;
  nom: string;
  categorie: string;
  marque: string;
  date_achat: string;
  etat: EquipmentStatus;
}

export interface CreateEquipmentPayload {
  reference: string;
  nom: string;
  categorie: string;
  marque: string;
  date_achat: string;
  etat?: EquipmentStatus;
}

export type UpdateEquipmentPayload = Partial<CreateEquipmentPayload>;
