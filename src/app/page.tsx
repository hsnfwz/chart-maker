'use client';

import ChartData from "@/components/ChartData";
import ChartSelect from "@/components/ChartSelect";
import ChartSettings from "@/components/ChartSettings";
import ChartView from "@/components/ChartView";
import ChartOptions from "@/components/ChartOptions";

function Home() {

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full h-screen p-4">
      <div className="w-full lg:max-w-[300px] overflow-y-scroll flex flex-col gap-4 bg-neutral-100 p-4 rounded-lg">
        <ChartSelect />
      </div>
      <div className="w-full h-full flex flex-col gap-4 bg-white">
        <div className="w-full h-full">
          <ChartView />
        </div>
        <div className="self-center bg-neutral-100 rounded-lg flex gap-2 p-4">
          <ChartOptions />
        </div>
      </div>
      <div className="w-full lg:max-w-[300px] overflow-y-scroll flex flex-col gap-4 bg-neutral-100 p-4 rounded-lg">
        <div className="w-full rounded flex flex-col gap-4">
          <ChartData />
        </div>
        <div className="w-full bg-neutral-200 rounded">
          <ChartSettings />
        </div>
      </div>
    </div>
  );
}

export default Home;
