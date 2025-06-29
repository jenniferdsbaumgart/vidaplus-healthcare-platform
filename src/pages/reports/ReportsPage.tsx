import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import {
  Download,
  Users,
  Activity,
  TrendingUp,
  DollarSign,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { useEffect, useState } from "react";
import AppointmentsChart from "../../components/charts/AppointmentsChart";
import MedicalAreasChart from "../../components/charts/MedicalAreasChart";
import MedicalConsultationsChart from "../../components/charts/MedicalConsultationsChart";
import PatientSatisfactionChart from "../../components/charts/PatientSatisfactionChart";
import PatientWaitingTimeChart from "../../components/charts/PatientWaitingTimeChart";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const ReportsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);
  const [dateRange, setDateRange] = useState("month");

  const stats = [
    {
      title: "Total de Pacientes",
      value: "1,248",
      change: "+12.5%",
      trend: "up",
      icon: <Users className="h-6 w-6 text-primary-500" />,
    },
    {
      title: "Consultas Realizadas",
      value: "3,427",
      change: "+3.2%",
      trend: "up",
      icon: <Activity className="h-6 w-6 text-success-500" />,
    },
    {
      title: "Taxa de Ocupação",
      value: "85%",
      change: "+5.8%",
      trend: "up",
      icon: <AlertCircle className="h-6 w-6 text-error-500" />,
    },
    {
      title: "Receita Mensal",
      value: "R$ 125.400",
      change: "+8.3%",
      trend: "up",
      icon: <DollarSign className="h-6 w-6 text-warning-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
          <p className="text-gray-500">
            Análise de dados e métricas do sistema
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-40"
          >
            <option value="week">Última Semana</option>
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
            <option value="year">Último Ano</option>
          </Select>

          <Button variant="outline" leftIcon={<Download className="h-4 w-4" />}>
            Exportar Dados
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
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
                <TrendingUp
                  className={`h-4 w-4 ${
                    stat.trend === "up" ? "text-success-500" : "text-error-500"
                  } mr-1`}
                />
                <span
                  className={`text-sm font-medium ${
                    stat.trend === "up" ? "text-success-600" : "text-error-600"
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Chart */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Volume de Consultas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80 w-full flex items-center justify-center">
              {/* <Bar data={appointmentsData} options={chartOptions} /> */}
              <AppointmentsChart />
            </div>
          </CardContent>
        </Card>

        {/* Specialties Distribution */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Distribuição por Especialidade</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80 w-full flex items-center justify-center">
              {/* <Pie data={specialtiesData} options={pieChartOptions} /> */}
              <MedicalAreasChart />
            </div>
          </CardContent>
        </Card>

        {/* Occupation */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Fluxo de Consultas Médicas Por Hora</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80 w-full flex items-center justify-center">
              <MedicalConsultationsChart />
            </div>
          </CardContent>
        </Card>

        {/* Patient Satisfaction */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Satisfação dos Pacientes</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80 w-full flex items-center justify-center">
              <PatientSatisfactionChart />
            </div>
          </CardContent>
        </Card>

        {/* Waiting Time */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Tempo Médio de Espera</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80 w-full flex items-center justify-center">
              <PatientWaitingTimeChart />
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Relatórios Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mt-2">
              {[
                {
                  title: "Relatório Mensal de Atendimentos",
                  date: "01/03/2024",
                  type: "PDF",
                  size: "2.4 MB",
                },
                {
                  title: "Análise de Satisfação Q1 2024",
                  date: "28/02/2024",
                  type: "XLSX",
                  size: "1.8 MB",
                },
                {
                  title: "Indicadores de Performance - Fevereiro",
                  date: "15/02/2024",
                  type: "PDF",
                  size: "3.1 MB",
                },
              ].map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <FileText className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {report.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Gerado em {report.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {report.type}
                      </p>
                      <p className="text-sm text-gray-500">{report.size}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Download className="h-4 w-4" />}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
