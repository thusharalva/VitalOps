# VitalOps

> Modular asset tracking, rental management, and service job system for medical equipment rental business

## 🚀 Tech Stack

- **Frontend (Web):** Next.js + Tailwind CSS + TypeScript + ShadCN UI
- **Mobile App:** React Native + Expo Router + Redux Toolkit
- **Backend:** Node.js + Express + Prisma ORM + PostgreSQL
- **Auth:** JWT-based authentication
- **Messaging:** WhatsApp API (Gupshup / Meta Cloud)
- **Payments:** Static UPI QR (manual confirmation)
- **Hosting:** Vercel (frontend), Render / Railway (backend), Supabase / Neon (DB)

## 📁 Monorepo Structure

```
vitalops/
├── apps/
│   ├── admin-web/         → Next.js Admin Panel
│   ├── mobile-app/        → Expo React Native App
│   └── backend-api/       → Node.js REST API
├── packages/
│   ├── ui/                → Shared components (Buttons, Cards, Inputs)
│   ├── types/             → Shared TypeScript interfaces
│   └── utils/             → Shared logic (QR gen, depreciation, WhatsApp)
├── prisma/                → DB schema
└── docs/                  → Architecture diagrams, API reference
```

## 🧰 Core Modules (Phase 1)

1. **Asset Management** - Add/Edit assets, QR code tagging, status lifecycle
2. **Rental Module** - Rental contracts, billing, rent ledger, WhatsApp reminders
3. **Sales Module** - Direct sales with invoice & record
4. **Technician Job Module** - Job assignment, QR scan, payment log
5. **Sleep Study Module** - Booking, delivery, pickup, report upload
6. **Billing & Payments** - Unified invoice system with UPI QR
7. **WhatsApp Integration** - Templates for Invoice, Reminder, Payment
8. **Dashboard & Reports** - Active rentals, available assets, pending payments

## 🛠️ Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp apps/backend-api/.env.example apps/backend-api/.env

# Initialize database
npm run backend prisma migrate dev

# Start all apps
npm run dev
```

### Individual App Commands

```bash
# Backend API
npm run backend

# Admin Web Panel
npm run admin

# Mobile App
npm run mobile
```

## 🎨 Design Guidelines

- **Theme:** Clean white UI with turquoise or steel-blue accent
- **Typography:** Poppins / Inter
- **UI Components:** ShadCN UI (web), custom card components (mobile)
- **Layout:** Left sidebar navigation (web), bottom-tab layout (mobile)
- **Icons:** Lucide React
- **UX Principle:** "2 taps max" for all mobile operations

## 🧠 Development Principles

1. Use TypeScript everywhere
2. Follow Controller → Service → Prisma Model architecture in backend
3. Keep each feature in its own module folder (e.g., `/modules/assets`)
4. Write reusable shared components in `/packages/ui`
5. Add new features as independent modules — don't break existing code
6. All API routes under `/api/v1/...`
7. Keep comments describing data flow clearly for future devs

## 📖 Documentation

See the `/docs` folder for:
- API Reference
- Architecture Diagrams
- Module Documentation
- Database Schema

## 📄 License

Proprietary - All rights reserved



