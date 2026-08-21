export interface Assignment {
  id: number;
  employe_id: number;
  equipement_id: number;
  date_affectation: string;
  date_retour: string | null;
  // Flat joined fields returned by the API JOIN query
  employe_nom?: string;
  employe_prenom?: string;
  equipement_nom?: string;
  equipement_ref?: string;
  // Present only if the controller adds it
  active?: boolean;
}

export interface CreateAssignmentPayload {
  employe_id: number;
  equipement_id: number;
  date_affectation?: string;
  date_retour?: string | null;
}

export interface ReturnAssignmentPayload {
  date_retour?: string;
}
