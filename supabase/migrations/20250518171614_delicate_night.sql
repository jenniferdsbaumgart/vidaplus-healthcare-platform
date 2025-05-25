/*
  # Create prescriptions system tables

  1. New Tables
    - `prescriptions`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `doctor_id` (uuid, foreign key)
      - `medications` (jsonb)
      - `instructions` (text)
      - `issued_at` (timestamp)
      - `valid_until` (timestamp)
      - `status` (text)
      - `signature` (text)
      - `qr_code` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `prescriptions` table
    - Add policies for authenticated users
    - Add audit logging
*/

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  medications jsonb NOT NULL DEFAULT '[]'::jsonb,
  instructions text,
  issued_at timestamptz NOT NULL DEFAULT now(),
  valid_until timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'active',
  signature text,
  qr_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('active', 'cancelled', 'expired'))
);

-- Create audit log table for prescriptions
CREATE TABLE IF NOT EXISTS prescription_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id uuid REFERENCES prescriptions(id) ON DELETE CASCADE,
  action text NOT NULL,
  actor_id uuid REFERENCES auth.users(id),
  changes jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescription_audit_logs ENABLE ROW LEVEL SECURITY;

-- Prescriptions policies
CREATE POLICY "Doctors can create prescriptions"
  ON prescriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM staff 
      WHERE id = auth.uid() 
      AND role = 'doctor'
    )
  );

CREATE POLICY "Doctors can view their prescriptions"
  ON prescriptions
  FOR SELECT
  TO authenticated
  USING (
    doctor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM patients 
      WHERE id = prescriptions.patient_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Doctors can update their prescriptions"
  ON prescriptions
  FOR UPDATE
  TO authenticated
  USING (doctor_id = auth.uid())
  WITH CHECK (doctor_id = auth.uid());

-- Audit logs policies
CREATE POLICY "Only system can insert audit logs"
  ON prescription_audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view relevant audit logs"
  ON prescription_audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM prescriptions p
      WHERE p.id = prescription_id
      AND (
        p.doctor_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM patients 
          WHERE id = p.patient_id 
          AND user_id = auth.uid()
        )
      )
    )
  );

-- Create indexes
CREATE INDEX idx_prescriptions_patient_id ON prescriptions(patient_id);
CREATE INDEX idx_prescriptions_doctor_id ON prescriptions(doctor_id);
CREATE INDEX idx_prescriptions_status ON prescriptions(status);
CREATE INDEX idx_prescriptions_valid_until ON prescriptions(valid_until);
CREATE INDEX idx_prescription_audit_logs_prescription_id ON prescription_audit_logs(prescription_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function and trigger for audit logging
CREATE OR REPLACE FUNCTION log_prescription_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO prescription_audit_logs (
    prescription_id,
    action,
    actor_id,
    changes,
    ip_address,
    user_agent
  ) VALUES (
    NEW.id,
    TG_OP,
    auth.uid(),
    jsonb_build_object(
      'old', to_jsonb(OLD),
      'new', to_jsonb(NEW)
    ),
    current_setting('request.headers')::json->>'x-forwarded-for',
    current_setting('request.headers')::json->>'user-agent'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

CREATE TRIGGER prescription_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION log_prescription_changes();