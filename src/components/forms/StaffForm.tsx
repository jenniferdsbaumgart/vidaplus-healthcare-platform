import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { staffSchema } from '../../lib/validations/staff';
import { createStaff } from '../../services/staffService';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { User, Phone, Mail, Stethoscope, UserCircle } from 'lucide-react';
import type { Database } from '../../lib/types/supabase';

type StaffFormData = Database['public']['Tables']['staff']['Insert'];

interface StaffFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StaffForm = ({ onSuccess, onCancel }: StaffFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
    },
  });

  const onSubmit = async (data: StaffFormData) => {
    try {
      const mappedData = {
        ...data,
        available_schedule: (data.available_schedule || []).map((item) => ({
          date: '',
          start_time: item.start || '',
          end_time: item.end || '',
          day: item.day,
        })),
      };
      await createStaff(mappedData as never);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error creating staff member:', error);
      if (error instanceof Error) {
        setError('root', { message: error.message });
      }
    }
  };

  return (
    <Card className='w-[800px]'>
      <CardHeader>
        <CardTitle>Cadastrar Novo Profissional</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {errors.root && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-800">{errors.root.message}</p>
            </div>
          )}
          
          <Input
            label="Nome Completo"
            leftIcon={<User className="h-5 w-5" />}
            error={errors.full_name?.message}
            {...register('full_name')}
            fullWidth
          />
          
          <Input
            label="Número de Registro (CRM/COREN)"
            leftIcon={<UserCircle className="h-5 w-5" />}
            error={errors.registration_number?.message}
            {...register('registration_number')}
            fullWidth
          />
          
          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Função
            </label>
            <select
              className="w-full rounded border-2 border-secondary focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none py-2 px-3 text-sm text-neutral-dark"
              {...register('role')}
            >
              <option value="">Selecione uma função</option>
              <option value="doctor">Médico(a)</option>
              <option value="nurse">Enfermeiro(a)</option>
              <option value="technician">Técnico(a)</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-error">{errors.role.message}</p>
            )}
          </div>
          
          <Input
            label="E-mail"
            type="email"
            leftIcon={<Mail className="h-5 w-5" />}
            error={errors.email?.message}
            {...register('email')}
            fullWidth
          />
          
          <Input
            label="Telefone"
            placeholder="(00) 00000-0000"
            leftIcon={<Phone className="h-5 w-5" />}
            error={errors.phone?.message}
            {...register('phone')}
            fullWidth
          />
          
          <Input
            label="Especialização"
            leftIcon={<Stethoscope className="h-5 w-5" />}
            error={errors.specialization?.message}
            {...register('specialization')}
            fullWidth
          />
          
          <div className="border-2 border-secondary/20 rounded p-4">
            <h4 className="text-sm font-heading font-medium text-neutral-dark mb-2">
              Horários Disponíveis
            </h4>
            <p className="text-sm text-secondary">
              Configure os horários de atendimento no painel de agenda após o cadastro.
            </p>
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
            variant="accent"
            isLoading={isSubmitting}
          >
            Cadastrar Profissional
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StaffForm;