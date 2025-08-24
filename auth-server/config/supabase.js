const { createClient } = require('@supabase/supabase-js');
const { DB_CONFIG, ERROR_MESSAGES } = require('./constants');

// Environment validation
const validateEnvironment = () => {
  const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_JWT_SECRET', 'JWT_SECRET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    throw new Error(`${ERROR_MESSAGES.MISSING_ENV_VARS}: ${missing.join(', ')}`);
  }
};

// Initialize Supabase client
let supabase = null;

try {
  validateEnvironment();
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Supabase initialization failed:', error.message);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

// Database operations wrapper
const db = {
  supabase,
  
  // Check if Supabase is available
  isAvailable() {
    return supabase !== null;
  },
  
  // Get Supabase client
  getClient() {
    if (!this.isAvailable()) {
      throw new Error(ERROR_MESSAGES.SUPABASE_NOT_CONFIGURED);
    }
    return supabase;
  },
  
  // Test database connection
  async testConnection() {
    const client = this.getClient();
    const { data, error } = await client
      .from(DB_CONFIG.TABLE_NAMES.USERS)
      .select('*')
      .limit(1);
    
    if (error) throw error;
    return data;
  }
};

module.exports = db;
