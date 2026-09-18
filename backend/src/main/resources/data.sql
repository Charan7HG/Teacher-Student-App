INSERT INTO teachers (name, email, password) 
VALUES ('Test Teacher', 'teacher@school.com', 'password123')
ON CONFLICT (email) DO NOTHING;
