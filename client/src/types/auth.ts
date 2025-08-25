export interface SignupFormData {
  email: string;
  password: string;
  username: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  username?: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface User {
  id: string;
  email: string;
  username: string;
  created_at: string;
}

