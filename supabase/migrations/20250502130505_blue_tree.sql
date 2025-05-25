/*
  # Create teleconsultations table

  1. New Tables
    - `teleconsultations`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `staff_id` (uuid, foreign key)
      - `scheduled_for` (timestamp with time zone)
      - `notes` (text)
      - `video_link` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `teleconsultations` table
    - Add policies for authenticated users to perform CRUD operations
    - Add foreign key constraints
*/

CREATE TABLE IF NOT EXISTS teleconsultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  scheduled_for timestamptz NOT NULL,
  notes text,
  video_link text,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled'))
);

ALTER TABLE teleconsultations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all teleconsultations"
  ON teleconsultations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create teleconsultations"
  ON teleconsultations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update teleconsultations"
  ON teleconsultations
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete teleconsultations"
  ON teleconsultations
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_teleconsultations_patient_id ON teleconsultations(patient_id);
CREATE INDEX idx_teleconsultations_staff_id ON teleconsultations(staff_id);
CREATE INDEX idx_teleconsultations_scheduled_for ON teleconsultations(scheduled_for);

CREATE TRIGGER update_teleconsultations_updated_at
  BEFORE UPDATE ON teleconsultations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();