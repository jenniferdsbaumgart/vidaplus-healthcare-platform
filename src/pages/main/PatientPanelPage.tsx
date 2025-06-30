import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import {
  Calendar,
  Stethoscope,
  ClipboardCheck,
  FileText,
  PlusCircle,
} from "lucide-react";
import { getPatientById } from "../../services/patientService";
import { getAppointments } from "../../services/appointmentService";
import Button from "../../components/ui/Button";

type Exam = {
  id: number;
  name: string;
  result: string;
};

const PatientPanelPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  type Appointment = {
    id: number;
    date: string;
    time: string;
    doctor_name?: string;
    patient_id: number;
  };
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  
  type Prescription = {
    id: number;
    medication: string;
    dosage: string;
  };
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

  useEffect(() => {
    const loadPatientData = async () => {
      try {
        if (user?.patientId) {
          const patientData = await getPatientById(user.patientId);

          setExams(patientData.exams || []);
          setPrescriptions(patientData.prescriptions || []);

          const allAppointments = await getAppointments();
          const filteredAppointments = allAppointments.filter(
            (a: Appointment) => Number(a.patient_id) === Number(user.patientId)
          );

          setAppointments(filteredAppointments);
        }
      } catch (err) {
        console.error("Erro ao carregar dados do paciente:", err);
      }
    };

    loadPatientData();
  }, [user]);

  const futureAppointments = appointments.filter(
    (a) => new Date(a.date) >= new Date()
  );
  const pastAppointments = appointments.filter(
    (a) => new Date(a.date) < new Date()
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.name}
          </h1>
          <p className="text-gray-500 mt-1">
            Bem-vindo ao seu painel VidaPlus
          </p>
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
                <p className="text-sm text-gray-500">Consultas Futuras</p>
                <p className="text-xl font-bold text-gray-900">
                  {futureAppointments.length}
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
                <p className="text-sm text-gray-500">Consultas Passadas</p>
                <p className="text-xl font-bold text-gray-900">
                  {pastAppointments.length}
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
                <p className="text-sm text-gray-500">Exames Realizados</p>
                <p className="text-xl font-bold text-gray-900">
                  {exams.length}
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
          {futureAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Médico
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {futureAppointments.map((a) => (
                    <tr key={a.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(a.date).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {a.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {a.doctor_name || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-4 text-gray-500">Nenhuma consulta futura.</p>
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
                    <p className="text-sm font-medium text-gray-900">
                      {p.medication}
                    </p>
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
                    <p className="text-sm font-medium text-gray-900">
                      {e.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Resultado: {e.result}
                    </p>
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
