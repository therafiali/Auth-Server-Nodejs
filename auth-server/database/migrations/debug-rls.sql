-- Debug RLS policies to understand the issue
-- Run this to see what's happening with auth.uid()

-- Check the current user context
SELECT 
    current_user,
    session_user,
    current_setting('request.jwt.claims', true) as jwt_claims;

-- Check what auth.uid() returns
SELECT auth.uid() as auth_uid;

-- Check the data types
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'todos' AND column_name = 'user_id';

-- Check what todos exist
SELECT 
    id,
    user_id,
    title,
    completed
FROM todos
ORDER BY created_at DESC
LIMIT 5;
