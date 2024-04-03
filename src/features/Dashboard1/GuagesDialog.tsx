import { OpenInFull } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog";
import { cn } from "src/lib/utils";
import Guage from "./Guage";
import StatusDialog from "./StatusDialog";
import { GlobalIndicator, ITrendsData, IWebSocketData } from "./type";

type GuagesDialogProps = {
  indicators: GlobalIndicator[] | undefined;
  trendsData: ITrendsData | undefined;
  moduleData: IWebSocketData | undefined;
};

const GuagesDialog = ({
  indicators,
  moduleData,
  trendsData,
}: GuagesDialogProps) => {
  return (
    <div className="w-full flex items-center justify-between pb-2 border-b">
      <div>
        <h1 className="text-base font-semibold">Global Indicators</h1>
      </div>
      <Dialog>
        <DialogTrigger>
          <OpenInFull style={{ fontSize: "14px" }} />
        </DialogTrigger>
        <DialogContent className="max-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Global Indicators</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            {indicators?.map((indicator, index) => (
              <div
                key={indicator.indicatorName}
                className={cn(
                  "p-4",
                  index !== indicators.length - 1 &&
                    index !== Math.floor(indicators.length / 2) &&
                    "border-r",
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuagesDialog;
