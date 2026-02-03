# ▲ Vercel Deployment Guide

## Overview

This guide covers deploying the Course Subscription Application on Vercel. **Important**: Vercel is optimized for frontend and serverless functions. For this full-stack app, we recommend:

**Recommended Approach**: Deploy frontend on Vercel + backend on Render/Railway

## Prerequisites

- Vercel account (free tier available)
- GitHub repository
- MongoDB Atlas account
- Backend deployed elsewhere (Render, Railway, Heroku)

---

## Option 1: Frontend Only on Vercel (Recommended)

### Step 1: Deploy Backend Elsewhere

First, deploy your backend to a platform like Render or Railway:

#### Render Deployment

1. Go to [render.com](https://render.com)
2. Create new **Web Service**
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   PORT=5000
   ```
6. Deploy and note the URL (e.g., `https://your-app.onrender.com`)

#### Railway Deployment

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Select `backend` directory
4. Add environment variables
5. Deploy and note the URL

### Step 2: Deploy Frontend on Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Update Frontend API URL**:
   
   Create `frontend/.env.production`:
   ```env
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

3. **Deploy via Vercel Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add environment variable:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com
     ```
   - Click "Deploy"

4. **Or Deploy via CLI**:
   ```bash
   cd frontend
   vercel --prod
   ```

### Step 3: Update Backend CORS

Update `backend/server.js` to allow your Vercel domain:

```javascript
app.use(cors({
  origin: ['https://your-app.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

---

## Option 2: Full Stack on Vercel (Advanced)

> [!WARNING]
> This approach converts your Express backend to Vercel serverless functions. It works but has limitations (cold starts, execution time limits).

### Step 1: Update Project Structure

The `vercel.json` file is already configured to proxy API requests.

### Step 2: Configure Environment Variables

In Vercel dashboard, add:
```
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=production
VITE_API_URL=https://your-app.vercel.app
```

### Step 3: Deploy

```bash
# From project root
vercel --prod
```

### Limitations of Serverless Backend

- ❌ Cold starts (first request slow)
- ❌ 10-second execution limit
- ❌ No persistent connections
- ❌ More complex debugging

---

## Vercel Configuration Files

### vercel.json

Already created with:
- Frontend build configuration
- API proxy routing
- Environment variables

### package.json (root)

Already created with:
- Vercel build script
- Frontend build command

---

## Environment Variables Setup

### Via Vercel Dashboard

1. Go to Project Settings
2. Navigate to "Environment Variables"
3. Add variables:
   - `VITE_API_URL` - Your backend URL
   - (If using serverless backend) `MONGODB_URI`, `JWT_SECRET`

### Via Vercel CLI

```bash
vercel env add VITE_API_URL production
# Enter value: https://your-backend-url.onrender.com

vercel env add MONGODB_URI production
# Enter value: mongodb+srv://...
```

---

## Custom Domain Setup

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatically provisioned

---

## Deployment Workflow

### Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: For every pull request

### Manual Deployment

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Monitoring and Logs

### View Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click on a deployment
4. View "Functions" or "Build" logs

### Analytics

Vercel provides:
- Page views
- Performance metrics
- Error tracking

---

## Troubleshooting

### Build Fails

```bash
# Check build logs in Vercel dashboard
# Common issues:
# 1. Wrong build command
# 2. Missing environment variables
# 3. Node version mismatch
```

### API Requests Fail

```bash
# Check:
# 1. VITE_API_URL is correct
# 2. Backend CORS allows Vercel domain
# 3. Backend is running and accessible
```

### Environment Variables Not Working

```bash
# Ensure variables are:
# 1. Added in Vercel dashboard
# 2. Prefixed with VITE_ for frontend
# 3. Redeployed after adding
```

---

## Performance Optimization

### Enable Edge Network

Vercel automatically uses CDN for static assets.

### Image Optimization

Use Vercel's Image Optimization:
```jsx
import Image from 'next/image' // If using Next.js
```

### Caching Headers

Already configured in `nginx.conf` for Docker deployment.

---

## Cost Considerations

### Free Tier Includes:
- Unlimited deployments
- 100 GB bandwidth
- Automatic HTTPS
- Preview deployments

### Pro Tier ($20/month):
- More bandwidth
- Advanced analytics
- Team collaboration

---

## Recommended Setup

For production, we recommend:

```
┌─────────────────┐
│  Vercel         │
│  (Frontend)     │
│  ↓ API calls    │
└─────────────────┘
        ↓
┌─────────────────┐
│  Render/Railway │
│  (Backend API)  │
│  ↓ DB queries   │
└─────────────────┘
        ↓
┌─────────────────┐
│  MongoDB Atlas  │
│  (Database)     │
└─────────────────┘
```

**Benefits**:
- ✅ Fast frontend delivery (Vercel CDN)
- ✅ Reliable backend (dedicated server)
- ✅ No cold starts for API
- ✅ Better debugging
- ✅ Scalable architecture

---

## Quick Deploy Commands

### Deploy Frontend to Vercel

```bash
cd frontend
vercel --prod
```

### Deploy Backend to Render

```bash
# Push to GitHub, then deploy via Render dashboard
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] API requests work
- [ ] Login/signup functions
- [ ] Free course enrollment works
- [ ] Premium course subscription works
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled
- [ ] Error tracking set up

---

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app)

---

## Next Steps

1. Set up monitoring (Sentry, LogRocket)
2. Configure custom domain
3. Enable analytics
4. Set up CI/CD pipeline
5. Implement automated testing
