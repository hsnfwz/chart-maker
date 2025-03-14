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
    dataX,
    dataY,
    color,
  } = useChartContext();

  const [data, setData] = useState<{
    x: number|string,
    y: number|string,
  }[]>([]);
  const [yMax, setYMax] = useState('auto');

  useEffect(() => {
    const _data = dataX.map((x, index) => {
      return {
        x,
        y: dataY[index]
      };
    });

    setData(_data);

    const max: any = getChartYMax(_data);
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
          dataKey="x"
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
        <Bar
          dataKey="y"
          fill={barColor}
          // label={{ fill: 'white', fontSize: 12 }}
          activeBar={{ stroke: 'white', strokeWidth: 1 }}
          // radius={[4, 4, 0, 0]}
          // barSize={20}
          // background={{ fill: 'yellow' }}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export default BarChart;
