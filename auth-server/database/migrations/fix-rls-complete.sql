-- Complete fix for RLS policies
-- This will ensure users can only access their own todos

-- Step 1: Drop all existing policies
DROP POLICY IF EXISTS "Users can view own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can insert own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can update own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can delete own todos" ON public.todos;

-- Step 2: Ensure RLS is enabled
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Step 3: Create new policies with proper UUID comparison
CREATE POLICY "Users can view own todos" ON public.todos
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own todos" ON public.todos
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own todos" ON public.todos
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own todos" ON public.todos
    FOR DELETE USING (user_id = auth.uid());

-- Step 4: Verify the policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'todos';
