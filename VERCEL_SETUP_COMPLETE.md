# ✅ Complete Vercel Setup for Monorepo

## The Problem
Vercel can't detect Next.js because it's looking in the wrong place for a monorepo setup.

## ✅ Solution: Correct Vercel Configuration

### Step 1: Go to Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **General**

### Step 2: Configure Project Settings

**Framework Preset:**
```
Next.js
```

**Root Directory:**
```
apps/admin-web
```
(Make sure there are NO spaces before or after)

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

**Node.js Version:**
```
18.x
```
(or 20.x - should match your local version)

### Step 3: Environment Variables

Go to **Settings** → **Environment Variables** and add:

**Key:** `NEXT_PUBLIC_API_URL`  
**Value:** `https://your-backend-api.onrender.com/api/v1`  
**Environment:** Production, Preview, Development (check all)

(Replace with your actual Render backend URL)

### Step 4: Save and Deploy

1. Click **"Save"** at the bottom
2. Go to **Deployments** tab
3. Click **"Redeploy"** on the latest deployment (or it will auto-deploy)

---

## Why This Works

1. **Root Directory = `apps/admin-web`**: Tells Vercel where the Next.js app is
2. **Install Command runs from root**: Installs all monorepo dependencies
3. **Build Command**: 
   - Goes to root
   - Installs dependencies
   - Builds packages (types, utils, ui)
   - Builds admin-web
4. **Framework Preset = Next.js**: Helps Vercel detect Next.js correctly

---

## Alternative: Use vercel.json

I've created `apps/admin-web/vercel.json`. If you prefer:

1. **Root Directory:** Leave empty or set to `./` (root)
2. Vercel will automatically use settings from `vercel.json`
3. The vercel.json file handles the build process

---

## Verify It's Working

After deployment:

1. **Check Deployments tab**: Should show "Ready" (green)
2. **Click the deployment**: View build logs - should see:
   - ✅ Installing dependencies
   - ✅ Building packages
   - ✅ Building Next.js app
   - ✅ Build completed
3. **Click Preview URL**: Should load your app

---

## Troubleshooting

### Still getting "No Next.js version detected"

1. **Double-check Root Directory**: Must be exactly `apps/admin-web` (no spaces)
2. **Verify Framework Preset**: Should be "Next.js"
3. **Check package.json**: Make sure `next` is in dependencies (it is)
4. **Try clearing Root Directory**: Delete it, save, then add it back

### Build fails with package errors

1. Make sure **Install Command** is: `cd ../.. && npm install`
2. Make sure **Build Command** builds packages first
3. Check build logs for specific errors

### Packages not found

1. Verify packages are built before admin-web
2. Check that `npm run build:packages` works locally
3. Make sure TypeScript is in dependencies (it is now)

---

## Quick Checklist

- [ ] Root Directory: `apps/admin-web` (no spaces)
- [ ] Framework Preset: `Next.js`
- [ ] Build Command: `cd ../.. && npm install && npm run build:packages && cd apps/admin-web && npm run build`
- [ ] Install Command: `cd ../.. && npm install`
- [ ] Output Directory: `.next`
- [ ] Environment Variable: `NEXT_PUBLIC_API_URL` set
- [ ] Saved settings
- [ ] Deployment triggered

---

## Success!

Once the deployment shows "Ready", your admin web is live! 🎉
