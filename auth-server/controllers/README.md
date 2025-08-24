# Controllers Directory

This directory contains all the API controllers organized in a modular, production-ready structure.

## Structure

```
controllers/
├── utils/                    # Shared utility modules
│   ├── validation.js        # Input validation functions
│   ├── response.js          # Standardized API responses
│   ├── auth.js              # Authentication utilities
│   └── database.js          # Database operation wrappers
├── login.js                 # User login controller
├── signup.js                # User registration controller
├── refresh.js               # Token refresh and logout
├── todos.js                 # Todo CRUD operations
├── utils.js                 # General utility endpoints
└── README.md               # This file
```

## Utility Modules

### `utils/validation.js`
Contains reusable validation functions for:
- Email validation
- Password validation (with configurable minimum length)
- Username validation
- Title validation
- Specific validation helpers for login, signup, and todo operations

### `utils/response.js`
Standardized API response functions:
- `sendSuccess()` - Success responses with consistent format
- `sendError()` - Error responses with optional error details
- `sendValidationError()` - Validation error responses
- `sendUnauthorized()` - 401 unauthorized responses
- `sendNotFound()` - 404 not found responses
- `sendConflict()` - 409 conflict responses

### `utils/auth.js`
Authentication-related utilities:
- JWT token generation and verification
- Password hashing and comparison
- Cookie management for tokens
- Token extraction from requests

### `utils/database.js`
Database operation wrappers with error handling:
- User CRUD operations
- Token management
- Connection testing
- Consistent error handling

## Controllers

### `login.js`
Handles user authentication:
- Validates login credentials
- Verifies password
- Generates access and refresh tokens
- Sets secure HTTP-only cookies

### `signup.js`
Handles user registration:
- Validates registration data
- Checks for existing users
- Hashes passwords securely
- Creates new user accounts

### `refresh.js`
Manages token refresh and logout:
- Refreshes expired access tokens
- Validates refresh tokens
- Handles user logout
- Clears authentication cookies

### `todos.js`
Todo management operations:
- Get user's todos (protected by RLS)
- Create new todos
- Uses authenticated Supabase client

### `utils.js`
General utility endpoints:
- Health check
- Database connection test
- User listing (for admin purposes)
- Simple home endpoint

## Benefits of This Structure

1. **DRY Principle**: No repeated code across controllers
2. **Consistency**: Standardized responses and error handling
3. **Maintainability**: Easy to modify shared functionality
4. **Readability**: Clear separation of concerns
5. **Testability**: Modular functions are easier to test
6. **Production Ready**: Proper error handling and logging

## Usage Example

```javascript
// In a controller
const { validateLoginData } = require('./utils/validation');
const { sendSuccess, sendError } = require('./utils/response');
const { findUserByEmail } = require('./utils/database');

const login = async (req, res) => {
  try {
    // Validate input
    const errors = validateLoginData(req.body);
    if (errors.length > 0) {
      return sendValidationError(res, errors);
    }
    
    // Process login
    const user = await findUserByEmail(req.body.email);
    
    // Send response
    sendSuccess(res, { user }, 'Login successful');
    
  } catch (error) {
    sendError(res, 'Login failed', 500, error);
  }
};
```

## For New Developers

1. **Start with utils/**: Understand the shared utilities first
2. **Follow the pattern**: Use the utility functions in your controllers
3. **Keep it simple**: Each controller should focus on one responsibility
4. **Use consistent responses**: Always use the response utilities
5. **Handle errors properly**: Use try-catch and the error utilities
