/*
  # Fix patient data and RLS policies

  This migration:
  1. Sets user_id for existing patients
  2. Updates RLS policies to ensure proper access
*/

-- First, temporarily disable RLS to allow the update
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;

-- Get the first admin user and set as owner of existing patients
DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get the first admin user's ID
  SELECT id INTO admin_id
  FROM auth.users
  LIMIT 1;

  -- Update existing patients to belong to this admin
  UPDATE patients
  SET user_id = admin_id
  WHERE user_id IS NULL;
END $$;

-- Re-enable RLS
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all patients" ON patients;
DROP POLICY IF EXISTS "Users can create patients" ON patients;
DROP POLICY IF EXISTS "Users can update patients" ON patients;
DROP POLICY IF EXISTS "Users can delete patients" ON patients;

-- Create new policies that are less restrictive
CREATE POLICY "Users can view all patients"
  ON patients FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create patients"
  ON patients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update patients"
  ON patients FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete patients"
  ON patients FOR DELETE
  TO authenticated
  USING (true);