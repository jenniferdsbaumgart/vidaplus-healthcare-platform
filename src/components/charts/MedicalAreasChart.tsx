import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { PieChart, PieSeriesOption } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<PieSeriesOption>;

const MedicalAreasChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option: EChartsOption = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        color: [
          "#00B7A4",
          "#028175",
          "#06AE9E",
          "#0A4641",
          "#4C9D98",
        ],
        series: [
          {
            name: "Especialidade",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 300, name: "Clínica Geral" },
              { value: 250, name: "Pediatria" },
              { value: 200, name: "Cardiologia" },
              { value: 150, name: "Ortopedia" },
              { value: 100, name: "Ginecologia" },
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

  return <div ref={chartRef} style={{ width: "600px", height: "400px" }} />;
};

export default MedicalAreasChart;