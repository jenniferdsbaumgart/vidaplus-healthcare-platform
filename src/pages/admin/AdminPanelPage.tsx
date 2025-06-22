// IMPORTS
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import {
  TendenciaTemporalChart,
  ComparacaoCategoriaChart,
} from "../../components/charts/DashboardCharts";
import {
  Users,
  Calendar,
  Bed,
  ShoppingCart,
  TrendingUp,
  AlertCircle,
  Check,
  Video,
} from "lucide-react";
import { getPatients } from "../../services/patientService";

// COMPONENT
const AdminPanelPage = () => {
  const { user } = useAuth();
  type Appointment = {
    id: string | number;
    date: string;
    time?: string;
    doctor?: { full_name?: string };
    type?: string;
    status?: string;
    // Removed index signature to fix type error
  };

  type AppointmentWithExtraInfo = {
  id: number | string;
  date: string;
  time: string;
  type: string;
  status: string;
  doctorName: string;
  patientName: string;
  patientId: number | string;
  doctorId?: number | string;
};

  type Patient = {
    id: string | number;
    full_name: string;
    appointments?: Appointment[];
    // Removed [key: string]: any; to avoid using 'any' type
  };

  const [upcomingAppointments, setUpcomingAppointments] = useState<AppointmentWithExtraInfo[]>([]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const patients: Patient[] = await getPatients();

        const appointments = patients.flatMap((patient: Patient) =>
          (patient.appointments || []).map((appointment: Appointment) => ({
            ...appointment,
            patientName: patient.full_name,
            patientId: patient.id,
            doctorName: appointment.doctor?.full_name || "Desconhecido",
            type: appointment.type || "Consulta",
            status: appointment.status || "pending",
            time: appointment.time || "09:00",
          }))
        );

        const sortedAppointments = appointments.sort((a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        setUpcomingAppointments(sortedAppointments.slice(0, 10));
      } catch (err) {
        console.error("Erro ao carregar consultas:", err);
      }
    };

    loadAppointments();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const statsData = [
    {
      title: "Pacientes",
      value: "1,248",
      change: "+12.5%",
      trend: "up",
      icon: <Users className="h-6 w-6 text-blue-500" />,
      link: "/patients",
    },
    {
      title: "Consultas Hoje",
      value: "42",
      change: "+3.2%",
      trend: "up",
      icon: <Calendar className="h-6 w-6 text-teal-500" />,
      link: "/appointments",
    },
    {
      title: "Leitos Ocupados",
      value: "32/40",
      change: "80%",
      trend: "neutral",
      icon: <Bed className="h-6 w-6 text-indigo-500" />,
      link: "/beds",
    },
    {
      title: "Inventário",
      value: "328",
      change: "-5.8%",
      trend: "down",
      icon: <ShoppingCart className="h-6 w-6 text-amber-500" />,
      link: "/inventory",
    },
  ];

  const urgentMatters = [
    {
      id: 1,
      title: "Medicamentos a vencer",
      description: "8 medicamentos vão expirar nos próximos 30 dias",
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
      link: "/inventory/expiring",
    },
    {
      id: 2,
      title: "Verificação de equipamentos",
      description: "3 equipamentos precisam de manutenção esta semana",
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
      link: "/equipment/maintenance",
    },
    {
      id: 3,
      title: "Renovações de convênios",
      description: "12 contratos de convênios para renovar este mês",
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
      link: "/insurance/renewal",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.name}
        </h1>
        <p className="text-gray-500 mt-1">
          Bem-vindo ao painel administrativo do Sistema de Gestão Hospitalar VidaPlus
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Link key={index} to={stat.link} className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-gray-50">{stat.icon}</div>
                </div>
                <div className="mt-4 flex items-center">
                  {stat.trend === "up" && (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  )}
                  {stat.trend === "down" && (
                    <TrendingUp className="h-4 w-4 text-red-500 mr-1 transform rotate-180" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Tabela + gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Consultas */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Próximas Consultas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Horário
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paciente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Médico
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {upcomingAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {appointment.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/patients/${appointment.patientId}`}
                            className="text-teal-600 hover:text-teal-800 hover:underline text-sm font-medium"
                          >
                            {appointment.patientName}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {appointment.doctorName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <Video className="h-3 w-3 mr-1" />
                            {appointment.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              appointment.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {appointment.status === "confirmed" ? (
                              <>
                                <Check className="h-3 w-3 mr-1" />
                                Confirmado
                              </>
                            ) : (
                              "Pendente"
                            )}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t">
                <Link
                  to="/appointments"
                  className="text-teal-600 hover:text-teal-800 hover:underline text-sm font-medium"
                >
                  Ver todas as consultas →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* GRÁFICOS */}
          {user?.role !== "doctor" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Tendência Temporal</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <TendenciaTemporalChart />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b">
                  <CardTitle>Consultas por Especialidade</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ComparacaoCategoriaChart />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* NECESSITA ATENÇÃO */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Necessita Atenção</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 py-2">
                {urgentMatters.map((item) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className="block p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">{item.icon}</div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
