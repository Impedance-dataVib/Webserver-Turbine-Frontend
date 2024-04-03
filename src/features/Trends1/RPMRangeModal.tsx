import { useState } from "react";
import { Button } from "src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "src/components/ui/dialog";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { RPMRangeType } from "./types";

type RPMRangeModalProps = {
  setRPMRange: React.Dispatch<React.SetStateAction<RPMRangeType>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const RPMRangeModal = ({ setRPMRange, open, setOpen }: RPMRangeModalProps) => {
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

  const resetRPMRange = () => {
    setMinValue(0);
    setMaxValue(0);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select RPM Range</DialogTitle>
          <div className="mb-4 mt-4">
            <Label className="mb-2">RPM Minimum</Label>
            <Input
              type="number"
              className="mt-2"
              value={minValue}
              onChange={(e) => setMinValue(+e.target.value)}
            />
          </div>
          <div className="mb-2">
            <Label className="mb-2">RPM Maximum</Label>
            <Input
              type="number"
              className="mt-2"
              value={maxValue}
              onChange={(e) => setMaxValue(+e.target.value)}
            />
          </div>
        </DialogHeader>
        <DialogFooter>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={resetRPMRange}>
            Reset
          </Button>
          <Button
            className="bg-[#444]"
            onClick={() => {
              setRPMRange({
                rpm_max: maxValue,
                rpm_min: minValue,
              });
              setOpen(false);
            }}
          >
            Add RPM Range
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RPMRangeModal;
