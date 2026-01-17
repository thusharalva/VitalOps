# VitalOps Deployment Guide

## Deployment Options

### Backend API
- **Recommended**: Render, Railway, or Heroku
- **Alternative**: DigitalOcean, AWS EC2, or VPS

### Database
- **Recommended**: Supabase (free tier) or Neon
- **Alternative**: Railway PostgreSQL, ElephantSQL, or self-hosted

### Admin Web
- **Recommended**: Vercel (automatic deployments from Git)
- **Alternative**: Netlify, Cloudflare Pages

### Mobile App
- **iOS**: App Store (requires Apple Developer account)
- **Android**: Google Play Store (requires Google Play Developer account)
- **Alternative**: Expo EAS Build for over-the-air updates

## Backend Deployment (Render)

### 1. Create Render Account
- Visit https://render.com
- Sign up with GitHub

### 2. Create PostgreSQL Database

```bash
# In Render Dashboard
1. Click "New +" → "PostgreSQL"
2. Name: vitalops-db
3. Plan: Free tier
4. Create Database
5. Copy the "External Database URL"
```

### 3. Deploy Backend API

```bash
# In Render Dashboard
1. Click "New +" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - Name: vitalops-api
   - Environment: Node
   - Build Command: cd apps/backend-api && npm install && npm run build
   - Start Command: cd apps/backend-api && npm start
   - Plan: Free tier

4. Add Environment Variables:
   DATABASE_URL=<from-step-2>
   JWT_SECRET=<generate-secure-key>
   NODE_ENV=production
   PORT=5000
   
5. Deploy
```

### 4. Run Database Migrations

```bash
# In Render Shell
cd apps/backend-api
npx prisma migrate deploy
```

## Admin Web Deployment (Vercel)

### 1. Create Vercel Account
- Visit https://vercel.com
- Sign up with GitHub

### 2. Deploy Admin Web

```bash
# Option 1: Via Vercel Dashboard
1. Click "Add New..." → "Project"
2. Import your Git repository
3. Configure:
   - Framework Preset: Next.js
   - Root Directory: apps/admin-web
   - Build Command: cd apps/admin-web && npm run build
   - Output Directory: .next
   
4. Add Environment Variables:
   NEXT_PUBLIC_API_URL=https://vitalops-api.onrender.com/api/v1
   
5. Deploy

# Option 2: Via CLI
cd apps/admin-web
npx vercel
# Follow prompts
```

## Mobile App Deployment

### Setup Expo EAS

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
cd apps/mobile-app
eas build:configure
```

### Android Build

```bash
# Build APK for testing
eas build --platform android --profile preview

# Build AAB for Play Store
eas build --platform android --profile production
```

### iOS Build

```bash
# Build for App Store (requires Apple Developer account)
eas build --platform ios --profile production
```

### Over-the-Air Updates

```bash
# Publish update without rebuilding
eas update --branch production --message "Bug fixes"
```

## Database Deployment (Supabase)

### 1. Create Supabase Project

```bash
1. Visit https://supabase.com
2. Create new project
3. Copy connection string
```

### 2. Update Environment Variables

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

### 3. Run Migrations

```bash
cd apps/backend-api
npx prisma migrate deploy
```

## Environment Variables

### Backend API (.env)

```env
# Production
DATABASE_URL="postgresql://..."
JWT_SECRET="<strong-random-secret>"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="production"

# WhatsApp
WHATSAPP_API_KEY="your-api-key"
WHATSAPP_APP_NAME="VitalOps"

# Frontend URLs
ADMIN_WEB_URL="https://vitalops-admin.vercel.app"
MOBILE_APP_URL="exp://..."

# UPI
UPI_ID="business@upi"
UPI_MERCHANT_NAME="VitalOps Medical Equipment"
```

### Admin Web

```env
NEXT_PUBLIC_API_URL="https://vitalops-api.onrender.com/api/v1"
```

## SSL/HTTPS

- **Vercel**: Automatic SSL
- **Render**: Automatic SSL
- **Custom Domain**: Configure DNS records

## Monitoring & Logging

### Sentry (Error Tracking)

```bash
npm install @sentry/node @sentry/react

# Backend
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: "your-dsn" });

# Frontend
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "your-dsn" });
```

### Log Management

- **Render**: Built-in logs dashboard
- **Alternative**: LogRocket, Papertrail, or Datadog

## Performance Optimization

### Backend
- Enable gzip compression
- Use Redis for caching (optional)
- Database connection pooling

### Frontend
- Enable Next.js Image Optimization
- Use CDN for static assets
- Implement lazy loading

### Mobile
- Optimize image sizes
- Use Hermes engine (Android)
- Enable ProGuard (Android production)

## Backup Strategy

### Database Backups

```bash
# Manual backup (PostgreSQL)
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Automated backups
- Supabase: Automatic daily backups
- Render: Point-in-time recovery
```

### File Storage Backups
- Store assets on S3/Cloudinary
- Regular backup to multiple regions

## Continuous Deployment

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel --prod
```

## Rollback Strategy

### Backend
```bash
# Render: Revert to previous deployment via dashboard
# Or redeploy specific commit
```

### Database
```bash
# Restore from backup
psql $DATABASE_URL < backup-20240101.sql
```

## Health Checks

### Backend Health Endpoint
```http
GET /health
Response: { "status": "OK", "timestamp": "..." }
```

### Monitoring
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Configure alerts for downtime

## Scaling

### Vertical Scaling
- Upgrade Render/Railway plan
- Increase database resources

### Horizontal Scaling
- Deploy multiple backend instances
- Use load balancer
- Implement Redis for session management

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Database backups scheduled
- [ ] Error logging configured
- [ ] Input validation enabled
- [ ] SQL injection prevention (Prisma)
- [ ] XSS protection
- [ ] JWT secret is strong and unique

## Cost Estimation

### Free Tier (Development)
- Render (Backend): Free
- Supabase (Database): Free (500MB)
- Vercel (Frontend): Free
- **Total**: $0/month

### Paid Tier (Production)
- Render (Backend): $7/month
- Supabase (Database): $25/month
- Vercel (Frontend): $20/month
- **Total**: ~$52/month

## Post-Deployment Tasks

1. Test all API endpoints
2. Verify database connections
3. Test authentication flow
4. Check mobile app functionality
5. Monitor error logs
6. Set up analytics
7. Configure backups
8. Update documentation with production URLs



