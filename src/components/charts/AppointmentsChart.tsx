import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { BarChart, BarSeriesOption } from "echarts/charts";
import { GridComponent, GridComponentOption } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([BarChart, GridComponent, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  BarSeriesOption | GridComponentOption
>;

const AppointmentsChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      // There should not be negative values in rawData
      const rawData = [
        [65, 59, 80, 81, 56, 55],
        [28, 48, 40, 19, 86, 27],
      ];
      const totalData: number[] = [];
      for (let i = 0; i < rawData[0].length; ++i) {
        let sum = 0;
        for (let j = 0; j < rawData.length; ++j) {
          sum += rawData[j][i];
        }
        totalData.push(sum);
      }

      const grid = {
        left: 100,
        right: 100,
        top: 50,
        bottom: 50,
      };

      const series: BarSeriesOption[] = ["Presencial", "Telemedicina"].map(
        (name, sid) => {
          return {
            name,
            type: "bar",
            stack: "total",
            barWidth: "60%",
            label: {
              show: true,
              formatter: (params) =>
                Math.round((params.value as number) * 1000) / 10 + "%",
            },
            data: rawData[sid].map((d, did) =>
              totalData[did] <= 0 ? 0 : d / totalData[did]
            ),
          };
        }
      );

      const option: EChartsOption = {
        legend: {
          selectedMode: false,
        },
        grid,
        yAxis: {
          type: "value",
        },
        xAxis: {
          type: "category",
          data: [
            "Clínica Geral",
            "Pediatria",
            "Cardiologia",
            "Ortopedia",
            "Ginecologia",
            "Outro",
          ],
        },
        series,
      };

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, []);

  return <div ref={chartRef} style={{ width: "600px", height: "400px" }} />;
};

export default AppointmentsChart;
