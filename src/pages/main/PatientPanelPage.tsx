import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import { Calendar, Stethoscope, ClipboardCheck, FileText, PlusCircle } from "lucide-react";
import { getPatientDetails } from "../../services/patientService";
import Button from "../../components/ui/Button";

const PatientPanelPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  interface PatientData {
    appointments?: { id: string; date: string; time: string; doctor?: { full_name: string } }[];
    prescriptions?: { id: string; medication: string; dosage: string }[];
    exams?: { id: string; name: string; result: string }[];
  }

  const [patientData, setPatientData] = useState<PatientData | null>(null);

  useEffect(() => {
    const loadPatient = async () => {
      try {
        if (user?.id) {
          const data = await getPatientDetails(user.id);
          setPatientData(data);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do paciente:", err);
      }
    };

    loadPatient();
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const upcomingAppointments = patientData?.appointments?.filter(
    (a) => new Date(a.date) >= new Date()
  );

  const pastAppointments = patientData?.appointments?.filter(
    (a) => new Date(a.date) < new Date()
  );

  const prescriptions = patientData?.prescriptions || [];
  const exams = patientData?.exams || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.name}
          </h1>
          <p className="text-gray-500 mt-1">Bem-vindo ao seu painel VidaPlus</p>
        </div>

        <Button
          variant="primary"
          leftIcon={<PlusCircle className="h-5 w-5" />}
          onClick={() => navigate("/appointments/schedule")}
        >
          Agendar Consulta
        </Button>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-teal-600" />
              <div>
                <p className="text-sm text-gray-500">Consultas Agendadas</p>
                <p className="text-xl font-bold text-gray-900">
                  {upcomingAppointments?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Stethoscope className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Consultas Concluídas</p>
                <p className="text-xl font-bold text-gray-900">
                  {pastAppointments?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <ClipboardCheck className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-sm text-gray-500">Exames Pendentes</p>
                <p className="text-xl font-bold text-gray-900">
                  {exams?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximas consultas */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Próximas Consultas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {(upcomingAppointments ?? []).length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Médico</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(upcomingAppointments ?? []).map((a) => (
                    <tr key={a.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(a.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {a.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {a.doctor?.full_name || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-4 text-gray-500">Nenhuma consulta agendada.</p>
          )}
        </CardContent>
      </Card>

      {/* Prescrições recentes */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Minhas Prescrições</CardTitle>
        </CardHeader>
        <CardContent>
          {prescriptions.length > 0 ? (
            <ul className="space-y-2">
              {prescriptions.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.medication}</p>
                    <p className="text-xs text-gray-500">Dose: {p.dosage}</p>
                  </div>
                  <FileText className="h-5 w-5 text-gray-400" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhuma prescrição recente.</p>
          )}
        </CardContent>
      </Card>

      {/* Exames recentes */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Meus Exames</CardTitle>
        </CardHeader>
        <CardContent>
          {exams.length > 0 ? (
            <ul className="space-y-2">
              {exams.slice(0, 5).map((e) => (
                <li key={e.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{e.name}</p>
                    <p className="text-xs text-gray-500">Resultado: {e.result}</p>
                  </div>
                  <FileText className="h-5 w-5 text-gray-400" />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum exame recente.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientPanelPage;
