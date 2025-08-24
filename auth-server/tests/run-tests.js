const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running Auth Server Tests...\n');

const tests = [
  { name: 'JWT Token Test', file: 'test-jwt.js' },
  { name: 'Login Test', file: 'test-login.js' },
  { name: 'Refresh Token Test', file: 'test-refresh.js' },
  { name: 'Simple Refresh Test', file: 'test-refresh-simple.js' },
  { name: 'Detailed Refresh Test', file: 'test-refresh-detailed.js' },
  { name: 'Manual Refresh Test', file: 'test-refresh-manual.js' },
  { name: 'RLS Test', file: 'test-rls.js' }
];

const runTest = (testFile) => {
  try {
    console.log(`\n📋 Running: ${testFile}`);
    console.log('─'.repeat(50));
    execSync(`node ${testFile}`, { 
      stdio: 'inherit',
      cwd: __dirname 
    });
    console.log('✅ Test completed successfully\n');
  } catch (error) {
    console.log('❌ Test failed\n');
  }
};

// Run all tests
tests.forEach(test => {
  runTest(test.file);
});

console.log('🎉 All tests completed!');
