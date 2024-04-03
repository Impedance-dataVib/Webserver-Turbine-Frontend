import { useEffect, useState } from "react";
import Guage from "./Guage";
import StatusDialog from "./StatusDialog";
import { GlobalIndicator, ITrendsData, IWebSocketData } from "./type";
import { cn } from "src/lib/utils";
import GuagesDialog from "./GuagesDialog";

type GlobalIndicatorsProps = {
  moduleData: IWebSocketData | undefined;
  trendsData: ITrendsData | undefined;
  globalIndicators: GlobalIndicator[] | undefined;
};

const GlobalIndicators = ({
  globalIndicators,
  trendsData,
  moduleData,
}: GlobalIndicatorsProps) => {
  const [indicators, setIndicators] = useState<GlobalIndicator[] | undefined>(
    undefined
  );

  useEffect(() => {
    const toShowIndicators = [
      "Coupling",
      "Regularity/Deviation",
      "Bearing Status",
      "Shaft/Blade Health",
      "Combustion Kit",
    ];
    const indicators = globalIndicators?.filter(
      (indicator) => toShowIndicators.indexOf(indicator.indicatorName) >= 0
    );

    setIndicators(indicators);
  }, [globalIndicators]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <GuagesDialog
        indicators={indicators}
        moduleData={moduleData}
        trendsData={trendsData}
      />
      <div className="lg:grid-cols-4 grid gap-x-4 grid-cols-1 md:grid-cols-2 gap-y-4 lg:gap-y-0">
        {indicators?.slice(0, 4).map((indicator, index) => (
          <div
            key={indicator.indicatorName}
            className={cn(
              "p-4",
              index !== 3 && "border-r",
              index === 0 && "pl-0"
            )}
          >
            <div className="flex items-center justify-between">
              <h1 className="text-[#3B3E40] font-medium">
                {indicator.indicatorName}
              </h1>
              <StatusDialog
                moduleData={moduleData}
                trendsData={trendsData?.alert || []}
              />
            </div>
            <Guage value={indicator.indicatorValue} />
            <p className="text-center text-[#02B271] font-medium">
              {indicator.indicatorUnit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GlobalIndicators;
