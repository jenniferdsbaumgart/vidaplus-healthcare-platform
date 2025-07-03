import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
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
import { Mail, Lock, AlertCircle } from "lucide-react";

type LoginFormData = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const [showCredentials, setShowCredentials] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    await login(data.email, data.password);
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
            <CardTitle>Login</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                  <span className="text-sm text-red-800">{error}</span>
                </div>
              )}

              <Input
                label="E-mail"
                type="email"
                leftIcon={<Mail className="h-5 w-5" />}
                fullWidth
                error={errors.email?.message}
                placeholder="seu.email@exemplo.com"
                {...register("email", {
                  required: "E-mail é obrigatório",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Formato de e-mail inválido",
                  },
                })}
              />

              <Input
                label="Senha"
                type="password"
                leftIcon={<Lock className="h-5 w-5" />}
                fullWidth
                error={errors.password?.message}
                placeholder="Sua senha"
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter pelo menos 6 caracteres",
                  },
                })}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Lembrar-me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
              </div>

              {/* Credentials help section */}
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <button
                  type="button"
                  className="text-sm text-blue-700 font-medium flex items-center justify-between w-full"
                  onClick={() => setShowCredentials(!showCredentials)}
                >
                  <span>Mostrar credenciais de demonstração</span>
                  <span className="text-xs">{showCredentials ? "▲" : "▼"}</span>
                </button>

                {showCredentials && (
                  <div className="mt-2 text-sm">
                    <p className="font-medium mb-1">Credenciais de Teste:</p>
                    <p>
                      <strong>Admin:</strong> admin@vidaplus.com / admin123
                    </p>
                    <p>
                      <strong>Médico:</strong> dr.ana@vidaplus.com / password123
                    </p>
                    <p>
                      <strong>Paciente:</strong> filomena@filomena.com / 123456
                    </p>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                fullWidth
              >
                Entrar
              </Button>
              <Button
              className="mt-2"
                type="button"
                variant="outline"
                fullWidth
                onClick={() => navigate("/signup")}
              >
                Cadastre-se
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
