const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testRLS() {
  console.log('🧪 Testing RLS with Unified JWT...\n');

  try {
    // Step 1: Login to get JWT
    console.log('1️⃣ Logging in...');
    const loginResponse = await axios.post(`${BASE_URL}/login`, {
      email: 'user@example.com',
      password: '123456'
    });

    const { token } = loginResponse.data;
    console.log('✅ Login successful, got JWT token');
    console.log(`   User ID: ${loginResponse.data.user.id}`);
    console.log();

    // Step 2: Test getting todos with JWT
    console.log('2️⃣ Testing GET /todos with JWT...');
    const todosResponse = await axios.get(`${BASE_URL}/todos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Todos fetched successfully:');
    console.log(`   User ID: ${todosResponse.data.user_id}`);
    console.log(`   Total todos: ${todosResponse.data.total}`);
    console.log(`   Todos:`, todosResponse.data.todos);
    console.log();

    // Step 3: Test creating a new todo
    console.log('3️⃣ Testing POST /todos with JWT...');
    const createResponse = await axios.post(`${BASE_URL}/todos`, {
      title: 'Test todo from script'
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Todo created successfully:');
    console.log(`   New todo:`, createResponse.data.todo);
    console.log();

    // Step 4: Test without JWT (should fail)
    console.log('4️⃣ Testing GET /todos without JWT (should fail)...');
    try {
      await axios.get(`${BASE_URL}/todos`);
      console.log('❌ This should have failed!');
    } catch (error) {
      console.log('✅ Correctly failed without JWT:');
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Message: ${error.response.data.message}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testRLS();
