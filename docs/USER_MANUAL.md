# User Manual

## Table of Contents

1. [Guest User Guide](#1-guest-user-guide)
2. [Client Portal Guide](#2-client-portal-guide)
3. [Admin Portal Guide](#3-admin-portal-guide)

---

## 1. Guest User Guide

A guest is any visitor who has not logged in.

### Browsing Properties

- **Home Page** (`/`): Featured properties carousel, hero section with search, and property highlights.
- **Properties Page** (`/properties`): Full property catalog with grid and list views.
  - **Filter by type**: Villa, Apartment, Penthouse, Duplex, Studio.
  - **Filter by status**: For Sale, For Rent, Sold, Under Contract.
  - **Sort**: Price low-to-high, price high-to-low, newest first.
  - **Search**: Real-time keyword search through titles, locations, features, and descriptions.
- **Property Details** (`/properties/:id`): Full details including images, amenities, description, and booking card.

### Language & Theme

- **Language Toggle**: Click the globe icon in the navbar to switch between English and Arabic. The entire UI flips to RTL for Arabic.
- **Dark / Light Mode**: Click the sun/moon icon in the navbar to toggle themes. Your preference is remembered across sessions.

### Account Registration

Click **"Sign Up"** in the navbar to register. Required fields:

| Field     | Notes                              |
| --------- | ---------------------------------- |
| Name      | Full name                          |
| Email     | Used for login + lead tracking     |
| Phone     | Required for booking & lead sync   |
| Password  | Minimum 6 characters               |

After registration, you are automatically logged in and redirected to the home page. Your profile is added to the leads list visible to admins.

---

## 2. Client Portal Guide

A client is a registered and logged-in user.

### Accessing Your Profile

Click your name / avatar in the navbar, then **"My Profile"**. The profile sidebar provides links to:

- **My Profile** — View and edit your account details
- **My Bookings** — View properties you have booked
- **Logout** — End your session

### Editing Your Profile

On the profile page you can update:

- **Name** — Display name
- **Email** — Login email (must be unique)
- **Phone** — Contact number
- **Password** — Enter a new password (optional; leave blank to keep current)

> **Important**: You must enter your current (old) password to save any changes. This prevents unauthorized account modifications.

### Favorites

- Click the heart icon on any property card or on the property detail page to add/remove it from your favorites.
- Your favorites are stored per-user — you will see the same favorites after logging back in.
- Visit **"My Favorites"** from the navbar user dropdown to view all your saved properties.

### Booking a Property

1. Navigate to any property detail page (`/properties/:id`).
2. In the booking card (right sidebar on desktop), fill in:
   - **Name** (pre-filled from your profile)
   - **Email** (pre-filled from your profile)
   - **Phone** (pre-filled from your profile)
   - **Date** — Select your preferred date
3. Click **"Book Now"**.
4. A confirmation message appears. Your booking is saved and visible to admins.

### Viewing Your Bookings

- Go to **"My Bookings"** from the navbar user dropdown, or from your profile page sidebar.
- You will see a table of all properties you have booked, including property name, date, and status.

### Logout

Click **"Logout"** from the navbar user dropdown or profile sidebar. Your session ends and you are redirected to the home page.

---

## 3. Admin Portal Guide

The admin portal is accessible only to users with the `admin` role.

### Accessing the Admin Portal

1. Navigate to `/secure-portal` (this URL is intentionally non-obvious).
2. Log in with admin credentials:

   | Email               | Password  |
   | ------------------- | --------- |
   | admin@luxestate.com | admin123  |

> **Note**: Regular user accounts cannot access the admin portal. If a non-admin tries to visit any `/secure-portal/*` page, they are redirected to a 403 Forbidden page.

### Dashboard (`/secure-portal/dashboard`)

The dashboard provides a high-level overview:

- **Total Users** — Count of registered users
- **Total Leads** — Count of user registrations (synced from users)
- **Total Bookings** — Count of all property bookings
- **Total Properties** — Count of properties in the catalog
- **Recent Leads** — Latest 5 registrations
- **Recent Bookings** — Latest 5 bookings

Navigation buttons at the bottom allow quick access to Leads, Bookings, and Settings.

### Leads Management (`/secure-portal/leads`)

A read-only table of all user registrations:

| Column     | Description                     |
| ---------- | ------------------------------- |
| Name       | User's full name                |
| Email      | User's email address            |
| Phone      | User's phone number             |
| Registered | Date and time of registration   |

> **Policy**: Admins can view leads but cannot edit or delete them. Only the user can edit their own profile.

### Bookings Management (`/secure-portal/bookings`)

A read-only table of all client bookings:

| Column     | Description                     |
| ---------- | ------------------------------- |
| Client     | User's full name                |
| Email      | User's email address            |
| Phone      | User's phone number             |
| Property   | Name of the booked property     |
| Date       | Booking date                    |
| Status     | Booking status                  |

> **Policy**: Admins can view all bookings but cannot edit them. Booking status changes are managed through the backend.

### Settings (`/secure-portal/settings`)

Admin account settings page where you can:

- **Change Email** — Update the admin login email
- **Change Password** — Update the admin password (requires current password)

> **Security**: All changes require the current (old) password for verification.

### Navigation Between Admin Pages

Each admin page includes navigation buttons at the bottom to jump between:
- Dashboard
- Leads
- Bookings
- Settings
- Back to Main Site
