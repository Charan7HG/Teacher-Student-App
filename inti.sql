-- Ensure the table exists before inserting to prevent timing errors
CREATE TABLE IF NOT EXISTS teachers (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Seed the initial teacher account profile expected by Playwright
INSERT INTO teachers (name, email, password) 
VALUES ('Test Teacher', 'teacher@school.com', 'password123')
ON CONFLICT (email) DO NOTHING;
