const { sendSuccess, sendError, sendUnauthorized } = require('./utils/response');
const { 
  generateAccessToken, 
  generateRefreshToken,
  verifyRefreshToken, 
  extractRefreshToken,
  setAuthCookies
} = require('./utils/auth');
const { findUserByRefreshToken, clearUserRefreshToken, clearUserRefreshTokenByToken, updateUserRefreshToken } = require('./utils/database');
const { TOKENS, COOKIES } = require('../config/constants');

// Refresh token controller
const refreshToken = async (req, res) => {
  try {
    const refreshToken = extractRefreshToken(req);
    
    if (!refreshToken) {
      return sendUnauthorized(res, 'Refresh token is required');
    }
    
    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return sendUnauthorized(res, 'Invalid refresh token');
    }
    
    // Check if token type is refresh
    if (decoded.type !== TOKENS.REFRESH.TYPE) {
      return sendUnauthorized(res, 'Invalid token type');
    }
    
    // Check if refresh token exists in user's record
    let user;
    try {
      user = await findUserByRefreshToken(decoded.userId, refreshToken);
    } catch (error) {
      return sendUnauthorized(res, 'Refresh token not found or invalid');
    }
    
    if (!user) {
      return sendUnauthorized(res, 'Refresh token not found or invalid');
    }
    
    // Check if token is expired
    if (new Date() > new Date(user.refresh_token_expires_at)) {
      // Clear expired token from user's record
      await clearUserRefreshToken(decoded.userId);
      return sendUnauthorized(res, 'Refresh token expired');
    }
    
    // Generate new access token
    const newAccessToken = generateAccessToken(user);
    
    // Generate new refresh token (TOKEN ROTATION)
    const newRefreshToken = generateRefreshToken(user.id);
    
    // Calculate new expiry for refresh token
    const expiresAt = new Date(
      Date.now() + TOKENS.REFRESH.EXPIRY * 1000
    ).toISOString();
    
    // Update user's refresh token in database (invalidate old, store new)
    await updateUserRefreshToken(user.id, newRefreshToken, expiresAt);
    
    // Set new tokens in cookies
    setAuthCookies(res, newAccessToken, newRefreshToken);
    
    // Return new access token
    sendSuccess(res, {
      token: newAccessToken,
      expiresIn: '15m'
    }, 'Token refreshed successfully');
    
  } catch (error) {
    console.error('Refresh token error:', error);
    sendError(res, 'Failed to refresh token', 500, error);
  }
};

// Logout controller (revoke refresh token)
const logout = async (req, res) => {
  try {
    const refreshToken = extractRefreshToken(req);
    
    if (refreshToken) {
      // Clear refresh token from user's record
      await clearUserRefreshTokenByToken(refreshToken);
    }
    
    // Clear cookies
    res.clearCookie(COOKIES.ACCESS_TOKEN, { path: '/' });
    res.clearCookie(COOKIES.REFRESH_TOKEN, { path: '/' });
    
    sendSuccess(res, {}, 'Logged out successfully');
    
  } catch (error) {
    console.error('Logout error:', error);
    sendError(res, 'Failed to logout', 500, error);
  }
};

module.exports = {
  refreshToken,
  logout
};
