-- 2025-08-24: add user profile fields
ALTER TABLE users 
  ADD COLUMN contact VARCHAR(20) NULL AFTER email,
  ADD COLUMN education VARCHAR(120) NULL AFTER contact,
  ADD COLUMN college VARCHAR(150) NULL AFTER education,
  ADD COLUMN experience VARCHAR(50) NULL AFTER college,
  ADD COLUMN skills VARCHAR(255) NULL AFTER experience;
