/*
  # Populate database with initial data
  
  1. Staff Data
    - Doctors with various specializations
    - Nurses with different areas
    - Technicians for different departments
  
  2. Patient Data
    - Sample patients with complete profiles
  
  3. Changes
    - Temporarily disable prescription audit trigger
    - Insert initial data
    - Re-enable prescription audit trigger
*/

-- Temporarily disable the prescription audit trigger
ALTER TABLE prescriptions DISABLE TRIGGER prescription_audit_trigger;

-- Medical Staff Data
INSERT INTO staff (full_name, registration_number, role, email, phone, specialization) VALUES
-- Doctors
('Dr. Ana Beatriz Santos', '52364-SP', 'doctor', 'dra.ana@vidaplus.com', '+55 11 98765-4321', 'Clínica Geral'),
('Dr. Carlos Eduardo Silva', '65478-SP', 'doctor', 'dr.carlos@vidaplus.com', '+55 11 98765-4322', 'Cardiologia'),
('Dra. Mariana Costa', '45698-SP', 'doctor', 'dra.mariana@vidaplus.com', '+55 11 98765-4323', 'Pediatria'),
('Dr. Ricardo Oliveira', '78932-SP', 'doctor', 'dr.ricardo@vidaplus.com', '+55 11 98765-4324', 'Ortopedia'),
('Dra. Juliana Lima', '36925-SP', 'doctor', 'dra.juliana@vidaplus.com', '+55 11 98765-4325', 'Ginecologia'),
('Dr. Fernando Mendes', '14785-SP', 'doctor', 'dr.fernando@vidaplus.com', '+55 11 98765-4326', 'Dermatologia'),
('Dra. Patricia Almeida', '95175-SP', 'doctor', 'dra.patricia@vidaplus.com', '+55 11 98765-4327', 'Neurologia'),
('Dr. Gustavo Santos', '75395-SP', 'doctor', 'dr.gustavo@vidaplus.com', '+55 11 98765-4328', 'Psiquiatria'),
('Dra. Camila Rodrigues', '15935-SP', 'doctor', 'dra.camila@vidaplus.com', '+55 11 98765-4329', 'Endocrinologia'),
('Dr. Lucas Ferreira', '24680-SP', 'doctor', 'dr.lucas@vidaplus.com', '+55 11 98765-4330', 'Oftalmologia'),

-- Nurses
('Enfª. Maria Silva', 'COREN-SP 123456', 'nurse', 'enf.maria@vidaplus.com', '+55 11 98765-4331', 'Clínica Médica'),
('Enfº. João Santos', 'COREN-SP 234567', 'nurse', 'enf.joao@vidaplus.com', '+55 11 98765-4332', 'Emergência'),
('Enfª. Ana Paula Costa', 'COREN-SP 345678', 'nurse', 'enf.ana@vidaplus.com', '+55 11 98765-4333', 'Pediatria'),
('Enfº. Pedro Oliveira', 'COREN-SP 456789', 'nurse', 'enf.pedro@vidaplus.com', '+55 11 98765-4334', 'Cardiologia'),
('Enfª. Beatriz Lima', 'COREN-SP 567890', 'nurse', 'enf.beatriz@vidaplus.com', '+55 11 98765-4335', 'Centro Cirúrgico'),

-- Technicians
('Téc. Roberto Alves', 'COREN-SP 987654', 'technician', 'tec.roberto@vidaplus.com', '+55 11 98765-4336', 'Radiologia'),
('Téc. Sandra Costa', 'COREN-SP 876543', 'technician', 'tec.sandra@vidaplus.com', '+55 11 98765-4337', 'Laboratório'),
('Téc. Carlos Santos', 'COREN-SP 765432', 'technician', 'tec.carlos@vidaplus.com', '+55 11 98765-4338', 'Enfermagem');

-- Patients Data
INSERT INTO patients (full_name, cpf, birth_date, gender, email, phone, address) VALUES
('Maria Silva Oliveira', '123.456.789-01', '1980-05-15', 'female', 'maria.silva@email.com', '+55 11 98888-7777', 'Rua das Flores, 123 - São Paulo/SP'),
('João Santos Lima', '234.567.890-12', '1975-08-22', 'male', 'joao.santos@email.com', '+55 11 97777-6666', 'Av. Paulista, 1000 - São Paulo/SP'),
('Ana Paula Costa', '345.678.901-23', '1990-03-10', 'female', 'ana.costa@email.com', '+55 11 96666-5555', 'Rua Augusta, 500 - São Paulo/SP'),
('Carlos Eduardo Pereira', '456.789.012-34', '1982-11-30', 'male', 'carlos.pereira@email.com', '+55 11 95555-4444', 'Rua Oscar Freire, 200 - São Paulo/SP'),
('Beatriz Lima Santos', '567.890.123-45', '1988-07-25', 'female', 'beatriz.lima@email.com', '+55 11 94444-3333', 'Alameda Santos, 750 - São Paulo/SP');

-- Get doctor and patient IDs for relationships
DO $$
DECLARE
    doctor_id uuid;
    patient_id uuid;
    current_date timestamp := NOW();
BEGIN
    -- Get a doctor ID
    SELECT id INTO doctor_id FROM staff WHERE role = 'doctor' LIMIT 1;
    
    -- Get a patient ID
    SELECT id INTO patient_id FROM patients LIMIT 1;

    -- Create teleconsultations
    INSERT INTO teleconsultations (patient_id, staff_id, scheduled_for, status, notes)
    VALUES
    (patient_id, doctor_id, current_date + interval '1 day' + interval '10 hours', 'scheduled', 'Consulta de rotina'),
    (patient_id, doctor_id, current_date + interval '2 days' + interval '14 hours', 'scheduled', 'Retorno');
END $$;

-- Re-enable the prescription audit trigger
ALTER TABLE prescriptions ENABLE TRIGGER prescription_audit_trigger;