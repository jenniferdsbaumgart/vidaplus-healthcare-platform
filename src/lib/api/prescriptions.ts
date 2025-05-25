import { supabase } from '../supabase';
import type { Database } from '../types/supabase';
import type { Prescription } from '../types/prescription';

type PrescriptionRow = Database['public']['Tables']['prescriptions']['Row'];
type PrescriptionInsert = Database['public']['Tables']['prescriptions']['Insert'];

export const createPrescription = async (prescription: Prescription) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Usuário não autenticado');

  const { data: doctor } = await supabase
    .from('staff')
    .select('id, role')
    .eq('id', user.id)
    .single();

  if (!doctor || doctor.role !== 'doctor') {
    throw new Error('Apenas médicos podem emitir prescrições');
  }

  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + prescription.validity_days);

  const prescriptionData: PrescriptionInsert = {
    patient_id: prescription.patient_id,
    doctor_id: doctor.id,
    medications: prescription.medications,
    instructions: prescription.instructions,
    valid_until: validUntil.toISOString(),
    status: 'active',
  };

  const { data, error } = await supabase
    .from('prescriptions')
    .insert([prescriptionData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPrescriptions = async (patientId?: string) => {
  let query = supabase
    .from('prescriptions')
    .select(`
      *,
      patient:patients(id, full_name, cpf, birth_date),
      doctor:staff(id, full_name, registration_number, specialization)
    `)
    .order('created_at', { ascending: false });

  if (patientId) {
    query = query.eq('patient_id', patientId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getPrescriptionById = async (id: string) => {
  const { data, error } = await supabase
    .from('prescriptions')
    .select(`
      *,
      patient:patients(id, full_name, cpf, birth_date),
      doctor:staff(id, full_name, registration_number, specialization)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

export const cancelPrescription = async (id: string) => {
  const { data, error } = await supabase
    .from('prescriptions')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};