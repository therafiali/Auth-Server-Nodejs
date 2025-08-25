require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { APP_CONFIG, ERROR_MESSAGES } = require('./config/constants');

const app = express();
const cors = require('cors');

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (process.env.NODE_ENV === 'production') {
      // In production, only allow specific origin
      const allowedOrigins = [process.env.FRONTEND_URL];
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // In development, allow all localhost origins
      if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Cache-Control', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Environment validation
const validateEnvironment = () => {
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_JWT_SECRET', 'JWT_SECRET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('❌', ERROR_MESSAGES.MISSING_ENV_VARS + ':', missing.join(', '));
    process.exit(1);
  }
};

// Validate environment on startup
validateEnvironment();

// Middleware
app.use(express.json({ limit: APP_CONFIG.JSON_LIMIT }));
app.use(cookieParser());

// Additional CORS headers middleware
app.use((req, res, next) => {
  // Set CORS headers for all responses
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie, Cache-Control');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  
  next();
});
// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`🌐 Origin: ${req.headers.origin || 'No origin'}`);
  console.log(`🍪 Cookies: ${req.headers.cookie ? 'Present' : 'Missing'}`);
  console.log(`🔑 Auth: ${req.headers.authorization ? 'Present' : 'Missing'}`);
  next();
});

// Routes
app.use('/', routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(APP_CONFIG.PORT, () => {
  console.log(`🚀 Server running on http://localhost:${APP_CONFIG.PORT}`);
  console.log(`🏥 Health check: http://localhost:${APP_CONFIG.PORT}/health`);
  console.log(`🌍 Environment: ${APP_CONFIG.NODE_ENV}`);
});
