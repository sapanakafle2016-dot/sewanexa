# SEWANEXA – Local Services Marketplace

> **Your Local Services, Connected.**  
> Prepared by: **Sangalo Tech Pvt. Ltd.**  
> Location: Lokanthali, Bhaktapur, Nepal  
> Official Proposal Reference: [www.sangalotech.com](http://www.sangalotech.com)

---

## 🚀 Overview

**SEWANEXA** is a location-based digital service marketplace designed for Nepal to connect customers with skilled professionals in their nearby areas (plumbers, electricians, mechanics, painters, carpenters, cleaners, technicians, and more).

The platform features:
- **Location-Based Proximity Matching:** MongoDB `2dsphere` geospatial indexing for search within 1 km, 2 km, 5 km, 10 km, or custom radii.
- **Nepal Payment Gateway Integrations:** Official support for **eSewa v2** (HMAC-SHA256 signature verification), **Khalti v2** (ePayment initiate/lookup APIs), and Cash on Delivery (COD) with automated 10% platform commission management.
- **Mobile OTP Authentication:** Optimized for Nepali mobile networks (Ncell, Nepal Telecom / NTC).
- **Real-Time Booking Dispatch:** Socket.IO engine for instantaneous job broadcasts to online nearby service providers and live status updates.
- **Provider Verification & Trust:** Mandatory identity document upload (Citizenship / National ID / PAN), admin verification queues, and verified customer reviews.

---

## 📂 Monorepo Architecture

```
sewanexa/
├── apps/
│   ├── api/                    # Node.js + Express + TypeScript Backend
│   │   ├── src/
│   │   │   ├── config/         # Environment, DB, Payment & SMS configs
│   │   │   ├── controllers/    # Auth, Providers, Categories, Bookings, Payments, Admin
│   │   │   ├── middlewares/    # JWT Auth, Provider & Admin RBAC, Error Handler
│   │   │   ├── models/         # Mongoose Schemas with 2dsphere GeoJSON Indexes
│   │   │   ├── routes/         # Express REST API Routes
│   │   │   ├── services/       # eSewa v2, Khalti v2, Geospatial, Wallet, OTP
│   │   │   ├── sockets/        # Socket.IO Real-Time Dispatch & Location Tracking
│   │   │   └── scripts/seed.ts # Database seeder with all 6 proposal categories
│   │   └── package.json
│   └── web/                    # Next.js 14+ App Router + Tailwind CSS Frontend
│       ├── src/app/            # Modern customer portal & landing page
│       ├── src/components/     # Navigation Header, Footer, Hero, Category Cards
│       └── package.json
├── packages/
│   ├── shared-types/           # Common TypeScript interfaces & DTOs
│   └── validation/             # Shared Zod validation schemas (Nepal phone regex, forms)
├── package.json                # Root workspace configuration
└── README.md
```

---

## 🛠️ Quick Start Guide

### 1. Prerequisites
- **Node.js** >= 18 (Tested on Node.js v25)
- **MongoDB** running locally or via MongoDB Atlas

### 2. Installation
Install all monorepo dependencies across `apps` and `packages`:
```bash
npm install
```

### 3. Environment Variables
Copy the sample environment file in `apps/api`:
```bash
cp apps/api/.env.example apps/api/.env
```

Key environment configurations:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sewanexa
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:3000

# eSewa v2 Configuration
ESEWA_PRODUCT_CODE=EPAYTEST
ESEWA_SECRET_KEY=8gBm/:&EnhH.1/q
ESEWA_GATEWAY_URL=https://rc-epay.esewa.com.np/api/epay/main/v2/form

# Khalti v2 Configuration
KHALTI_SECRET_KEY=test_secret_key_f59e8b7d18b4499be40251c1c3977824
KHALTI_GATEWAY_URL=https://a.khalti.com/api/v2/epayment
```

### 4. Seed Database
Seed the 6 service categories (45+ subcategories), admin account, and sample verified provider in Lokanthali:
```bash
npm run seed --workspace=apps/api
```

### 5. Run Development Servers
- **Run Backend API (Port 5000):**
  ```bash
  npm run dev:api
  ```
- **Run Next.js Web Frontend (Port 3000):**
  ```bash
  npm run dev:web
  ```
- **Run Mobile Application (Expo - Android & iOS):**
  ```bash
  npm run dev:mobile
  ```
  *Press `a` in the Expo console to open on Android Emulator, `i` for iOS Simulator, or scan the QR code with the Expo Go app on your physical device.*

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/send-otp` | Request 6-digit OTP for Nepal mobile number | Public |
| `POST` | `/api/auth/verify-otp` | Verify OTP and receive JWT access token | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile & provider status | Bearer |
| `GET` | `/api/categories` | List all 6 categories with active subcategories | Public |
| `GET` | `/api/providers/nearby` | Geospatial search (`longitude`, `latitude`, `radiusKm`) | Public |
| `GET` | `/api/providers/:id` | View public provider profile, portfolio & rating | Public |
| `POST` | `/api/providers/register` | Register as a service provider with ID documents | Bearer |
| `PUT` | `/api/providers/toggle-online`| Toggle provider Online/Offline availability | Provider |
| `POST` | `/api/bookings` | Create direct booking or nearby broadcast request | Customer |
| `GET` | `/api/bookings/my` | View customer or provider booking history | Bearer |
| `PATCH` | `/api/bookings/:id/status` | Update booking status (`accepted`, `en_route`, `completed`, etc.) | Bearer |
| `POST` | `/api/bookings/review` | Submit rating & review for completed service | Customer |
| `POST` | `/api/payments/esewa/initiate` | Generate signed parameters for eSewa v2 EPAY | Bearer |
| `POST` | `/api/payments/esewa/verify` | Verify eSewa transaction callback | Bearer |
| `POST` | `/api/payments/khalti/initiate`| Initiate Khalti v2 epayment (`payment_url` & `pidx`) | Bearer |
| `POST` | `/api/payments/khalti/verify` | Verify Khalti transaction with lookup API | Bearer |
| `POST` | `/api/payments/cash/confirm` | Confirm cash payment and debit 10% platform commission | Bearer |
| `GET` | `/api/admin/dashboard-stats` | Overarching platform metrics & revenue stats | Admin |
| `GET` | `/api/admin/pending-providers`| Queue of providers awaiting identity verification | Admin |
| `POST` | `/api/admin/providers/:id/review`| Approve or reject provider verification | Admin |

---

## 🇳🇵 Supported Payment Methods

1. **eSewa ePay v2:** Automatic HMAC-SHA256 signature calculation using merchant secret key.
2. **Khalti v2:** Server-to-server REST initiation and lookup verification using `pidx`.
3. **Cash on Delivery (COD):** 100% collected in hand by provider; platform 10% commission automatically debited from provider's digital wallet ledger.

---

## 🏢 Organization
**Sangalo Tech Pvt. Ltd.**  
Lokanthali, Bhaktapur, Nepal  
Email: [sangalotech@gmail.com](mailto:sangalotech@gmail.com)  
Website: [www.sangalotech.com](http://www.sangalotech.com)

