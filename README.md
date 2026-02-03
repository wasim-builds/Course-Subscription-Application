# 🎓 CourseHub - Black Friday Edition

A full-stack course subscription application with Black Friday promo code support. Users can browse courses, subscribe to **8 free courses** instantly, and get 50% off on **5 premium courses** using the promo code **BFSALE25**.

![Black Friday Sale](https://img.shields.io/badge/Black%20Friday-50%25%20OFF-red?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)

## ✨ Features

### Authentication
- 🔐 JWT-based authentication
- 📝 User registration and login
- 🔒 Protected routes for authenticated users

### Course Management
- 📚 Browse 13 courses (8 free + 5 premium)
- 🆓 Free courses (instant enrollment, no payment required)
- � Premium courses (with promo code validation)
- 🖼️ Course thumbnails and detailed descriptions
- 🎯 Separate sections for free and premium courses

### Subscription System
- ✅ Subscribe to free courses instantly
- 🎟️ Apply promo code **BFSALE25** for 50% discount on paid courses
- 🚫 Prevent duplicate subscriptions
- 📊 View all subscribed courses in "My Courses"

### UI/UX
- 🎨 Modern Black Friday themed design
- 🌙 Dark mode interface
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔔 Toast notifications for user feedback
- ⚡ Smooth animations and transitions

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **TailwindCSS** - Styling
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🚀 Local Development Setup

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd Course-Subscription-Application
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env file with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb://localhost:27017/course-subscription
# or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/course-subscription
# JWT_SECRET=your_super_secret_jwt_key_here

# Seed the database with dummy data
npm run seed

# Start the backend server
npm run dev
\`\`\`

Backend will run on **http://localhost:5000**

### 3. Frontend Setup

\`\`\`bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\`

Frontend will run on **http://localhost:5173**

## 👤 Demo User Credentials

Use these credentials to login:

| Email | Password |
|-------|----------|
| john@example.com | password123 |
| jane@example.com | password123 |
| admin@example.com | admin123 |

## 🎟️ Promo Code

Use promo code **BFSALE25** to get **50% OFF** on all paid courses!

## 📁 Project Structure

\`\`\`
Course-Subscription-Application/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   └── Subscription.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   └── subscriptionRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── scripts/
│   │   └── seedData.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── CourseCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── CourseDetail.jsx
│   │   │   └── MyCourses.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
\`\`\`

## 🔌 API Endpoints

### Authentication
- \`POST /api/auth/signup\` - Register new user
- \`POST /api/auth/login\` - Login user

### Courses
- \`GET /api/courses\` - Get all courses
- \`GET /api/courses/:id\` - Get single course

### Subscriptions
- \`POST /api/subscribe\` - Subscribe to a course (requires auth)
- \`GET /api/my-courses\` - Get user's subscribed courses (requires auth)

## 🌐 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables:
   - \`MONGODB_URI\` - Your MongoDB Atlas connection string
   - \`JWT_SECRET\` - Your JWT secret key
   - \`NODE_ENV=production\`
4. Build command: \`cd backend && npm install\`
5. Start command: \`cd backend && npm start\`

### Frontend Deployment (Vercel/Netlify)

1. Create a new project
2. Connect your GitHub repository
3. Set build settings:
   - Build command: \`cd frontend && npm run build\`
   - Output directory: \`frontend/dist\`
4. Set environment variable:
   - \`VITE_API_URL\` - Your backend API URL

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)

### Home Page - Course Listing
![Home Page](screenshots/home.png)

### Course Detail Page
![Course Detail](screenshots/course-detail.png)

### My Courses Page
![My Courses](screenshots/my-courses.png)

## 🧪 Testing the Application

### Test Free Course Subscription
1. Login with demo credentials
2. Navigate to a FREE course
3. Click "Enroll Now"
4. Verify course appears in "My Courses"

### Test Paid Course with Promo Code
1. Navigate to a PAID course
2. Enter promo code: \`BFSALE25\`
3. Click "Apply Code"
4. Verify 50% discount is applied
5. Click "Subscribe Now"
6. Verify course appears in "My Courses" with discounted price

## 🔒 Security Features

- ✅ Passwords hashed with bcrypt
- ✅ JWT token-based authentication
- ✅ Protected API routes
- ✅ Input validation
- ✅ CORS enabled
- ✅ Duplicate subscription prevention

## 🎨 Design Features

- Modern Black Friday themed UI
- Gradient backgrounds and buttons
- Smooth hover effects and transitions
- Responsive grid layouts
- Toast notifications for user feedback
- Loading states and spinners
- Empty states for better UX

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Author

Created as part of a full-stack development project.

---

**Happy Learning! 🚀**

*Don't forget to use promo code BFSALE25 for 50% off!* 🎉
