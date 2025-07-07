import { z } from 'zod';

export const staffSchema = z.object({
  full_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),

  registration_number: z.string().min(4, 'Número de registro inválido'),

  role: z.enum(['doctor', 'nurse', 'technician'], {
    errorMap: () => ({ message: 'Selecione uma função válida' }),
  }),

  email: z.string().email('E-mail inválido'),

  phone: z.string()
    .min(10, 'Telefone inválido')
    .optional()
    .nullable(),

  birth_date: z.string()
    .optional()
    .nullable(),

  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Selecione um gênero válido' }),
  }).optional().nullable(),

  specialization: z.string()
    .min(3, 'Especialização inválida')
    .optional()
    .nullable(),

  avatar: z.string()
    .url('URL do avatar inválida')
    .optional()
    .nullable(),

  address: z.string()
    .min(3, 'Endereço inválido')
    .optional()
    .nullable(),

  available_schedule: z.array(z.object({
    day: z.number().min(0).max(6),
    start: z.string(),
    end: z.string(),
  })).optional().nullable(),
});

export type StaffFormData = z.infer<typeof staffSchema>;
