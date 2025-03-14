'use client';

import { useChartContext } from "@/hooks/context";
import BarChart from "./BarChart";
import { Chart } from "@/enums/chart";

function ChartView() {
  const { chart } = useChartContext();

  return (
    <>
      {chart === Chart.Bar && (
        <BarChart />
      )}
    </>
  );
}

export default ChartView;
