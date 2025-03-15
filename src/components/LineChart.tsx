'use client';

import {
  LineChart as RechartsLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
} from 'recharts';

import { useEffect, useState } from 'react';

import { useChartContext } from "@/hooks/context";

import { getChartYMax } from '@/helpers/chart';

function LineChart({ syncId, barColor }: any) {
  const {
    chartRef,
    rerenderChart,
    labelX,
    labelY,
    dataX,
    dataY,
    color,
  } = useChartContext();

  const [data, setData] = useState<{
    [key: string]: number|string,
  }[]>([]);
  const [yMax, setYMax] = useState<number|string>('auto');

  useEffect(() => {
    const result: {
      [key:string]: string|number,
    }[] = [];

    let i = 0;
    while (i < dataX.length) {

      const x = dataX[i];
      const value = {
        [labelX]: x,
      }

      let j = i*labelY.length;
      let k = 0;
      const limit = j + labelY.length;
      while (j < limit) {
        value[labelY[k]] = dataY[j];
        k++;
        j++;
      }

      result.push(value);

      i++;
    }

    setData(result);

    const max: number = getChartYMax(dataY);
    setYMax(max);
  }, [rerenderChart]);

  function renderLegend(props: any) {
    const { payload } = props;

    // console.log(payload)

    return (
      <ul className="flex justify-center items-center gap-4 p-2">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} className="flex justify-center items-center gap-2">
            <span className={`w-[16px] h-[16px] rounded`} style={{ backgroundColor: `${entry.color}` }} ></span>
            <span className="capitalize">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  }

  function renderTooltip(props: any) {
    const { active, payload, label } = props;

    if (active && payload && payload.length) {
      return (
        <div className="border border-slate-700 bg-slate-800 rounded text-white p-2 flex flex-col gap-4">
          <h1 className="font-bold">{label}</h1>
          <div className="flex flex-col gap-2">
            {payload.map((item: any, index: number) => (
              <p key={index} style={{ color: barColor }}>{item.name}: {item.value}</p>
            ))}
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <ResponsiveContainer ref={chartRef}>
      <RechartsLineChart
        
        data={data}
        // margin={{
        //   top: 0,
        //   left: 10,
        //   bottom: 16,
        //   right: 0
        // }}
        margin={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
        syncId={syncId}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={barColor}
          fill={barColor}
          fillOpacity="0.25"
        />
        <XAxis
          dataKey={labelX}
          // stroke="white"
          axisLine={{ stroke: barColor }}
          // label={{ value: 'Month', position: 'bottom', offset: 0, fill: 'white' }}
        />
        <YAxis
          // stroke="white"
          axisLine={{ stroke: barColor }}
          type="number"
          domain={[0, yMax]}
          // allowDataOverflow={false}
          // label={{ value: 'Amount', angle: -90, position: 'left', offset: 0, fill: 'white' }}
        />
        <Legend
          verticalAlign="top"
          align="center"
          content={renderLegend}
        />
        {/* <Tooltip cursor={false} content={renderTooltip} /> */}
        {labelY.map((y, index) => (
          <Line
            key={index}
            dataKey={y}
            stroke={index === 0 ? 'oklch(0.828 0.111 230.318)' : index === 1 ? 'oklch(0.685 0.169 237.323)' : index === 2 ? 'oklch(0.5 0.134 242.749)' : ''}
            label={{ fill: 'white', fontSize: 12 }}
            // activeDot={{ stroke: 'blue', strokeWidth: 1 }}
            // radius={[4, 4, 0, 0]}
            // barSize={20}
            // background={{ fill: 'yellow' }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export default LineChart;
