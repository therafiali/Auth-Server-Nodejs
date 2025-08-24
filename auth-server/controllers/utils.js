const { sendSuccess, sendError } = require('./utils/response');
const { getAllUsers, testConnection } = require('./utils/database');

// Home controller
const home = (req, res) => {
  sendSuccess(res, {}, 'Hello World!');
};

// Health check controller
const health = (req, res) => {
  sendSuccess(res, {
    timestamp: new Date().toISOString()
  }, 'OK');
};

// Test database connection controller
const testDb = async (req, res) => {
  try {
    const data = await testConnection();
    
    sendSuccess(res, {
      status: 'connected',
      table: 'auth_test',
      data
    }, 'Supabase connection successful!');
    
  } catch (error) {
    sendError(res, 'Database connection failed', 500, error);
  }
};

// Get users controller
const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    
    sendSuccess(res, {
      count: users.length,
      users
    }, 'Users fetched successfully');
    
  } catch (error) {
    sendError(res, 'Failed to fetch users', 500, error);
  }
};

module.exports = {
  home,
  health,
  testDb,
  getUsers
};
