import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { GaugeChart, GaugeSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([GaugeChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<GaugeSeriesOption>;

interface OccupationGaugeProps {
  value?: number;
  label?: string;
}

const OccupationChart: React.FC<OccupationGaugeProps> = ({
  value = 0.85,
  label = "Muito Alta",
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option: EChartsOption = {
        series: [
          {
            type: "gauge",
            startAngle: 180,
            endAngle: 0,
            center: ["50%", "75%"],
            radius: "90%",
            min: 0,
            max: 1,
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 6,
                color: [
                  [0.25, "#06AE9E"],
                  [0.5, "#028175"],
                  [0.75, "#C7A037"],
                  [1, "#C73743"],
                ],
              },
            },
            pointer: {
              icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
              length: "12%",
              width: 20,
              offsetCenter: [0, "-60%"],
              itemStyle: {
                color: "auto",
              },
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: "auto",
                width: 2,
              },
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: "auto",
                width: 5,
              },
            },
            axisLabel: {
              color: "#464646",
              fontSize: 20,
              distance: -60,
              rotate: "tangential",
              formatter: function (val: number) {
                if (val === 0.875) return "Muito Alta";
                if (val === 0.625) return "Alta";
                if (val === 0.375) return "Média";
                if (val === 0.125) return "Baixa";
                return "";
              },
            },
            title: {
              offsetCenter: [0, "-10%"],
              fontSize: 20,
            },
            detail: {
              fontSize: 30,
              offsetCenter: [0, "-35%"],
              valueAnimation: true,
              formatter: function (val: number) {
                return Math.round(val * 100) + "%";
              },
              color: "inherit",
            },
            data: [
              {
                value,
                name: label,
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
  }, [value, label]);

  return (
    <div
      ref={chartRef}
      style={{ minWidth: "340px", width: "100%", height: "350px" }}
    />
  );
};

export default OccupationChart;