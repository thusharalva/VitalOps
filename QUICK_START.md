# VitalOps Quick Start Guide

Get VitalOps up and running in 10 minutes!

## Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] PostgreSQL installed and running
- [ ] Git installed

## Step 1: Install Dependencies (2 minutes)

```bash
# From project root
npm install
```

This installs all dependencies for the monorepo.

## Step 2: Configure Database (3 minutes)

### Option A: Local PostgreSQL

```bash
# Create database
createdb vitalops

# Or using psql
psql -U postgres
CREATE DATABASE vitalops;
\q
```

### Option B: Use Supabase (Free Cloud Database)

1. Go to https://supabase.com
2. Create free account
3. Create new project
4. Copy connection string from Settings → Database

## Step 3: Set Environment Variables (2 minutes)

```bash
cd apps/backend-api
cp .env.example .env
```

Edit `.env` file:

```env
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/vitalops?schema=public"

# OR Supabase
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Generate a secure JWT secret (or use this for testing)
JWT_SECRET="vitalops-secret-key-change-in-production-123456789"

# Other defaults are fine for development
PORT=5000
NODE_ENV="development"
```

## Step 4: Initialize Database (2 minutes)

```bash
# Still in apps/backend-api directory

# Generate Prisma Client
npm run prisma:generate

# Run migrations (creates all tables)
npm run prisma:migrate

# Seed database with initial data
npm run prisma:seed
```

You should see:
```
✨ Database seeding completed successfully!

📋 Default Login Credentials:
Admin: admin@vitalops.com / admin123
Manager: manager@vitalops.com / manager123
Technician: tech@vitalops.com / tech123
```

## Step 5: Start Development Servers (1 minute)

Open **3 separate terminals**:

### Terminal 1: Backend API
```bash
npm run backend
```
✅ Backend running at http://localhost:5000

### Terminal 2: Admin Web
```bash
npm run admin
```
✅ Admin web running at http://localhost:3000

### Terminal 3: Mobile App (Optional)
```bash
npm run mobile
```
✅ Expo running - scan QR code with Expo Go app

## Step 6: Test the API

### Option A: Using Postman

1. Import `postman_collection.json` from project root
2. Use "Login" request with:
   - Email: `admin@vitalops.com`
   - Password: `admin123`
3. Token will be auto-saved
4. Try other requests!

### Option B: Using curl

```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vitalops.com",
    "password": "admin123"
  }'

# Copy the token from response, then:
TOKEN="your-token-here"

# Get dashboard overview
curl http://localhost:5000/api/v1/dashboard/overview \
  -H "Authorization: Bearer $TOKEN"
```

## Step 7: Explore the Application

### Admin Web (http://localhost:3000)
- Landing page with overview
- Dashboard at `/dashboard`
- Clean UI with turquoise theme

### API Endpoints (http://localhost:5000/api/v1)
- `/auth/login` - Authentication
- `/assets` - Asset management
- `/customers` - Customer management
- `/rentals` - Rental operations
- `/dashboard/overview` - Analytics

### Mobile App (Expo)
- Scan QR code with Expo Go app
- Login with seeded credentials
- Explore dashboard, jobs, scanner

## Common Issues & Solutions

### ❌ "Port 5000 already in use"

```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### ❌ "Cannot connect to database"

1. Check PostgreSQL is running:
   ```bash
   # Mac
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   
   # Windows
   # Check Services app for PostgreSQL
   ```

2. Verify DATABASE_URL in `.env`
3. Test connection:
   ```bash
   cd apps/backend-api
   npx prisma studio
   ```

### ❌ "Prisma Client not found"

```bash
cd apps/backend-api
npm run prisma:generate
```

### ❌ "Module not found" errors

```bash
# Clean install from root
rm -rf node_modules
rm package-lock.json
npm install
```

## Next Steps

### Create Your First Asset

1. Login to get token
2. Create asset category:
```bash
curl -X POST http://localhost:5000/api/v1/assets/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "CPAP Machine",
    "description": "Sleep apnea treatment devices"
  }'
```

3. Create asset (replace category-id):
```bash
curl -X POST http://localhost:5000/api/v1/assets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ResMed AirSense 10",
    "categoryId": "<category-id>",
    "purchaseDate": "2024-01-01",
    "purchasePrice": 50000,
    "depreciationRate": 10,
    "manufacturer": "ResMed",
    "model": "AirSense 10",
    "serialNumber": "SN001"
  }'
```

### Explore Features

- **Dashboard**: View system overview and stats
- **Assets**: QR code generation, tracking, logs
- **Rentals**: Create contracts, track returns
- **Jobs**: Assign to technicians, track completion
- **Invoices**: Generate and send via WhatsApp (when configured)

### View Database

```bash
cd apps/backend-api
npm run prisma:studio
```

Opens Prisma Studio at http://localhost:5555 - GUI for your database!

## Development Workflow

1. **Backend changes**: Edit files in `apps/backend-api/src/`
   - Auto-reloads with nodemon
   
2. **Frontend changes**: Edit files in `apps/admin-web/src/`
   - Hot reload enabled
   
3. **Mobile changes**: Edit files in `apps/mobile-app/app/`
   - Shake device → Reload

4. **Database changes**: Edit `prisma/schema.prisma`
   ```bash
   cd apps/backend-api
   npx prisma migrate dev --name your_migration_name
   ```

## Production Deployment

See `docs/DEPLOYMENT.md` for complete deployment guide.

Quick options:
- **Backend**: Deploy to Render/Railway
- **Frontend**: Deploy to Vercel
- **Database**: Use Supabase/Neon

## Getting Help

- **Documentation**: Check `/docs` folder
- **API Reference**: `docs/API_REFERENCE.md`
- **Architecture**: `docs/ARCHITECTURE.md`
- **Database Schema**: `docs/DATABASE_SCHEMA.md`

## Success Checklist

- [ ] All dependencies installed
- [ ] Database created and migrated
- [ ] Seed data loaded
- [ ] Backend API running (http://localhost:5000/health returns OK)
- [ ] Can login and get JWT token
- [ ] Admin web accessible (http://localhost:3000)
- [ ] Dashboard shows stats
- [ ] Postman collection imported and working

**You're all set! Start building! 🚀**



