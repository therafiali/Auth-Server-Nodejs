const { createClient } = require('@supabase/supabase-js');
const { sendSuccess, sendError, sendUnauthorized, sendValidationError } = require('./utils/response');
const { extractToken } = require('./utils/auth');
const { validateTodoData } = require('./utils/validation');
const { DB_CONFIG } = require('../config/constants');

// Create Supabase client with JWT token
const createAuthenticatedClient = (token) => {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    }
  );
};

// Get user's todos (this will be protected by RLS)
const getTodos = async (req, res) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return sendUnauthorized(res, 'Access token required');
    }
    
    const supabase = createAuthenticatedClient(token);
    
    const { data: todos, error } = await supabase
      .from(DB_CONFIG.TABLE_NAMES.TODOS)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    sendSuccess(res, {
      todos,
      user_id: req.user.id,
      total: todos.length
    }, 'Todos fetched successfully');
    
  } catch (error) {
    console.error('Get todos error:', error);
    sendError(res, 'Failed to fetch todos', 500, error);
  }
};

// Create new todo (this will be protected by RLS)
const createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    
    // Validate input
    const validationErrors = validateTodoData({ title });
    if (validationErrors.length > 0) {
      return sendValidationError(res, validationErrors);
    }
    
    const token = extractToken(req);
    
    if (!token) {
      return sendUnauthorized(res, 'Access token required');
    }
    
    const supabase = createAuthenticatedClient(token);
    
    const { data: todo, error } = await supabase
      .from(DB_CONFIG.TABLE_NAMES.TODOS)
      .insert([{
        user_id: req.user.id,  // This will be UUID format, checked by RLS
        title: title.trim()
      }])
      .select()
      .single();
    
    if (error) throw error;
    
    sendSuccess(res, {
      todo
    }, 'Todo created successfully', 201);
    
  } catch (error) {
    console.error('Create todo error:', error);
    sendError(res, 'Failed to create todo', 500, error);
  }
};

module.exports = {
  getTodos,
  createTodo
};
