export type Patient = {
  id: string;
  full_name: string;
  cpf: string;
  birth_date: string;
  gender: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

export type Staff = {
  id: string;
  full_name: string;
  registration_number: string;
  role: 'doctor' | 'nurse' | 'technician';
  email: string;
  phone: string | null;
  specialization: string;
  available_schedule: Array<{
    day: number;
    start: string;
    end: string;
  }>;
  created_at: string;
  updated_at: string;
};

export type Teleconsultation = {
  id: string;
  patient_id: string;
  staff_id: string;
  scheduled_for: string;
  notes: string | null;
  video_link: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      patients: {
        Row: Patient;
        Insert: Omit<Patient, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Patient, 'id' | 'created_at' | 'updated_at'>>;
      };
      staff: {
        Row: Staff;
        Insert: Omit<Staff, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Staff, 'id' | 'created_at' | 'updated_at'>>;
      };
      teleconsultations: {
        Row: Teleconsultation;
        Insert: Omit<Teleconsultation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Teleconsultation, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};