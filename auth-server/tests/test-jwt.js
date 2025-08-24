const jwt = require('jsonwebtoken');
require('dotenv').config();

console.log('🔐 Testing JWT Token Generation and Validation...\n');

// Test data
const testUser = {
  id: '550e8400-e29b-41d4-a716-446655440002',
  email: 'user@example.com',
  username: 'testuser'
};

console.log('1️⃣ Testing Access Token Generation...');
try {
  const accessToken = jwt.sign({
    sub: testUser.id,
    role: "authenticated",
    email: testUser.email,
    username: testUser.username,
    type: 'access',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (15 * 60) // 15 minutes
  }, process.env.SUPABASE_JWT_SECRET || 'fallback-supabase-jwt-secret', {
    algorithm: 'HS256'
  });
  
  console.log('✅ Access token generated successfully');
  console.log(`   Token: ${accessToken.substring(0, 20)}...`);
  
  // Test verification
  const decoded = jwt.verify(accessToken, process.env.SUPABASE_JWT_SECRET || 'fallback-supabase-jwt-secret');
  console.log('✅ Access token verified successfully');
  console.log(`   User ID: ${decoded.sub}`);
  console.log(`   Type: ${decoded.type}`);
  console.log();
  
} catch (error) {
  console.error('❌ Access token test failed:', error.message);
}

console.log('2️⃣ Testing Refresh Token Generation...');
try {
  const refreshToken = jwt.sign({
    userId: testUser.id,
    type: 'refresh',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  }, process.env.JWT_SECRET, {
    algorithm: 'HS256'
  });
  
  console.log('✅ Refresh token generated successfully');
  console.log(`   Token: ${refreshToken.substring(0, 20)}...`);
  
  // Test verification
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  console.log('✅ Refresh token verified successfully');
  console.log(`   User ID: ${decoded.userId}`);
  console.log(`   Type: ${decoded.type}`);
  console.log();
  
} catch (error) {
  console.error('❌ Refresh token test failed:', error.message);
}

console.log('3️⃣ Environment Variables Check...');
console.log(`   SUPABASE_JWT_SECRET: ${process.env.SUPABASE_JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`   SUPABASE_URL: ${process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`   SUPABASE_ANON_KEY: ${process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}`);

console.log('\n🎉 JWT Test completed!');
