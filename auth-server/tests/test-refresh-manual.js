const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testRefreshTokenManual() {
  console.log('🔄 Testing Refresh Token (Manual Cookie Extraction)...\n');

  try {
    // Step 1: Login and capture cookies
    console.log('1️⃣ Logging in and capturing cookies...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'user@example.com',
      password: '123456'
    }, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept 2xx and 3xx
      }
    });

    console.log('✅ Login successful');
    console.log(`   Access Token: ${loginResponse.data.token.substring(0, 20)}...`);
    console.log(`   User ID: ${loginResponse.data.user.id}`);
    
    // Extract cookies from response headers
    const cookies = loginResponse.headers['set-cookie'];
    if (cookies) {
      console.log('   Cookies received:', cookies.length);
      cookies.forEach((cookie, index) => {
        console.log(`   Cookie ${index + 1}: ${cookie.split(';')[0]}`);
      });
    } else {
      console.log('   No cookies received');
    }
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
      console.log(`   New Token: ${refreshResponse.data.token.substring(0, 20)}...`);
      console.log(`   Expires In: ${refreshResponse.data.expiresIn}`);
      console.log();

      // Step 3: Verify tokens are different
      console.log('3️⃣ Verifying token refresh...');
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

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure the server is running: node app.js');
  }
}

// Run the test
testRefreshTokenManual();
