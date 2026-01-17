# 🔧 Quick Fix for Current Errors

## Run These Commands Now

Open PowerShell and run these commands **one by one**:

### 1. Go to Root Directory
```powershell
cd F:\developments\VitalOps
```

### 2. Create .env File
```powershell
# Copy the template
Copy-Item apps\backend-api\env.template apps\backend-api\.env

# Edit it with notepad
notepad apps\backend-api\.env
```

**In the notepad window, update the first line:**
```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/vitalops?schema=public"
```
Replace `YOUR_PASSWORD` with your PostgreSQL password, then **Save and Close**.

### 3. Setup Database
```powershell
cd apps\backend-api

# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Add initial data (users, categories, etc.)
npm run prisma:seed
```

You should see:
```
✨ Database seeding completed successfully!
Admin: admin@vitalops.com / admin123
```

### 4. Start Backend (Keep this window open)
```powershell
# Make sure you're in F:\developments\VitalOps\apps\backend-api
npm run dev
```

Wait until you see:
```
🚀 VitalOps API server running on port 5000
```

### 5. Open NEW PowerShell Window - Start Admin Web
```powershell
cd F:\developments\VitalOps
npm run admin
```

### 6. Test It!

Open browser: http://localhost:3000/login

Click "Admin" button → Should login automatically → See dashboard

## If You Get Errors

### "Cannot connect to PostgreSQL"

**Option A - Install PostgreSQL:**
1. Download: https://www.postgresql.org/download/windows/
2. Install with defaults
3. Create database:
```powershell
# In Command Prompt
psql -U postgres
# Enter your password
CREATE DATABASE vitalops;
\q
```

**Option B - Use Free Cloud Database (Easier):**
1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Copy connection string from Settings → Database
5. Paste in `.env` file as DATABASE_URL

### "Port 5000 already in use"
```powershell
# Find and kill the process
netstat -ano | findstr :5000
taskkill /PID <NUMBER> /F
```

### "Prisma Client not generated"
```powershell
cd F:\developments\VitalOps\apps\backend-api
npm run prisma:generate
```

## Success ✅

You should now have:
- ✅ Backend API running on http://localhost:5000
- ✅ Admin web running on http://localhost:3000
- ✅ Can login with admin@vitalops.com / admin123
- ✅ Dashboard showing (even if stats are 0)

## Quick API Test

Open browser or PowerShell:
```powershell
curl http://localhost:5000/health
```

Should return:
```json
{"status":"OK","message":"VitalOps API is running"}
```

## Need Help?

Check the detailed guide: `SETUP_GUIDE_WINDOWS.md`



