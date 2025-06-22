import { z } from 'zod';

export const appointmentSchema = z.object({
  patientId: z.number({
    required_error: 'Paciente é obrigatório',
    invalid_type_error: 'ID do paciente inválido',
  }),

  doctorId: z.number({
    required_error: 'Médico é obrigatório',
    invalid_type_error: 'ID do médico inválido',
  }),

  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Data deve estar no formato YYYY-MM-DD',
  }),

  time: z.string().regex(/^\d{2}:\d{2}$/, {
    message: 'Hora deve estar no formato HH:mm',
  }),

  type: z.enum(['Consulta', 'Exame', 'Telemedicina'], {
    errorMap: () => ({ message: 'Tipo de consulta inválido' }),
  }),

  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),

  notes: z.string().max(1000, 'As observações devem ter no máximo 1000 caracteres').optional().nullable(),
});
