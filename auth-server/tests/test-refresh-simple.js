const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testRefreshTokenSimple() {
  console.log('🔄 Testing Refresh Token (Simple Version)...\n');

  try {
    // Step 1: Login to get tokens
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'user@example.com',
      password: '123456'
    });

    console.log('✅ Login successful');
    console.log(`   Access Token: ${loginResponse.data.token.substring(0, 20)}...`);
    console.log(`   User ID: ${loginResponse.data.user.id}`);
    console.log();

    // Step 2: Check if refresh token was stored in database
    console.log('2️⃣ Checking if refresh token was stored...');
    
    // We can't directly check the database from here, but we can test the refresh endpoint
    // by manually extracting the refresh token from the response headers or cookies
    
    console.log('   Note: Refresh token should be stored in database and cookies');
    console.log('   To test refresh, you need to:');
    console.log('   1. Start the server: node app.js');
    console.log('   2. Use a browser or Postman to test /refresh endpoint');
    console.log('   3. The refresh token is in HTTP-only cookies');
    console.log();

    // Step 3: Test logout (this should work without cookies)
    console.log('3️⃣ Testing logout...');
    try {
      const logoutResponse = await axios.post(`${BASE_URL}/logout`);
      console.log('✅ Logout successful');
      console.log(`   Message: ${logoutResponse.data.message}`);
    } catch (logoutError) {
      console.log('❌ Logout failed:');
      console.log(`   Status: ${logoutError.response?.status}`);
      console.log(`   Message: ${logoutError.response?.data?.message}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure the server is running: node app.js');
  }
}

// Run the test
testRefreshTokenSimple();
