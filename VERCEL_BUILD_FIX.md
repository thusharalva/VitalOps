# 🔧 Vercel Build Configuration Fix

## Problem
Vercel build fails because:
1. Monorepo packages need to be built before admin-web
2. TypeScript is in devDependencies (not installed during build)
3. Packages need TypeScript to compile

## ✅ Solution: Update Vercel Project Settings

### Step 1: Go to Vercel Dashboard
1. Open https://vercel.com/dashboard
2. Click on your admin-web project
3. Go to **Settings** → **General**

### Step 2: Update Build & Development Settings

**Option A: Using Root Directory (Recommended)**

**Root Directory:**
```
apps/admin-web
```

**Build Command:**
```bash
cd ../.. && npm install && npm run build:packages && cd apps/admin-web && npm run build
```

**Output Directory:**
```
.next
```

**Install Command:**
```bash
cd ../.. && npm install
```

**Option B: Using vercel.json (Alternative)**

I've created `apps/admin-web/vercel.json` which Vercel will automatically detect. In this case:

**Root Directory:** Leave empty (or set to root `./`)

**Build Command:** (auto-detected from vercel.json)

**Output Directory:** (auto-detected from vercel.json)

### Step 3: Environment Variables

Make sure this is set in **Environment Variables**:

```
NEXT_PUBLIC_API_URL = https://your-backend-api.onrender.com/api/v1
```

(Replace with your actual Render backend URL)

---

## Alternative: Use Root Build Script

If the above doesn't work, we can add a build script to root `package.json` that builds everything in order.

---

## What I Fixed

1. **Moved TypeScript to dependencies** in:
   - `packages/types/package.json`
   - `packages/ui/package.json`
   - `packages/utils/package.json`
   - `apps/admin-web/package.json`

2. **Added postinstall scripts** to packages to auto-build after install

3. **Updated Vercel build command** to:
   - Install all dependencies at root
   - Build packages in order
   - Build admin-web

---

## Why This Works

1. **Root `npm install`** - Installs all workspace dependencies
2. **Package builds** - Compiles TypeScript for each package
3. **Admin-web build** - Can now use the built packages

---

## Verify Build Success

After deployment, check:
1. **Deployments** tab shows "Ready"
2. **Build Logs** show successful compilation
3. **Preview URL** works and loads the app

---

## If Still Failing

Check the build logs for specific errors. Common issues:

1. **Package not found**: Make sure packages are built before admin-web
2. **Type errors**: Verify TypeScript is in dependencies
3. **Missing env var**: Add `NEXT_PUBLIC_API_URL` to Vercel environment variables

---

## Quick Reference

**Root Directory:** `apps/admin-web`
**Build Command:** `cd ../.. && npm install && npm run build --workspace=packages/types && npm run build --workspace=packages/utils && npm run build --workspace=packages/ui && cd apps/admin-web && npm run build`
**Output Directory:** `.next`
**Install Command:** `cd ../.. && npm install`
