'use client';

import ChartData from "@/components/ChartData";
import ChartSelect from "@/components/ChartSelect";
import ChartSettings from "@/components/ChartSettings";
import ChartView from "@/components/ChartView";
import ChartExport from "@/components/ChartExport";

function Home() {

  return (
    <div className="flex flex-col lg:flex-row gap-3 w-full h-screen p-3">

      <div className="order-2 lg:order-2 w-full h-[200px] lg:h-full lg:max-w-[200px] overflow-y-scroll flex flex-col gap-3 bg-neutral-100 p-3 rounded-lg text-xs">
        <ChartData />
      </div>

      <div className="order-1 lg:order-1 w-full h-full flex flex-col gap-3 bg-white">
        <div className="self-center bg-neutral-100 rounded-lg flex gap-2 p-3 text-xs">
          <ChartSelect />
        </div>
        <div className="w-full h-full">
          <ChartView />
        </div>
        <div className="self-center bg-neutral-100 rounded-lg flex gap-2 p-3 text-xs">
          <ChartExport />
        </div>
      </div>

      {/* <div className="order-3 w-full h-[200px] lg:h-full lg:max-w-[200px] overflow-y-scroll flex flex-col gap-3 bg-neutral-100 p-3 rounded-lg text-xs">
        <ChartSettings />
      </div> */}

    </div>
  );
}

export default Home;
