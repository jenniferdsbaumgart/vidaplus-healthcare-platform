/*
  # Update patients table RLS policies

  1. Changes
    - Add user_id column to track ownership
    - Drop existing policies to avoid conflicts
    - Create new RLS policies with proper ownership checks

  2. Security
    - Enable RLS on patients table
    - Add policies for authenticated users to:
      - Read all patients (all authenticated users can view)
      - Create patients with their user_id
      - Update and delete only their own patients
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view all patients" ON patients;
DROP POLICY IF EXISTS "Users can create patients" ON patients;
DROP POLICY IF EXISTS "Users can update patients" ON patients;
DROP POLICY IF EXISTS "Users can delete patients" ON patients;

-- Add user_id column to track ownership if it doesn't exist
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Update RLS policies
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all patients
CREATE POLICY "Users can view all patients"
ON patients FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert patients with their user_id
CREATE POLICY "Users can create patients"
ON patients FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own patients
CREATE POLICY "Users can update patients"
ON patients FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own patients
CREATE POLICY "Users can delete patients"
ON patients FOR DELETE
TO authenticated
USING (auth.uid() = user_id);