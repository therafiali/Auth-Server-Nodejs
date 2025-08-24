// Standardized response utilities
const sendSuccess = (res, data = {}, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...data
  });
};

const sendError = (res, message = 'An error occurred', statusCode = 500, error = null) => {
  const response = {
    success: false,
    message
  };
  
  if (error && process.env.NODE_ENV !== 'production') {
    response.error = error.message || error;
  }
  
  res.status(statusCode).json(response);
};

const sendValidationError = (res, errors) => {
  res.status(400).json({
    success: false,
    message: 'Validation failed',
    errors
  });
};

const sendUnauthorized = (res, message = 'Unauthorized') => {
  res.status(401).json({
    success: false,
    message
  });
};

const sendNotFound = (res, message = 'Resource not found') => {
  res.status(404).json({
    success: false,
    message
  });
};

const sendConflict = (res, message = 'Resource already exists') => {
  res.status(409).json({
    success: false,
    message
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendNotFound,
  sendConflict
};
