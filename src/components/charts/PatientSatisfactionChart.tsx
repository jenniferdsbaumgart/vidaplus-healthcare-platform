import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { RadarChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([RadarChart, TooltipComponent, LegendComponent, CanvasRenderer]);

const PatientSatisfactionChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option = {
        legend: {
          data: ["Teleconsulta", "Presencial"],
          orient: "vertical",
          right: "5%",
          top: "center",
        },
        radar: {
          indicator: [
            { name: "Atendimento", max: 5 },
            { name: "Clareza", max: 5 },
            { name: "Tempo de Espera", max: 5 },
            { name: "Qualidade do Atendimento", max: 5 },
            { name: "Facilidade de Acesso", max: 5 },
            { name: "Satisfação Geral", max: 5 },
          ],
        },
        series: [
          {
            name: "Satisfação dos Pacientes",
            type: "radar",
            data: [
              {
                value: [4.8, 4.9, 3.8, 4.9, 4.7, 4.8], // Presencial
                name: "Presencial",
                itemStyle: {
                  color: "#083F3A",
                },
              },
              {
                value: [4.5, 4.1, 4.2, 4.8, 4.3, 4.7], // Teleconsulta
                name: "Teleconsulta",
                itemStyle: {
                  color: "#028175",
                },
              },
            ],
          },
        ],
      };

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: "800px", height: "350px" }} />;
};

export default PatientSatisfactionChart;
