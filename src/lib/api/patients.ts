// import { supabase } from '../supabase';
// import type { Database } from '../types/supabase';

// import { mockPatients } from '../mock/data';

// export async function getPatients() {
//   // Simula um delay de API
//   await new Promise((resolve) => setTimeout(resolve, 300));
//   return mockPatients;
// }

// type Patient = Database['public']['Tables']['patients']['Row'];
// type PatientInsert = Database['public']['Tables']['patients']['Insert'];
// type PatientUpdate = Database['public']['Tables']['patients']['Update'];

// export const getPatients = async () => {
//   const { data, error } = await supabase
//     .from('patients')
//     .select('*')
//     .order('full_name');
    
//   if (error) throw error;
//   return data;
// };

// export const getPatientById = async (id: string) => {
//   const { data, error } = await supabase
//     .from('patients')
//     .select('*')
//     .eq('id', id)
//     .single();
    
//   if (error) throw error;
//   return data;
// };

// export const createPatient = async (patient: PatientInsert) => {
//   // Get the current user's ID
//   const { data: { user } } = await supabase.auth.getUser();
  
//   const { data, error } = await supabase
//     .from('patients')
//     .insert([{ ...patient, user_id: user?.id }])
//     .select()
//     .single();
    
//   if (error) throw error;
//   return data;
// };

// export const updatePatient = async (id: string, updates: PatientUpdate) => {
//   const { data, error } = await supabase
//     .from('patients')
//     .update(updates)
//     .eq('id', id)
//     .select()
//     .single();
    
//   if (error) throw error;
//   return data;
// };

// export const deletePatient = async (id: string) => {
//   const { error } = await supabase
//     .from('patients')
//     .delete()
//     .eq('id', id);
    
//   if (error) throw error;
// };

import { v4 as uuidv4 } from 'uuid';
import { mockPatients } from '../mock/data';
import type { Patient } from '../mock/data';

let patientsData: Patient[] = [...mockPatients];

export async function getPatients() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return patientsData;
}

export async function getPatientById(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return patientsData.find((p) => p.id === id) || null;
}

export async function createPatient(newPatient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const patient: Patient = {
    ...newPatient,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  patientsData.push(patient);
  return patient;
}

export async function updatePatient(id: string, updates: Partial<Patient>) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const index = patientsData.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Patient not found');
  patientsData[index] = {
    ...patientsData[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  return patientsData[index];
}

export async function deletePatient(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  patientsData = patientsData.filter((p) => p.id !== id);
  return true;
}