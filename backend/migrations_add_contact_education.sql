-- Optional: add columns if not exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS contact VARCHAR(50) NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS education VARCHAR(255) NULL;