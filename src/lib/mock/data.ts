import { v4 as uuidv4 } from "uuid";
import { Medication } from "../validations/patient";

export type Exam = {
  id: string;
  name: string;
  date: string;
  result?: string;
};

export type Appointment = {
  id: string;
  date: string;
  time: string;
  doctorId: string;
  doctorName: string;
  type: string;
  status: string;
};
export interface Patient {
  id: string;
  full_name: string;
  cpf: string;
  birth_date: string;
  gender: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  avatar?: string | null;
  created_at: string;
  updated_at: string;
  medications?: Medication[];
  allergies?: string[];
  chronic_conditions?: string[];
  exams?: Exam[];
  appointments?: Appointment[];
}

export interface StaffSchedule {
  date: string;
  start_time: string;
  end_time: string;
}

export interface Staff {
  id: string;
  full_name: string;
  registration_number: string;
  role: "doctor" | "nurse" | "technician";
  email: string;
  phone: string | null;
  specialization: string | null;
  available_schedule: StaffSchedule[];
  avatar?: string | null;
  created_at: string;
  updated_at: string;
}

export const EXAM_TYPES = [
  'Hemograma Completo',
  'Glicemia em Jejum',
  'Colesterol Total e Frações',
  'Triglicerídeos',
  'TSH e T4 Livre',
  'Ureia e Creatinina',
  'TGO e TGP',
  'Ácido Úrico',
  'Raio-X de Tórax',
  'Eletrocardiograma',
  'Ultrassonografia Abdominal',
  'Ressonância Magnética',
  'Tomografia Computadorizada',
  'Densitometria Óssea',
  'Mamografia',
];

export const mockPatients: Patient[] = [
  {
    id: "1",
    full_name: "Maria Silva Oliveira",
    cpf: "123.456.789-01",
    birth_date: "1980-05-15",
    gender: "female",
    email: "maria.silva@email.com",
    phone: "+55 47 98888-7777",
    address: "Rua Amazonas, 123 - Blumenau/SC",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    medications: [
      { name: "Paracetamol", dosage: "500mg" },
      { name: "Ibuprofeno", dosage: "400mg" },
    ],
    allergies: ["Dipirona"],
    chronic_conditions: ["Hipertensão"],
    exams: [
      {
        id: uuidv4(),
        name: "Hemograma Completo",
        date: "2024-04-10",
        result: "Normal",
      },
      {
        id: uuidv4(),
        name: "Raio-X Tórax",
        date: "2024-03-15",
        result: "Sem alterações",
      },
    ],
    appointments: [
      {
        id: uuidv4(),
        date: "2024-05-20",
        time: "09:00",
        doctorId: "1",
        doctorName: "Dr. Ana Beatriz Santos",
        type: "Consulta",
        status: "confirmed",
      },
    ],
  },
  {
    id: "2",
    full_name: "João Santos Lima",
    cpf: "234.567.890-12",
    birth_date: "1975-08-22",
    gender: "male",
    email: "joao.santos@email.com",
    phone: "+55 47 97777-6666",
    address: "Rua Paraguai, 1000 - Blumenau/SC",
    created_at: "2024-01-16T14:30:00Z",
    updated_at: "2024-01-16T14:30:00Z",
    medications: [],
    allergies: ["Penicilina"],
    chronic_conditions: ["Diabetes"],
    exams: [
      {
        id: uuidv4(),
        name: "Ultrassonografia Abdominal",
        date: "2024-02-20",
        result: "Normal",
      },
    ],
    appointments: [
      {
        id: uuidv4(),
        date: "2024-05-30",
        time: "15:45",
        doctorId: "5",
        doctorName: "Dr. Ricardo Mendes",
        type: "Telemedicina",
        status: "confirmed",
      },
    ],
  },
  {
    id: "3",
    full_name: "Ana Paula Costa",
    cpf: "345.678.901-23",
    birth_date: "1990-03-10",
    gender: "female",
    email: "ana.costa@email.com",
    phone: "+55 47 96666-5555",
    address: "Rua Itajaí, 500 - Blumenau/SC",
    created_at: "2024-01-17T09:15:00Z",
    updated_at: "2024-01-17T09:15:00Z",
    medications: [],
    allergies: [],
    chronic_conditions: [],
    exams: [],
    appointments: [
      {
        id: uuidv4(),
        date: "2024-05-25",
        time: "11:30",
        doctorId: "1",
        doctorName: "Dr. Ana Beatriz Santos",
        type: "Telemedicina",
        status: "pending",
      },
    ],
  },
  {
    id: "4",
    full_name: "Carlos Eduardo Pereira",
    cpf: "456.789.012-34",
    birth_date: "1982-11-30",
    gender: "male",
    email: "carlos.pereira@email.com",
    phone: "+55 47 95555-4444",
    address: "Rua São Paulo, 200 - Blumenau/SC",
    created_at: "2024-01-18T16:45:00Z",
    updated_at: "2024-01-18T16:45:00Z",
    medications: [
      { name: "AAS", dosage: "100mg" },
      { name: "Losartana", dosage: "50mg" },
    ],
    allergies: ["Lactose"],
    chronic_conditions: ["Asma"],
    exams: [
      {
        id: uuidv4(),
        name: "Eletrocardiograma",
        date: "2024-03-01",
        result: "Normal",
      },
    ],
    appointments: [
      {
        id: uuidv4(),
        date: "2024-06-05",
        time: "14:00",
        doctorId: "4",
        doctorName: "Dr. Paula Rodrigues",
        type: "Consulta",
        status: "confirmed",
      },
    ],
  },
  {
    id: "5",
    full_name: "Beatriz Lima Santos",
    cpf: "567.890.123-45",
    birth_date: "1988-07-25",
    gender: "female",
    email: "beatriz.lima@email.com",
    phone: "+55 47 94444-3333",
    address: "Alameda Rio Branco, 750 - Blumenau/SC",
    created_at: "2024-01-19T11:20:00Z",
    updated_at: "2024-01-19T11:20:00Z",
    medications: [],
    allergies: [],
    chronic_conditions: [],
    exams: [],
    appointments: [
      {
        id: uuidv4(),
        date: "2024-06-15",
        time: "14:00",
        doctorId: "2",
        doctorName: "Dr. Carlos Eduardo Silva",
        type: "Telemedicina",
        status: "pending",
      },
    ],
  },
  {
    id: "6",
    full_name: "Arthur Oliveira",
    cpf: "456.789.012-34",
    birth_date: "1992-10-06",
    gender: "male",
    email: "arthur.oliveira@email.com",
    phone: "+55 47 945425-4432",
    address: "Rua Progresso, 200 - Blumenau/SC",
    created_at: "2024-01-18T16:45:00Z",
    updated_at: "2024-01-18T16:45:00Z",
    medications: [{ name: "Fluoxetina", dosage: "50mg" }],
    allergies: ["Glúten"],
    chronic_conditions: [],
    exams: [],
    appointments: [
      {
        id: uuidv4(),
        date: "2024-07-20",
        time: "10:30",
        doctorId: "3",
        doctorName: "Dr. Ricardo Mendes",
        type: "Exame",
        status: "confirmed",
      },
    ],
  },
];

export const mockStaff: Staff[] = [
  {
    id: "1",
    full_name: "Dr. Ana Beatriz Santos",
    registration_number: "52364-SC",
    role: "doctor",
    email: "dra.ana@vidaplus.com",
    phone: "+55 47 98765-4321",
    specialization: "Clínica Geral",
    available_schedule: [],
    avatar:
      "https://images.pexels.com/photos/5214959/pexels-photo-5214959.jpeg?auto=compress&cs=tinysrgb&w=150",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    full_name: "Dr. Carlos Eduardo Silva",
    registration_number: "65478-SC",
    role: "doctor",
    email: "dr.carlos@vidaplus.com",
    phone: "+55 47 98765-4322",
    specialization: "Cardiologia",
    available_schedule: [],
    avatar:
      "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150",
    created_at: "2024-01-16T14:30:00Z",
    updated_at: "2024-01-16T14:30:00Z",
  },
  {
    id: "3",
    full_name: "Enfª. Maria Silva",
    registration_number: "COREN-SC 123456",
    role: "nurse",
    email: "enf.maria@vidaplus.com",
    phone: "+55 47 98765-4331",
    specialization: "Clínica Médica",
    available_schedule: [],
    avatar:
      "https://images.pexels.com/photos/1139315/pexels-photo-1139315.jpeg?auto=compress&cs=tinysrgb&w=150",
    created_at: "2024-01-17T09:15:00Z",
    updated_at: "2024-01-17T09:15:00Z",
  },
  {
    id: "4",
    full_name: "Téc. Roberto Alves",
    registration_number: "COREN-SC 987654",
    role: "technician",
    email: "tec.roberto@vidaplus.com",
    phone: "+55 47 98765-4336",
    specialization: "Radiologia",
    available_schedule: [],
    avatar:
      "https://images.pexels.com/photos/4270375/pexels-photo-4270375.jpeg?auto=compress&cs=tinysrgb&w=150",
    created_at: "2024-01-18T16:45:00Z",
    updated_at: "2024-01-18T16:45:00Z",
  },
  {
    id: "5",
    full_name: "Dr. Ricardo Mendes",
    registration_number: "65479-SC",
    role: "doctor",
    email: "dr.ricardo@vidaplus.com",
    phone: "+55 47 98765-4222",
    specialization: "Clínica Geral",
    available_schedule: [],
    avatar:
      "https://images.pexels.com/photos/32160037/pexels-photo-32160037/free-photo-of-confident-young-doctor-with-stethoscope-portrait.jpeg?auto=compress&cs=tinysrgb&w=150",
    created_at: "2024-01-18T16:45:00Z",
    updated_at: "2024-01-18T16:45:00Z",
  },
  {
    id: "6",
    full_name: "Dr. Paula Rodrigues",
    registration_number: "68843-SC",
    role: "doctor",
    email: "dr.paula@vidaplus.com",
    phone: "+55 47 98765-4222",
    specialization: "Reumatologia",
    available_schedule: [],
    avatar:
      "https://images.pexels.com/photos/5998474/pexels-photo-5998474.jpeg?auto=compress&cs=tinysrgb&w=150",
    created_at: "2024-01-18T16:45:00Z",
    updated_at: "2024-01-18T16:45:00Z",
  },
  {
    id: "7",
    full_name: "Dr. Melissa Andrade",
    registration_number: "68821-SC",
    role: "doctor",
    email: "dr.melissa@vidaplus.com",
    phone: "+55 47 98765-4222",
    specialization: "Psiquiatria",
    available_schedule: [],
    avatar:
      "https://images.pexels.com/photos/32160039/pexels-photo-32160039/free-photo-of-confident-female-doctor-in-clinic-setting.jpeg?auto=compress&cs=tinysrgb&w=150",
    created_at: "2024-01-18T16:45:00Z",
    updated_at: "2024-01-18T16:45:00Z",
  },
  {
    id: "8",
    full_name: "Téc. Joana Costa",
    registration_number: "COREN-SC 984454",
    role: "technician",
    email: "tec.joana@vidaplus.com",
    phone: "+55 47 98765-4336",
    specialization: "Radiologia",
    available_schedule: [],
    avatar:
      "https://images.pexels.com/photos/5207117/pexels-photo-5207117.jpeg?auto=compress&cs=tinysrgb&w=150",
    created_at: "2024-01-18T16:45:00Z",
    updated_at: "2024-01-18T16:45:00Z",
  },
];
