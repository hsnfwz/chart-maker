'use client';

import {
  BarChart as RechartsBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  // Legend,
  Bar,
  ResponsiveContainer,
} from 'recharts';

import { useEffect, useState } from 'react';

import { useChartContext } from "@/hooks/context";

import { getChartYMax } from '@/helpers/chart';

function BarChart({ syncId, barColor }: any) {
  const {
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
  }, [dataX, dataY]);

  // function renderLegend(props) {
  //   const { payload } = props;

  //   // console.log(payload)

  //   return (
  //     <ul className="flex justify-center items-center gap-4 p-2">
  //       {payload.map((entry, index) => (
  //         <li key={`item-${index}`} className="flex justify-center items-center gap-2">
  //           <span className={`w-[16px] h-[16px] rounded`} style={{ backgroundColor: `${entry.color}` }} ></span>
  //           <span className="text-white capitalize">{entry.value}</span>
  //         </li>
  //       ))}
  //     </ul>
  //   );
  // }

  function renderTooltip(props: any) {
    const { active, payload, label } = props;

    // console.log(active, payload, label);

    if (active && payload && payload.length) {
      return (
        <div className="border border-slate-700 bg-slate-800 rounded text-white p-2">
          <p>{label}</p>
          <p style={{ color: barColor }}>{payload[0].value}</p>
        </div>
      );
    }

    return null;
  }

  return (
    <ResponsiveContainer>
      <RechartsBarChart
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
          // dataKey="y"
          // stroke="white"
          axisLine={{ stroke: barColor }}
          type="number"
          domain={[0, yMax]}
          // allowDataOverflow={false}
          // label={{ value: 'Amount', angle: -90, position: 'left', offset: 0, fill: 'white' }}
        />
        {/* <Legend
          verticalAlign="top"
          align="center"
          content={renderLegend}
        /> */}
        <Tooltip cursor={false} content={renderTooltip} />
        {labelY.map((y, index) => (
          <Bar
            key={index}
            dataKey={y}
            fill={barColor}
            // label={{ fill: 'white', fontSize: 12 }}
            activeBar={{ stroke: 'blue', strokeWidth: 1 }}
            // radius={[4, 4, 0, 0]}
            // barSize={20}
            // background={{ fill: 'yellow' }}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export default BarChart;
