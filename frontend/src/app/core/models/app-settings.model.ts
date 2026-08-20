export interface AppSettings {
  appName: string;
  tagline: string;
  logoDataUrl: string | null;
  primaryColor: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  appName: 'EquipManager',
  tagline: 'Gestion du parc informatique',
  logoDataUrl: null,
  primaryColor: '#2563eb',
  companyName: '',
  contactEmail: '',
  contactPhone: ''
};
