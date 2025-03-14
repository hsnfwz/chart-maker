'use client';

import { Chart } from "@/enums/chart";
import { useChartContext } from "@/hooks/context";

function ChartSelect() {
  const {
    chart,
    setChart,
  } = useChartContext();

  return (
    <>
      <button
        type="button"
        onClick={() => setChart(Chart.Bar)}
      >

      </button>
    </>
  );
}

export default ChartSelect;
