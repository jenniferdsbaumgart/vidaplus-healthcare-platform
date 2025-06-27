import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import {
  Download,
  Users,
  Activity,
  TrendingUp,
  DollarSign,
  FileText,
  Filter,
} from 'lucide-react';
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
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { useState } from 'react';
import AppointmentsChart from '../../components/charts/AppointmentsChart';

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
  const [dateRange, setDateRange] = useState('month');
  // const [department, setDepartment] = useState('all');

  // Mock data for charts
  // const appointmentsData = {
  //   labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  //   datasets: [
  //     {
  //       label: 'Consultas Presenciais',
  //       data: [65, 59, 80, 81, 56, 55],
  //       backgroundColor: 'rgba(5, 42, 39, 0.8)',
  //     },
  //     {
  //       label: 'Teleconsultas',
  //       data: [28, 48, 40, 19, 86, 27],
  //       backgroundColor: 'rgba(6, 174, 158, 0.8)',
  //     },
  //   ],
  // };

  const specialtiesData = {
    labels: ['Clínica Geral', 'Pediatria', 'Cardiologia', 'Ortopedia', 'Ginecologia'],
    datasets: [
      {
        data: [300, 250, 200, 150, 100],
        backgroundColor: [
          'rgba(4, 207, 188, 0.8)',
          'rgba(6, 174, 158, 0.8)',
          'rgba(5, 42, 39, 0.8)',
          'rgba(28, 118, 110, 0.8)',
          'rgba(30, 110, 104, 0.8)',
        ],
      },
    ],
  };

  const patientSatisfactionData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Satisfação dos Pacientes',
        data: [95, 92, 96, 94, 97, 95],
        borderColor: 'rgba(6, 174, 158, 1)',
        backgroundColor: 'rgba(6, 174, 158, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const waitingTimeData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Tempo Médio de Espera (min)',
        data: [25, 20, 22, 18, 15, 17],
        borderColor: 'rgba(5, 42, 39, 0.8)',
        backgroundColor: 'rgba(5, 42, 39, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
    },
  };

  const stats = [
    {
      title: 'Total de Pacientes',
      value: '1,248',
      change: '+12.5%',
      trend: 'up',
      icon: <Users className="h-6 w-6 text-primary-500" />,
    },
    {
      title: 'Consultas Realizadas',
      value: '3,427',
      change: '+3.2%',
      trend: 'up',
      icon: <Activity className="h-6 w-6 text-success-500" />,
    },
    {
      title: 'Taxa de Ocupação',
      value: '85%',
      change: '+5.8%',
      trend: 'up',
      icon: <TrendingUp className="h-6 w-6 text-accent-500" />,
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 125.400',
      change: '+8.3%',
      trend: 'up',
      icon: <DollarSign className="h-6 w-6 text-warning-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>
          <p className="text-gray-500">Análise de dados e métricas do sistema</p>
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

          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
          >
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
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full bg-gray-50">
                  {stat.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className={`h-4 w-4 ${
                  stat.trend === 'up' ? 'text-success-500' : 'text-error-500'
                } mr-1`} />
                <span className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-success-600' : 'text-error-600'
                }`}>
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
            <div className="h-80">
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
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Filter className="h-4 w-4" />}
              >
                Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <Pie data={specialtiesData} options={pieChartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Patient Satisfaction */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Satisfação dos Pacientes</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Filter className="h-4 w-4" />}
              >
                Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <Line data={patientSatisfactionData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Waiting Time */}
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Tempo Médio de Espera</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Filter className="h-4 w-4" />}
              >
                Filtros
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <Line data={waitingTimeData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Relatórios Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mt-2">
            {[
              {
                title: 'Relatório Mensal de Atendimentos',
                date: '01/03/2024',
                type: 'PDF',
                size: '2.4 MB',
              },
              {
                title: 'Análise de Satisfação Q1 2024',
                date: '28/02/2024',
                type: 'XLSX',
                size: '1.8 MB',
              },
              {
                title: 'Indicadores de Performance - Fevereiro',
                date: '15/02/2024',
                type: 'PDF',
                size: '3.1 MB',
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
                    <p className="text-sm text-gray-500">
                      {report.size}
                    </p>
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
  );
};

export default ReportsPage;