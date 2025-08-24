require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { APP_CONFIG, ERROR_MESSAGES } = require('./config/constants');

const app = express();

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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
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
