"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { Button } from "src/components/ui/button";
import { Calendar } from "src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import { cn } from "src/lib/utils";

import { DatePickerWithRangeProps } from "./types";

export function DatePickerWithRange({
  className,
  dateRangeValues,
  setDateRangeValues,
}: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild className="hover:bg-[#444] hover:text-white">
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRangeValues && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRangeValues?.from ? (
              dateRangeValues.to ? (
                <>
                  {format(dateRangeValues.from, "LLL dd, y")} -{" "}
                  {format(dateRangeValues.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRangeValues.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRangeValues?.from}
            selected={dateRangeValues}
            onSelect={(range) =>
              setDateRangeValues((values) => ({
                ...values,
                from: range?.from,
                to: range?.to,
              }))
            }
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
