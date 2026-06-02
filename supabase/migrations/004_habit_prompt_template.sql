-- Migration: Add optional journal prompt template to habits
ALTER TABLE habits ADD COLUMN IF NOT EXISTS prompt_template TEXT;
