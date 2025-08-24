const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testRefreshTokenDetailed() {
  console.log('🔄 Testing Refresh Token (Detailed Analysis)...\n');

  try {
    // Step 1: Login and capture cookies
    console.log('1️⃣ Logging in and capturing cookies...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'user@example.com',
      password: '123456'
    }, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400;
      }
    });

    console.log('✅ Login successful');
    console.log(`   User ID: ${loginResponse.data.user.id}`);
    
    // Extract cookies from response headers
    const cookies = loginResponse.headers['set-cookie'];
    console.log(`   Cookies received: ${cookies ? cookies.length : 0}`);
    console.log();

    // Step 2: Test refresh with extracted cookies
    console.log('2️⃣ Testing refresh with cookies...');
    try {
      const refreshResponse = await axios.post(`${BASE_URL}/refresh`, {}, {
        headers: {
          'Cookie': cookies ? cookies.join('; ') : ''
        }
      });
      
      console.log('✅ Refresh successful');
      console.log(`   Expires In: ${refreshResponse.data.expiresIn}`);
      console.log();

      // Step 3: Detailed token comparison
      console.log('3️⃣ Detailed token analysis...');
      const originalToken = loginResponse.data.token;
      const newToken = refreshResponse.data.token;
      
      console.log(`   Original Token Length: ${originalToken.length}`);
      console.log(`   New Token Length: ${newToken.length}`);
      console.log(`   Tokens are identical: ${originalToken === newToken}`);
      
      // Show first and last 20 characters of each token
      console.log(`   Original Token Start: ${originalToken.substring(0, 20)}...`);
      console.log(`   New Token Start: ${newToken.substring(0, 20)}...`);
      console.log(`   Original Token End: ...${originalToken.substring(originalToken.length - 20)}`);
      console.log(`   New Token End: ...${newToken.substring(newToken.length - 20)}`);
      
      // Check if tokens are actually different
      if (originalToken !== newToken) {
        console.log('✅ Tokens are different (refresh worked correctly)');
      } else {
        console.log('❌ Tokens are identical (refresh may not be working)');
      }
      console.log();

      // Step 4: Test both tokens work
      console.log('4️⃣ Testing both tokens work...');
      
      // Test original token
      try {
        const originalTodosResponse = await axios.get(`${BASE_URL}/todos`, {
          headers: {
            'Authorization': `Bearer ${originalToken}`
          }
        });
        console.log('✅ Original token still works');
      } catch (error) {
        console.log('❌ Original token failed:', error.response?.status);
      }
      
      // Test new token
      try {
        const newTodosResponse = await axios.get(`${BASE_URL}/todos`, {
          headers: {
            'Authorization': `Bearer ${newToken}`
          }
        });
        console.log('✅ New token works');
      } catch (error) {
        console.log('❌ New token failed:', error.response?.status);
      }

    } catch (refreshError) {
      console.log('❌ Refresh failed:');
      console.log(`   Status: ${refreshError.response?.status}`);
      console.log(`   Message: ${refreshError.response?.data?.message}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testRefreshTokenDetailed();
