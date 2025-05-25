import { supabase } from '../supabase';
import type { Database } from '../types/supabase';

type Staff = Database['public']['Tables']['staff']['Row'];
type StaffInsert = Database['public']['Tables']['staff']['Insert'];
type StaffUpdate = Database['public']['Tables']['staff']['Update'];

export const getStaff = async () => {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('full_name');
    
  if (error) throw error;
  return data;
};

export const getStaffById = async (id: string) => {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data;
};

export const createStaff = async (staff: StaffInsert) => {
  const { data, error } = await supabase
    .from('staff')
    .insert([staff])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateStaff = async (id: string, updates: StaffUpdate) => {
  const { data, error } = await supabase
    .from('staff')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteStaff = async (id: string) => {
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};