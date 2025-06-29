import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { getAppointments } from "../../services/appointmentService";
import { Check, Video } from "lucide-react";

type Appointment = {
  id: number;
  date: string;
  time: string;
  type: string;
  status: string;
  patient: {
    id: number;
    full_name: string;
  };
  doctor: {
    id: number;
    full_name: string;
  };
};

const statusColors: Record<string, string> = {
  Agendado: "bg-blue-100 text-blue-800",
  Concluído: "bg-green-100 text-green-800",
  Pendente: "bg-yellow-100 text-yellow-800",
  Cancelado: "bg-red-100 text-red-800",
};

const formatTime = (time: string) => {
  const [hour, minute] = time.split(":");
  return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
};

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getAppointments();
        setAppointments(data);
        setError(null);
      } catch (err) {
        console.error("Erro ao carregar consultas:", err);
        setError("Erro ao carregar consultas. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Todas as Consultas</h1>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-md border border-red-200 text-red-800">
          {error}
        </div>
      ) : (
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Consultas Agendadas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
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
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {new Date(appointment.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatTime(appointment.time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/patients/${appointment.patient.id}`}
                          className="text-teal-600 hover:text-teal-800 hover:underline text-sm font-medium"
                        >
                          {appointment.patient.full_name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {appointment.doctor.full_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                          <Video className="h-3 w-3 mr-1" />
                          {appointment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[appointment.status] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {appointment.status === "Concluído" ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Concluído
                            </>
                          ) : (
                            appointment.status
                          )}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentsPage;
