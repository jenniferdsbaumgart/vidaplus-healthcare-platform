import { supabase } from '../supabase';
import type { Database } from '../types/supabase';

// type Teleconsultation = Database['public']['Tables']['teleconsultations']['Row'];
type TeleconsultationInsert = Database['public']['Tables']['teleconsultations']['Insert'];
type TeleconsultationUpdate = Database['public']['Tables']['teleconsultations']['Update'];

export const getTeleconsultations = async (date?: string) => {
  let query = supabase
    .from('teleconsultations')
    .select(`
      *,
      patient:patients(id, full_name, birth_date, gender),
      staff:staff(id, full_name, specialization)
    `)
    .order('scheduled_for');
    
  if (date) {
    // Filter by date if provided
    query = query.gte('scheduled_for', `${date}T00:00:00`)
      .lte('scheduled_for', `${date}T23:59:59`);
  }
    
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getTeleconsultationById = async (id: string) => {
  const { data, error } = await supabase
    .from('teleconsultations')
    .select(`
      *,
      patient:patients(id, full_name, birth_date, gender),
      staff:staff(id, full_name, specialization)
    `)
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
};

export const createTeleconsultation = async (teleconsultation: TeleconsultationInsert) => {
  const { data, error } = await supabase
    .from('teleconsultations')
    .insert([teleconsultation])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateTeleconsultation = async (id: string, updates: TeleconsultationUpdate) => {
  const { data, error } = await supabase
    .from('teleconsultations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteTeleconsultation = async (id: string) => {
  const { error } = await supabase
    .from('teleconsultations')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};