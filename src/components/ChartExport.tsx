'use client';

import { Export } from "@/enums/chart";
import { useChartContext } from "@/hooks/context";

import html2canvas from "html2canvas";

function ChartExport() {
  const {
    chartRef,
  } = useChartContext();

  async function exportChart(option: Export) {
    const canvas = await html2canvas(chartRef.current);

    if (option === Export.PNG) {
      const url = canvas.toDataURL('image/png');
      const anchor = document.createElement('a');
      anchor.setAttribute('href', url);
      anchor.setAttribute('download', 'chart.png');
      anchor.click();
      anchor.remove();
    } else if (option === Export.JPEG) {
      const url = canvas.toDataURL('image/jpeg');
      const anchor = document.createElement('a');
      anchor.setAttribute('href', url);
      anchor.setAttribute('download', 'chart.jpeg');
      anchor.click();
      anchor.remove();
    }
  }

  return (
    <>
      <button type="button" onClick={async () => await exportChart(Export.PNG)} className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white">PNG</button>
      <button type="button" onClick={async () => await exportChart(Export.JPEG)} className="bg-neutral-200 rounded p-2 cursor-pointer hover:bg-black hover:text-white">JPEG</button>
    </>
  );
}

export default ChartExport;
