// Application constants
const APP_CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JSON_LIMIT: '10mb'
};

// Database constants
const DB_CONFIG = {
  TABLE_NAMES: {
    USERS: 'auth_test',
    TODOS: 'todos'
  }
};

// Validation constants
const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 6,
    SALT_ROUNDS: 10
  },
  USERNAME: {
    MIN_LENGTH: 3
  },
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

// Token constants
const TOKENS = {
  ACCESS: {
    EXPIRY: 15 * 60, // 15 minutes
    TYPE: 'access'
  },
  REFRESH: {
    EXPIRY: 7 * 24 * 60 * 60, // 7 days
    TYPE: 'refresh'
  }
};

// Cookie constants
const COOKIES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/',
    domain: process.env.NODE_ENV === 'production' ? undefined : undefined
  }
};

// HTTP Status codes
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

// Error messages
const ERROR_MESSAGES = {
  MISSING_ENV_VARS: 'Missing required environment variables',
  SUPABASE_NOT_CONFIGURED: 'Supabase not configured',
  INVALID_TOKEN: 'Invalid or expired token',
  UNAUTHORIZED: 'Unauthorized access',
  VALIDATION_FAILED: 'Validation failed',
  RESOURCE_NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error'
};

module.exports = {
  APP_CONFIG,
  DB_CONFIG,
  VALIDATION,
  TOKENS,
  COOKIES,
  STATUS_CODES,
  ERROR_MESSAGES
};
