'use client';

import { Chart } from '@/enums/chart';
import { createContext, useState, Dispatch, SetStateAction } from 'react';

const ChartContext = createContext<{
  labelX: string,
  labelY: string[],
  dataX: (number|string)[],
  dataY: number[],
  chart: Chart,
  color: string,
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

  const [labelX, setLabelX] = useState('Groups');
  const [labelY, setLabelY] = useState(['Day 1', 'Day 2', 'Day 3']);
  const [dataX, setDataX] = useState<(number|string)[]>(['Group A', 'Group B', 'Group C']);
  const [dataY, setDataY] = useState<(number[])>([10, 20, 30, 40, 50, 60, 70, 80, 90]);


  /* 
  [
    {
      [x]: 'A',
      [y1]: 1,
      [y2]: 2,
      [y3]: 3,
    },
    {
      [x]: 'B',
      [y1]: 2,
      [y2]: 4,
      [y3]: 6,
    }
  ]
  
  
  */
  
  const [chart, setChart] = useState<Chart>(Chart.Bar);
  const [color, setColor] = useState<string>('');

  return (
    <ChartContext.Provider value={{
      labelX,
      labelY,
      dataX,
      dataY,
      chart,
      color,
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
