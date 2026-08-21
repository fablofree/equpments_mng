import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  auth = inject(AuthService);
  appSettings = inject(AppSettingsService);
  layout = inject(LayoutService);

  get initials(): string {
    const u = this.auth.currentUser();
    if (!u) return '?';
    return `${u.prenom[0]}${u.nom[0]}`.toUpperCase();
  }

  get fullName(): string {
    const u = this.auth.currentUser();
    return u ? `${u.prenom} ${u.nom}` : '';
  }

  logout(): void {
    this.auth.logout();
  }
}
