import { api } from '../lib/api/axios';

export interface AppointmentData {
  // Replace these fields with the actual structure of your appointment data
  date: string;
  time: string;
  patientId: number;
  doctorId: number;
  [key: string]: unknown;
}

export async function getAppointments() {
  const res = await api.get('/appointments');
  return res.data;
}

export async function getAppointmentById(id: number) {
  const res = await api.get(`/appointments/${id}`);
  return res.data;
}

export async function createAppointment(data: AppointmentData) {
  const res = await api.post('/appointments', data);
  return res.data;
}

export async function updateAppointment(id: number, updates: Partial<AppointmentData>) {
  const res = await api.put(`/appointments/${id}`, updates);
  return res.data;
}

export async function deleteAppointment(id: number) {
  const res = await api.delete(`/appointments/${id}`);
  return res.data;
}
