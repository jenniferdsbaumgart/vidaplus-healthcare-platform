import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { HeatmapChart } from "echarts/charts";
import { TooltipComponent, VisualMapComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([HeatmapChart, TooltipComponent, VisualMapComponent, CanvasRenderer]);

const MedicalConsultationsChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      // Horários para os dias úteis (7h - 19h)
      const hoursWeekdays = [
        '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
      ];

      // Horários para sábado (7h - 13h)
      const hoursSaturday = [
        '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00'
      ];

      // Dias da semana
      const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

      // Gerar dados aleatórios para número de consultas por hora e por dia
      const generateRandomData = () => {
        const data: [number, number, number][] = [];

        // Segunda a sexta (7h - 19h)
        for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
          for (let hourIndex = 0; hourIndex < hoursWeekdays.length; hourIndex++) {
            data.push([hourIndex, dayIndex, Math.floor(Math.random() * 10)]);
          }
        }

        // Sábado (7h - 13h com dados, depois 0)
        for (let hourIndex = 0; hourIndex < hoursWeekdays.length; hourIndex++) {
          if (hourIndex < hoursSaturday.length) {
            data.push([hourIndex, 5, Math.floor(Math.random() * 10)]);
          } else {
            data.push([hourIndex, 5, 0]);
          }
        }

        return data;
      };

      const data = generateRandomData();

      const option = {
        tooltip: {
          position: 'top',
        },
        grid: {
          height: '50%',
          top: '15%',
        },
        xAxis: {
          type: 'category',
          // Separando os dados de horas de segunda a sexta e sábado, e garantindo que fiquem ordenados
          data: hoursWeekdays, // Combine os horários de segunda a sexta e sábado
          splitArea: {
            show: true,
          },
          axisLabel: {
            interval: 1, // Garante que os rótulos das horas apareçam corretamente
          }
        },
        yAxis: {
          type: 'category',
          data: days.reverse(), // Reverte a ordem dos dias para ter segunda no topo
          splitArea: {
            show: true,
          },
        },
        visualMap: {
          min: 0,
          max: 10,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%',
          inRange: {
            color: [
              "#A0D8D5", // Cor clara
              "#6DB5B0", // Cor suave
              "#4A8884", // Cor saturada
              "#028175", // Turquesa
              "#0A4641", // Turquesa escuro
            ]
          }
        },
        series: [
          {
            name: 'Consultas por Hora',
            type: 'heatmap',
            data: data,
            label: {
              show: true,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: "800px", height: "460px" }} />;
};

export default MedicalConsultationsChart;
