const { validateSignupData } = require('./utils/validation');
const { sendSuccess, sendError, sendValidationError, sendConflict } = require('./utils/response');
const { hashPassword } = require('./utils/auth');
const { checkUserExists, createUser } = require('./utils/database');

// Signup controller
const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    // Validate input data
    const validationErrors = validateSignupData({ email, password, username });
    if (validationErrors.length > 0) {
      return sendValidationError(res, validationErrors);
    }
    
    // Check if user already exists
    const existingUsers = await checkUserExists(email, username);
    
    if (existingUsers && existingUsers.length > 0) {
      const existingEmail = existingUsers.find(user => user.email === email);
      const existingUsername = existingUsers.find(user => user.username === username);
      
      if (existingEmail) {
        return sendConflict(res, 'User with this email already exists');
      }
      
      if (existingUsername) {
        return sendConflict(res, 'Username is already taken');
      }
    }
    
    // Hash password
    const hashedPassword = await hashPassword(password);
    
    // Create new user
    const userData = {
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      username: username.trim(),
      created_at: new Date().toISOString()
    };
    
    const newUser = await createUser(userData);
    
    // Return success response
    sendSuccess(res, {
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        created_at: newUser.created_at
      }
    }, 'User created successfully', 201);
    
  } catch (error) {
    console.error('Signup error:', error);
    sendError(res, 'Failed to create user', 500, error);
  }
};

module.exports = {
  signup
};
