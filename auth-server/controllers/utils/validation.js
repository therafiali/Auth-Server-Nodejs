const { VALIDATION } = require('../../config/constants');

// Shared validation utilities
const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  if (!VALIDATION.EMAIL.REGEX.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

const validatePassword = (password, minLength = VALIDATION.PASSWORD.MIN_LENGTH) => {
  if (!password || password.length < minLength) {
    return `Password must be at least ${minLength} character${minLength > 1 ? 's' : ''} long`;
  }
  return null;
};

const validateUsername = (username, minLength = VALIDATION.USERNAME.MIN_LENGTH) => {
  if (!username || username.trim().length < minLength) {
    return `Username must be at least ${minLength} character${minLength > 1 ? 's' : ''} long`;
  }
  return null;
};

const validateTitle = (title) => {
  if (!title || !title.trim()) {
    return 'Title is required';
  }
  return null;
};

// Validation helpers for specific use cases
const validateLoginData = (data) => {
  const errors = [];
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);
  
  const passwordError = validatePassword(data.password, 1);
  if (passwordError) errors.push(passwordError);
  
  return errors;
};

const validateSignupData = (data) => {
  const errors = [];
  
  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);
  
  const passwordError = validatePassword(data.password, VALIDATION.PASSWORD.MIN_LENGTH);
  if (passwordError) errors.push(passwordError);
  
  const usernameError = validateUsername(data.username, VALIDATION.USERNAME.MIN_LENGTH);
  if (usernameError) errors.push(usernameError);
  
  return errors;
};

const validateTodoData = (data) => {
  const errors = [];
  
  const titleError = validateTitle(data.title);
  if (titleError) errors.push(titleError);
  
  return errors;
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUsername,
  validateTitle,
  validateLoginData,
  validateSignupData,
  validateTodoData
};
