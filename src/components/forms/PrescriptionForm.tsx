import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { prescriptionSchema } from '../../lib/validations/prescription';
import { createPrescription } from '../../lib/api/prescriptions';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Plus, Minus, FileText, Clock, AlertTriangle } from 'lucide-react';
import type { Prescription } from '../../lib/types/prescription';

interface PrescriptionFormProps {
  patientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PrescriptionForm = ({ patientId, onSuccess, onCancel }: PrescriptionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Prescription>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patient_id: patientId,
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      validity_days: 30,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications',
  });

  const onSubmit = async (data: Prescription) => {
    try {
      setIsSubmitting(true);
      await createPrescription(data);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating prescription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Nova Prescrição Médica</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">
                  Atenção ao Prescrever
                </h4>
                <ul className="mt-2 text-sm text-amber-700 space-y-1">
                  <li>• Verifique cuidadosamente as dosagens e interações</li>
                  <li>• Considere o histórico e alergias do paciente</li>
                  <li>• Forneça instruções claras de uso</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-4">Medicamentos</h3>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 border border-gray-200 rounded-lg space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">
                      Medicamento {index + 1}
                    </h4>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        leftIcon={<Minus className="h-4 w-4" />}
                      >
                        Remover
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Nome do Medicamento"
                      error={errors.medications?.[index]?.name?.message}
                      {...register(`medications.${index}.name`)}
                      fullWidth
                    />

                    <Input
                      label="Dosagem"
                      error={errors.medications?.[index]?.dosage?.message}
                      {...register(`medications.${index}.dosage`)}
                      fullWidth
                    />

                    <Input
                      label="Frequência"
                      error={errors.medications?.[index]?.frequency?.message}
                      {...register(`medications.${index}.frequency`)}
                      fullWidth
                    />

                    <Input
                      label="Duração do Tratamento"
                      error={errors.medications?.[index]?.duration?.message}
                      {...register(`medications.${index}.duration`)}
                      fullWidth
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instruções Específicas
                    </label>
                    <textarea
                      className="w-full rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 p-3 text-sm"
                      rows={2}
                      {...register(`medications.${index}.instructions`)}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => append({ name: '', dosage: '', frequency: '', duration: '', instructions: '' })}
                leftIcon={<Plus className="h-4 w-4" />}
                fullWidth
              >
                Adicionar Medicamento
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instruções Gerais e Observações
            </label>
            <textarea
              className="w-full rounded-lg border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 p-3 text-sm"
              rows={4}
              {...register('instructions')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validade da Receita (dias)
            </label>
            <Input
              type="number"
              min={1}
              max={90}
              leftIcon={<Clock className="h-4 w-4" />}
              error={errors.validity_days?.message}
              {...register('validity_days', { valueAsNumber: true })}
            />
            <p className="mt-1 text-sm text-gray-500">
              A receita será válida por até 90 dias após a emissão
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            leftIcon={<FileText className="h-4 w-4" />}
            isLoading={isSubmitting}
          >
            Emitir Prescrição
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default PrescriptionForm;