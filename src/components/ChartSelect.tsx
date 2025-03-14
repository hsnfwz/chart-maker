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
        className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white"
      >
        Bar Chart
      </button>
      <button type="button" onClick={() => console.log('click')} className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white">Line Chart</button>
      <button type="button" onClick={() => console.log('click')} className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white">Area Chart</button>
    </>
  );
}

export default ChartSelect;
