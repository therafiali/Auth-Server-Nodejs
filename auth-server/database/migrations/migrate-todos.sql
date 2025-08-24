-- Migration script to update todos table for proper RLS
-- Run this if you already have the todos table with TEXT user_id

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can insert own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can update own todos" ON public.todos;
DROP POLICY IF EXISTS "Users can delete own todos" ON public.todos;

-- Drop existing table
DROP TABLE IF EXISTS public.todos;

-- Recreate table with correct data types
CREATE TABLE public.todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own todos" ON public.todos
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own todos" ON public.todos
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own todos" ON public.todos
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own todos" ON public.todos
    FOR DELETE USING (user_id = auth.uid());
