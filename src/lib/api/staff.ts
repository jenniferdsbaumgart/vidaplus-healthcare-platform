// import { supabase } from '../supabase';
// import type { Database } from '../types/supabase';

// type Staff = Database['public']['Tables']['staff']['Row'];
// type StaffInsert = Database['public']['Tables']['staff']['Insert'];
// type StaffUpdate = Database['public']['Tables']['staff']['Update'];

// export const getStaff = async () => {
//   const { data, error } = await supabase
//     .from('staff')
//     .select('*')
//     .order('full_name');
    
//   if (error) throw error;
//   return data;
// };

// export const getStaffById = async (id: string) => {
//   const { data, error } = await supabase
//     .from('staff')
//     .select('*')
//     .eq('id', id)
//     .single();
    
//   if (error) throw error;
//   return data;
// };

// export const createStaff = async (staff: StaffInsert) => {
//   const { data, error } = await supabase
//     .from('staff')
//     .insert([staff])
//     .select()
//     .single();
    
//   if (error) throw error;
//   return data;
// };

// export const updateStaff = async (id: string, updates: StaffUpdate) => {
//   const { data, error } = await supabase
//     .from('staff')
//     .update(updates)
//     .eq('id', id)
//     .select()
//     .single();
    
//   if (error) throw error;
//   return data;
// };

// export const deleteStaff = async (id: string) => {
//   const { error } = await supabase
//     .from('staff')
//     .delete()
//     .eq('id', id);
    
//   if (error) throw error;
// };

import { v4 as uuidv4 } from 'uuid';
import { mockStaff as initialMockStaff } from '../mock/data';
import type { Staff } from '../mock/data';

let staffData: Staff[] = [...initialMockStaff];

export async function getStaff() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return staffData;
}

export async function getStaffById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return staffData.find((s) => s.id === id) || null;
}

export async function createStaff(newStaff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const staffMember: Staff = {
    ...newStaff,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  staffData.push(staffMember);
  return staffMember;
}

export async function updateStaff(id: string, updates: Partial<Staff>) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const index = staffData.findIndex((s) => s.id === id);
  if (index === -1) throw new Error('Staff not found');
  staffData[index] = {
    ...staffData[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return staffData[index];
}

export async function deleteStaff(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  staffData = staffData.filter((s) => s.id !== id);
  return true;
}