# Architecture Review — LUXESTATE Real Estate Platform

## 1. Project Overview

| Property | Value |
|---|---|
| **Application** | LUXESTATE — Luxury Real Estate Platform |
| **Version** | 1.0.0 |
| **Type** | Single Page Application (SPA) |
| **Stack** | React 18, TypeScript 5, Vite 5, Tailwind CSS 3.4 |
| **State** | Zustand 4 (localStorage-persisted) |
| **Routing** | React Router DOM v6 |
| **i18n** | i18next + react-i18next (EN/AR) |
| **Animations** | Framer Motion, GSAP, Three.js |
| **Build** | 414 modules, 0 TypeScript errors |

---

## 2. Architecture Style

**Current**: Monolithic SPA with file-based feature grouping.

**Structure**:
```
src/
├── components/        # Shared UI (layout, sections, forms, 3d, animations)
├── features/          # Domain modules (auth, admin, favorites, profile)
├── pages/             # Route-level pages (Home, Properties, PropertyDetails)
├── store/             # Zustand state stores
├── locales/           # i18n translation files (en.json, ar.json)
├── types/             # TypeScript interfaces
├── lib/               # Utilities (ThemeProvider, cn())
├── data/              # Legacy data module (partial)
├── assets/            # Static images
├── i18n.ts            # i18next config
├── index.css          # Global styles + design system
├── App.tsx            # Root component + routing
└── main.tsx           # Entry point
```

**Architecture Score**: 6/10 — Good separation by domain, but lacks:
- Backend/service layer abstraction
- API client module
- Environment configuration
- Repository pattern for data access
- Dependency injection

---

## 3. Data Flow

### Current State (All Client-Side)

```
User Action → React Component → Zustand Store → localStorage
                                               ↓
                                        (no backend)
```

### Data Storage Locations (localStorage)

| Key | Type | Purpose |
|---|---|---|
| `luxury-properties` | JSON array | Property CRUD data |
| `luxury-users` | JSON array | Registered user accounts |
| `luxury-current-user` | JSON object | Active session user |
| `luxury-pwd-{email}` | Plaintext string | User password |
| `luxury-favorites-{userId}` | JSON array of IDs | Per-user favorites |
| `luxury-leads` | JSON array | Lead records from registration |
| `luxury-bookings` | JSON array | Property booking records |
| `luxury-admins` | JSON array | Admin accounts (currently unused) |
| `luxestate-theme` | `'dark'` / `'light'` | Theme preference |

**Data Flow Score**: 3/10 — No backend, plaintext passwords, localStorage as primary database.

---

## 4. Authentication & Authorization

### User Authentication (AuthProvider)
- **Mechanism**: Email/password stored in localStorage
- **Password Storage**: Plaintext (`luxury-pwd-{email}`)
- **Session**: User object in `luxury-current-user`
- **Register**: Creates User + Lead records
- **Login**: Validates against localStorage

### Admin Authentication (authStore)
- **Mechanism**: Hardcoded credentials
- **Credentials**: `admin@luxestate.com` / `admin123`
- **Session**: Zustand store boolean flag

### Route Guards
| Guard | Redirect | Purpose |
|---|---|---|
| `AuthGuard` | `/login` | Protects `/profile/*` |
| `AdminGuard` | `/secure-portal` | Protects `/secure-portal/*` |

**Auth Score**: 2/10 — No hashed passwords, hardcoded admin, no JWT/session tokens, no OAuth.

---

## 5. Routing Structure

| Path | Component | Guard | Purpose |
|---|---|---|---|
| `/` | Home | None | Landing page |
| `/properties` | Properties | None | Property listing |
| `/properties/:id` | PropertyDetails | None | Single property |
| `/login` | LoginPage | None | User sign-in |
| `/register` | RegisterPage | None | User sign-up |
| `/profile` | ProfilePage | AuthGuard | User profile |
| `/profile/favorites` | FavoritesPage | AuthGuard | Saved properties |
| `/profile/bookings` | MyBookings | AuthGuard | User bookings |
| `/secure-portal` | AdminLogin | None | Admin login |
| `/secure-portal/dashboard` | AdminDashboard | AdminGuard | Property CRUD |
| `/secure-portal/leads` | LeadsPage | AdminGuard | Lead management |
| `/secure-portal/bookings` | BookingsPage | AdminGuard | Booking overview |
| `/secure-portal/settings` | AdminSettings | AdminGuard | Admin account |

**Missing**: `*` (404 catch-all), route-based code splitting, lazy loading.

---

## 6. Design System

### Theme (CSS Custom Properties)
- **Light Mode**: Warm cream (#F6F4EF bg, #1C1814 text, #FAF7F2 cards)
- **Dark Mode**: Deep navy (#050816 bg, #FFFFFF text, #101827 cards)
- **Accent**: Gold (#F5B700) throughout
- **Shadows**: Context-aware via CSS variables (`--shadow-luxury`, `--shadow-gold`)

### Tailwind Configuration
- Custom colors: `background`, `secondary`, `card`, `gold` (50-900), `muted`, `cream` (50-900), `charcoal` (50-900)
- Custom shadows: `gold`, `gold-glow`, `gold-glow-lg`, `luxury`, `glass`
- Custom animations: `float`, `pulse-gold`, `drift`
- Bilingual fonts: Poppins (EN), Tajawal (AR)
- Dark mode via `class` strategy

### Reusable Classes (in index.css)
- `.glass`, `.glass-dark`, `.glass-gold` — glassmorphism effects
- `.btn-primary`, `.btn-outline`, `.btn-ghost` — button variants
- `.input-field` — form inputs
- `.card`, `.card-hover` — card containers
- `.text-gradient` — gold gradient text
- `.section-title`, `.section-subtitle` — typography

**Design System Score**: 7/10 — Solid foundation but UI component library (`Button.tsx`, `Input.tsx`) references non-existent Tailwind colors (`warm-500`, `beige-300`).

---

## 7. Internationalization

- **Framework**: i18next + react-i18next + browser language detector
- **Languages**: English (`en.json`), Arabic (`ar.json`)
- **Structure**: ~240 translation keys per language, feature-grouped
- **RTL Support**: CSS rules for `dir="rtl"` (direction, text-align, flex-direction, spacing)
- **Language Detection**: Browser preference, persisted
- **Property Data**: Bilingual (`title.en`/`title.ar`, `location.en`/`location.ar`, etc.)

**i18n Score**: 8/10 — Complete coverage, good structure, proper RTL support.

---

## 8. State Management

### Zustand Stores

| Store | Persistence | Key |
|---|---|---|
| `propertyStore` | zustand persist | `luxury-properties` |
| `favoritesStore` | Manual | `luxury-favorites-{userId}` |
| `authStore` | None (RAM) | — |

**Pattern**: Stores are flat, no middleware, no selectors, no normalized data.

---

## 9. Security Posture (See SECURITY_REPORT.md for full details)

| Issue | Severity | Location |
|---|---|---|
| Plaintext passwords | **CRITICAL** | `luxury-pwd-{email}` |
| Hardcoded admin credentials | **HIGH** | `src/store/authStore.ts` |
| No backend authentication | **HIGH** | Entire auth system |
| localStorage XSS vulnerability | **MEDIUM** | All storage |
| No CSRF protection | **MEDIUM** | — |
| No rate limiting | **LOW** | All forms |
| No input sanitization | **LOW** | Forms |
| Admin secret URL exposed | **LOW** | Route definition |

---

## 10. Performance Observations

- **Build size**: 550 KB JS (single chunk), 37 KB CSS
- **Chunk warning**: Single bundle exceeds 500 KB
- **No code splitting**: All routes bundled together
- **No lazy loading**: All components loaded eagerly
- **Three.js scene**: Loaded on every page (in `Home.tsx`)
- **Images**: Local static assets only, no optimization pipeline
- **Fonts**: Google Fonts (Poppins + Tajawal), FontAwesome CDN

---

## 11. Recommendations (Priority Order)

1. **🔴 CRITICAL**: Replace plaintext passwords with hashed storage (or migrate to backend auth)
2. **🔴 CRITICAL**: Remove hardcoded admin credentials, implement proper admin registration flow
3. **🟡 HIGH**: Implement backend service (Node.js + SQLite for local development)
4. **🟡 HIGH**: Add proper API abstraction layer (axios/fetch wrapper)
5. **🟡 HIGH**: Implement JWT-based session management
6. 🟢 MEDIUM: Add code splitting / lazy loading for routes
7. 🟢 MEDIUM: Remove unused legacy files (`src/App.css`, `src/data/properties.ts`)
8. 🟢 MEDIUM: Fix UI component library (`Button.tsx`, `Input.tsx`) to use current theme
9. 🟢 MEDIUM: Add 404 catch-all route
10. 🔵 LOW: Add environment variable management (.env files)
11. 🔵 LOW: Implement comprehensive testing (unit, integration, E2E)
12. 🔵 LOW: Add CI/CD pipeline configuration

---

*Report generated by Principal Software Architect — June 2026*
