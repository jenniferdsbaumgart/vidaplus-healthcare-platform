import { z } from 'zod';

export const teleconsultationSchema = z.object({
  patient_id: z.string().uuid('Selecione um paciente'),
  staff_id: z.string().uuid('Selecione um profissional'),
  scheduled_for: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Data/hora inválida'),
  notes: z.string().optional(),
});