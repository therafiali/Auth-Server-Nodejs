-- Insert sample data
INSERT INTO auth_test (email, password, username) 
VALUES 
    ('test@example.com', 'password123', 'testuser'),
    ('admin@example.com', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;
