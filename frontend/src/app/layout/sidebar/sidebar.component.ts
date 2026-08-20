import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  navItems = [
    { label: 'Tableau de bord', icon: 'bi-speedometer2', route: '/dashboard', section: 'Principal' },
    { label: 'Employés', icon: 'bi-people', route: '/employees', section: 'Gestion' },
    { label: 'Équipements', icon: 'bi-laptop', route: '/equipments', section: 'Gestion' },
    { label: 'Affectations', icon: 'bi-link-45deg', route: '/assignments', section: 'Gestion' },
    { label: 'Utilisateurs', icon: 'bi-person-gear', route: '/users', section: 'Administration' },
    { label: 'Mon profil', icon: 'bi-person-circle', route: '/profile', section: 'Administration' }
  ];

  get sections(): string[] {
    return [...new Set(this.navItems.map(i => i.section))];
  }

  itemsFor(section: string) {
    return this.navItems.filter(i => i.section === section);
  }
}
