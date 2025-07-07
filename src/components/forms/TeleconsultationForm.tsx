import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { teleconsultationSchema } from '../../lib/validations/teleconsultation';
import { createTeleconsultation } from '../../services/telemedicineService';
import { getPatients } from '../../services/patientService';
import { getStaff } from '../../services/staffService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Input from '../ui/Input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../ui/Card';
import { Video } from 'lucide-react';

interface Patient {
  id: number;
  full_name: string;
}

interface Staff {
  id: number;
  full_name: string;
  specialization?: string;
  role: 'doctor' | 'nurse' | 'technician';
}

interface TeleconsultationFormData {
  patient_id: string;
  staff_id: string;
  scheduled_for: string;
  notes?: string;
}

interface TeleconsultationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TeleconsultationForm = ({ onSuccess, onCancel }: TeleconsultationFormProps) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<TeleconsultationFormData>({
    resolver: zodResolver(teleconsultationSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, staffData] = await Promise.all([
          getPatients(),
          getStaff(),
        ]);

        setPatients(patientsData);
        setStaff(staffData.filter((s: Staff) => s.role === 'doctor'));
        setLoadError(null);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoadError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: TeleconsultationFormData) => {
  if (!user || !user.patientId) {
    console.error("Usuário não possui patientId vinculado ou não está logado.");
    return;
  }

  try {
    await createTeleconsultation({
      patientId: user.patientId,
      doctorId: Number(data.staff_id),
      date: data.scheduled_for,
      notes: data.notes?.trim() || undefined,
    });
    reset();
    onSuccess?.();
  } catch (error) {
    console.error("Erro ao agendar teleconsulta:", error);
    if (error instanceof Error) {
      setError("root", { message: error.message });
    }
  }
};

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loadError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-error">
            <p>{loadError}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Tentar Novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Agendar Nova Teleconsulta</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {errors.root && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-800">{errors.root.message}</p>
            </div>
          )}

          {user?.role !== 'patient' && (
            <div>
              <label className="block text-sm font-medium text-neutral-dark mb-1">
                Paciente
              </label>
              <select
                className="w-full rounded border-2 border-secondary focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:outline-none py-2 px-3 text-sm text-neutral-dark"
                {...register('patient_id')}
              >
                <option value="">Selecione um paciente</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.full_name}
                  </option>
                ))}
              </select>
              {errors.patient_id && (
                <p className="mt-1 text-sm text-error">{errors.patient_id.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Médico
            </label>
            <select
              className="w-full rounded border-2 border-secondary focus:border-accent focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:outline-none py-2 px-3 text-sm text-neutral-dark"
              {...register('staff_id')}
            >
              <option value="">Selecione um médico</option>
              {staff.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.full_name} - {doctor.specialization}
                </option>
              ))}
            </select>
            {errors.staff_id && (
              <p className="mt-1 text-sm text-error">{errors.staff_id.message}</p>
            )}
          </div>

          <Input
            label="Data e Hora"
            type="datetime-local"
            error={errors.scheduled_for?.message}
            {...register('scheduled_for')}
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Observações
            </label>
            <textarea
              className="w-full rounded border-2 border-secondary focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none py-2 px-3 text-sm text-neutral-dark resize-none"
              rows={3}
              {...register('notes')}
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-error">{errors.notes.message}</p>
            )}
          </div>

          <div className="rounded bg-accent/5 border-2 border-accent/20 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Video className="h-5 w-5 text-accent" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-neutral-dark">
                  Informações da Teleconsulta
                </h3>
                <div className="mt-2 text-sm text-secondary">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>O link da videochamada será gerado automaticamente</li>
                    <li>Paciente e médico receberão instruções por e-mail</li>
                    <li>Certifique-se de que os dados de contato estão atualizados</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end space-x-4">
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
            isLoading={isSubmitting}
          >
            Agendar Teleconsulta
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TeleconsultationForm;
