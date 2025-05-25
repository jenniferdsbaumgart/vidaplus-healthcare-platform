/*
  # Create healthcare staff table

  1. New Tables
    - `staff`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `registration_number` (text, unique) - CRM/COREN
      - `role` (text) - doctor/nurse/technician
      - `email` (text)
      - `phone` (text)
      - `specialization` (text)
      - `available_schedule` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `staff` table
    - Add policies for authenticated users to perform CRUD operations
*/

CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  registration_number text UNIQUE NOT NULL,
  role text NOT NULL,
  email text NOT NULL,
  phone text,
  specialization text,
  available_schedule jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_role CHECK (role IN ('doctor', 'nurse', 'technician'))
);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all staff"
  ON staff
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create staff"
  ON staff
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update staff"
  ON staff
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete staff"
  ON staff
  FOR DELETE
  TO authenticated
  USING (true);

CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON staff
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();