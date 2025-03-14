'use client';

import { Chart } from '@/enums/chart';
import { createContext, useState, Dispatch, SetStateAction } from 'react';

const ChartContext = createContext<{
  dataX: (number|string)[],
  dataY: (number|string)[],
  chart: Chart,
  color: string,
  setDataX: Dispatch<SetStateAction<(number|string)[]>>
  setDataY: Dispatch<SetStateAction<(number|string)[]>>
  setChart: Dispatch<SetStateAction<Chart>>
  setColor: Dispatch<SetStateAction<string>>
} | null>(null);

function ChartContextProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [dataX, setDataX] = useState<(number|string)[]>(['Category A', 'Category B', 'Category C']);
  const [dataY, setDataY] = useState<((number|string))[]>([10, 20, 30]);
  
  const [chart, setChart] = useState<Chart>(Chart.Bar);
  const [color, setColor] = useState<string>('');

  return (
    <ChartContext.Provider value={{
      dataX,
      dataY,
      chart,
      color,
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
