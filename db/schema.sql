-- 1. Modify your existing 'user' column so it supports a Unique index, and fix password size
ALTER TABLE users 
MODIFY COLUMN user VARCHAR(100) NOT NULL,
MODIFY COLUMN password VARCHAR(255) NOT NULL;

-- 2. Make the 'user' column unique so usernames cannot be duplicated
ALTER TABLE users 
ADD UNIQUE (user);

-- 3. Add the missing fields (role, department, active) right after your 'name' column
ALTER TABLE users 
ADD COLUMN role VARCHAR(20) DEFAULT 'user' AFTER name,
ADD COLUMN department VARCHAR(100) AFTER role,
ADD COLUMN active TINYINT(1) DEFAULT 1 AFTER department;
