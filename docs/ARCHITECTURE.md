# VitalOps Architecture

## Overview

VitalOps is a comprehensive medical equipment rental management system built as a monorepo with separate frontend applications and a unified backend API.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     VitalOps Ecosystem                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐                    │
│  │  Admin Web   │      │  Mobile App  │                    │
│  │  (Next.js)   │      │  (RN+Expo)   │                    │
│  └──────┬───────┘      └──────┬───────┘                    │
│         │                     │                              │
│         └──────────┬──────────┘                              │
│                    │                                         │
│         ┌──────────▼──────────┐                             │
│         │   Backend API       │                             │
│         │   (Express)         │                             │
│         └──────────┬──────────┘                             │
│                    │                                         │
│         ┌──────────▼──────────┐                             │
│         │   PostgreSQL        │                             │
│         │   (Prisma ORM)      │                             │
│         └─────────────────────┘                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend (Web)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI (to be integrated)
- **State Management**: React Context / Zustand
- **HTTP Client**: Axios

### Mobile App
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: Redux Toolkit
- **Camera/QR**: expo-camera, expo-barcode-scanner
- **Location**: expo-location

### Backend API
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Validation**: express-validator

### Shared Packages
- **@vitalops/types**: Shared TypeScript types and interfaces
- **@vitalops/utils**: Common utility functions (QR generation, formatters, validators)
- **@vitalops/ui**: Reusable UI components

## Database Schema

### Core Entities

1. **Users** - Authentication and authorization
2. **Assets** - Medical equipment inventory
3. **Customers** - Client information
4. **Rentals** - Rental contracts and items
5. **Sales** - Direct sales and rental conversions
6. **Jobs** - Technician assignments
7. **Sleep Studies** - Patient sleep study management
8. **Invoices** - Billing and invoicing
9. **Payments** - Payment tracking
10. **WhatsApp Messages** - Communication logs

## Module Structure

Each backend module follows the **Controller → Service → Prisma Model** pattern:

```
modules/
├── assets/
│   ├── assets.routes.ts
│   ├── assets.controller.ts
│   └── assets.service.ts
├── rentals/
│   ├── rentals.routes.ts
│   ├── rentals.controller.ts
│   └── rentals.service.ts
└── ...
```

### Flow Example: Creating an Asset

```
1. Client Request → 2. Route → 3. Controller → 4. Service → 5. Prisma → 6. Database
                                                                           ↓
7. Response ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
```

## API Structure

All API endpoints are prefixed with `/api/v1/`:

- `/api/v1/auth` - Authentication
- `/api/v1/assets` - Asset management
- `/api/v1/customers` - Customer management
- `/api/v1/rentals` - Rental operations
- `/api/v1/sales` - Sales records
- `/api/v1/jobs` - Technician jobs
- `/api/v1/sleep-studies` - Sleep study management
- `/api/v1/invoices` - Invoice generation
- `/api/v1/payments` - Payment recording
- `/api/v1/dashboard` - Analytics and reports

## Authentication Flow

1. User submits credentials to `/api/v1/auth/login`
2. Backend validates credentials
3. JWT token generated and returned
4. Client stores token (localStorage/AsyncStorage)
5. All subsequent requests include token in `Authorization: Bearer <token>` header
6. Middleware validates token and attaches user to request

## Data Flow Patterns

### Asset Lifecycle

```
AVAILABLE → RENTED → [RETURNED] → AVAILABLE
                  ↓
               SOLD → END
```

### Rental to Sale Conversion

```
1. Active Rental
2. Calculate depreciated value
3. Apply conversion factor (60-70%)
4. Create sale record
5. Update asset status to SOLD
6. Update rental status to CONVERTED_TO_SALE
```

## Security Considerations

1. **JWT Authentication**: All protected routes require valid JWT
2. **Role-Based Access**: Different permissions for ADMIN, MANAGER, TECHNICIAN, etc.
3. **Input Validation**: All inputs validated using express-validator
4. **SQL Injection Prevention**: Prisma ORM with parameterized queries
5. **CORS Configuration**: Restricted to known origins
6. **Environment Variables**: Sensitive data in .env files

## Deployment Architecture

```
┌────────────────────────────────────────────────────────┐
│                    Production Setup                     │
├────────────────────────────────────────────────────────┤
│                                                          │
│  Admin Web (Vercel)                                     │
│  ↓                                                       │
│  Backend API (Render/Railway)                           │
│  ↓                                                       │
│  PostgreSQL (Supabase/Neon)                            │
│                                                          │
│  Mobile App → Backend API                               │
│                                                          │
└────────────────────────────────────────────────────────┘
```

## Performance Optimization

1. **Database Indexing**: Key fields indexed (assetCode, rentalNumber, etc.)
2. **Pagination**: All list endpoints support pagination
3. **Caching**: Static assets cached on CDN
4. **Lazy Loading**: Mobile app uses lazy loading for screens
5. **Image Optimization**: Next.js automatic image optimization

## Error Handling

```typescript
try {
  // Business logic
} catch (error) {
  // Handled by global error handler middleware
  // Returns consistent error response format
}
```

## Monitoring & Logging

- **Development**: Morgan logging middleware
- **Production**: Structured logging with timestamps
- **Error Tracking**: Centralized error handler
- **Audit Trail**: ActivityLog table tracks all major actions

## Future Enhancements

1. Real-time notifications (WebSockets/Firebase)
2. Advanced analytics dashboard
3. Mobile offline support with sync
4. Automated invoice generation scheduler
5. Predictive maintenance alerts
6. Route optimization for technicians
7. Multi-tenant support for multiple branches



