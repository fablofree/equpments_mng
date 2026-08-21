import { Injectable, signal } from '@angular/core';

const SERVICES_KEY = 'ref_services';
const CATEGORIES_KEY = 'ref_categories';

const DEFAULT_SERVICES = [
  'Commercial', 'Direction', 'Finance', 'Informatique', 'Infrastructure',
  'Juridique', 'Logistique', 'Marketing', 'Ressources Humaines'
];

const DEFAULT_CATEGORIES = [
  'Accessoire', 'Équipement réseau', 'Imprimante', 'Moniteur',
  'Ordinateur fixe', 'Ordinateur portable', 'Serveur', 'Tablette', 'Téléphone'
];

@Injectable({ providedIn: 'root' })
export class ReferenceDataService {
  services = signal<string[]>(this.load(SERVICES_KEY, DEFAULT_SERVICES));
  categories = signal<string[]>(this.load(CATEGORIES_KEY, DEFAULT_CATEGORIES));

  private load(key: string, defaults: string[]): string[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [...defaults];
    } catch {
      return [...defaults];
    }
  }

  private persist(key: string, list: string[]): void {
    localStorage.setItem(key, JSON.stringify(list));
  }

  addService(name: string): void {
    const trimmed = name.trim();
    if (!trimmed || this.services().includes(trimmed)) return;
    const updated = [...this.services(), trimmed].sort((a, b) => a.localeCompare(b, 'fr'));
    this.services.set(updated);
    this.persist(SERVICES_KEY, updated);
  }

  removeService(name: string): void {
    const updated = this.services().filter(s => s !== name);
    this.services.set(updated);
    this.persist(SERVICES_KEY, updated);
  }

  addCategory(name: string): void {
    const trimmed = name.trim();
    if (!trimmed || this.categories().includes(trimmed)) return;
    const updated = [...this.categories(), trimmed].sort((a, b) => a.localeCompare(b, 'fr'));
    this.categories.set(updated);
    this.persist(CATEGORIES_KEY, updated);
  }

  removeCategory(name: string): void {
    const updated = this.categories().filter(c => c !== name);
    this.categories.set(updated);
    this.persist(CATEGORIES_KEY, updated);
  }

  resetServices(): void {
    this.services.set([...DEFAULT_SERVICES]);
    this.persist(SERVICES_KEY, DEFAULT_SERVICES);
  }

  resetCategories(): void {
    this.categories.set([...DEFAULT_CATEGORIES]);
    this.persist(CATEGORIES_KEY, DEFAULT_CATEGORIES);
  }
}
