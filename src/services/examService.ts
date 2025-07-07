import { api } from '../lib/api/axios';

export interface Exam {
  id?: number;
  name: string;
  date: string;
}

export async function getExams() {
  const res = await api.get('/exams');
  return res.data;
}

export async function getExamById(id: number) {
  const res = await api.get(`/exams/${id}`);
  return res.data;
}

export async function createExam(data: Exam) {
  const res = await api.post('/exams', data);
  return res.data;
}

export async function updateExam(id: number, updates: Partial<Exam>) {
  const res = await api.put(`/exams/${id}`, updates);
  return res.data;
}

export async function deleteExam(id: number) {
  const res = await api.delete(`/exams/${id}`);
  return res.data;
}
