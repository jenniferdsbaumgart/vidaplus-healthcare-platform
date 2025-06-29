import { api } from '../lib/api/axios';

export interface Teleconsultation {
  id: number;
  scheduled_for: string;
  date: string;
  notes?: string;
  patient: {
    id: number;
    full_name: string;
    birth_date: string;
  };
  doctor: {
    id: number;
    full_name: string;
    specialization: string;
  };
}

export const getTeleconsultations = async (date?: string) => {
  const params = date ? { date } : {};
  const response = await api.get("/telemedicine", { params });
  return response.data;
};

export async function createTeleconsultation(data: {
  patientId: number;
  doctorId: number;
  date: string;
  notes?: string;
}) {
  const res = await api.post('/telemedicine', data);
  return res.data;
}

export async function updateTeleconsultation(
  id: number,
  updates: Partial<{
    patientId: number;
    doctorId: number;
    date: string;
    notes?: string;
  }>
) {
  const res = await api.put(`/telemedicine/${id}`, updates);
  return res.data;
}

export async function deleteTeleconsultation(id: number) {
  const res = await api.delete(`/telemedicine/${id}`);
  return res.data;
}
