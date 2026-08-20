import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/user-list/user-list.component').then(m => m.UserListComponent)
      },
      {
        path: 'users/new',
        loadComponent: () => import('./features/users/user-form/user-form.component').then(m => m.UserFormComponent)
      },
      {
        path: 'users/:id/edit',
        loadComponent: () => import('./features/users/user-form/user-form.component').then(m => m.UserFormComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'employees',
        loadComponent: () => import('./features/employees/employee-list/employee-list.component').then(m => m.EmployeeListComponent)
      },
      {
        path: 'employees/new',
        loadComponent: () => import('./features/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
      },
      {
        path: 'employees/:id/edit',
        loadComponent: () => import('./features/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent)
      },
      {
        path: 'equipments',
        loadComponent: () => import('./features/equipments/equipment-list/equipment-list.component').then(m => m.EquipmentListComponent)
      },
      {
        path: 'equipments/new',
        loadComponent: () => import('./features/equipments/equipment-form/equipment-form.component').then(m => m.EquipmentFormComponent)
      },
      {
        path: 'equipments/:id/edit',
        loadComponent: () => import('./features/equipments/equipment-form/equipment-form.component').then(m => m.EquipmentFormComponent)
      },
      {
        path: 'assignments',
        loadComponent: () => import('./features/assignments/assignment-list/assignment-list.component').then(m => m.AssignmentListComponent)
      },
      {
        path: 'assignments/new',
        loadComponent: () => import('./features/assignments/assignment-form/assignment-form.component').then(m => m.AssignmentFormComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
