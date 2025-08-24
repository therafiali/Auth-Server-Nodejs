# Auth Server Tests

This directory contains test files for the authentication server functionality.

## Test Files

- `test-refresh.js` - Comprehensive refresh token functionality test
- `test-refresh-simple.js` - Simple refresh token test
- `test-refresh-detailed.js` - Detailed refresh token test with error scenarios
- `test-refresh-manual.js` - Manual refresh token test
- `test-rls.js` - Row Level Security (RLS) test
- `run-tests.js` - Test runner to execute all tests

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Tests
```bash
npm run test:refresh
npm run test:rls
```

### Run Individual Test Files
```bash
node tests/test-refresh.js
node tests/test-rls.js
```

## Prerequisites

1. Make sure the server is running (`npm run dev`)
2. Ensure you have a test user in the database
3. Set up your environment variables in `.env`

## Test User

The tests use a default test user:
- Email: `user@example.com`
- Password: `123456`

Make sure this user exists in your database before running tests.
