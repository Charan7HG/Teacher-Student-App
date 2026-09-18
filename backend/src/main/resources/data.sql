INSERT INTO teachers (name, email, password)
VALUES ('Test Teacher', 'teacher@test.com', 'Teacher@123')
ON CONFLICT (email) DO NOTHING;