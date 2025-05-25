import { supabase } from '../supabase';
import type { Database } from '../types/supabase';

type Patient = Database['public']['Tables']['patients']['Row'];
type PatientInsert = Database['public']['Tables']['patients']['Insert'];
type PatientUpdate = Database['public']['Tables']['patients']['Update'];

export const getPatients = async () => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('full_name');
    
  if (error) throw error;
  return data;
};

export const getPatientById = async (id: string) => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
};

export const createPatient = async (patient: PatientInsert) => {
  // Get the current user's ID
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('patients')
    .insert([{ ...patient, user_id: user?.id }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updatePatient = async (id: string, updates: PatientUpdate) => {
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deletePatient = async (id: string) => {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};