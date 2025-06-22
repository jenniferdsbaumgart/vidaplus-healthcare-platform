import axios from 'axios';

const API_URL = '/api/prescriptions';

export interface Prescription {
  id: number;
  patient_id: number;
  doctor_id: number;
  medication_id: number;
  dosage?: string;
  instructions?: string;
  issued_date?: string;
  created_at?: string;
  updated_at?: string;
}

export const getPrescriptions = async (): Promise<Prescription[]> => {
  const { data } = await axios.get(API_URL);
  return data;
};

export const getPrescriptionById = async (id: number): Promise<Prescription> => {
  const { data } = await axios.get(`${API_URL}/${id}`);
  return data;
};

export const createPrescription = async (prescription: Omit<Prescription, 'id' | 'created_at' | 'updated_at'>): Promise<Prescription> => {
  const { data } = await axios.post(API_URL, prescription);
  return data;
};

export const updatePrescription = async (id: number, updates: Partial<Prescription>): Promise<Prescription> => {
  const { data } = await axios.put(`${API_URL}/${id}`, updates);
  return data;
};

export const deletePrescription = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
