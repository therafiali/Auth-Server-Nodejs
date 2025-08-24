const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testLogin() {
  console.log('🔐 Testing Login Endpoint...\n');

  try {
    // Test login
    console.log('1️⃣ Testing login with valid credentials...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'user@example.com',
      password: '123456'
    });

    console.log('✅ Login successful');
    console.log(`   Status: ${loginResponse.status}`);
    console.log(`   Success: ${loginResponse.data.success}`);
    console.log(`   Message: ${loginResponse.data.message}`);
    console.log(`   User ID: ${loginResponse.data.user?.id}`);
    console.log(`   Token: ${loginResponse.data.token ? loginResponse.data.token.substring(0, 20) + '...' : '❌ Missing'}`);
    console.log(`   Expires In: ${loginResponse.data.expiresIn}`);
    console.log();

    // Test with invalid credentials
    console.log('2️⃣ Testing login with invalid credentials...');
    try {
      await axios.post(`${BASE_URL}/login`, {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      });
      console.log('❌ This should have failed!');
    } catch (error) {
      console.log('✅ Correctly failed with invalid credentials:');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n💡 Make sure the server is running: npm run dev');
  }
}

// Run the test
testLogin();
