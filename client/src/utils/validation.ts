import { SignupFormData, ValidationErrors } from '../types/auth';

// Validation constants
const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 6
  },
  USERNAME: {
    MIN_LENGTH: 3
  },
  EMAIL: {
    REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  if (!VALIDATION.EMAIL.REGEX.test(email)) {
    return 'Invalid email format';
  }
  return null;
};

// Password validation
export const validatePassword = (password: string, minLength = VALIDATION.PASSWORD.MIN_LENGTH): string | null => {
  if (!password || password.length < minLength) {
    return `Password must be at least ${minLength} character${minLength > 1 ? 's' : ''} long`;
  }
  return null;
};

// Username validation
export const validateUsername = (username: string, minLength = VALIDATION.USERNAME.MIN_LENGTH): string | null => {
  if (!username || username.trim().length < minLength) {
    return `Username must be at least ${minLength} character${minLength > 1 ? 's' : ''} long`;
  }
  return null;
};

// Signup form validation
export const validateSignupForm = (data: SignupFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password, VALIDATION.PASSWORD.MIN_LENGTH);
  if (passwordError) errors.password = passwordError;

  const usernameError = validateUsername(data.username, VALIDATION.USERNAME.MIN_LENGTH);
  if (usernameError) errors.username = usernameError;

  return errors;
};

// Login form validation
export const validateLoginForm = (data: { email: string; password: string }): ValidationErrors => {
  const errors: ValidationErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(data.password, 1);
  if (passwordError) errors.password = passwordError;

  return errors;
};

