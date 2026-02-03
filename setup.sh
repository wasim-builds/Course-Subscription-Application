#!/bin/bash

echo "🎓 CourseHub - Black Friday Edition Setup Script"
echo "=================================================="
echo ""

# Check if MongoDB is running
echo "📊 Checking MongoDB status..."
if pgrep -x "mongod" > /dev/null
then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running"
    echo "Please start MongoDB with: sudo systemctl start mongod"
    echo "Or use MongoDB Atlas for cloud database"
    exit 1
fi

echo ""
echo "🔧 Setting up Backend..."
cd backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Seed database
echo "Seeding database with dummy data..."
npm run seed

# Start backend in background
echo "Starting backend server..."
npm run dev &
BACKEND_PID=$!
echo "Backend running on http://localhost:5000 (PID: $BACKEND_PID)"

echo ""
echo "🎨 Setting up Frontend..."
cd ../frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Start frontend
echo "Starting frontend server..."
echo "Frontend will run on http://localhost:5173"
echo ""
echo "✨ Setup complete!"
echo ""
echo "📝 Demo Credentials:"
echo "   Email: john@example.com"
echo "   Password: password123"
echo ""
echo "🎟️ Promo Code: BFSALE25 (50% OFF)"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

npm run dev
