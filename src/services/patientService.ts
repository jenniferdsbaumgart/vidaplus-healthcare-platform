import { api } from '../lib/api/axios';

export interface Patient {
  id?: number;
  full_name: string;
  cpf: string;
  birth_date: Date | string;
  gender: string;
  email?: string;
  phone?: string;
  address?: string;
  // você pode incluir created_at, updated_at se necessário
}

export type CreatePatientInput = Omit<Patient, 'id' | 'created_at' | 'updated_at'>;

export async function getPatients() {
  const res = await api.get('/patients');
  return res.data;
}

export async function getPatientById(id: number) {
  const res = await api.get(`/patients/${id}`);
  return res.data;
}

export const getPatientDetails = async (id: number) => {
  return await getPatientById(id);
};

export const createPatient = async (data: CreatePatientInput) => {
  const response = await api.post('/patients', data);
  return response.data;
};

export async function updatePatient(id: number, updates: Partial<Patient>) {
  const res = await api.put(`/patients/${id}`, updates);
  return res.data;
}

export async function deletePatient(id: number) {
  const res = await api.delete(`/patients/${id}`);
  return res.data;
}
