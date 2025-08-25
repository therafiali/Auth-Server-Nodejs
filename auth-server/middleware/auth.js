const jwt = require('jsonwebtoken');
const { extractToken } = require('../controllers/utils/auth');

const verifyToken = (req, res, next) => {
  const token = extractToken(req);
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Access token required' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET || 'fallback-supabase-jwt-secret');
    
    // Verify it's an access token (not refresh)
    if (decoded.type === 'refresh') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token type' 
      });
    }
    
    // Add user info to request
    req.user = {
      id: decoded.sub,        // Use 'sub' from JWT (will be UUID format)
      email: decoded.email,
      username: decoded.username,
      role: decoded.role,
      accessToken: token      // Store the original token for Supabase authentication
    };
    
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

module.exports = { verifyToken };
