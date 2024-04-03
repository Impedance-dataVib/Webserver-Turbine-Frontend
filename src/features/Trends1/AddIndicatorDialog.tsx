import { Plus } from "lucide-react";
import React from "react";
import { Button } from "src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog";
import IndicatorSelector from "./IndicatorSelector";
import { Option } from "src/components/ui/multiple-selector";

type AddIndicatorDialogProps = {
  selectedIndicators: Option[];
  setSelectedIndicators: React.Dispatch<React.SetStateAction<Option[]>>;
};

const AddIndicatorDialog = ({
  selectedIndicators,
  setSelectedIndicators,
}: AddIndicatorDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" className="hover:bg-[#444] hover:text-white">
          <Plus />
          &nbsp;Add Indicators
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Indicators</DialogTitle>
          <IndicatorSelector
            selectedIndicators={selectedIndicators}
            setSelectedIndicators={setSelectedIndicators}
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddIndicatorDialog;
