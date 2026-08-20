export interface Assignment {
  id: number;
  employe_id: number;
  equipement_id: number;
  date_affectation: string;
  date_retour: string | null;
  active: boolean;
  employe?: { nom: string; prenom: string };
  equipement?: { nom: string; reference: string };
}

export interface CreateAssignmentPayload {
  employe_id: number;
  equipement_id: number;
  date_affectation?: string;
}

export interface ReturnAssignmentPayload {
  date_retour?: string;
}
