'use client';

import { useChartContext } from "@/hooks/context";
import BarChart from "./BarChart";
import { Chart } from "@/enums/chart";
import LineChart from "./LineChart";
import AreaChart from "./AreaChart";

function ChartView() {
  const { chart } = useChartContext();

  return (
    <>
      {chart === Chart.Bar && (
        <BarChart />
      )}
      {chart === Chart.Line && (
        <LineChart />
      )}
      {chart === Chart.Area && (
        <AreaChart />
      )}
    </>
  );
}

export default ChartView;
