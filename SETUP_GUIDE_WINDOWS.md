# VitalOps Setup Guide for Windows

## Quick Fix for Your Current Situation

You're in `apps/backend-api` directory. Let's fix this:

### Step 1: Go Back to Root Directory
```powershell
cd F:\developments\VitalOps
```

### Step 2: Create .env File
```powershell
# Copy the example file (Windows PowerShell command)
Copy-Item apps\backend-api\.env.example apps\backend-api\.env

# Or manually create it
notepad apps\backend-api\.env
```

Add this content to `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/vitalops?schema=public"
JWT_SECRET="vitalops-secret-key-change-in-production-123456789"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
WHATSAPP_API_KEY="your-key"
WHATSAPP_APP_NAME="VitalOps"
ADMIN_WEB_URL="http://localhost:3000"
MOBILE_APP_URL="exp://localhost:19000"
UPI_ID="yourbusiness@upi"
UPI_MERCHANT_NAME="VitalOps Medical Equipment"
```

**IMPORTANT:** Update the `DATABASE_URL` with your PostgreSQL credentials!

### Step 3: Setup Database

```powershell
# From root directory (F:\developments\VitalOps)

# Navigate to backend
cd apps\backend-api

# Generate Prisma Client
npm run prisma:generate

# Run migrations (this creates all tables)
npm run prisma:migrate

# Seed database with initial data
npm run prisma:seed
```

### Step 4: Start the Application

**Open 3 separate PowerShell windows:**

**Window 1 - Backend API:**
```powershell
cd F:\developments\VitalOps
npm run backend
```

**Window 2 - Admin Web:**
```powershell
cd F:\developments\VitalOps
npm run admin
```

**Window 3 - Mobile App (Optional):**
```powershell
cd F:\developments\VitalOps
npm run mobile
```

## If You Don't Have PostgreSQL Installed

### Option 1: Install PostgreSQL Locally

1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set for `postgres` user
4. Create database:
   ```powershell
   # Open Command Prompt or PowerShell
   psql -U postgres
   # Enter password
   CREATE DATABASE vitalops;
   \q
   ```

### Option 2: Use Supabase (Free Cloud Database - Recommended)

1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Wait 2-3 minutes for setup
5. Go to Settings → Database
6. Copy "Connection string" (URI)
7. Use this in your `.env` file as `DATABASE_URL`

Example Supabase URL:
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijk.supabase.co:5432/postgres"
```

## Common Windows Issues

### Issue 1: "cp: Cannot find path"
**Solution:** Use `Copy-Item` instead of `cp` in PowerShell
```powershell
Copy-Item apps\backend-api\.env.example apps\backend-api\.env
```

### Issue 2: "Prisma Schema not found"
**Solution:** Make sure you're in the root directory, not `apps/backend-api`
```powershell
cd F:\developments\VitalOps
cd apps\backend-api
npm run prisma:generate
```

### Issue 3: "DATABASE_URL not found"
**Solution:** Check that `.env` file exists and has the DATABASE_URL
```powershell
# Check if file exists
Test-Path apps\backend-api\.env

# View contents
Get-Content apps\backend-api\.env
```

### Issue 4: Port Already in Use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Issue 5: npm Vulnerabilities
The warnings about vulnerabilities are from dependencies. They're mostly in development dependencies and don't affect functionality. You can ignore them for now or run:
```powershell
npm audit fix
```

## Verify Everything Works

### Test Backend API
```powershell
# In browser or PowerShell
curl http://localhost:5000/health
# Should return: {"status":"OK","message":"VitalOps API is running",...}
```

### Test Login
```powershell
# Login with curl (PowerShell)
$body = @{
    email = "admin@vitalops.com"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### Access Web Interface
- Open browser: http://localhost:3000
- Click "Admin" quick login button
- You should see the dashboard

## Default Login Credentials

After seeding, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vitalops.com | admin123 |
| Manager | manager@vitalops.com | manager123 |
| Technician | tech@vitalops.com | tech123 |

## Need Help?

1. Make sure PostgreSQL is running
2. Check `.env` file has correct DATABASE_URL
3. Make sure you're in root directory when running commands
4. Check that all `npm install` completed successfully

## Success Checklist

- [ ] `.env` file created with correct DATABASE_URL
- [ ] Prisma client generated
- [ ] Database migrated
- [ ] Database seeded
- [ ] Backend running on port 5000
- [ ] Admin web accessible at port 3000
- [ ] Can login with admin credentials

You're all set! 🎉



