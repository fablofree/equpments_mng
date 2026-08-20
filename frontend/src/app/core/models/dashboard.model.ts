export interface DashboardStats {
  equipements: {
    total: number;
    disponibles: number;
    affectes: number;
    maintenance: number;
    hors_service: number;
  };
  employes: {
    total: number;
  };
  affectations: {
    actives: number;
  };
}
