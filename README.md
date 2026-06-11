# Luxury Estate — React

A bilingual (English/Arabic) luxury real estate platform built with React, TypeScript, and Node.js. Features user authentication, property browsing, favorites, booking management, and an admin portal — all wrapped in a premium EVREND design system.

## Tech Stack

| Layer        | Technology                                                   |
| ------------ | ------------------------------------------------------------ |
| Frontend     | React 19, TypeScript, Vite, TailwindCSS v4, i18next, Zustand |
| Backend      | Express, better-sqlite3, CORS                                |
| Testing      | Vitest + React Testing Library + jsdom                       |
| Languages    | English (en), Arabic (ar) — RTL-ready                        |

## Quick Start

```bash
# Prerequisites: Node.js 18+, npm 9+
npm install          # Install frontend dependencies

cd server
npm install          # Install backend dependencies
npm run dev          # Start backend on port 3001 (auto-seeds DB)
cd ..

npm run dev          # Start frontend Vite dev server on port 5173
```

Open `http://localhost:5173`. The Vite proxy forwards `/api/*` to the backend.

### Admin Access

Navigate to `/secure-portal` and log in with:

| Email               | Password  |
| ------------------- | --------- |
| admin@luxestate.com | admin123  |

## Directory Structure

```
├── server/                    # Express + SQLite backend
│   └── src/
│       ├── middleware/auth.ts  # Token-based auth
│       ├── routes/             # Auth, properties, favorites, leads, bookings
│       ├── schema.ts           # DDL + seed data
│       └── index.ts            # Server entry (port 3001)
├── src/
│   ├── components/             # Reusable UI (Button, Input, Navbar, etc.)
│   ├── features/
│   │   ├── admin/              # Admin pages (dashboard, leads, bookings, settings)
│   │   └── auth/               # AuthProvider, AdminGuard, login/register pages
│   ├── pages/                  # Route-level page components (lazy-loaded)
│   ├── services/               # API client, hash (SHA-256), storage helpers
│   ├── store/                  # Zustand stores (auth, favorites, properties, theme)
│   ├── locales/                # en.json, ar.json (200+ keys each)
│   ├── types/                  # TypeScript interfaces
│   ├── App.tsx                 # Routes with lazy-loading + Suspense
│   ├── index.css               # CSS variable theme system (light/dark)
│   └── main.tsx                # Entry point
├── qa/                         # Test files
├── docs/                       # Documentation
├── logs/                       # Test execution logs
├── vitest.config.ts
└── vite.config.ts              # Proxy /api → localhost:3001
```

## Features

- **Role-Based Access Control**: Guests → Users → Admins; `/forbidden` 403 page for unauthorized access
- **Password Security**: All passwords hashed with SHA-256 (Web Crypto API) — never stored in plaintext
- **API-First Persistence**: REST API via Express/SQLite; seamless localStorage fallback when offline
- **Route-Based Code Splitting**: 14 lazy-loaded chunks reduce main bundle to ~369 KB
- **Bilingual (EN/AR)**: Full i18next integration with RTL layout support for Arabic
- **Dark/Light Mode**: CSS custom property theme system with TailwindCSS dark variant
- **Favorites**: Per-user favorites store (`luxury-favorites-{userId}`), toggle from carousel/grid/detail views
- **Booking System**: Users book properties from detail page; admins view all bookings in read-only table
- **Lead Management**: User registrations auto-synced to leads; admins view read-only table
- **Profile Editing**: Users edit name, email, phone, password (requires old password verification)
- **Admin Settings**: Admins change their email/password (requires old password)

## Testing

```bash
npm test            # Run all 18 tests (Vitest)
```

| Suite            | Tests | Scope                          |
| ---------------- | ----- | ------------------------------ |
| `hash.test.ts`   | 9     | SHA-256 hashing + verification |
| `adminGuard.test.tsx` | 3 | RBAC redirect behavior         |
| `favorites.test.ts`  | 6 | Per-user persistence CRUD     |

## Documentation

| File                            | Purpose                          |
| ------------------------------- | -------------------------------- |
| `docs/ARCHITECTURE_REVIEW.md`   | Component architecture, data flow, code organization |
| `docs/SECURITY_REPORT.md`       | Security audit, findings, mitigations |
| `docs/PRODUCTION_READINESS.md`  | Go-live checklist, monitoring, deployment |
| `docs/QA_REPORT.md`             | Test results, coverage, quality metrics |
| `docs/SCALABILITY_REPORT.md`    | Performance, concurrent users, migration path |
| `docs/USER_MANUAL.md`           | End-user guide (guest, client, admin) |
| `docs/SYSTEM_MANUAL.md`         | System topology, database schema, RBAC, API reference |

## Build

```bash
npm run build       # Production build → 0 errors, ~420 modules, 369 KB main chunk
```
