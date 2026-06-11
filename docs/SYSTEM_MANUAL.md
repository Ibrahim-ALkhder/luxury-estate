# System Manual

## Table of Contents

1. [System Topology](#1-system-topology)
2. [Database Schema](#2-database-schema)
3. [Cryptographic Identity Matrix](#3-cryptographic-identity-matrix)
4. [Role-Based Access Control](#4-role-based-access-control)
5. [Scalability Architecture](#5-scalability-architecture)
6. [API Reference](#6-api-reference)
7. [Data Flow Diagrams](#7-data-flow-diagrams)

---

## 1. System Topology

```
┌──────────────────────────────────────────────────────────┐
│                     Browser (Client)                       │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  React 19 + TypeScript + Vite + TailwindCSS v4       │ │
│  │                                                      │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │ │
│  │  │ Zustand  │  │ i18next  │  │ React.lazy()     │  │ │
│  │  │ Stores   │  │ locales  │  │ 14 code-split    │  │ │
│  │  │          │  │ EN / AR  │  │ chunks           │  │ │
│  │  └──────────┘  └──────────┘  └──────────────────┘  │ │
│  │                                                      │ │
│  │  ┌────────────────────────────────────────────┐     │ │
│  │  │  Services Layer                             │     │ │
│  │  │  - api.ts (REST client + token mgmt)       │     │ │
│  │  │  - hash.ts (SHA-256 Web Crypto)            │     │ │
│  │  │  - storage.ts (typed localStorage helpers) │     │ │
│  │  │  - authService.ts (API-first, fallback)    │     │ │
│  │  └────────────────────────────────────────────┘     │ │
│  └──────────────────────────────────────────────────────┘ │
│                           │                                │
│                    Vite Proxy (/api → :3001)                │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTP (JSON)
┌──────────────────────▼───────────────────────────────────┐
│                  Express Server (:3001)                    │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Middleware Stack                                    │ │
│  │  - CORS                                              │ │
│  │  - JSON body parser                                  │ │
│  │  - Auth (Bearer token → userId lookup)               │ │
│  │  - Route handlers                                    │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Routes                                              │ │
│  │  POST   /api/auth/login                              │ │
│  │  POST   /api/auth/register                           │ │
│  │  GET    /api/auth/me                                 │ │
│  │  POST   /api/auth/logout                             │ │
│  │  PUT    /api/auth/profile                            │ │
│  │  GET    /api/properties                              │ │
│  │  GET    /api/properties/:id                          │ │
│  │  POST   /api/properties          (admin)             │ │
│  │  PUT    /api/properties/:id      (admin)             │ │
│  │  DELETE /api/properties/:id      (admin)             │ │
│  │  POST   /api/favorites/toggle                        │ │
│  │  GET    /api/favorites                               │ │
│  │  GET    /api/leads                (admin)            │ │
│  │  POST   /api/bookings                                │ │
│  │  GET    /api/bookings                                │ │
│  │  GET    /api/bookings/user                           │ │
│  └──────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  better-sqlite3 Database                             │ │
│  │  - WAL mode                                          │ │
│  │  - Foreign keys enabled                              │ │
│  │  - Auto-seeded on first run                          │ │
│  │  File: ./server/data/luxury.db                       │ │
│  └──────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Fallback Architecture

When the backend is unreachable, the frontend falls back to localStorage:

| Data              | API Endpoint       | Fallback Key                     |
| ----------------- | ------------------ | -------------------------------- |
| Users             | `/api/auth/*`      | `luxury-users`                   |
| Properties        | `/api/properties`  | `luxury-properties`              |
| Favorites         | `/api/favorites`   | `luxury-favorites-{userId}`      |
| Bookings          | `/api/bookings`    | `luxury-bookings`                |
| Leads             | `/api/leads`       | `luxury-leads`                   |
| Auth Token        | —                  | `luxury-api-token`               |

---

## 2. Database Schema

### Table: `users`

| Column        | Type      | Constraints               |
| ------------- | --------- | ------------------------- |
| id            | INTEGER   | PRIMARY KEY AUTOINCREMENT |
| name          | TEXT      | NOT NULL                  |
| email         | TEXT      | NOT NULL UNIQUE           |
| phone         | TEXT      | NOT NULL                  |
| password_hash | TEXT      | NOT NULL                  |
| role          | TEXT      | NOT NULL DEFAULT 'user'   |
| created_at    | DATETIME  | DEFAULT CURRENT_TIMESTAMP |

### Table: `properties`

| Column             | Type      | Constraints               |
| ------------------ | --------- | ------------------------- |
| id                 | INTEGER   | PRIMARY KEY AUTOINCREMENT |
| title_en           | TEXT      | NOT NULL                  |
| title_ar           | TEXT      | NOT NULL                  |
| location_en        | TEXT      | NOT NULL                  |
| location_ar        | TEXT      | NOT NULL                  |
| price              | REAL      | NOT NULL                  |
| type               | TEXT      | NOT NULL                  |
| status             | TEXT      | NOT NULL                  |
| image              | TEXT      | NOT NULL                  |
| description_en     | TEXT      | NOT NULL                  |
| description_ar     | TEXT      | NOT NULL                  |
| features_en        | TEXT      | NOT NULL                  |
| features_ar        | TEXT      | NOT NULL                  |
| amenities          | TEXT      | NOT NULL                  |
| bedrooms           | INTEGER   | NOT NULL                  |
| bathrooms          | INTEGER   | NOT NULL                  |
| area               | REAL      | NOT NULL                  |
| year_built         | INTEGER   |                           |
| created_at         | DATETIME  | DEFAULT CURRENT_TIMESTAMP |

### Table: `favorites`

| Column      | Type      | Constraints                                    |
| ----------- | --------- | ---------------------------------------------- |
| id          | INTEGER   | PRIMARY KEY AUTOINCREMENT                      |
| user_id     | INTEGER   | NOT NULL REFERENCES users(id) ON DELETE CASCADE |
| property_id | INTEGER   | NOT NULL REFERENCES properties(id) ON DELETE CASCADE |
| UNIQUE(user_id, property_id) |

### Table: `leads`

| Column      | Type      | Constraints               |
| ----------- | --------- | ------------------------- |
| id          | INTEGER   | PRIMARY KEY AUTOINCREMENT |
| name        | TEXT      | NOT NULL                  |
| email       | TEXT      | NOT NULL                  |
| phone       | TEXT      | NOT NULL                  |
| created_at  | DATETIME  | DEFAULT CURRENT_TIMESTAMP |

### Table: `bookings`

| Column      | Type      | Constraints                                    |
| ----------- | --------- | ---------------------------------------------- |
| id          | INTEGER   | PRIMARY KEY AUTOINCREMENT                      |
| user_id     | INTEGER   | NOT NULL REFERENCES users(id) ON DELETE CASCADE |
| property_id | INTEGER   | NOT NULL REFERENCES properties(id)             |
| name        | TEXT      | NOT NULL                                       |
| email       | TEXT      | NOT NULL                                       |
| phone       | TEXT      | NOT NULL                                       |
| date        | TEXT      | NOT NULL                                       |
| status      | TEXT      | NOT NULL DEFAULT 'pending'                     |
| created_at  | DATETIME  | DEFAULT CURRENT_TIMESTAMP |

---

## 3. Cryptographic Identity Matrix

### Password Hashing

| Aspect          | Detail                                           |
| --------------- | ------------------------------------------------ |
| Algorithm       | SHA-256 via Web Crypto API (`crypto.subtle.digest`) |
| Encoding        | Lowercase hexadecimal string (64 characters)     |
| Salt            | None (SHA-256 is deterministic; see note below)  |
| Storage         | `password_hash` column in `users` table          |
| Verification    | Hash input + compare to stored hash              |
| Length          | 256 bits                                         |

> **Note**: The current implementation uses bare SHA-256. In production, migrate to `bcrypt` or `argon2` with per-user salts as recommended by OWASP. This is tracked in the security roadmap.

### Token Authentication

| Aspect          | Detail                                           |
| --------------- | ------------------------------------------------ |
| Token Format    | UUID v4 (`crypto.randomUUID()`)                  |
| Storage         | In-memory `Map<token, userId>` on server         |
| Client Storage  | `luxury-api-token` key in localStorage           |
| Header          | `Authorization: Bearer <token>`                  |
| Expiration      | None (until server restart or explicit logout)   |
| Revocation      | `Map.delete(token)` on logout                    |

### Admin Credentials

| Aspect          | Detail                                           |
| --------------- | ------------------------------------------------ |
| Default Email   | `admin@luxestate.com` (configurable via `VITE_ADMIN_EMAIL` env var) |
| Default Password | `admin123`                                       |
| Stored Hash     | SHA-256 of `admin123` = `240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9` |
| Override        | Set `VITE_ADMIN_PWD_HASH` env var with custom SHA-256 hex string |

---

## 4. Role-Based Access Control

### Roles

| Role    | Description                                      | Accessible Areas                                   |
| ------- | ------------------------------------------------ | -------------------------------------------------- |
| `guest` | Not logged in (implicit)                         | Home, Properties, Property Details, Register, Login |
| `user`  | Registered and logged in                         | All guest areas + Profile, Favorites, My Bookings  |
| `admin` | Has `role: 'admin'` in user record               | All user areas + `/secure-portal/*`                |

### Guard Implementation

**`AdminGuard.tsx`** (src/features/auth/AdminGuard.tsx):
- Checks `useAuthStore` for `isLoggedIn` and `role === 'admin'`
- If not logged in → redirects to `/secure-portal` (login)
- If logged in but not admin → redirects to `/forbidden`
- If admin → renders children

**`AuthGuard.tsx`** (src/features/auth/AuthProvider.tsx):
- Checks if user is authenticated
- If not → redirects to `/login`
- If authenticated → renders children

**Protected Routes** (src/App.tsx):
```
/secure-portal              → AdminGuard wrapper
/secure-portal/dashboard    → AdminGuard
/secure-portal/leads        → AdminGuard
/secure-portal/bookings     → AdminGuard
/secure-portal/settings     → AdminGuard
/profile                    → AuthGuard
/profile/bookings           → AuthGuard
/forbidden                  → Public (no guard)
*                           → Redirects to /forbidden
```

### 403 Forbidden Page

The `/forbidden` page (`src/pages/Forbidden.tsx`):
- Displays a 403 error message (bilingual via i18next)
- Provides a link back to the home page
- Serves as the catch-all route for any undefined paths

---

## 5. Scalability Architecture

### Code Splitting

All 12 page-level components are lazy-loaded via `React.lazy()`:

| Chunk                  | Route Pattern      |
| ---------------------- | ------------------ |
| Home                   | `/`                |
| Properties             | `/properties`      |
| PropertyDetails        | `/properties/:id`  |
| LoginPage              | `/login`           |
| RegisterPage           | `/register`        |
| ProfilePage            | `/profile`         |
| MyBookings             | `/profile/bookings`|
| AdminLogin             | `/secure-portal`   |
| AdminDashboard         | `/secure-portal/dashboard` |
| LeadsPage              | `/secure-portal/leads`     |
| BookingsPage           | `/secure-portal/bookings`  |
| AdminSettings          | `/secure-portal/settings`  |
| Forbidden              | `/forbidden`, `*`  |

**Impact**: Main chunk reduced from ~550 KB to ~369 KB. Each lazy chunk is loaded only on demand.

### State Management

- **Zustand stores**: Auth, property, favorites, theme — scoped, no unnecessary re-renders
- **Favorites per user**: Keyed by `luxury-favorites-{userId}`, cleared on logout
- **No persist middleware**: Manual save/load pattern gives explicit control over serialization

### Backend Scaling Path

| Scale        | Strategy                                   |
| ------------ | ------------------------------------------ |
| < 1K users   | SQLite (current) — zero configuration      |
| < 10K users  | SQLite with connection pooling             |
| 10K+ users   | Migrate to PostgreSQL (same schema design) |
| 100K+ users  | Add Redis cache layer, read replicas       |
| 1M+ users    | Horizontal sharding, CDN for property images |

### Performance Budget

| Metric              | Current     | Target       |
| ------------------- | ----------- | ------------ |
| Main bundle size    | ~369 KB     | < 400 KB     |
| Lazy chunk size     | ~5-30 KB    | < 50 KB      |
| API response time   | < 50ms      | < 100ms      |
| First contentful paint | ~1.2s    | < 2s         |

---

## 6. API Reference

### Authentication

| Method | Endpoint             | Auth Required | Body                                      | Response              |
| ------ | -------------------- | ------------- | ----------------------------------------- | --------------------- |
| POST   | `/api/auth/login`    | No            | `{ email, password }`                      | `{ token, user }`     |
| POST   | `/api/auth/register` | No            | `{ name, email, phone, password }`         | `{ token, user }`     |
| GET    | `/api/auth/me`       | Yes           | —                                         | `{ user }`            |
| POST   | `/api/auth/logout`   | Yes           | —                                         | `{ message }`         |
| PUT    | `/api/auth/profile`  | Yes           | `{ name?, email?, phone?, oldPassword, newPassword? }` | `{ user }` |

### Properties

| Method | Endpoint               | Auth Required | Role   |
| ------ | ---------------------- | ------------- | ------ |
| GET    | `/api/properties`      | No            | Public |
| GET    | `/api/properties/:id`  | No            | Public |
| POST   | `/api/properties`      | Yes           | Admin  |
| PUT    | `/api/properties/:id`  | Yes           | Admin  |
| DELETE | `/api/properties/:id`  | Yes           | Admin  |

### Favorites

| Method | Endpoint                | Auth Required | Body                  |
| ------ | ----------------------- | ------------- | --------------------- |
| POST   | `/api/favorites/toggle` | Yes           | `{ propertyId }`      |
| GET    | `/api/favorites`        | Yes           | —                     |

### Leads

| Method | Endpoint         | Auth Required | Role   |
| ------ | ---------------- | ------------- | ------ |
| GET    | `/api/leads`     | Yes           | Admin  |

### Bookings

| Method | Endpoint              | Auth Required | Role           |
| ------ | --------------------- | ------------- | -------------- |
| POST   | `/api/bookings`       | Yes           | User           |
| GET    | `/api/bookings`       | Yes           | Admin          |
| GET    | `/api/bookings/user`  | Yes           | User           |

### Error Response Format

All errors return:
```json
{
  "error": "Human-readable error message"
}
```

HTTP status codes used:
- `200` — Success
- `201` — Created
- `400` — Bad request (missing fields, validation error)
- `401` — Unauthorized (missing/invalid token)
- `403` — Forbidden (insufficient role)
- `404` — Not found
- `409` — Conflict (duplicate email)
- `500` — Internal server error

---

## 7. Data Flow Diagrams

### Registration Flow

```
User → Register Form → AuthProvider.register()
  → hashService.hashPassword(password)
  → api.post('/api/auth/register', { name, email, phone, password_hash })
    → [Server] Validate inputs
    → [Server] Check email uniqueness
    → [Server] Insert into users table
    → [Server] Copy to leads table
    → [Server] Create token
    → [Server] Return { token, user }
  → [Client] Store token in localStorage
  → [Client] Set current user in authService
  → [Client] Navigate to home page
```

### Login Flow

```
User → Login Form → AuthProvider.login()
  → hash = await hashPassword(password)
  → api.post('/api/auth/login', { email, password_hash })
    → [Server] Lookup user by email
    → [Server] Compare hash
    → [Server] Create token
    → [Server] Return { token, user }
  → [Client] Store token
  → [Client] Load user favorites
  → [Client] Navigate to home page
```

### Booking Flow

```
User → PropertyDetail booking form → submitBooking()
  → api.post('/api/bookings', { propertyId, name, email, phone, date })
    → [Server] Validate user token
    → [Server] Insert into bookings table
    → [Server] Return { booking }
  → [Client] Show success message
```

### Favorites Toggle Flow

```
User clicks heart icon → favoritesStore.toggleFavorite(propertyId)
  → api.post('/api/favorites/toggle', { propertyId })
    → [Server] Check if favorite exists for user_id + property_id
    → [Server] If exists → DELETE, return { favorited: false }
    → [Server] If not → INSERT, return { favorited: true }
  → [Client] Update UI heart icon state
  → [Client] Persist to localStorage (fallback)
```

### Profile Update Flow

```
User → Profile form → updateProfile()
  → hashService.verifyPassword(oldPassword, storedHash) [frontend]
  → api.put('/api/auth/profile', { name, email, phone, oldPassword, newPassword? })
    → [Server] Verify old password hash
    → [Server] Update users table
    → [Server] Sync changes to leads table (if email/name/phone changed)
    → [Server] Sync changes to bookings table (if name/email/phone changed)
    → [Server] Return updated user
  → [Client] Update local state
```

---

## Environment Variables

| Variable               | Default                          | Description                    |
| ---------------------- | -------------------------------- | ------------------------------ |
| `VITE_ADMIN_EMAIL`     | `admin@luxestate.com`            | Admin login email              |
| `VITE_ADMIN_PWD_HASH`  | SHA-256 of `admin123`            | Admin password hash (hex)      |
| `PORT` (server)        | `3001`                           | Backend server port            |

---

## File Locations

| Component            | Path                          |
| -------------------- | ----------------------------- |
| Backend entry        | `server/src/index.ts`         |
| Database schema+seed | `server/src/schema.ts`        |
| Auth middleware      | `server/src/middleware/auth.ts` |
| Route handlers       | `server/src/routes/*.ts`      |
| Frontend entry       | `src/main.tsx`                |
| Route definitions    | `src/App.tsx`                 |
| API client           | `src/services/api.ts`         |
| Hash service         | `src/services/hash.ts`        |
| Auth service         | `src/services/authService.ts` |
| Storage helpers      | `src/services/storage.ts`     |
| Zustand stores       | `src/store/*.ts`              |
| Auth provider        | `src/features/auth/AuthProvider.tsx` |
| Admin guard          | `src/features/auth/AdminGuard.tsx`   |
| Translations         | `src/locales/{en,ar}.json`    |
| Tests                | `qa/*.test.{ts,tsx}`          |
| Vite config          | `vite.config.ts`              |
| Vitest config        | `vitest.config.ts`            |
| Tailwind config      | `tailwind.config.js`          |

## Debugging

### Backend Logs

The server logs all requests to stdout:
```
[INFO] POST /api/auth/login 200 12.345ms
[INFO] GET /api/properties 200 3.456ms
[ERROR] POST /api/auth/register 409 "Email already registered"
```

### Common Issues

| Symptom                          | Cause                              | Fix                               |
| -------------------------------- | ---------------------------------- | --------------------------------- |
| `ECONNREFUSED :3001`             | Backend not running                | `cd server && npm run dev`        |
| `401 Unauthorized`               | Token expired or missing           | Log out and log in again          |
| `403 Forbidden` on admin pages   | User has `role: 'user'`           | Log in with admin account         |
| Duplicate email on register      | Email already in use               | Use a different email or log in   |
| Profile save fails               | Wrong current password             | Enter your current password       |
| Favorites not persisting         | Backend offline                    | Will sync when backend is back up |

---

## Maintenance

### Backup Database

```bash
# Stop the backend
# Copy the SQLite database file
copy "server\data\luxury.db" "server\data\luxury-backup-YYYY-MM-DD.db"
```

### Reseeding Data

Delete the database file and restart the backend — the schema + seed logic in `schema.ts` will recreate it:

```bash
del server\data\luxury.db
cd server && npm run dev
```

### Applying Schema Changes

For production SQLite, use migration scripts. For development, delete the DB and reseed.

---

*Last updated: June 2026*
