-- Insert test todos for user with UUID: 550e8400-e29b-41d4-a716-446655440002
INSERT INTO public.todos (user_id, title, completed) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Buy groceries', false),
('550e8400-e29b-41d4-a716-446655440002', 'Walk the dog', true),
('550e8400-e29b-41d4-a716-446655440002', 'Read a book', false);

-- Insert test todos for another user to demonstrate RLS
-- Using a fixed UUID for user_99: 550e8400-e29b-41d4-a716-446655440099
INSERT INTO public.todos (user_id, title, completed) VALUES
('550e8400-e29b-41d4-a716-446655440099', 'Secret task', false),
('550e8400-e29b-41d4-a716-446655440099', 'Another secret task', true);
