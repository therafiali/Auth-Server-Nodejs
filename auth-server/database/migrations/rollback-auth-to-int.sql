-- Rollback script to convert auth_test table back to INTEGER (if needed)
-- WARNING: This will lose data if not handled carefully

-- Step 1: Add integer id column back
ALTER TABLE auth_test ADD COLUMN int_id SERIAL;

-- Step 2: Update integer IDs based on UUID mapping
UPDATE auth_test SET int_id = 1 WHERE id = '550e8400-e29b-41d4-a716-446655440001';
UPDATE auth_test SET int_id = 2 WHERE id = '550e8400-e29b-41d4-a716-446655440002';

-- Step 3: Drop UUID primary key
ALTER TABLE auth_test DROP CONSTRAINT auth_test_pkey;

-- Step 4: Drop UUID column
ALTER TABLE auth_test DROP COLUMN id;

-- Step 5: Rename int_id to id
ALTER TABLE auth_test RENAME COLUMN int_id TO id;

-- Step 6: Make id the primary key
ALTER TABLE auth_test ADD PRIMARY KEY (id);

-- Step 7: Update todos table back to INTEGER
ALTER TABLE todos ALTER COLUMN user_id TYPE INTEGER USING 
  CASE 
    WHEN user_id = '550e8400-e29b-41d4-a716-446655440001' THEN 1
    WHEN user_id = '550e8400-e29b-41d4-a716-446655440002' THEN 2
    ELSE 99
  END;
