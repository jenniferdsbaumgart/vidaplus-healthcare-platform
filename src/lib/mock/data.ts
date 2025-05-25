import { v4 as uuidv4 } from 'uuid';

export interface Patient {
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
}

export interface Staff {
  id: string;
  full_name: string;
  registration_number: string;
  role: 'doctor' | 'nurse' | 'technician';
  email: string;
  phone: string | null;
  specialization: string | null;
  available_schedule: any[];
  created_at: string;
  updated_at: string;
}

export const mockPatients: Patient[] = [
  {
    id: uuidv4(),
    full_name: 'Maria Silva Oliveira',
    cpf: '123.456.789-01',
    birth_date: '1980-05-15',
    gender: 'female',
    email: 'maria.silva@email.com',
    phone: '+55 11 98888-7777',
    address: 'Rua das Flores, 123 - São Paulo/SP',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: uuidv4(),
    full_name: 'João Santos Lima',
    cpf: '234.567.890-12',
    birth_date: '1975-08-22',
    gender: 'male',
    email: 'joao.santos@email.com',
    phone: '+55 11 97777-6666',
    address: 'Av. Paulista, 1000 - São Paulo/SP',
    created_at: '2024-01-16T14:30:00Z',
    updated_at: '2024-01-16T14:30:00Z'
  },
  {
    id: uuidv4(),
    full_name: 'Ana Paula Costa',
    cpf: '345.678.901-23',
    birth_date: '1990-03-10',
    gender: 'female',
    email: 'ana.costa@email.com',
    phone: '+55 11 96666-5555',
    address: 'Rua Augusta, 500 - São Paulo/SP',
    created_at: '2024-01-17T09:15:00Z',
    updated_at: '2024-01-17T09:15:00Z'
  },
  {
    id: uuidv4(),
    full_name: 'Carlos Eduardo Pereira',
    cpf: '456.789.012-34',
    birth_date: '1982-11-30',
    gender: 'male',
    email: 'carlos.pereira@email.com',
    phone: '+55 11 95555-4444',
    address: 'Rua Oscar Freire, 200 - São Paulo/SP',
    created_at: '2024-01-18T16:45:00Z',
    updated_at: '2024-01-18T16:45:00Z'
  },
  {
    id: uuidv4(),
    full_name: 'Beatriz Lima Santos',
    cpf: '567.890.123-45',
    birth_date: '1988-07-25',
    gender: 'female',
    email: 'beatriz.lima@email.com',
    phone: '+55 11 94444-3333',
    address: 'Alameda Santos, 750 - São Paulo/SP',
    created_at: '2024-01-19T11:20:00Z',
    updated_at: '2024-01-19T11:20:00Z'
  }
];

export const mockStaff: Staff[] = [
  {
    id: uuidv4(),
    full_name: 'Dr. Ana Beatriz Santos',
    registration_number: '52364-SP',
    role: 'doctor',
    email: 'dra.ana@vidaplus.com',
    phone: '+55 11 98765-4321',
    specialization: 'Clínica Geral',
    available_schedule: [],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  {
    id: uuidv4(),
    full_name: 'Dr. Carlos Eduardo Silva',
    registration_number: '65478-SP',
    role: 'doctor',
    email: 'dr.carlos@vidaplus.com',
    phone: '+55 11 98765-4322',
    specialization: 'Cardiologia',
    available_schedule: [],
    created_at: '2024-01-16T14:30:00Z',
    updated_at: '2024-01-16T14:30:00Z'
  },
  {
    id: uuidv4(),
    full_name: 'Enfª. Maria Silva',
    registration_number: 'COREN-SP 123456',
    role: 'nurse',
    email: 'enf.maria@vidaplus.com',
    phone: '+55 11 98765-4331',
    specialization: 'Clínica Médica',
    available_schedule: [],
    created_at: '2024-01-17T09:15:00Z',
    updated_at: '2024-01-17T09:15:00Z'
  },
  {
    id: uuidv4(),
    full_name: 'Téc. Roberto Alves',
    registration_number: 'COREN-SP 987654',
    role: 'technician',
    email: 'tec.roberto@vidaplus.com',
    phone: '+55 11 98765-4336',
    specialization: 'Radiologia',
    available_schedule: [],
    created_at: '2024-01-18T16:45:00Z',
    updated_at: '2024-01-18T16:45:00Z'
  }
];