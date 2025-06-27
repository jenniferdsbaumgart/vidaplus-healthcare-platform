import { useEffect, useRef, useMemo } from "react";
import * as echarts from "echarts/core";
import { ScatterChart } from "echarts/charts";
import { TooltipComponent, TitleComponent, SingleAxisComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { TitleComponentOption } from "echarts/components";  // Importando o tipo correto
import { SingleAxisComponentOption } from "echarts/components";  // Importando o tipo correto
import { ScatterSeriesOption } from "echarts/charts";  // Importando o tipo correto

echarts.use([ScatterChart, TooltipComponent, TitleComponent, SingleAxisComponent, CanvasRenderer]);

const PatientWaitingTimeChart: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  const hours = useMemo(
    () => [
      '7:00', '8:00', '9:00', '10:00', '11:00',
      '12:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00'
    ],
    []
  );

  const days = useMemo(
    () => [
      'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'
    ],
    []
  );

  const data: [number, number, number][] = useMemo(() => [
    [0, 0, 3], [0, 1, 1], [0, 2, 2], [0, 3, 2], [0, 4, 3], [0, 5, 4], [0, 6, 2], [0, 7, 3], [0, 8, 5], [0, 9, 5], [0, 10, 3], [0, 11, 2],
    [1, 0, 2], [1, 1, 1], [1, 2, 2], [1, 3, 2], [1, 4, 2], [1, 5, 3], [1, 6, 2], [1, 7, 2], [1, 8, 3], [1, 9, 4], [1, 10, 2], [1, 11, 1],
    [2, 0, 2], [2, 1, 1], [2, 2, 2], [2, 3, 2], [2, 4, 2], [2, 5, 3], [2, 6, 2], [2, 7, 2], [2, 8, 3], [2, 9, 4], [2, 10, 2], [2, 11, 1],
    [3, 0, 1], [3, 1, 1], [3, 2, 2], [3, 3, 2], [3, 4, 2], [3, 5, 3], [3, 6, 2], [3, 7, 2], [3, 8, 3], [3, 9, 4], [3, 10, 2], [3, 11, 1],
    [4, 0, 2], [4, 1, 1], [4, 2, 2], [4, 3, 2], [4, 4, 2], [4, 5, 3], [4, 6, 2], [4, 7, 2], [4, 8, 3], [4, 9, 4], [4, 10, 2], [4, 11, 1],
  ], []);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const title: TitleComponentOption[] = [];
      const singleAxis: SingleAxisComponentOption[] = [];
      const series: ScatterSeriesOption[] = [];

      days.forEach((day, idx) => {
        title.push({
          textBaseline: 'middle',
          top: `${(idx + 0.5) * 100 / 7 + 5}%`,
          text: day,
          textStyle: {
            fontSize: 13,
            color: '#333' 
          }
        });
        singleAxis.push({
          left: '150',
          type: 'category',
          boundaryGap: false,
          data: hours,
          top: `${(idx * 100) / 7 + 10}%`,
          height: `${100 / 7 - 10}%`,
          axisLabel: {
            interval: 2
          }
        });
        series.push({
          singleAxisIndex: idx,
          coordinateSystem: 'singleAxis',
          type: 'scatter',
          data: [],
          symbolSize: function (dataItem: [number, number, number]) {
            return dataItem[2] * 4; 
          },
          itemStyle: {
            color: function (params: { data: [number, number, number] }) {

              const dataArr = params.data as [number, number, number];
              const value = dataArr?.[2] ?? 0;
              if (value <= 2) {
                return '#00B7A4';
              } else if (value <= 4) {
                return '#028175';
              } else if (value <= 6) {
                return '#06AE9E';
              } else {
                return '#0A4641';
              }
            }
          }
        } as ScatterSeriesOption & { data: number[][] });
      });

      // Preenche os dados
      data.forEach((dataItem) => {
        (series[dataItem[0]].data as number[][]).push([dataItem[1], dataItem[0], dataItem[2]]);
      });

      const option = {
        tooltip: {
          position: 'top'
        },
        title: title,
        singleAxis: singleAxis,
        series: series
      };

      myChart.setOption(option);

      return () => {
        myChart.dispose();
      };
    }
  }, [data, days, hours]);

  return <div ref={chartRef} style={{ width: "650px", height: "400px" }} />;
};

export default PatientWaitingTimeChart;
