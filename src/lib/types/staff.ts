export interface StaffData {
  id: number;
  full_name: string;
  registration_number: string;
  role: 'doctor' | 'nurse' | 'technician';
  email: string;
  phone?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  specialization?: string | null;
  avatar?: string | null;
  address?: string | null;
  available_schedule?: { day: string; start: string; end: string }[] | null;
  created_at: string;
  updated_at: string;
}
