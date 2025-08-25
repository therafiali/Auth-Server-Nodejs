import { SignupFormData, ApiResponse } from '../types/auth';

// API configuration
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  ENDPOINTS: {
    SIGNUP: '/signup',
    LOGIN: '/login',
    REFRESH: '/refresh',
    LOGOUT: '/logout'
  }
};

// Generic API request function
const apiRequest = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse> => {
  try {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    console.log('🌐 Making API request to:', url);
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Always include credentials for cookies
    };

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        'Cookie': document.cookie
      }
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', response.headers);

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        data: data.data || data,
        message: data.message
      };
    } else {
      return {
        success: false,
        message: data.message || 'Request failed',
        data: data
      };
    }
  } catch (error) {
    console.error('🚨 API request error:', error);
    return {
      success: false,
      message: 'Network error. Please check if the server is running.'
    };
  }
};

// Signup user
export const signupUser = async (userData: SignupFormData): Promise<ApiResponse> => {
  return await apiRequest(API_CONFIG.ENDPOINTS.SIGNUP, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

// Login user
export const loginUser = async (credentials: { email: string; password: string }): Promise<ApiResponse> => {
  console.log('🔐 Attempting login with credentials:', { email: credentials.email });
  
  const result = await apiRequest(API_CONFIG.ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  console.log('🔐 Login result:', result);
  
  // Check cookies after login
  setTimeout(() => {
    console.log('🍪 Cookies after login attempt:', document.cookie);
  }, 500);
  
  return result;
};

// Refresh token
export const refreshToken = async (refreshToken: string): Promise<ApiResponse> => {
  return await apiRequest(API_CONFIG.ENDPOINTS.REFRESH, {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
};

// Logout user
export const logoutUser = async (): Promise<ApiResponse> => {
  return await apiRequest(API_CONFIG.ENDPOINTS.LOGOUT, {
    method: 'POST',
  });
};

