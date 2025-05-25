import { z } from 'zod';

export const patientSchema = z.object({
  full_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Selecione um gênero válido' }),
  }),
  email: z.string().email('E-mail inválido').optional().nullable(),
  phone: z.string().min(10, 'Telefone inválido').optional().nullable(),
  address: z.string().min(10, 'Endereço muito curto').optional().nullable(),
});