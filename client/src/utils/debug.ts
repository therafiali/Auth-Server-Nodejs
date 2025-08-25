// Debug utilities for authentication troubleshooting

export const debugAuth = async () => {
  console.log('🔍 Debugging authentication...');
  
  try {
    // Check if cookies exist
    const cookies = document.cookie;
    console.log('🍪 Cookies:', cookies);
    
    // Try to fetch todos to check auth
    const response = await fetch('http://localhost:3000/todos', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', response.headers);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Authentication successful:', data);
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Authentication failed:', response.status, errorData);
      return false;
    }
  } catch (error) {
    console.error('🚨 Debug error:', error);
    return false;
  }
};

export const debugLogin = async (credentials: { email: string; password: string }) => {
  console.log('🔍 Debugging login...');
  
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
    
    console.log('📡 Login response status:', response.status);
    console.log('📡 Login response headers:', response.headers);
    
    const data = await response.json();
    console.log('📡 Login response data:', data);
    
    // Check cookies after login
    setTimeout(() => {
      console.log('🍪 Cookies after login:', document.cookie);
    }, 1000);
    
    return { success: response.ok, data };
  } catch (error) {
    console.error('🚨 Login debug error:', error);
    return { success: false, error };
  }
};
