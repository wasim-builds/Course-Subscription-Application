# Deployment Guide - Course Subscription Application

## Quick Start Commands

### Running Locally

**Terminal 1 - Backend**:
```bash
cd backend
npm run seed    # First time only - seeds database with 13 courses
npm run dev     # Starts backend on port 5000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev     # Starts frontend on port 5173
```

Then open: http://localhost:5173

### Demo Credentials
- Email: `john@example.com`
- Password: `password123`

---

## Production Deployment

### Backend Deployment (Render/Railway/Heroku)

1. **Create Web Service**
   - Connect your GitHub repository
   - Root directory: `backend`

2. **Environment Variables**:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/course-subscription
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   NODE_ENV=production
   PORT=5000
   ```

3. **Build Settings**:
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Post-Deployment**:
   - Run seed script once: `npm run seed`

### Frontend Deployment (Vercel/Netlify)

1. **Create Project**
   - Connect your GitHub repository
   - Root directory: `frontend`

2. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Environment Variables**:
   ```env
   VITE_API_URL=https://your-backend-url.com
   ```

---

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string and update `.env`

---

## Testing Checklist

- [ ] Login with demo credentials works
- [ ] Free courses display in separate section
- [ ] Can enroll in free courses without promo code
- [ ] Premium courses require promo code BFSALE25
- [ ] 50% discount applies correctly
- [ ] My Courses page shows enrolled courses
- [ ] Responsive design works on mobile

---

## Features

✅ **13 Courses Total**
- 8 Free Courses (instant enrollment)
- 5 Premium Courses (50% off with BFSALE25)

✅ **Enhanced UI**
- Separate sections for free and premium courses
- Clear visual indicators
- Responsive design

✅ **Bug Fixes**
- Fixed password validation (now 6 characters minimum)
- Improved free course enrollment flow

---

---

## 🐳 Docker Deployment

For containerized deployment with Docker:

```bash
# Quick start with Docker Compose
docker-compose up -d

# Seed database (first time only)
docker-compose exec backend npm run seed

# Access application
# Frontend: http://localhost
# Backend: http://localhost:5000
```

**See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for complete Docker deployment guide.**

### Docker Features
- ✅ Consistent environment across all platforms
- ✅ Easy local development
- ✅ Production-ready containers
- ✅ Health checks included
- ✅ Multi-stage builds for optimization

---

## ▲ Vercel Deployment

For serverless deployment on Vercel:

### Recommended: Frontend on Vercel + Backend on Render

1. **Deploy Backend to Render**:
   - Create Web Service on [render.com](https://render.com)
   - Root directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
   - Add environment variables

2. **Deploy Frontend to Vercel**:
   ```bash
   cd frontend
   vercel --prod
   ```
   - Add environment variable: `VITE_API_URL=https://your-backend.onrender.com`

**See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for complete Vercel deployment guide.**

### Vercel Features
- ✅ Automatic deployments from GitHub
- ✅ Global CDN for fast delivery
- ✅ Free SSL certificates
- ✅ Preview deployments for PRs
- ✅ Built-in analytics

---

## Support

For issues, check:
1. MongoDB connection is active
2. Environment variables are set correctly
3. Both backend and frontend are running
4. Ports 5000 and 5173 are available
