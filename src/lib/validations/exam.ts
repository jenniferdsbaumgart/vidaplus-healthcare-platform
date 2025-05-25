import { z } from 'zod';

export const examSchema = z.object({
  patient_id: z.string(),
  exam_type: z.string().min(1, 'Tipo de exame é obrigatório'),
  urgency: z.enum(['low', 'medium', 'high']),
  reason: z.string().min(1, 'Motivo do exame é obrigatório'),
  scheduled_date: z.string().optional(),
  fasting_required: z.boolean(),
  special_instructions: z.string().optional(),
});

export type ExamFormData = z.infer<typeof examSchema>;