# VitalOps Setup Guide

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL database
- Git

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd VitalOps
```

### 2. Install Dependencies

```bash
npm install
```

This will install dependencies for all apps and packages in the monorepo.

### 3. Set Up Environment Variables

#### Backend API

```bash
cd apps/backend-api
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vitalops?schema=public"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# WhatsApp API (optional for now)
WHATSAPP_API_KEY="your-gupshup-api-key"
WHATSAPP_APP_NAME="your-app-name"

# Frontend URLs
ADMIN_WEB_URL="http://localhost:3000"
MOBILE_APP_URL="exp://localhost:19000"

# UPI Payment
UPI_ID="yourbusiness@upi"
UPI_MERCHANT_NAME="VitalOps Medical Equipment"
```

### 4. Set Up Database

```bash
# Generate Prisma Client
cd apps/backend-api
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view/manage data
npm run prisma:studio
```

### 5. Start Development Servers

#### Option 1: Start All Apps (from root)

```bash
npm run dev
```

#### Option 2: Start Individual Apps

**Backend API:**
```bash
npm run backend
# Runs on http://localhost:5000
```

**Admin Web:**
```bash
npm run admin
# Runs on http://localhost:3000
```

**Mobile App:**
```bash
npm run mobile
# Opens Expo Dev Tools
```

## Development Workflow

### Backend Development

1. Create new module in `apps/backend-api/src/modules/<module-name>/`
2. Create routes, controller, and service files
3. Add route to `apps/backend-api/src/routes/index.ts`
4. Test using Postman or similar tool

### Frontend Development

1. Create pages in `apps/admin-web/src/app/`
2. Use shared components from `packages/ui/`
3. Use shared types from `packages/types/`
4. Test in browser at http://localhost:3000

### Mobile Development

1. Create screens in `apps/mobile-app/app/`
2. Test on device or simulator
3. Use QR code scanner from Expo Go app

## Database Management

### Create a new migration

```bash
cd apps/backend-api
npx prisma migrate dev --name <migration-name>
```

### Reset database

```bash
cd apps/backend-api
npx prisma migrate reset
```

### Seed database (optional)

Create `apps/backend-api/prisma/seed.ts` and run:

```bash
npx prisma db seed
```

## Building for Production

### Backend

```bash
cd apps/backend-api
npm run build
npm run start
```

### Admin Web

```bash
cd apps/admin-web
npm run build
npm run start
```

### Mobile App

```bash
cd apps/mobile-app
# For Android
npx eas build --platform android

# For iOS
npx eas build --platform ios
```

## Testing

### Backend Tests

```bash
cd apps/backend-api
npm test
```

### Frontend Tests

```bash
cd apps/admin-web
npm test
```

## Troubleshooting

### Port Already in Use

If port 5000 or 3000 is already in use:

```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Prisma Connection Issues

1. Verify PostgreSQL is running
2. Check DATABASE_URL in .env
3. Ensure database exists
4. Run `npx prisma db push` to sync schema

### Module Not Found Errors

```bash
# Clean install
rm -rf node_modules
rm package-lock.json
npm install
```

### Expo Issues

```bash
# Clear Expo cache
npx expo start -c

# Reinstall Expo CLI
npm install -g expo-cli
```

## Recommended VS Code Extensions

- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- React Native Tools

## Environment-Specific Configuration

### Development
- Hot reload enabled
- Detailed error messages
- Logging enabled

### Staging
- Similar to production
- Test data
- Limited access

### Production
- Optimized builds
- Error tracking
- Minimal logging
- HTTPS required

## Next Steps

1. Register first user at http://localhost:5000/api/v1/auth/register
2. Login and get JWT token
3. Use token to create asset categories
4. Create your first asset
5. Explore the admin dashboard

## Support

For issues or questions:
1. Check the documentation in `/docs`
2. Review the API reference
3. Contact the development team



