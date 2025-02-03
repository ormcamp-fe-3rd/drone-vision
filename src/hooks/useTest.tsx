import { Dataset } from "@/types/api";
import {
  getStatus,
  getAltitude,
  groupDataById,
  getSpeed,
} from "@/hooks/useChartsData";
import { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { DefaultSynchronisedChartsProps } from "@/components/log/charts/SynchronisedCharts";

interface useChartDataTransformProps {
  telemetryData: any;
  selectedOperationId: string[];
}

const useChartXData = (telemetryData: any, selectedOperationId: string[]) => {
  const [xData, setXData] = useState<number[]>([]);

  useEffect(() => {
    const droneStatus = getSpeed(telemetryData, selectedOperationId);

    const xAxisData = droneStatus.map((timeStamp) => timeStamp[3]);

    setXData(xAxisData);
  }, [telemetryData, selectedOperationId]);

  return xData;
};

const useSynchronisedChartsData = ({
  telemetryData,
  selectedOperationId,
}: useChartDataTransformProps) => {
  const [chartData, setChartData] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const droneSpeed = getSpeed(telemetryData, selectedOperationId);

        if (!droneSpeed.length) {
          return null;
        }

        const formattedAlt: Dataset = {
          name: "고도",
          type: "area",
          unit: droneSpeed.map((item) => item[0]),
          data: droneSpeed.map((item) => item[2]),
        };

        const formattedSpeed: Dataset = {
          name: "속도",
          type: "area",
          unit: droneSpeed.map((item) => item[0]),
          data: droneSpeed.map((item) => item[1]),
        };

        setChartData([formattedAlt, formattedSpeed]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [telemetryData, selectedOperationId]);
  return chartData;
};
// TODO: 컴포넌트 내 차트 옵션생성 로직 추출 목적
const createChartOptions = (
  dataset: Dataset,
  index: number,
  xData: number[],
) => {
  const data = dataset.data.map((val: number, i: number) => [
    xData[i],
    val,
    dataset.unit[i],
  ]);

  const groupData = groupDataById(data);

  const colours = Highcharts.getOptions().colors;
  const colour = colours && colours.length > index ? colours[index] : undefined;
  const maxYValue = Math.max(...dataset.data); // y축 최대값 계산
  const minYValue = Math.min(...dataset.data); // y축 최대값 계산

  const options = {
    chart: {
      zooming: {
        type: "x",
      },
      width: 700,
      height: 400,
    },
    title: {
      text: dataset.name,
    },
    xAxis: {
      crosshair: true,
      labels: {
        formatter: function () {
          return ((this as any).value / 10).toFixed(0) + " 초";
        },
      },
      events: {
        afterSetExtremes: function (event: Highcharts.ExtremesObject) {
          Highcharts.charts.forEach((chart) => {
            if (!chart) return null;
            chart.xAxis[0].setExtremes(event.min, event.max);
          });
        },
      },
    },
    yAxis: {
      title: {
        // text: dataset.unit,
        text: " ",
      },
      min: minYValue,
      max: maxYValue,
    },
    plotOptions: {
      series: {
        animation: {
          duration: 2500,
        },
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 616,
          },
          chartOptions: {
            legend: {
              enabled: true,
            },
          },
        },
      ],
    },

    // 데이터가 차트로 변환 되는 부분 data: data는 데이터값, 나머지 부분은 수정 불필요
    series: [
      // 첫 번째 라인: dataset1
      {
        name: `${dataset.name} 1`,
        type: dataset.type,
        step: true,
        data: groupData["677730f8e8f8dd840dd35153"], // 첫 번째 유닛 데이터만 사용
        color: colour,
        turboThreshold: 5000,
      },
      // 두 번째 라인: dataset2
      {
        name: `${dataset.name} 2`,
        type: dataset.type,
        step: true,
        data: groupData["6777325ae8f8dd840dd35163"], // 두 번째 유닛 데이터만 사용
        color: "red",
        turboThreshold: 5000,
      },
      // 세 번째 라인 : dataset3
      {
        name: `${dataset.name} 3`,
        type: dataset.type,
        step: true,
        data: groupData["677745dee8f8dd840dd35186"], // 세 번째 유닛 데이터만 사용
        color: "green",
        turboThreshold: 5000,
      },
    ],
    tooltip: {
      valueSuffix: ` ${dataset.name}`,
    },
  };

  return options;
};

const renderChart = (dataset: Dataset, index: number, xData: number[]) => {
  const options = createChartOptions(dataset, index, xData);
  if (!options) return null;
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      key={dataset.name}
    />
  );
};

export { useSynchronisedChartsData, renderChart, useChartXData };
