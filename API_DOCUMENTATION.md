# API Documentation

## Base URL
- Development: `http://localhost:5000/api`
- Production: `https://your-backend-url.com/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

---

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user.

**Request Body:**
\`\`\`json
{
  "name": "John Doe",      // optional
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

#### POST /auth/login
Login an existing user.

**Request Body:**
\`\`\`json
{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

---

### Courses

#### GET /courses
Get all available courses (public).

**Response (200):**
\`\`\`json
{
  "success": true,
  "count": 8,
  "courses": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete Web Development Bootcamp",
      "description": "Master HTML, CSS, JavaScript, React...",
      "price": 4999,
      "image": "https://images.unsplash.com/...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
\`\`\`

#### GET /courses/:id
Get a single course by ID (public).

**Response (200):**
\`\`\`json
{
  "success": true,
  "course": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Complete Web Development Bootcamp",
    "description": "Master HTML, CSS, JavaScript, React...",
    "price": 4999,
    "image": "https://images.unsplash.com/...",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
\`\`\`

---

### Subscriptions

#### POST /subscribe
Subscribe to a course (protected).

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body (Free Course):**
\`\`\`json
{
  "courseId": "507f1f77bcf86cd799439011"
}
\`\`\`

**Request Body (Paid Course):**
\`\`\`json
{
  "courseId": "507f1f77bcf86cd799439011",
  "promoCode": "BFSALE25"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "success": true,
  "message": "Successfully subscribed to course",
  "subscription": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439010",
    "courseId": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Complete Web Development Bootcamp",
      "description": "Master HTML, CSS, JavaScript, React...",
      "price": 4999,
      "image": "https://images.unsplash.com/..."
    },
    "pricePaid": 2499.5,
    "subscribedAt": "2024-01-01T00:00:00.000Z"
  }
}
\`\`\`

**Error Responses:**
- 400: Invalid promo code
- 400: Already subscribed
- 400: Promo code required for paid courses
- 404: Course not found

#### GET /my-courses
Get all courses the authenticated user is subscribed to (protected).

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "count": 2,
  "subscriptions": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439010",
      "courseId": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Complete Web Development Bootcamp",
        "description": "Master HTML, CSS, JavaScript, React...",
        "price": 4999,
        "image": "https://images.unsplash.com/..."
      },
      "pricePaid": 2499.5,
      "subscribedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
\`\`\`

---

## Promo Code Logic

- **Valid Promo Code:** `BFSALE25`
- **Discount:** 50% off
- **Applies to:** Paid courses only
- **Calculation:** `pricePaid = originalPrice * 0.5`

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error
