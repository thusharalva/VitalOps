# 🔧 Vercel Monorepo Fix - "No Next.js version detected"

## The Problem
Vercel checks for Next.js **before** running install commands. In a monorepo, this fails because:
- Root Directory is set to `apps/admin-web`
- Vercel looks for `package.json` there immediately
- But dependencies need to be installed from root first

## ✅ Solution: Two Options

### Option 1: Use Root vercel.json (Easiest)

1. **In Vercel Dashboard:**
   - Go to **Settings** → **General**
   - **Root Directory:** Leave **EMPTY** (or delete the value)
   - **Framework Preset:** `Next.js` (or leave auto-detect)
   - **Build Command:** Leave empty
   - **Output Directory:** Leave empty
   - **Install Command:** Leave empty

2. **The `vercel.json` in root will handle everything:**
   - Installs from root (monorepo)
   - Builds packages
   - Builds admin-web
   - Outputs to correct directory

3. **Save and redeploy**

### Option 2: Manual Configuration (If Option 1 doesn't work)

1. **In Vercel Dashboard:**
   - **Root Directory:** `apps/admin-web`
   - **Framework Preset:** `Next.js`
   - **Build Command:** 
     ```bash
     cd ../.. && npm install && npm run build:packages && cd apps/admin-web && npm run build
     ```
   - **Output Directory:** `.next`
   - **Install Command:**
     ```bash
     cd ../.. && npm install
     ```

2. **If still failing, try:**
   - **Root Directory:** Leave empty
   - **Build Command:**
     ```bash
     npm install && npm run build:packages && cd apps/admin-web && npm run build
     ```
   - **Output Directory:** `apps/admin-web/.next`

---

## Why This Happens

Vercel's framework detection runs **before** the install command. In monorepos:
- Dependencies are in root `package.json`
- But Next.js app is in `apps/admin-web`
- Vercel needs to install first, then detect

---

## Quick Fix Steps

1. **Go to Vercel Dashboard** → Your Project → **Settings** → **General**
2. **Clear Root Directory** (delete the value, leave empty)
3. **Save**
4. **Redeploy**

The root `vercel.json` will handle the rest automatically.

---

## Verify

After redeploying, check:
- ✅ Build logs show: "Installing dependencies" first
- ✅ Then: "Building packages"
- ✅ Then: "Building Next.js app"
- ✅ Deployment shows "Ready"

---

## If Still Failing

1. **Delete the project** in Vercel
2. **Re-import** from GitHub
3. **During import:**
   - **Root Directory:** Leave empty
   - **Framework:** Auto-detect or Next.js
   - Don't set build/install commands (use vercel.json)
4. **Add environment variable:** `NEXT_PUBLIC_API_URL`
5. **Deploy**

This fresh setup often resolves monorepo detection issues.
