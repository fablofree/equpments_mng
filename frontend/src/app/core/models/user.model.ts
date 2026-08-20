export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

export interface CreateUserPayload {
  nom: string;
  prenom: string;
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  nom?: string;
  prenom?: string;
  email?: string;
  password?: string;
}
