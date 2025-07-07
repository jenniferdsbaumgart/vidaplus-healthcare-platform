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

      const hoursWeekdays = [
        '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
      ];
      const hoursSaturday = [
        '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00'
      ];

      const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

      const generateRandomData = () => {
        const data: [number, number, number][] = [];

        for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
          for (let hourIndex = 0; hourIndex < hoursWeekdays.length; hourIndex++) {
            data.push([hourIndex, dayIndex, Math.floor(Math.random() * 10)]);
          }
        }

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
          data: hoursWeekdays,
          splitArea: {
            show: true,
          },
          axisLabel: {
            interval: 1,
          }
        },
        yAxis: {
          type: 'category',
          data: days.reverse(),
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
              "#A0D8D5",
              "#6DB5B0",
              "#4A8884",
              "#028175",
              "#0A4641",
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
