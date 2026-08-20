import { Injectable, signal } from '@angular/core';
import { AppSettings, DEFAULT_SETTINGS } from '../models/app-settings.model';

@Injectable({ providedIn: 'root' })
export class AppSettingsService {
  private readonly STORAGE_KEY = 'app_settings';

  settings = signal<AppSettings>(this.load());

  save(updated: AppSettings): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    this.settings.set(updated);
    this.applyTheme(updated);
  }

  reset(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.settings.set({ ...DEFAULT_SETTINGS });
    this.applyTheme(DEFAULT_SETTINGS);
  }

  applyTheme(s: AppSettings = this.settings()): void {
    const root = document.documentElement;
    const rgb = this.hexToRgb(s.primaryColor);
    root.style.setProperty('--primary', s.primaryColor);
    root.style.setProperty('--primary-dark', this.darken(s.primaryColor, 15));
    root.style.setProperty('--bs-primary', s.primaryColor);
    if (rgb) root.style.setProperty('--bs-primary-rgb', `${rgb.r},${rgb.g},${rgb.b}`);
    root.style.setProperty('--bs-link-color', s.primaryColor);
    root.style.setProperty('--bs-link-hover-color', this.darken(s.primaryColor, 15));
    this.updateFavicon(s.logoDataUrl);
    document.title = s.appName;
  }

  private load(): AppSettings {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  private updateFavicon(logoDataUrl: string | null): void {
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = logoDataUrl ?? 'favicon.ico';
    link.type = logoDataUrl ? 'image/png' : 'image/x-icon';
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
  }

  private darken(hex: string, pct: number): string {
    const rgb = this.hexToRgb(hex);
    if (!rgb) return hex;
    const d = (v: number) => Math.max(0, Math.round(v * (1 - pct / 100)));
    return `#${[d(rgb.r), d(rgb.g), d(rgb.b)].map(v => v.toString(16).padStart(2, '0')).join('')}`;
  }
}
