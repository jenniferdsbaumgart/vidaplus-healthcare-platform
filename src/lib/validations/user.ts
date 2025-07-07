import { z } from 'zod';

export const userSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres').optional(), // optional para updates
  avatar: z.string().url('URL do avatar inválida').nullable().optional(),
  role: z.enum(['admin', 'doctor', 'nurse', 'technician', 'patient'], {
    errorMap: () => ({ message: 'Selecione uma função válida' }),
  }),
  patientId: z.number().nullable().optional(),
  staffId: z.number().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;