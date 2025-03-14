import { useContext } from "react";
import { ChartContext } from "@/contexts/ChartContextProvider";

function useChartContext() {
  const context = useContext(ChartContext);
  if (!context) throw Error("useChartContext can only be used inside an ChartContextProvider");
  return context;
}

export {
  useChartContext,
};
