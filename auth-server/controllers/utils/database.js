const db = require('../../config/supabase');
const { DB_CONFIG } = require('../../config/constants');

// Database operation wrapper with error handling
const executeQuery = async (operation) => {
  try {
    return await operation();
  } catch (error) {
    console.error('Database operation error:', error);
    throw error;
  }
};

// User operations
const findUserByEmail = async (email) => {
  return await executeQuery(async () => {
    const supabase = db.getClient();
    const { data, error } = await supabase
      .from(DB_CONFIG.TABLE_NAMES.USERS)
      .select('id, email, username, password')
      .eq('email', email.trim().toLowerCase())
      .single();
    
    if (error) throw error;
    return data;
  });
};

const findUserById = async (userId) => {
  return await executeQuery(async () => {
    const supabase = db.getClient();
    const { data, error } = await supabase
      .from(DB_CONFIG.TABLE_NAMES.USERS)
      .select('id, email, username, refresh_token, refresh_token_expires_at')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  });
};

const findUserByRefreshToken = async (userId, refreshToken) => {
  return await executeQuery(async () => {
    const supabase = db.getClient();
    const { data, error } = await supabase
      .from(DB_CONFIG.TABLE_NAMES.USERS)
      .select('id, email, username, refresh_token, refresh_token_expires_at')
      .eq('id', userId)
      .eq('refresh_token', refreshToken)
      .single();
    
    if (error) throw error;
    return data;
  });
};

const checkUserExists = async (email, username) => {
  return await executeQuery(async () => {
    const supabase = db.getClient();
    const { data, error } = await supabase
      .from(DB_CONFIG.TABLE_NAMES.USERS)
      .select('id, email, username')
      .or(`email.eq.${email},username.eq.${username}`)
      .limit(1);
    
    if (error) throw error;
    return data;
  });
};

const createUser = async (userData) => {
  return await executeQuery(async () => {
    const supabase = db.getClient();
    const { data, error } = await supabase
      .from(DB_CONFIG.TABLE_NAMES.USERS)
      .insert([userData])
      .select('id, email, username, created_at')
      .single();
    
    if (error) throw error;
    return data;
  });
};

const updateUserRefreshToken = async (userId, refreshToken, expiresAt) => {
  return await executeQuery(async () => {
    const supabase = db.getClient();
    const { error } = await supabase
      .from(DB_CONFIG.TABLE_NAMES.USERS)
      .update({
        refresh_token: refreshToken,
        refresh_token_expires_at: expiresAt
      })
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  });
};

const clearUserRefreshToken = async (userId) => {
  return await executeQuery(async () => {
    const supabase = db.getClient();
    const { error } = await supabase
      .from(DB_CONFIG.TABLE_NAMES.USERS)
      .update({
        refresh_token: null,
        refresh_token_expires_at: null
      })
      .eq('id', userId);
    
    if (error) throw error;
    return true;
  });
};

const clearUserRefreshTokenByToken = async (refreshToken) => {
  return await executeQuery(async () => {
    const supabase = db.getClient();
    const { error } = await supabase
      .from(DB_CONFIG.TABLE_NAMES.USERS)
      .update({
        refresh_token: null,
        refresh_token_expires_at: null
      })
      .eq('refresh_token', refreshToken);
    
    if (error) throw error;
    return true;
  });
};

const getAllUsers = async () => {
  return await executeQuery(async () => {
    const supabase = db.getClient();
    const { data, error } = await supabase
      .from(DB_CONFIG.TABLE_NAMES.USERS)
      .select('id, email, username, created_at')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  });
};

// Test database connection
const testConnection = async () => {
  return await executeQuery(async () => {
    return await db.testConnection();
  });
};

module.exports = {
  executeQuery,
  findUserByEmail,
  findUserById,
  findUserByRefreshToken,
  checkUserExists,
  createUser,
  updateUserRefreshToken,
  clearUserRefreshToken,
  clearUserRefreshTokenByToken,
  getAllUsers,
  testConnection
};
