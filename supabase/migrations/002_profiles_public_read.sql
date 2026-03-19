-- Migration: Allow public read access to profiles
-- This enables the forum to display usernames on non-anonymous public entries.
-- The join entries → profiles is blocked by RLS without this policy.

CREATE POLICY "Profiles are publicly readable"
  ON profiles FOR SELECT
  USING (true);
