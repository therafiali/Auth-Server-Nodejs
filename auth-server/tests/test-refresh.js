const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testRefreshToken() {
  console.log('🔄 Testing Refresh Token Functionality...\n');

  // Create axios instance that handles cookies
  const client = axios.create({
    baseURL: BASE_URL,
    withCredentials: true // This is crucial for cookies!
  });

  try {
    // Step 1: Login to get both access and refresh tokens
    console.log('1️⃣ Logging in to get tokens...');
    const loginResponse = await client.post('/login', {
      email: 'user@example.com',
      password: '123456'
    });

    console.log('✅ Login successful');
    console.log(`   Access Token: ${loginResponse.data.token.substring(0, 20)}...`);
    console.log(`   User ID: ${loginResponse.data.user.id}`);
    console.log();

    // Step 2: Test access with original token
    console.log('2️⃣ Testing access with original token...');
    const originalTodosResponse = await client.get('/todos', {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.token}`
      }
    });

    console.log('✅ Original token works');
    console.log(`   Total todos: ${originalTodosResponse.data.total}`);
    console.log();

    // Step 3: Test refresh token endpoint (now with cookies!)
    console.log('3️⃣ Testing refresh token endpoint...');
    try {
      const refreshResponse = await client.post('/refresh');
      console.log('✅ Refresh successful');
      console.log(`   New Token: ${refreshResponse.data.token.substring(0, 20)}...`);
      console.log(`   Expires In: ${refreshResponse.data.expiresIn}`);
      console.log();

      // Step 4: Test access with new token
      console.log('4️⃣ Testing access with refreshed token...');
      const newTodosResponse = await client.get('/todos', {
        headers: {
          'Authorization': `Bearer ${refreshResponse.data.token}`
        }
      });

      console.log('✅ Refreshed token works');
      console.log(`   Total todos: ${newTodosResponse.data.total}`);
      console.log();

      // Step 5: Verify tokens are different
      console.log('5️⃣ Verifying token refresh...');
      if (loginResponse.data.token !== refreshResponse.data.token) {
        console.log('✅ Tokens are different (refresh worked)');
      } else {
        console.log('❌ Tokens are the same (refresh may not have worked)');
      }

    } catch (refreshError) {
      console.log('❌ Refresh failed:');
      console.log(`   Status: ${refreshError.response?.status}`);
      console.log(`   Message: ${refreshError.response?.data?.message}`);
      console.log();
    }

    // Step 6: Test logout
    console.log('6️⃣ Testing logout...');
    try {
      const logoutResponse = await client.post('/logout');
      console.log('✅ Logout successful');
      console.log(`   Message: ${logoutResponse.data.message}`);
    } catch (logoutError) {
      console.log('❌ Logout failed:');
      console.log(`   Status: ${logoutError.response?.status}`);
      console.log(`   Message: ${logoutError.response?.data?.message}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testRefreshToken();
