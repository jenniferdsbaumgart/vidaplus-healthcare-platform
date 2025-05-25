import { z } from 'zod';

export const staffSchema = z.object({
  full_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  registration_number: z.string().min(4, 'Número de registro inválido'),
  role: z.enum(['doctor', 'nurse', 'technician'], {
    errorMap: () => ({ message: 'Selecione uma função válida' }),
  }),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido').optional().nullable(),
  specialization: z.string().min(3, 'Especialização inválida'),
  available_schedule: z.array(z.object({
    day: z.number().min(0).max(6),
    start: z.string(),
    end: z.string(),
  })),
});