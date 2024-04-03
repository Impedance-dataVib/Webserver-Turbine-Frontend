import { WarningAmber } from "@mui/icons-material";
import AlertsAndInstructions from "./AlertAndInstructions";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";

const StatusDialog = ({ moduleData, trendsData }: any) => {
  return (
    <Popover>
      <PopoverTrigger className="hover:bg-[#44444428] rounded-full flex items-center justify-center p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <WarningAmber />
            </TooltipTrigger>
            <TooltipContent>
              <p>Alerts & Instructions</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PopoverTrigger>
      <PopoverContent>
        <h1 className="font-semibold">
          <WarningAmber />
          &nbsp; Alerts & Instructions
        </h1>
        <AlertsAndInstructions
          moduleData={moduleData}
          alertData={trendsData?.alert || []}
          isModalOpen={true}
        />
      </PopoverContent>
    </Popover>
  );
};

export default StatusDialog;
