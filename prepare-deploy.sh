#!/bin/bash

# Course Subscription Application - Deployment Preparation Script
# This script helps prepare your application for deployment

echo "🚀 Course Subscription Application - Deployment Preparation"
echo "============================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if MongoDB Atlas is accessible
echo "1️⃣  Checking MongoDB Atlas Connection..."
cd backend
node scripts/test-auth.js
MONGO_STATUS=$?

if [ $MONGO_STATUS -eq 0 ]; then
    echo -e "${GREEN}✅ MongoDB Atlas connection successful!${NC}"
else
    echo -e "${RED}❌ MongoDB Atlas connection failed!${NC}"
    echo -e "${YELLOW}⚠️  Action Required:${NC}"
    echo "   1. Go to https://cloud.mongodb.com/"
    echo "   2. Navigate to Network Access"
    echo "   3. Add IP Address: 0.0.0.0/0 (Allow from anywhere)"
    echo "   4. Run this script again"
    echo ""
    exit 1
fi

echo ""
echo "2️⃣  Checking if database is seeded..."
USER_COUNT=$(node -e "
const mongoose = require('mongoose');
const User = require('./models/User.js').default;
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const count = await User.countDocuments();
        console.log(count);
        process.exit(0);
    })
    .catch(() => {
        console.log(0);
        process.exit(1);
    });
" 2>/dev/null)

if [ "$USER_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✅ Database has $USER_COUNT users${NC}"
else
    echo -e "${YELLOW}⚠️  Database is empty. Seeding now...${NC}"
    npm run seed
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database seeded successfully!${NC}"
    else
        echo -e "${RED}❌ Failed to seed database${NC}"
        exit 1
    fi
fi

echo ""
echo "3️⃣  Checking environment variables..."
cd ..

# Check backend .env
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✅ Backend .env file exists${NC}"
    
    # Check for required variables
    if grep -q "MONGODB_URI=" backend/.env && \
       grep -q "JWT_SECRET=" backend/.env; then
        echo -e "${GREEN}✅ Required environment variables present${NC}"
    else
        echo -e "${RED}❌ Missing required environment variables${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Backend .env file not found${NC}"
    exit 1
fi

echo ""
echo "4️⃣  Testing backend build..."
cd backend
npm install --silent
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install backend dependencies${NC}"
    exit 1
fi

echo ""
echo "5️⃣  Testing frontend build..."
cd ../frontend
npm install --silent
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
    exit 1
fi

npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend builds successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

cd ..

echo ""
echo "============================================================"
echo -e "${GREEN}✅ All checks passed! Ready for deployment!${NC}"
echo ""
echo "📋 Next Steps:"
echo "   Option 1: Deploy to Render + Vercel"
echo "   Option 2: Deploy with Docker"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo "🐳 See DOCKER_DEPLOYMENT.md for Docker deployment"
echo ""
