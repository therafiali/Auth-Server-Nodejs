-- Create todos table with RLS
CREATE TABLE IF NOT EXISTS public.todos (
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
