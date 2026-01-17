# 🔧 Render Build Configuration Fix

## Problem
TypeScript compilation errors because:
1. DevDependencies (type definitions) not installed during build
2. Prisma client not generated before TypeScript compilation
3. Build command doesn't include necessary steps

## ✅ Solution: Update Render Service Settings

### Step 1: Go to Render Dashboard
1. Open https://dashboard.render.com
2. Click on your backend service (e.g., `vitalops-api`)
3. Go to **Settings** tab

### Step 2: Update Build & Deploy Settings

**Root Directory:**
```
apps/backend-api
```

**Build Command:**
```bash
npm install && npm run build
```

**Note:** I've moved TypeScript and type definitions to `dependencies` (instead of `devDependencies`) so they're always installed during build. This ensures Render has all the types it needs.

**Start Command:**
```bash
npm start
```

### Step 3: Environment Variables

Make sure these are set in **Environment** section:

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
JWT_SECRET = [your-generated-secret]
JWT_EXPIRES_IN = 7d
NODE_ENV = production
PORT = 5000
ADMIN_WEB_URL = https://your-admin-app.vercel.app
MOBILE_APP_URL = exp://localhost:19000
```

### Step 4: Save and Redeploy

1. Click **"Save Changes"**
2. Render will automatically trigger a new deployment
3. Monitor the **Logs** tab to see the build progress

---

## Alternative: Use Custom Build Script

If the above doesn't work, you can create a custom build script.

### Create `apps/backend-api/build.sh`:

```bash
#!/bin/bash
set -e

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Building TypeScript..."
npm run build

echo "Build complete!"
```

Then update **Build Command** in Render to:
```bash
chmod +x build.sh && ./build.sh
```

---

## Why This Works

1. **`npm install`** - Installs ALL dependencies including devDependencies (needed for TypeScript types)
2. **`npx prisma generate`** - Generates Prisma client with all types (AssetStatus, UserRole, etc.)
3. **`npm run build`** - Compiles TypeScript (now has all types available)

The `postinstall` script I added to package.json will also auto-generate Prisma client after `npm install`, but it's good to be explicit in the build command.

---

## Verify Build Success

After deployment, check:
1. **Logs** tab shows "Build succeeded"
2. **Health endpoint** works: `https://your-api.onrender.com/health`
3. No TypeScript errors in logs

---

## If Still Failing

If you still see errors, check:

1. **Node Version**: Render should use Node 18+ (check in Settings → Environment)
2. **Prisma Schema**: Make sure `prisma/schema.prisma` is in the correct location
3. **Build Logs**: Check full error messages in Render logs

---

## Quick Reference

**Root Directory:** `apps/backend-api`
**Build Command:** `npm install && npm run build`
**Start Command:** `npm start`
