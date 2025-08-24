# 🔐 Custom JWT Auth Server with Supabase RLS

A complete authentication system with custom JWT tokens, refresh tokens, and Row Level Security (RLS) using Node.js, Express, and Supabase.

## 📋 Table of Contents

- [🏗️ Architecture Overview](#️-architecture-overview)
- [🚀 Quick Start](#-quick-start)
- [🔧 System Components](#-system-components)
- [🔄 Authentication Flow](#-authentication-flow)
- [🗄️ Database Schema](#️-database-schema)
- [🔒 Security Features](#-security-features)
- [📱 Frontend Integration](#-frontend-integration)
- [🛠️ API Reference](#️-api-reference)
- [🐛 Troubleshooting](#-troubleshooting)

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Supabase      │
│   (Next.js)     │◄──►│   (Node.js)     │◄──►│   (Database)    │
│                 │    │                 │    │                 │
│ • Login Form    │    │ • JWT Auth      │    │ • RLS Policies  │
│ • Dashboard     │    │ • Token Refresh │    │ • User Data     │
│ • Todo App      │    │ • API Routes    │    │ • Todo Data     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🔄 Data Flow Diagram

```
User Login Flow:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │───►│  Frontend   │───►│  Backend    │───►│  Supabase   │
│  Credentials│    │   (Next.js) │    │ (Express)   │    │  Database   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Email/Pass  │    │ HTTP Request│    │ JWT Token   │    │ User Record │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 🚀 Quick Start

### 1. Clone & Setup
```bash
git clone <your-repo>
cd Auth-Server-Nodejs
npm install
```

### 2. Environment Configuration
```bash
cp env.example .env
```

**Required Environment Variables:**
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# Server Configuration
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

### 3. Database Setup
```sql
-- Run these in Supabase SQL Editor:

-- 1. Create auth table
-- Copy contents of: database/schema.sql

-- 2. Create todos table with RLS
-- Copy contents of: database/todos.sql

-- 3. Migrate to UUID (if needed)
-- Copy contents of: database/migrate-auth-to-uuid.sql

-- 4. Seed data
-- Copy contents of: database/seed.sql
-- Copy contents of: database/seed-todos.sql
```

### 4. Start Backend
```bash
npm start
# Server runs on http://localhost:3000
```

### 5. Start Frontend (Optional)
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3001
```

## 🔧 System Components

### 📁 Project Structure
```
Auth-Server-Nodejs/
├── 📁 app.js                 # Main server file
├── 📁 config/
│   └── supabase.js          # Supabase client config
├── 📁 controllers/
│   ├── auth.js              # Authentication logic
│   ├── login.js             # Login controller
│   ├── refresh.js           # Token refresh
│   ├── signup.js            # User registration
│   └── todos.js             # Todo operations
├── 📁 database/
│   ├── schema.sql           # Auth table schema
│   ├── todos.sql            # Todos table + RLS
│   ├── seed.sql             # Sample users
│   └── seed-todos.sql       # Sample todos
├── 📁 middleware/
│   └── auth.js              # JWT verification
├── 📁 routes/
│   └── index.js             # API routes
└── 📁 frontend/             # Next.js frontend app
    ├── 📁 app/              # Next.js pages
    ├── 📁 components/       # React components
    └── 📁 lib/              # Utilities
```

### 🔐 Authentication Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication System                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Login     │  │   Refresh   │  │   Logout    │        │
│  │ Controller  │  │ Controller  │  │ Controller  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│         │                │                │                │
│         ▼                ▼                ▼                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ JWT Token   │  │ Refresh     │  │ Clear       │        │
│  │ (15 min)    │  │ Token       │  │ All Tokens  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│         │                │                │                │
│         └────────────────┼────────────────┘                │
│                          │                                 │
│                          ▼                                 │
│                   ┌─────────────┐                         │
│                   │ HTTP-only   │                         │
│                   │ Cookies     │                         │
│                   └─────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Authentication Flow

### 1. User Registration Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │───►│  Frontend   │───►│  Backend    │───►│  Supabase   │
│ Registration│    │   Form      │    │ /signup     │    │  Database   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Email/Pass  │    │ HTTP POST   │    │ Hash Pass   │    │ Store User  │
│ Username    │    │ JSON Data   │    │ Create User │    │ Record      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### 2. User Login Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │───►│  Frontend   │───►│  Backend    │───►│  Supabase   │
│   Login     │    │   Form      │    │ /login      │    │  Database   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Email/Pass  │    │ HTTP POST   │    │ Verify Pass │    │ Get User    │
│             │    │ JSON Data   │    │ Generate    │    │ Data        │
│             │    │             │    │ JWT Tokens  │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       └───────────────────┼───────────────────┼───────────────────┘
                           │                   │
                           ▼                   ▼
                    ┌─────────────┐    ┌─────────────┐
                    │ Access Token│    │ Refresh     │
                    │ (15 min)    │    │ Token       │
                    │ + Cookies   │    │ (7 days)    │
                    └─────────────┘    └─────────────┘
```

### 3. Token Refresh Flow
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │───►│  Backend    │───►│  Supabase   │───►│   Frontend  │
│ API Call    │    │ /refresh    │    │  Database   │    │ New Token   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Access Token│    │ Verify      │    │ Check Token │    │ Updated     │
│ Expired     │    │ Refresh     │    │ in Database │    │ Access      │
│ (401 Error) │    │ Token       │    │ Generate    │    │ Token       │
│             │    │             │    │ New Token   │    │ + Cookies   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 🗄️ Database Schema

### Users Table (`auth_test`)
```sql
┌─────────────────────────────────────────────────────────────┐
│                        auth_test                            │
├─────────────────────────────────────────────────────────────┤
│  id (UUID, PK)        │ email (VARCHAR, UNIQUE)            │
│  username (VARCHAR)   │ password (VARCHAR, HASHED)         │
│  refresh_token        │ refresh_token_expires_at           │
│  created_at           │ updated_at                         │
└─────────────────────────────────────────────────────────────┘
```

### Todos Table (`public.todos`)
```sql
┌─────────────────────────────────────────────────────────────┐
│                        public.todos                         │
├─────────────────────────────────────────────────────────────┤
│  id (UUID, PK)        │ user_id (UUID, FK)                 │
│  title (TEXT)         │ completed (BOOLEAN)                │
│  created_at           │ updated_at                         │
└─────────────────────────────────────────────────────────────┘
```

### RLS Policies
```
┌─────────────────────────────────────────────────────────────┐
│                    Row Level Security                       │
├─────────────────────────────────────────────────────────────┤
│  SELECT Policy: user_id = auth.uid()                       │
│  INSERT Policy: user_id = auth.uid()                       │
│  UPDATE Policy: user_id = auth.uid()                       │
│  DELETE Policy: user_id = auth.uid()                       │
└─────────────────────────────────────────────────────────────┘
```

## 🔒 Security Features

### 🔐 JWT Token Structure
```
┌─────────────────────────────────────────────────────────────┐
│                    JWT Payload Structure                    │
├─────────────────────────────────────────────────────────────┤
│  Access Token:                                              │
│  {                                                          │
│    "sub": "user-uuid",           // User ID                │
│    "role": "authenticated",       // Required for RLS      │
│    "email": "user@example.com",   // User email            │
│    "username": "johndoe",         // Username              │
│    "type": "access",              // Token type            │
│    "iat": 1234567890,             // Issued at             │
│    "exp": 1234567890 + 900        // Expires in 15 min     │
│  }                                                          │
│                                                             │
│  Refresh Token:                                            │
│  {                                                          │
│    "userId": "user-uuid",         // User ID               │
│    "type": "refresh",             // Token type            │
│    "iat": 1234567890,             // Issued at             │
│    "exp": 1234567890 + 604800     // Expires in 7 days     │
│  }                                                          │
└─────────────────────────────────────────────────────────────┘
```

### 🛡️ Security Measures
```
┌─────────────────────────────────────────────────────────────┐
│                    Security Features                        │
├─────────────────────────────────────────────────────────────┤
│  ✅ HTTP-only Cookies          │ ✅ Password Hashing       │
│  ✅ CSRF Protection            │ ✅ JWT Token Expiration    │
│  ✅ Row Level Security         │ ✅ Refresh Token Rotation │
│  ✅ Input Validation           │ ✅ Secure Headers          │
│  ✅ Rate Limiting              │ ✅ Environment Variables   │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Frontend Integration

### 🎨 Frontend Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Pages     │  │ Components  │  │   Utils     │        │
│  │             │  │             │  │             │        │
│  │ • /         │  │ • LoginForm │  │ • API Client│        │
│  │ • /login    │  │ • Dashboard │  │ • Auth Hook │        │
│  │ • /dashboard│  │ • TodoList  │  │ • Interceptors│       │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### 🔄 Frontend-Backend Communication
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Browser   │───►│   Next.js   │───►│   Express   │
│             │    │   Frontend  │    │   Backend   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ HTTP-only   │    │ API Proxy   │    │ JWT Auth    │
│ Cookies     │    │ /api/*      │    │ Middleware  │
│             │    │ → localhost │    │ RLS Check   │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 🛠️ API Reference

### 🔓 Public Endpoints
```http
GET  /                    # Health check
GET  /health             # Server status
GET  /test-db            # Database connection test
GET  /users              # List all users (for testing)
```

### 🔐 Authentication Endpoints
```http
POST /signup             # User registration
POST /login              # User login
POST /refresh            # Token refresh
POST /logout             # User logout
```

### 🛡️ Protected Endpoints
```http
GET  /todos              # Get user's todos (RLS protected)
POST /todos              # Create new todo (RLS protected)
```

### 📝 Request/Response Examples

#### User Registration
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "username": "johndoe"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "user@example.com",
    "username": "johndoe"
  }
}
```

#### User Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": "15m"
}
```

#### Get Todos (Protected)
```bash
curl -X GET http://localhost:3000/todos \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**Response:**
```json
{
  "message": "Todos fetched successfully",
  "todos": [
    {
      "id": "todo-uuid",
      "title": "Buy groceries",
      "completed": false,
      "created_at": "2024-01-01T12:00:00.000Z"
    }
  ],
  "total": 1
}
```

## 🐛 Troubleshooting

### 🔍 Common Issues & Solutions

#### 1. Database Connection Issues
```
❌ Error: "Supabase connection failed"
✅ Solution: Check SUPABASE_URL and SUPABASE_ANON_KEY in .env
```

#### 2. JWT Token Issues
```
❌ Error: "Invalid or expired token"
✅ Solution: Check SUPABASE_JWT_SECRET matches Supabase project
```

#### 3. RLS Policy Issues
```
❌ Error: "new row violates row-level security policy"
✅ Solution: Ensure JWT has correct 'sub' and 'role' claims
```

#### 4. CORS Issues (Frontend)
```
❌ Error: "CORS policy blocked request"
✅ Solution: Backend automatically handles CORS for localhost
```

### 🧪 Testing Commands

#### Test Backend Health
```bash
curl http://localhost:3000/health
```

#### Test Database Connection
```bash
curl http://localhost:3000/test-db
```

#### Test Authentication Flow
```bash
# 1. Register user
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456","username":"testuser"}'

# 2. Login
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# 3. Use token for protected endpoint
curl -X GET http://localhost:3000/todos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 📊 Debug Information

#### Check JWT Token
```javascript
// In browser console
const token = document.cookie.split('access_token=')[1];
console.log(JSON.parse(atob(token.split('.')[1])));
```

#### Check Database Tables
```sql
-- In Supabase SQL Editor
SELECT * FROM auth_test;
SELECT * FROM public.todos;
```

## 🎯 Demo Credentials

```
Email: user@example.com
Password: 123456
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [JWT.io](https://jwt.io/) - JWT Token Debugger
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**🎉 Happy Coding! Your custom JWT auth system with Supabase RLS is ready to use!**
