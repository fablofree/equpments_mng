export interface Employee {
  id: number;
  nom: string;
  prenom: string;
  service: string;
  telephone: string;
  email: string;
}

export interface CreateEmployeePayload {
  nom: string;
  prenom: string;
  service: string;
  telephone: string;
  email: string;
}

export type UpdateEmployeePayload = Partial<CreateEmployeePayload>;
