import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Calendar, TestTube, ClipboardCheck } from "lucide-react";
import { getAppointments } from "../../services/appointmentService";

const StaffPanelPage = () => {
  const { user } = useAuth();
  interface Appointment {
    id: string;
    time: string;
    patientName: string;
    patientId: string;
    doctorName: string;
    doctorId: string;
    type: string;
    status: string;
  }

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await getAppointments();

        type RawAppointment = {
          id: string;
          time: string;
          patient?: { id: string; full_name: string };
          doctor?: { id: string; full_name: string };
          doctor_id?: number | string;
          type: string;
          status: string;
          date: string;
        };

        let allAppointments = data.map((appointment: RawAppointment) => ({
          id: appointment.id,
          time: appointment.time,
          patientName: appointment.patient?.full_name || "Desconhecido",
          patientId: appointment.patient?.id,
          doctorName: appointment.doctor?.full_name || "Desconhecido",
          doctorId: appointment.doctor_id || appointment.doctor?.id,
          type: appointment.type,
          status: appointment.status,
          date: appointment.date,
        }));

        // 🔍 Filtro por staffId se for doctor
        if (user?.role === "doctor" && user?.staffId) {
            allAppointments = allAppointments.filter(
            (a: Appointment) => Number(a.doctorId) === Number(user.staffId)
            );
        }

        setAppointments(allAppointments);
      } catch (err) {
        console.error("Erro ao carregar consultas:", err);
      }
    };

    loadAppointments();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {getGreeting()}, {user?.name}
        </h1>
        <p className="text-gray-500 mt-1">
          Bem-vindo ao seu painel de {user?.role}
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-teal-600" />
              <div>
                <p className="text-sm text-gray-500">Consultas Hoje</p>
                <p className="text-xl font-bold text-gray-900">
                  {appointments.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {user?.role !== "doctor" && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <TestTube className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Exames Pendentes</p>
                  <p className="text-xl font-bold text-gray-900">12</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user?.role === "nurse" && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <ClipboardCheck className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-sm text-gray-500">Tarefas Pendentes</p>
                  <p className="text-xl font-bold text-gray-900">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabela de consultas */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>
            Consultas {user?.role === "doctor" ? "Minhas" : "do Dia"}
          </CardTitle>
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
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {a.time || "09:00"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/patients/${a.patientId}`}
                        className="text-teal-600 hover:underline"
                      >
                        {a.patientName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {a.doctorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {a.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {a.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffPanelPage;
