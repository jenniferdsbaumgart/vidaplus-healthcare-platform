import { api } from '../lib/api/axios';

export interface Staff {
  id?: number;
  name: string;
  position: string;
  email: string;
  // Add other staff fields as needed
}

export async function getStaff() {
  const res = await api.get('/staff');
  return res.data;
}

export async function getStaffById(id: number) {
  const res = await api.get(`/staff/${id}`);
  return res.data;
}

export async function createStaff(staff: Staff) {
  const res = await api.post('/staff', staff);
  return res.data;
}

export async function updateStaff(id: number, updates: Partial<Staff>) {
  const res = await api.put(`/staff/${id}`, updates);
  return res.data;
}

export async function deleteStaff(id: number) {
  const res = await api.delete(`/staff/${id}`);
  return res.data;
}
