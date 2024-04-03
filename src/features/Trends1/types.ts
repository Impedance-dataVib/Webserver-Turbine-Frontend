export type RPMRangeType = {
  rpm_min: number;
  rpm_max: number;
}

export type DateRangeType = {
  to: Date | undefined;
  from: Date | undefined;
};

export type DatePickerWithRangeProps = {
  className?: string;
  dateRangeValues: DateRangeType;
  setDateRangeValues: React.Dispatch<React.SetStateAction<DateRangeType>>;
};