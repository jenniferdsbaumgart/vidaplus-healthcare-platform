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
import { Bar, Line } from 'react-chartjs-2';

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

export const TendenciaTemporalChart = () => {
  const data = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        label: 'Consultas',
        data: [65, 59, 80, 81, 56, 55],
        fill: true,
        borderColor: '#06AE9E',
        backgroundColor: 'rgba(6, 174, 158, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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

  return (
    <div className="h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
};

export const ComparacaoCategoriaChart = () => {
  const data = {
    labels: ['Clínica Geral', 'Reumatologia', 'Cardiologia', 'Psiquiatria', 'Ginecologia'],
    datasets: [
      {
        data: [300, 220, 140, 260, 100],
        backgroundColor: [
          'rgba(6, 174, 158, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 400,
      }
    }
  };

  return (
    <div className="h-[300px]">
      <Bar data={data} options={options} />
    </div>
  );
};