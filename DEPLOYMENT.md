# Deployment Guide

## Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Render/Railway account (for backend)
- Vercel/Netlify account (for frontend)

---

## Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with username and password
4. Whitelist all IP addresses (0.0.0.0/0) for development
5. Get your connection string:
   \`\`\`
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/course-subscription?retryWrites=true&w=majority
   \`\`\`

---

## Step 2: Deploy Backend (Render)

### Option A: Using Render

1. Go to [Render](https://render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** course-subscription-backend
   - **Root Directory:** backend
   - **Environment:** Node
   - **Build Command:** \`npm install\`
   - **Start Command:** \`npm start\`
5. Add Environment Variables:
   \`\`\`
   MONGODB_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<your-secret-key>
   NODE_ENV=production
   PORT=5000
   \`\`\`
6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy your backend URL (e.g., \`https://course-subscription-backend.onrender.com\`)

### Option B: Using Railway

1. Go to [Railway](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory:** backend
   - **Build Command:** \`npm install\`
   - **Start Command:** \`npm start\`
5. Add Environment Variables (same as above)
6. Deploy and copy your backend URL

---

## Step 3: Seed Production Database

After backend is deployed, seed the database:

1. Open your backend URL in browser: \`https://your-backend-url.com/api/health\`
2. You should see: \`{"success": true, "message": "Course Subscription API is running"}\`
3. SSH into your Render/Railway instance or use a local terminal:
   \`\`\`bash
   # Set your production MongoDB URI
   export MONGODB_URI="mongodb+srv://..."
   export JWT_SECRET="your-secret"
   
   # Run seed script
   cd backend
   npm run seed
   \`\`\`

Alternatively, you can create a temporary route in your backend to seed data via HTTP request.

---

## Step 4: Deploy Frontend (Vercel)

### Option A: Using Vercel

1. Go to [Vercel](https://vercel.com/)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** frontend
   - **Build Command:** \`npm run build\`
   - **Output Directory:** \`dist\`
5. Add Environment Variable:
   \`\`\`
   VITE_API_URL=https://your-backend-url.com/api
   \`\`\`
6. Click "Deploy"
7. Wait for deployment to complete
8. Your frontend will be live at \`https://your-app.vercel.app\`

### Option B: Using Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure:
   - **Base directory:** frontend
   - **Build command:** \`npm run build\`
   - **Publish directory:** \`frontend/dist\`
5. Add Environment Variable (same as above)
6. Click "Deploy site"

---

## Step 5: Update Frontend API URL

If you didn't set the environment variable during deployment:

1. Go to your Vercel/Netlify dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add:
   \`\`\`
   VITE_API_URL=https://your-backend-url.com/api
   \`\`\`
4. Redeploy your frontend

---

## Step 6: Test Production Application

1. Visit your frontend URL
2. Login with demo credentials:
   - Email: \`john@example.com\`
   - Password: \`password123\`
3. Test free course subscription
4. Test paid course with promo code \`BFSALE25\`
5. Verify "My Courses" page shows subscriptions

---

## Troubleshooting

### Backend Issues

**Problem:** Cannot connect to MongoDB
- **Solution:** Check MongoDB Atlas IP whitelist and connection string

**Problem:** 500 errors on API calls
- **Solution:** Check backend logs in Render/Railway dashboard

### Frontend Issues

**Problem:** API calls failing
- **Solution:** Verify \`VITE_API_URL\` environment variable is set correctly

**Problem:** CORS errors
- **Solution:** Backend already has CORS enabled, but verify your frontend URL is accessible

### Database Issues

**Problem:** No courses showing
- **Solution:** Run the seed script to populate the database

---

## Production URLs

After deployment, you should have:

- **Backend API:** \`https://your-backend.onrender.com\`
- **Frontend App:** \`https://your-app.vercel.app\`
- **MongoDB:** \`mongodb+srv://...\`

---

## Security Checklist

- ✅ Environment variables set correctly
- ✅ MongoDB Atlas IP whitelist configured
- ✅ JWT secret is strong and unique
- ✅ HTTPS enabled (automatic on Vercel/Render)
- ✅ Passwords are hashed
- ✅ No sensitive data in frontend code

---

## Monitoring

- **Backend:** Check Render/Railway logs for errors
- **Frontend:** Check Vercel/Netlify deployment logs
- **Database:** Monitor MongoDB Atlas dashboard for connections

---

## Updating the Application

1. Push changes to GitHub
2. Vercel/Netlify will auto-deploy frontend
3. Render/Railway will auto-deploy backend
4. No manual intervention needed!

---

## Cost Estimate

- **MongoDB Atlas:** Free (512MB storage)
- **Render/Railway:** Free tier available
- **Vercel/Netlify:** Free tier available

**Total:** $0/month for hobby projects! 🎉
