const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { TOKENS, COOKIES, VALIDATION } = require('../../config/constants');

// JWT token utilities
const generateAccessToken = (user) => {
  const payload = {
    sub: user.id,
    role: "authenticated",
    email: user.email,
    username: user.username,
    type: TOKENS.ACCESS.TYPE,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + TOKENS.ACCESS.EXPIRY
  };
  
  return jwt.sign(payload, process.env.SUPABASE_JWT_SECRET, {
    algorithm: 'HS256'
  });
};

const generateRefreshToken = (userId) => {
  const payload = {
    userId,
    type: TOKENS.REFRESH.TYPE,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + TOKENS.REFRESH.EXPIRY
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-jwt-secret-key', {
    algorithm: 'HS256'
  });
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret-key');
  } catch (error) {
    return null;
  }
};

// Password utilities
const hashPassword = async (password) => {
  return await bcrypt.hash(password, VALIDATION.PASSWORD.SALT_ROUNDS);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Cookie utilities
const setAuthCookies = (res, accessToken, refreshToken) => {
  // Set access token cookie (short-lived)
  res.cookie(COOKIES.ACCESS_TOKEN, accessToken, {
    ...COOKIES.OPTIONS,
    maxAge: TOKENS.ACCESS.EXPIRY * 1000
  });
  
  // Set refresh token cookie (long-lived)
  res.cookie(COOKIES.REFRESH_TOKEN, refreshToken, {
    ...COOKIES.OPTIONS,
    maxAge: TOKENS.REFRESH.EXPIRY * 1000
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie(COOKIES.ACCESS_TOKEN, { path: '/' });
  res.clearCookie(COOKIES.REFRESH_TOKEN, { path: '/' });
};

// Token extraction utilities
const extractToken = (req) => {
  return req.headers.authorization?.split(' ')[1] || req.cookies[COOKIES.ACCESS_TOKEN];
};

const extractRefreshToken = (req) => {
  return req.cookies[COOKIES.REFRESH_TOKEN];
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashPassword,
  comparePassword,
  setAuthCookies,
  clearAuthCookies,
  extractToken,
  extractRefreshToken
};
