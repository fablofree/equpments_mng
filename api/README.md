# API Gestion des Équipements Informatiques

Backend PHP RESTful pour la gestion du parc informatique d'une ESN. Architecture MVC modulaire, JWT, MySQL, déployable sur WampServer.

---

## Sommaire

1. [Architecture](#architecture)
2. [Arborescence du projet](#arborescence)
3. [Prérequis](#prérequis)
4. [Installation](#installation)
5. [Configuration Apache (WampServer)](#configuration-apache)
6. [Migrations et Seeds](#migrations-et-seeds)
7. [Authentification JWT](#authentification-jwt)
8. [Endpoints REST](#endpoints-rest)
9. [Format des réponses](#format-des-réponses)
10. [Sécurité](#sécurité)

---

## Architecture

```
Requête HTTP
    └─► public/index.php          (point d'entrée unique)
            └─► Application       (bootstrap + routing)
                    └─► CorsMiddleware
                    └─► Router (dispatch)
                            └─► AuthMiddleware (endpoints protégés)
                            └─► Controller
                                    └─► Service  (logique métier)
                                            └─► Repository  (accès données / PDO)
                                                    └─► MySQL
```

**Principes appliqués :** SRP · OCP · LSP · ISP · DIP · DRY · No active record.

---

## Arborescence

```
api/
├── app/
│   ├── Controllers/          # Gestion HTTP (entrée/sortie uniquement)
│   ├── Models/               # DTOs (User, Employee, Equipment, Assignment)
│   ├── Repositories/         # Accès données via PDO + interfaces
│   │   └── Interfaces/
│   ├── Services/             # Logique métier
│   ├── Middleware/           # AuthMiddleware, CorsMiddleware
│   └── Core/                 # Framework maison (Router, Request, Response, JwtManager, Validator…)
├── config/                   # bootstrap.php, database.php, jwt.php
├── database/
│   ├── migrations/           # Scripts SQL de création des tables
│   └── seeds/                # Données initiales
├── routes/
│   └── api.php               # Définition centralisée des routes
├── public/
│   └── index.php             # Point d'entrée Apache
├── storage/logs/             # Logs applicatifs (auto-créé)
├── .env.example              # Template de configuration
├── .htaccess                 # Règles Apache (racine)
└── README.md
```

---

## Prérequis

| Composant | Version minimum |
|-----------|----------------|
| WampServer | 3.x |
| PHP | 8.1+ |
| MySQL | 5.7+ / 8.0+ |
| Apache | 2.4+ avec `mod_rewrite` |

---

## Installation

### 1. Copier le projet

Copier le dossier `backend` dans le répertoire WampServer :

```
C:\wamp64\www\
```

### 2. Configurer l'environnement

```bash
# Copier le fichier d'exemple
copy .env.example .env
```

Éditer `.env` :

```env
APP_ENV=development
APP_DEBUG=true

DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=equipments_mng
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=0675fc155fa2b6bdefced153c6d05682fbc2e00158774ca75fe7de0c5b35c3be
JWT_EXPIRATION=86400
```

> **Générer une clé JWT sécurisée :**
> ```bash
> php -r "echo bin2hex(random_bytes(32));"
> ```

### 3. Créer la base de données

Dans phpMyAdmin ou MySQL CLI :

```sql
CREATE DATABASE equipments_mng
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

### 4. Exécuter les migrations

Dans l'ordre, via phpMyAdmin (onglet SQL) ou MySQL CLI :

```bash
mysql -u root -p equipments_mng < database/migrations/001_create_users_table.sql
mysql -u root -p equipments_mng < database/migrations/002_create_employees_table.sql
mysql -u root -p equipments_mng < database/migrations/003_create_equipments_table.sql
mysql -u root -p equipments_mng < database/migrations/004_create_assignments_table.sql
```

### 5. Exécuter les seeds

```bash
mysql -u root -p equipments_mng < database/seeds/001_seed_admin_user.sql
# (optionnel) données de démo
mysql -u root -p equipments_mng < database/seeds/002_seed_sample_data.sql
```

> Compte admin créé : `admin@gmail.com` / `admin@123`
> **Changer le mot de passe immédiatement après le premier login.**

---

## Configuration Apache

### Option A — Virtual Host dédié (recommandé)

Ajouter dans `C:\wamp64\bin\apache\apache2.x.x\conf\extra\httpd-vhosts.conf` :

```apache
<VirtualHost *:80>
    ServerName equipments.backend
    DocumentRoot "${INSTALL_DIR}/www/backend"

    <Directory "${INSTALL_DIR}/www/backend">
        Options +Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog  "${INSTALL_DIR}/logs/equipments_api_error.log"
    CustomLog "${INSTALL_DIR}/logs/equipments_api_access.log" combined
</VirtualHost>
```

Ajouter dans `C:\Windows\System32\drivers\etc\hosts` :

```
127.0.0.1 equipments.backend
```

Redémarrer WampServer. L'API sera disponible sur `http://equipments.backend/api/`.

### Option B — Sous-dossier (développement rapide)

Accès direct via : `http://localhost/backend/api/public/api/`

Aucune configuration supplémentaire n'est requise si `mod_rewrite` est activé.

### Activer mod_rewrite

Dans WampServer : clic gauche sur l'icône → Apache → Modules Apache → cocher `rewrite_module`.

---

## Authentification JWT

Toutes les routes sauf `POST /api/login` nécessitent un token JWT valide.

**Header requis :**
```
Authorization: Bearer <votre_token>
```

**Obtenir un token :**

```http
POST http://equipments.backend:api/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "admin@123"
}
```

**Réponse :**
```json
{
  "success": true,
  "message": "Connexion réussie.",
  "data": {
    "token": "eyJ...",
    "user": { "id": 1, "nom": "Administrateur", "prenom": "Système", "email": "admin@esn.com" }
  }
}
```

---

## Endpoints REST

### Authentification

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/api/login` | Non | Connexion |

### Utilisateurs

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users?page=1&limit=10&q=dupont` | Liste (paginée, recherche optionnelle) |
| GET | `/api/users/{id}` | Détail |
| POST | `/api/users` | Créer |
| PUT | `/api/users/{id}` | Modifier |
| DELETE | `/api/users/{id}` | Supprimer |

**Body POST/PUT :**
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "jean@esn.com",
  "password": "MonMotDePasse1!"
}
```

### Employés

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/employees?page=1&limit=10&q=martin` | Liste paginée |
| GET | `/api/employees/{id}` | Détail |
| POST | `/api/employees` | Créer |
| PUT | `/api/employees/{id}` | Modifier |
| DELETE | `/api/employees/{id}` | Supprimer |

**Body POST/PUT :**
```json
{
  "nom": "Martin",
  "prenom": "Sophie",
  "service": "Infrastructure",
  "telephone": "0612345678",
  "email": "sophie.martin@esn.com"
}
```

### Équipements

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/equipments?page=1&limit=10&q=dell&etat=disponible` | Liste paginée + filtre |
| GET | `/api/equipments/{id}` | Détail |
| POST | `/api/equipments` | Créer |
| PUT | `/api/equipments/{id}` | Modifier |
| DELETE | `/api/equipments/{id}` | Supprimer |

**Valeurs `etat` autorisées :** `disponible`, `affecte`, `maintenance`, `hors_service`

**Body POST/PUT :**
```json
{
  "reference": "PC-042",
  "nom": "Laptop Dell XPS 15",
  "categorie": "Ordinateur portable",
  "marque": "Dell",
  "date_achat": "2024-01-15",
  "etat": "disponible"
}
```

### Affectations

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/assignments?page=1&limit=10&active=true` | Liste (filtre actives) |
| GET | `/api/assignments/{id}` | Détail |
| POST | `/api/assignments` | Affecter un équipement |
| POST | `/api/assignments/{id}/return` | Retourner un équipement |
| GET | `/api/employees/{id}/assignments` | Historique employé |
| GET | `/api/equipments/{id}/assignments` | Historique équipement |

**Body POST /api/assignments :**
```json
{
  "employe_id": 1,
  "equipement_id": 2,
  "date_affectation": "2024-06-01"
}
```

**Body POST /api/assignments/{id}/return :**
```json
{
  "date_retour": "2024-06-30"
}
```

### Dashboard

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/dashboard/statistics` | Statistiques globales |

**Réponse :**
```json
{
  "success": true,
  "data": {
    "equipements": {
      "total": 42, "disponibles": 30, "affectes": 8, "maintenance": 3, "hors_service": 1
    },
    "employes": { "total": 25 },
    "affectations": { "actives": 8 }
  }
}
```

---

## Format des réponses

### Succès

```json
{ "success": true, "message": "Opération effectuée avec succès", "data": {} }
```

### Liste paginée

```json
{
  "success": true,
  "message": "Opération effectuée avec succès",
  "data": [],
  "pagination": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
}
```

### Erreur

```json
{ "success": false, "message": "Description de l'erreur" }
```

### Erreur de validation

```json
{
  "success": false,
  "message": "Erreur de validation des données.",
  "errors": {
    "email": ["Le champ « email » doit être une adresse e-mail valide."],
    "nom":   ["Le champ « nom » est obligatoire."]
  }
}
```

### Codes HTTP utilisés

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Ressource créée |
| 204 | Suppression réussie |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Accès interdit |
| 404 | Ressource introuvable |
| 422 | Erreur de validation / règle métier |
| 500 | Erreur serveur |

---

## Sécurité

- **JWT** : signature HMAC-SHA256, expiration configurable, vérification systématique.
- **Mots de passe** : `password_hash(PASSWORD_BCRYPT)` uniquement, jamais en clair.
- **SQL** : requêtes préparées PDO exclusivement, aucune interpolation de variables.
- **Validation** : toutes les entrées sont validées avant traitement.
- **Erreurs** : messages techniques masqués en production (`APP_DEBUG=false`).
- **Logs** : exceptions enregistrées dans `storage/logs/app-YYYY-MM-DD.log`.
- **Headers** : CORS restreint, `X-Content-Type-Options`, `X-Frame-Options` actifs.
- **Fichiers sensibles** : `.env` et répertoires métier bloqués par `.htaccess`.

### Checklist avant mise en production

- [ ] `APP_DEBUG=false` dans `.env`
- [ ] `APP_ENV=production` dans `.env`
- [ ] Clé JWT longue et aléatoire (≥ 32 octets)
- [ ] Mot de passe admin changé
- [ ] HTTPS activé (décommenter la règle dans `.htaccess`)
- [ ] `DB_PASSWORD` non vide
- [ ] Permissions `storage/` : `755` (dossier) / `644` (fichiers)
- [ ] Fichier `.env` non inclus dans le dépôt Git (`.gitignore`)

---

## Génération d'un hash bcrypt (utilitaire)

```bash
php -r "echo password_hash('VotreMotDePasse', PASSWORD_BCRYPT, ['cost' => 12]);"
```

---

## Licence

Projet interne — usage réservé à l'ESN.
