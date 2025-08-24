const { sendError } = require('../controllers/utils/response');

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Global error handler:', err);
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return sendError(res, 'Validation failed', 400, err);
  }
  
  if (err.name === 'UnauthorizedError') {
    return sendError(res, 'Unauthorized access', 401, err);
  }
  
  if (err.code === 'PGRST116') {
    return sendError(res, 'Resource not found', 404, err);
  }
  
  // Default error response
  sendError(res, 'Internal server error', 500, err);
};

module.exports = errorHandler;
