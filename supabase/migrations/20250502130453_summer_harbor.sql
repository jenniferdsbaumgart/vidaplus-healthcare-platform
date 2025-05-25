/*
  # Create patients table

  1. New Tables
    - `patients`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `cpf` (text, unique)
      - `birth_date` (date)
      - `gender` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `patients` table
    - Add policies for authenticated users to perform CRUD operations
*/

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  cpf text UNIQUE NOT NULL,
  birth_date date NOT NULL,
  gender text NOT NULL,
  email text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all patients"
  ON patients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create patients"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update patients"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete patients"
  ON patients
  FOR DELETE
  TO authenticated
  USING (true);

-- Create a trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();