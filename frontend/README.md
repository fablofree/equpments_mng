# EquipManager — Frontend

Angular 19 dashboard for the **EquipManager** equipment management system. Communicates with the PHP REST API located in the `../api/` folder.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Project architecture](#project-architecture)
3. [Features](#features)
4. [Prerequisites](#prerequisites)
5. [Environment configuration](#environment-configuration)
6. [Development setup](#development-setup)
7. [Production build & deployment](#production-build--deployment)
8. [Useful CLI commands](#useful-cli-commands)

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Angular 19 (standalone components) |
| Styling | Bootstrap 5.3 + Bootstrap Icons |
| HTTP | Angular `HttpClient` with functional interceptor |
| Auth | JWT stored in `localStorage` |
| Forms | Angular Reactive Forms |
| Routing | Angular Router with lazy-loaded feature routes |
| Build tool | Angular Build (`@angular/build:application`) |

---

## Project architecture

```
frontend/
├── src/
│   ├── environments/
│   │   ├── environment.ts          # Development — API URL, flags
│   │   └── environment.prod.ts     # Production — API URL, flags
│   ├── styles.css                  # Global styles: CSS variables, sidebar, topbar, utilities
│   ├── index.html
│   ├── main.ts                     # Application bootstrap
│   └── app/
│       ├── app.ts                  # Root component (router-outlet only)
│       ├── app.config.ts           # provideRouter, provideHttpClient, interceptors
│       ├── app.routes.ts           # All routes (lazy-loaded per feature)
│       │
│       ├── core/                   # Singleton services, models, guards, interceptors
│       │   ├── models/
│       │   │   ├── api-response.model.ts   # ApiResponse<T>, PaginatedResponse<T>, Pagination
│       │   │   ├── user.model.ts
│       │   │   ├── employee.model.ts
│       │   │   ├── equipment.model.ts      # EquipmentStatus enum
│       │   │   ├── assignment.model.ts
│       │   │   └── dashboard.model.ts
│       │   ├── services/
│       │   │   ├── auth.service.ts         # login(), logout(), updateProfile(), currentUser signal
│       │   │   ├── user.service.ts
│       │   │   ├── employee.service.ts
│       │   │   ├── equipment.service.ts
│       │   │   ├── assignment.service.ts
│       │   │   └── dashboard.service.ts
│       │   ├── interceptors/
│       │   │   └── auth.interceptor.ts     # Attaches Authorization: Bearer <token> to every request
│       │   └── guards/
│       │       └── auth.guard.ts           # Redirects to /login when unauthenticated
│       │
│       ├── layout/                 # Shell components (rendered on every protected page)
│       │   ├── main-layout/        # Wraps sidebar + topbar + router-outlet
│       │   ├── sidebar/            # Section-grouped navigation with active-link highlighting
│       │   └── navbar/             # User avatar dropdown (profile, logout)
│       │
│       ├── shared/                 # Reusable, feature-agnostic components and pipes
│       │   ├── components/
│       │   │   └── pagination/     # Generic prev/next + page-number paginator
│       │   └── pipes/
│       │       └── status-label.pipe.ts    # Translates EquipmentStatus to French label
│       │
│       └── features/               # Feature modules — each lazy-loaded
│           ├── auth/login/         # Login page (email + password, show/hide toggle)
│           ├── dashboard/          # KPI cards, equipment status progress bars, quick-access buttons
│           ├── users/
│           │   ├── user-list/      # Searchable paginated table + inline delete confirmation
│           │   └── user-form/      # Create / edit user (password optional on edit)
│           ├── profile/            # Edit own name, email, password
│           ├── employees/
│           │   ├── employee-list/
│           │   └── employee-form/
│           ├── equipments/
│           │   ├── equipment-list/ # Searchable + filterable by status
│           │   └── equipment-form/
│           └── assignments/
│               ├── assignment-list/ # Active/returned filter + one-click return action
│               └── assignment-form/ # Loads only "disponible" equipment into the dropdown
```

### Routing overview

| Path | Component | Guard |
|---|---|---|
| `/login` | `LoginComponent` | — |
| `/dashboard` | `DashboardComponent` | `authGuard` |
| `/users` | `UserListComponent` | `authGuard` |
| `/users/new` | `UserFormComponent` | `authGuard` |
| `/users/:id/edit` | `UserFormComponent` | `authGuard` |
| `/profile` | `ProfileComponent` | `authGuard` |
| `/employees` | `EmployeeListComponent` | `authGuard` |
| `/employees/new` | `EmployeeFormComponent` | `authGuard` |
| `/employees/:id/edit` | `EmployeeFormComponent` | `authGuard` |
| `/equipments` | `EquipmentListComponent` | `authGuard` |
| `/equipments/new` | `EquipmentFormComponent` | `authGuard` |
| `/equipments/:id/edit` | `EquipmentFormComponent` | `authGuard` |
| `/assignments` | `AssignmentListComponent` | `authGuard` |
| `/assignments/new` | `AssignmentFormComponent` | `authGuard` |

### Data flow

```
Component
  └─► Service (core/services/)
        └─► HttpClient  ──[authInterceptor adds JWT]──► PHP API
                                                         └─► JSON response
```

---

## Features

- **Authentication** — JWT login, automatic token injection on every request, logout clears storage and redirects.
- **Dashboard** — live KPI tiles (total equipment, employees, active assignments, in-maintenance count) and per-status progress bars.
- **User management** — admin can create accounts, update credentials, delete users.
- **Profile** — any logged-in user can edit their own name, email, and password.
- **Employees** — full CRUD with search.
- **Equipments** — full CRUD with search and status filter (`disponible`, `affecte`, `maintenance`, `hors_service`).
- **Assignments** — create assignments (only `disponible` equipment selectable), register equipment returns, filter by active/returned.
- **Shared paginator** — reused across all list pages.
- **Debounced search** — 350 ms debounce with `switchMap` to avoid request flooding.

---

## Prerequisites

| Tool | Minimum version |
|---|---|
| Node.js | 18 LTS or later |
| npm | 9 or later |
| Angular CLI | 19+ (`npm install -g @angular/cli`) |
| PHP API | Running and reachable (see `../api/README.md`) |

---

## Environment configuration

There are two environment files. Choose the one that matches your target.

### `src/environments/environment.ts` (development)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost/equpments_mng/api/public/api'
};
```

Adjust `apiUrl` to match your local Apache/WampServer setup. Common alternatives:

| Setup | URL |
|---|---|
| WampServer, no virtual host | `http://localhost/equpments_mng/api/public/api` |
| Apache virtual host `equipments.backend` | `http://equipments.backend/api` |
| PHP built-in server on port 8000 | `http://localhost:8000/api` |

### `src/environments/environment.prod.ts` (production)

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-domain.com/api'
};
```

Replace `https://your-production-domain.com/api` with your actual API URL before building for production.

> The Angular build automatically swaps `environment.ts` with `environment.prod.ts` when running `ng build --configuration=production`.

---

## Development setup

```bash
# 1. Install dependencies
cd frontend
npm install

# 2. Start the dev server (uses environment.ts)
ng serve

# Open http://localhost:4200 in your browser
# The app reloads automatically on file changes.
```

Default admin credentials (seeded by the API):

| Field | Value |
|---|---|
| Email | `admin@esn.com` |
| Password | `Admin@1234` |

---

## Production build & deployment

### 1. Set the production API URL

Edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-domain.com/api'
};
```

### 2. Build the production bundle

```bash
ng build --configuration=production
```

Output is placed in `dist/frontend/browser/`.

### 3. Deploy to a web server

Copy the contents of `dist/frontend/browser/` to your web server's document root (Apache, Nginx, or any static host).

**Apache** — add a `.htaccess` at the root to support Angular's HTML5 routing:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

**Nginx** — add this inside your `server {}` block:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**CORS** — the PHP API already sends `Access-Control-Allow-Origin: *`, so no proxy configuration is required.

### 4. Environment variables at runtime (optional)

For containerized deployments where the API URL is not known at build time, replace the `apiUrl` value in `dist/frontend/browser/main.js` after the build, or use a runtime config file loaded via `APP_INITIALIZER`.

---

## Useful CLI commands

```bash
# Start dev server
ng serve

# Build for development (no optimization)
ng build --configuration=development

# Build for production (minified, tree-shaken)
ng build --configuration=production

# Generate a new standalone component
ng generate component features/my-feature/my-component --standalone

# Generate a new service
ng generate service core/services/my-service

# Generate a functional guard
ng generate guard core/guards/my-guard --functional

# Generate a functional interceptor
ng generate interceptor core/interceptors/my-interceptor --functional

# Check for outdated packages
ng update
```
When I affect an equipment to an employee, in the affection list only the Date Affectation displays, other fields aren't displayed (No value is visible)
When I create an Affectation allow the user to select the return date (not mandatory)
Allow the user to see an affectation, in the list the user can click in emplyee or equipement this redirect to that particular element

For each employee display his historic affectations, same for equipment
Allow the admin to Manage employee service and use it as a dropdown menu when creating or updating an employee
Also manage the Equipment Category in Equipment and display the dropdown when create or update an equipment
If the Equipement is already affected don't allow the user to change his status
