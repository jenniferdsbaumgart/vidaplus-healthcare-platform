import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientSchema } from "../../lib/validations/patient";
import { createPatient } from "../../services/patientService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/Card";
import { User, Phone, Mail, MapPin, Calendar, UserCircle } from "lucide-react";

type PatientFormData = {
  full_name: string;
  cpf: string;
  birth_date: string;
  gender: string;
  email?: string;
  phone?: string;
  address?: string;
};

interface PatientFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const mapFormDataToCreatePatientInput = (formData: PatientFormData) => {
  return {
    full_name: formData.full_name,
    cpf: formData.cpf,
    birth_date: new Date(formData.birth_date),
    gender: formData.gender,
    email: formData.email || undefined,
    phone: formData.phone || undefined,
    address: formData.address || undefined,
  };
};

const PatientForm = ({ onSuccess, onCancel }: PatientFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      const adaptedData = mapFormDataToCreatePatientInput(data);
      await createPatient(adaptedData);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating patient:", error);
      if (error instanceof Error) {
        setError("root", { message: error.message });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastrar Novo Paciente</CardTitle>
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
            {...register("full_name")}
            fullWidth
          />

          <Input
            label="CPF"
            placeholder="000.000.000-00"
            leftIcon={<UserCircle className="h-5 w-5" />}
            error={errors.cpf?.message}
            {...register("cpf")}
            fullWidth
          />

          <Input
            label="Data de Nascimento"
            type="date"
            leftIcon={<Calendar className="h-5 w-5" />}
            error={errors.birth_date?.message}
            {...register("birth_date")}
            fullWidth
          />

          <div>
            <label className="block text-sm font-medium text-neutral-dark mb-1">
              Gênero
            </label>
            <select
              className="w-full rounded border-2 border-secondary focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none py-2 px-3 text-sm text-neutral-dark"
              {...register("gender")}
            >
              <option value="">Selecione um gênero</option>
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
              <option value="other">Outro</option>
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-error">{errors.gender.message}</p>
            )}
          </div>

          <Input
            label="E-mail"
            type="email"
            leftIcon={<Mail className="h-5 w-5" />}
            error={errors.email?.message}
            {...register("email")}
            fullWidth
          />

          <Input
            label="Telefone"
            placeholder="(00) 00000-0000"
            leftIcon={<Phone className="h-5 w-5" />}
            error={errors.phone?.message}
            {...register("phone")}
            fullWidth
          />

          <Input
            label="Endereço"
            leftIcon={<MapPin className="h-5 w-5" />}
            error={errors.address?.message}
            {...register("address")}
            fullWidth
          />
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

          <Button type="submit" variant="accent" isLoading={isSubmitting}>
            Cadastrar Paciente
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PatientForm;
