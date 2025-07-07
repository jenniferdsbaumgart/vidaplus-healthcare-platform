import { api } from '../lib/api/axios';
export interface ReportInput {
  title: string;
  content: string;
}

export async function getReports() {
  const res = await api.get('/reports');
  return res.data;
}

export async function getReportById(id: number) {
  const res = await api.get(`/reports/${id}`);
  return res.data;
}

export async function createReport(data: ReportInput) {
  const res = await api.post('/reports', data);
  return res.data;
}

export async function updateReport(id: number, updates: ReportInput) {
  const res = await api.put(`/reports/${id}`, updates);
  return res.data;
}

export async function deleteReport(id: number) {
  const res = await api.delete(`/reports/${id}`);
  return res.data;
}
