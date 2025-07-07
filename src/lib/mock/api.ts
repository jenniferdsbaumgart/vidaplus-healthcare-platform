import { mockPatients, mockStaff } from './data';
import type { Patient, Staff } from './data';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getPatients = async (): Promise<Patient[]> => {
  await delay(500);
  return [...mockPatients];
};

export const getPatientById = async (id: string): Promise<Patient | null> => {
  await delay(300);
  return mockPatients.find(p => p.id === id) || null;
};

export const createPatient = async (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient> => {
  await delay(500);
  const now = new Date().toISOString();
  const newPatient: Patient = {
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
    ...patient
  };
  mockPatients.push(newPatient);
  return newPatient;
};

export const getStaff = async (): Promise<Staff[]> => {
  await delay(500);
  return [...mockStaff];
};

export const getStaffById = async (id: string): Promise<Staff | null> => {
  await delay(300);
  return mockStaff.find(s => s.id === id) || null;
};

export const createStaff = async (staff: Omit<Staff, 'id' | 'created_at' | 'updated_at'>): Promise<Staff> => {
  await delay(500);
  const now = new Date().toISOString();
  const newStaff: Staff = {
    id: crypto.randomUUID(),
    created_at: now,
    updated_at: now,
    ...staff
  };
  mockStaff.push(newStaff);
  return newStaff;
};
