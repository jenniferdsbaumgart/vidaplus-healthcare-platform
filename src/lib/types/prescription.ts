import { z } from 'zod';

export const medicationSchema = z.object({
  name: z.string().min(3, 'Nome do medicamento é obrigatório'),
  dosage: z.string().min(1, 'Dosagem é obrigatória'),
  frequency: z.string().min(1, 'Frequência é obrigatória'),
  duration: z.string().min(1, 'Duração é obrigatória'),
  instructions: z.string().optional(),
});

export const prescriptionSchema = z.object({
  patient_id: z.string().uuid('ID do paciente inválido'),
  medications: z.array(medicationSchema).min(1, 'Adicione pelo menos um medicamento'),
  instructions: z.string().optional(),
  validity_days: z.number().min(1).max(90),
});

export type Medication = z.infer<typeof medicationSchema>;
export type Prescription = z.infer<typeof prescriptionSchema>;