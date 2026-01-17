# 🚀 VitalOps Complete Hosting Guide

Step-by-step guide to deploy VitalOps to production.

---

## 📋 Prerequisites Checklist

- [ ] GitHub account (free)
- [ ] Code pushed to GitHub repository
- [ ] Email address for account signups

---

## Step 1: Set Up Database (Supabase) - 10 minutes

### 1.1 Create Supabase Account

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub (recommended) or email
4. Click **"New Project"**

### 1.2 Create Database Project

1. **Organization**: Create new or select existing
2. **Project Name**: `vitalops-production`
3. **Database Password**: Create a strong password (SAVE THIS!)
4. **Region**: Choose closest to your users
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup

### 1.3 Get Database Connection String

1. In your project dashboard, go to **Settings** → **Database**
2. Scroll to **"Connection string"** section
3. Select **"URI"** tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. **Replace `[YOUR-PASSWORD]`** with the password you created
6. **SAVE THIS** - you'll need it in Step 2

---

## Step 2: Deploy Backend API (Render) - 15 minutes

### 2.1 Create Render Account

1. Go to https://render.com
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended)
4. Verify your email

### 2.2 Create PostgreSQL Database (Optional - if not using Supabase)

**Skip this if using Supabase from Step 1**

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. **Name**: `vitalops-db`
3. **Database**: `vitalops`
4. **User**: `vitalops_user`
5. **Region**: Choose closest
6. **Plan**: Free (or paid for production)
7. Click **"Create Database"**
8. Wait 2-3 minutes
9. Copy the **"Internal Database URL"** (for Render services) or **"External Database URL"** (for outside access)

### 2.3 Deploy Backend Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. **Connect GitHub**: Authorize and select your repository
3. **Configure Service**:
   - **Name**: `vitalops-api`
   - **Environment**: `Node`
   - **Region**: Choose closest
   - **Branch**: `main` (or your main branch)
   - **Root Directory**: `apps/backend-api`
   - **Build Command**: 
     ```bash
     npm install && npm run build && npx prisma generate
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```
   - **Plan**: Free (or paid for production)

4. **Environment Variables** - Click **"Add Environment Variable"** and add:

   ```
   DATABASE_URL = postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
   (Use the connection string from Step 1.3)

   ```
   JWT_SECRET = [Generate a random string - use: openssl rand -base64 32]
   ```

   ```
   JWT_EXPIRES_IN = 7d
   ```

   ```
   NODE_ENV = production
   ```

   ```
   PORT = 5000
   ```

   ```
   ADMIN_WEB_URL = https://your-admin-app.vercel.app
   ```
   (We'll update this after deploying frontend)

   ```
   MOBILE_APP_URL = exp://localhost:19000
   ```

   ```
   WHATSAPP_API_KEY = your-key-here
   ```
   (Optional - leave empty if not using WhatsApp)

   ```
   WHATSAPP_APP_NAME = VitalOps
   ```

   ```
   UPI_ID = yourbusiness@upi
   ```
   (Optional)

   ```
   UPI_MERCHANT_NAME = VitalOps Medical Equipment
   ```

5. Click **"Create Web Service"**
6. Wait 5-10 minutes for first deployment

### 2.4 Run Database Migrations

1. After deployment completes, click on your service
2. Go to **"Shell"** tab (or use **"Logs"** to find the URL)
3. In the shell, run:
   ```bash
   cd apps/backend-api
   npx prisma migrate deploy
   npx prisma db seed
   ```
4. Wait for migrations to complete

### 2.5 Test Backend API

1. Copy your service URL (e.g., `https://vitalops-api.onrender.com`)
2. Test health endpoint:
   ```
   https://vitalops-api.onrender.com/health
   ```
3. Should return: `{"status":"OK",...}`

**✅ Backend is now live!** Save the URL - you'll need it for frontend.

---

## Step 3: Deploy Admin Web (Vercel) - 10 minutes

### 3.1 Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)
4. Authorize Vercel

### 3.2 Deploy Admin Web

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. **Import Git Repository**: Select your VitalOps repository
3. **Configure Project**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **"Edit"** and set to `apps/admin-web`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables** - Click **"Add"** and add:

   ```
   NEXT_PUBLIC_API_URL = https://vitalops-api.onrender.com/api/v1
   ```
   (Use your backend URL from Step 2.5)

5. Click **"Deploy"**
6. Wait 2-5 minutes for deployment

### 3.3 Update Backend CORS Settings

1. Go back to Render dashboard
2. Edit your backend service
3. Update environment variable:
   ```
   ADMIN_WEB_URL = https://your-project-name.vercel.app
   ```
   (Use the Vercel URL from Step 3.2)
4. **Save** and wait for redeployment

### 3.4 Test Admin Web

1. Visit your Vercel URL (e.g., `https://vitalops-admin.vercel.app`)
2. Try logging in with:
   - Email: `admin@vitalops.com`
   - Password: `admin123`
   (These are from the seed data)

**✅ Admin Web is now live!**

---

## Step 4: Mobile App (Optional) - 30 minutes

### 4.1 Install Expo EAS CLI

```bash
npm install -g eas-cli
```

### 4.2 Login to Expo

```bash
eas login
```

### 4.3 Configure EAS

```bash
cd apps/mobile-app
eas build:configure
```

### 4.4 Build Android APK

```bash
# For testing
eas build --platform android --profile preview

# For Play Store
eas build --platform android --profile production
```

### 4.5 Build iOS App

```bash
# Requires Apple Developer account ($99/year)
eas build --platform ios --profile production
```

### 4.6 Update Mobile App API URL

Before building, update the API URL in your mobile app code to point to your production backend.

---

## 🔧 Post-Deployment Configuration

### Update Environment Variables

**Backend (Render)**:
- Update `ADMIN_WEB_URL` with your Vercel URL
- Update `MOBILE_APP_URL` if deploying mobile app

**Frontend (Vercel)**:
- Verify `NEXT_PUBLIC_API_URL` points to your Render backend

### Test Everything

1. ✅ Backend health check works
2. ✅ Can login to admin web
3. ✅ Dashboard loads data
4. ✅ Can create assets/customers/rentals
5. ✅ API endpoints respond correctly

---

## 🔒 Security Checklist

- [ ] JWT_SECRET is strong and unique
- [ ] Database password is strong
- [ ] HTTPS enabled (automatic on Render/Vercel)
- [ ] CORS configured correctly
- [ ] Environment variables are secure (not in code)
- [ ] Database backups enabled (Supabase has automatic backups)

---

## 📊 Monitoring & Maintenance

### Check Logs

**Render**: Dashboard → Your Service → Logs
**Vercel**: Dashboard → Your Project → Deployments → View Function Logs

### Database Management

**Supabase**: Dashboard → Table Editor (GUI) or SQL Editor
**Prisma Studio**: 
```bash
cd apps/backend-api
npx prisma studio
```

### Update Application

1. Push changes to GitHub
2. Render and Vercel auto-deploy on push
3. Monitor logs for errors

---

## 🆘 Troubleshooting

### Backend won't start

- Check environment variables are set correctly
- Verify DATABASE_URL is correct
- Check logs in Render dashboard
- Ensure migrations ran successfully

### Frontend can't connect to backend

- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running (check health endpoint)

### Database connection errors

- Verify DATABASE_URL format
- Check Supabase project is active
- Ensure password is correct (no brackets in URL)

### Build failures

- Check build logs in Render/Vercel
- Verify all dependencies are in package.json
- Ensure TypeScript compiles without errors

---

## 💰 Cost Summary

### Free Tier (Development/Small Scale)
- **Supabase**: Free (500MB database)
- **Render**: Free (spins down after inactivity)
- **Vercel**: Free (unlimited for personal projects)
- **Total**: $0/month

### Paid Tier (Production)
- **Supabase**: $25/month (8GB database)
- **Render**: $7/month (always-on backend)
- **Vercel**: $20/month (team features)
- **Total**: ~$52/month

---

## ✅ Success Checklist

- [ ] Database created and migrations run
- [ ] Backend API deployed and accessible
- [ ] Admin web deployed and accessible
- [ ] Can login with seeded credentials
- [ ] All features working correctly
- [ ] Environment variables configured
- [ ] HTTPS enabled (automatic)
- [ ] Monitoring set up

---

## 🎉 You're Live!

Your VitalOps application is now hosted and accessible worldwide!

**Next Steps**:
1. Set up custom domain (optional)
2. Configure WhatsApp integration (if needed)
3. Set up monitoring/analytics
4. Schedule regular backups
5. Update mobile app API URLs

---

## 📞 Need Help?

- Check `docs/DEPLOYMENT.md` for more details
- Review Render/Vercel documentation
- Check application logs for errors
