-- Migration: Profile management, anonymous posting, and settings
-- Run this in the Supabase SQL editor or via `supabase db push`.

-- 1. Add default_is_anonymous to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS default_is_anonymous BOOLEAN NOT NULL DEFAULT false;

-- 2. Case-insensitive unique constraint on username
--    Partial index allows multiple NULL values (users mid-onboarding).
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_unique
  ON profiles (lower(username))
  WHERE username IS NOT NULL;

-- 3. Add is_anonymous to entries
ALTER TABLE entries
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN NOT NULL DEFAULT false;

-- 4. FK from entries.user_id → profiles.id (required for Supabase PostgREST join)
--    ⚠ Ensure every existing entries.user_id has a matching profiles.id row
--    before running, otherwise this constraint will fail.
ALTER TABLE entries
  ADD CONSTRAINT entries_user_id_profiles_fk
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- 5. settings table (user_id as PK enforces 1:1 with profiles)
CREATE TABLE IF NOT EXISTS settings (
  user_id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_username_change TIMESTAMPTZ
);

-- 6. Row-level security for settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own settings"
  ON settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON settings FOR UPDATE
  USING (auth.uid() = user_id);
