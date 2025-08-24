-- Migration script to convert auth_test table from INTEGER to UUID
-- This ensures consistency between auth_test.id and todos.user_id

-- Step 1: Add UUID column to auth_test
ALTER TABLE auth_test ADD COLUMN uuid_id UUID DEFAULT gen_random_uuid();

-- Step 2: Update existing users with specific UUIDs (matching our JWT logic)
UPDATE auth_test SET uuid_id = '550e8400-e29b-41d4-a716-446655440001' WHERE id = 1;
UPDATE auth_test SET uuid_id = '550e8400-e29b-41d4-a716-446655440002' WHERE id = 2;

-- Step 3: Make uuid_id NOT NULL
ALTER TABLE auth_test ALTER COLUMN uuid_id SET NOT NULL;

-- Step 4: Drop the old integer id column
ALTER TABLE auth_test DROP COLUMN id;

-- Step 5: Rename uuid_id to id
ALTER TABLE auth_test RENAME COLUMN uuid_id TO id;

-- Step 6: Make id the primary key
ALTER TABLE auth_test ADD PRIMARY KEY (id);

-- Step 7: Add unique constraint on email (if not already exists)
ALTER TABLE auth_test ADD CONSTRAINT auth_test_email_unique UNIQUE (email);

-- Step 8: Update todos table to use the correct UUIDs
-- First, let's see what we have and update accordingly
UPDATE todos SET user_id = '550e8400-e29b-41d4-a716-446655440002' WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
