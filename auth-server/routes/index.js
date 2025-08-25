const express = require('express');
const router = express.Router();
const utilsController = require('../controllers/utils');
const signupController = require('../controllers/signup');
const loginController = require('../controllers/login');
const refreshController = require('../controllers/refresh');
const todosController = require('../controllers/todos');
const { verifyToken } = require('../middleware/auth');

// Routes
router.get('/', utilsController.home);
router.get('/health', utilsController.health);
router.get('/test-db', utilsController.testDb);
router.get('/users', utilsController.getUsers);

// Test CORS endpoint
router.get('/test-cors', (req, res) => {
  res.json({
    success: true,
    message: 'CORS test successful',
    origin: req.headers.origin,
    cookies: req.headers.cookie ? 'Present' : 'Missing'
  });
});

// Auth routes
router.post('/signup', signupController.signup);
router.post('/login', loginController.login);
router.post('/refresh', refreshController.refreshToken);
router.post('/logout', refreshController.logout);

// Get user's JWT token for Supabase authentication
router.get('/auth/token', verifyToken, (req, res) => {
  res.json({
    success: true,
    token: req.user.accessToken
  });
});

// Protected routes (require JWT)
router.get('/todos', verifyToken, todosController.getTodos);
router.post('/todos', verifyToken, todosController.createTodo);

module.exports = router;
