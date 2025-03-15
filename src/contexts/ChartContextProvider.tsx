'use client';

import { Chart } from '@/enums/chart';
import { createContext, useState, Dispatch, SetStateAction , useRef , RefObject } from 'react';

const ChartContext = createContext<{
  chartRef: any,
  rerenderChart: boolean,
  labelX: string,
  labelY: string[],
  dataX: (number|string)[],
  dataY: number[],
  chart: Chart,
  color: string,
  setRerenderChart: Dispatch<SetStateAction<boolean>>
  setLabelX: Dispatch<SetStateAction<string>>
  setLabelY: Dispatch<SetStateAction<string[]>>
  setDataX: Dispatch<SetStateAction<(number|string)[]>>
  setDataY: Dispatch<SetStateAction<number[]>>
  setChart: Dispatch<SetStateAction<Chart>>
  setColor: Dispatch<SetStateAction<string>>
} | null>(null);

function ChartContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const chartRef = useRef<any>(null);
  const [rerenderChart, setRerenderChart] = useState<boolean>(false);

  const [labelX, setLabelX] = useState('X-Axis');
  const [labelY, setLabelY] = useState(['Y1', 'Y2', 'Y3']);
  const [dataX, setDataX] = useState<(number|string)[]>(['X1', 'X2', 'X3']);
  const [dataY, setDataY] = useState<(number[])>([10, 20, 30, 40, 50, 60, 70, 80, 90]);

  const [chart, setChart] = useState<Chart>(Chart.Bar);
  const [color, setColor] = useState<string>('');

  return (
    <ChartContext.Provider value={{
      chartRef,
      rerenderChart,
      labelX,
      labelY,
      dataX,
      dataY,
      chart,
      color,
      setRerenderChart,
      setLabelX,
      setLabelY,
      setDataX,
      setDataY,
      setChart,
      setColor,
    }}>
      {children}
    </ChartContext.Provider>
  );
}

export {
  ChartContext,
  ChartContextProvider,
};
