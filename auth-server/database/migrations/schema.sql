-- Create simple auth_test table with UUID primary key
CREATE TABLE IF NOT EXISTS auth_test (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(100),
    refresh_token TEXT,
    refresh_token_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
