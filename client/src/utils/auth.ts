// Authentication utilities

// Check if user is authenticated by making a request to a protected endpoint
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3000/todos', {
      method: 'GET',
      credentials: 'include', // Include cookies
      headers: {
        'Cache-Control': 'no-cache', // Prevent caching
        'Content-Type': 'application/json',
      },
    });
    
    console.log('🔍 Auth check response status:', response.status);
    
    if (response.status === 401) {
      console.log('🔍 Auth check: Unauthorized (401)');
      return false;
    }
    
    if (response.ok) {
      console.log('🔍 Auth check: Success');
      return true;
    }
    
    console.log('🔍 Auth check: Failed with status:', response.status);
    return false;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
};

// Redirect to todos page if authenticated
export const redirectIfAuthenticated = async () => {
  try {
    const isAuthenticated = await checkAuthStatus();
    if (isAuthenticated) {
      window.location.href = '/todos';
    }
  } catch (error) {
    console.error('Redirect if authenticated error:', error);
  }
};

// Redirect to login page if not authenticated
export const redirectIfNotAuthenticated = async () => {
  try {
    const isAuthenticated = await checkAuthStatus();
    if (!isAuthenticated) {
      window.location.href = '/';
    }
  } catch (error) {
    console.error('Redirect if not authenticated error:', error);
    // If there's an error, redirect to login as a fallback
    window.location.href = '/';
  }
};

// Get current user info (if needed)
export const getCurrentUser = async () => {
  try {
    const response = await fetch('http://localhost:3000/users', {
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};
