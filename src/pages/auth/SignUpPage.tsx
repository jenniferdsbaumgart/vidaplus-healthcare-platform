import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  Mail,
  Lock,
  User,
  UserCircle,
  Calendar,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";

type SignUpFormData = {
  userType: "patient" | "staff";
  // Paciente
  full_name: string;
  cpf: string;
  birth_date: string;
  gender: string;
  phone?: string;
  address?: string;
  email: string;
  password: string;
  // Profissional
  registration_number: string;
  specialization: string;
  staff_full_name: string;
  staff_birth_date: string;
  staff_gender: string;
  staff_phone?: string;
  staff_address?: string;
  role: string;
};

const validateCPF = (cpf: string) => /^\d{11}$/.test(cpf.replace(/\D/g, ""));

const SignUpPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormData>({
    defaultValues: {
      userType: "patient",
      full_name: "",
      cpf: "",
      birth_date: "",
      gender: "",
      phone: "",
      address: "",
      email: "",
      password: "",
      registration_number: "",
      specialization: "",
      staff_full_name: "",
      staff_birth_date: "",
      staff_gender: "",
      staff_phone: "",
      staff_address: "",
      role: "",
    },
  });

  const userType = watch("userType");

  const onSubmit = async (data: SignUpFormData) => {
    setError(null);

    // Validações extras
    if (!data.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      setError("E-mail inválido.");
      return;
    }
    if (data.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (data.userType === "patient") {
      if (!validateCPF(data.cpf)) {
        setError("CPF deve conter 11 dígitos numéricos.");
        return;
      }
      if (!data.full_name.trim()) {
        setError("Nome completo é obrigatório.");
        return;
      }
      if (!data.birth_date) {
        setError("Data de nascimento é obrigatória.");
        return;
      }
      if (!data.gender) {
        setError("Gênero é obrigatório.");
        return;
      }
    }

    if (data.userType === "staff") {
      if (!data.staff_full_name.trim()) {
        setError("Nome completo é obrigatório.");
        return;
      }
      if (!data.staff_birth_date) {
        setError("Data de nascimento é obrigatória.");
        return;
      }
      if (!data.staff_gender) {
        setError("Gênero é obrigatório.");
        return;
      }
      if (!data.registration_number.trim()) {
        setError("Número de registro é obrigatório.");
        return;
      }
      if (!data.role.trim()) {
        setError("Função é obrigatória.");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userType: data.userType,
          full_name:
            data.userType === "patient" ? data.full_name : data.staff_full_name,
          cpf: data.cpf,
          birth_date:
            data.userType === "patient"
              ? data.birth_date
              : data.staff_birth_date,
          gender: data.userType === "patient" ? data.gender : data.staff_gender,
          phone: data.userType === "patient" ? data.phone : data.staff_phone,
          address:
            data.userType === "patient" ? data.address : data.staff_address,
          email: data.email,
          password: data.password,
          registration_number: data.registration_number,
          specialization: data.specialization,
          role: data.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro no cadastro.");
      }

      navigate("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Falha no cadastro. Tente novamente.");
      } else {
        setError("Falha no cadastro. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and app name */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/vidaplus-logo-name.png" alt="Logo VidaPlus" />
          </div>
          <p className="text-gray-600 mt-1">
            Sistema de Gestão Hospitalar e de Serviços de Saúde
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>
              Preencha os dados para se cadastrar
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-start">
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-1">
                  Tipo de Usuário
                </label>
                <select
                  className="w-full rounded border-2 border-secondary focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none py-2 px-3 text-sm text-neutral-dark"
                  {...register("userType")}
                >
                  <option value="patient">Paciente</option>
                  <option value="staff">Profissional</option>
                </select>
              </div>

              {userType === "patient" && (
                <>
                  <Input
                    label="Nome Completo"
                    leftIcon={<User className="h-5 w-5" />}
                    error={errors.full_name?.message}
                    {...register("full_name", {
                      required: "Nome completo é obrigatório",
                    })}
                    fullWidth
                  />
                  <Input
                    label="CPF"
                    placeholder="00000000000"
                    leftIcon={<UserCircle className="h-5 w-5" />}
                    error={errors.cpf?.message}
                    {...register("cpf", { required: "CPF é obrigatório" })}
                    fullWidth
                  />
                  <Input
                    label="Data de Nascimento"
                    type="date"
                    leftIcon={<Calendar className="h-5 w-5" />}
                    error={errors.birth_date?.message}
                    {...register("birth_date", {
                      required: "Data de nascimento é obrigatória",
                    })}
                    fullWidth
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-1">
                      Gênero
                    </label>
                    <select
                      className="w-full rounded border-2 border-secondary focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none py-2 px-3 text-sm text-neutral-dark"
                      {...register("gender", {
                        required: "Gênero é obrigatório",
                      })}
                    >
                      <option value="">Selecione um gênero</option>
                      <option value="male">Masculino</option>
                      <option value="female">Feminino</option>
                      <option value="other">Outro</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-error">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
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
                  <Input
                    label="E-mail"
                    type="email"
                    leftIcon={<Mail className="h-5 w-5" />}
                    error={errors.email?.message}
                    {...register("email", { required: "E-mail é obrigatório" })}
                    fullWidth
                  />
                </>
              )}

              {userType === "staff" && (
                <>
                  <Input
                    label="Nome Completo"
                    leftIcon={<User className="h-5 w-5" />}
                    error={errors.staff_full_name?.message}
                    {...register("staff_full_name", {
                      required: "Nome completo é obrigatório",
                    })}
                    fullWidth
                  />
                  <Input
                    label="Data de Nascimento"
                    type="date"
                    leftIcon={<Calendar className="h-5 w-5" />}
                    error={errors.staff_birth_date?.message}
                    {...register("staff_birth_date", {
                      required: "Data de nascimento é obrigatória",
                    })}
                    fullWidth
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-1">
                      Gênero
                    </label>
                    <select
                      className="w-full rounded border-2 border-secondary focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none py-2 px-3 text-sm text-neutral-dark"
                      {...register("staff_gender", {
                        required: "Gênero é obrigatório",
                      })}
                    >
                      <option value="">Selecione um gênero</option>
                      <option value="male">Masculino</option>
                      <option value="female">Feminino</option>
                      <option value="other">Outro</option>
                    </select>
                    {errors.staff_gender && (
                      <p className="mt-1 text-sm text-error">
                        {errors.staff_gender.message}
                      </p>
                    )}
                  </div>
                  <Input
                    label="Telefone"
                    placeholder="(00) 00000-0000"
                    leftIcon={<Phone className="h-5 w-5" />}
                    error={errors.staff_phone?.message}
                    {...register("staff_phone")}
                    fullWidth
                  />
                  <Input
                    label="Endereço"
                    leftIcon={<MapPin className="h-5 w-5" />}
                    error={errors.staff_address?.message}
                    {...register("staff_address")}
                    fullWidth
                  />
                  <Input
                    label="Número de Registro (CRM/COREN)"
                    leftIcon={<UserCircle className="h-5 w-5" />}
                    error={errors.registration_number?.message}
                    {...register("registration_number", {
                      required: "Número de registro é obrigatório",
                    })}
                    fullWidth
                  />
                  <Input
                    label="Especialização"
                    leftIcon={<Briefcase className="h-5 w-5" />}
                    error={errors.specialization?.message}
                    {...register("specialization")}
                    fullWidth
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark mb-1">
                      Função
                    </label>
                    <select
                      className="w-full rounded border-2 border-secondary focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:outline-none py-2 px-3 text-sm text-neutral-dark"
                      {...register("role", {
                        required: "Função é obrigatória",
                      })}
                    >
                      <option value="">Selecione uma função</option>
                      <option value="doctor">Médico(a)</option>
                      <option value="nurse">Enfermeiro(a)</option>
                      <option value="technician">Técnico(a)</option>
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-sm text-error">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                  <Input
                    label="E-mail"
                    type="email"
                    leftIcon={<Mail className="h-5 w-5" />}
                    error={errors.email?.message}
                    {...register("email", { required: "E-mail é obrigatório" })}
                    fullWidth
                  />
                </>
              )}

              <Input
                label="Senha"
                type="password"
                leftIcon={<Lock className="h-5 w-5" />}
                error={errors.password?.message}
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter pelo menos 6 caracteres",
                  },
                })}
                fullWidth
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                fullWidth
              >
                Cadastrar
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate("/login")}
              >
                Já tem uma conta? Entrar
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
