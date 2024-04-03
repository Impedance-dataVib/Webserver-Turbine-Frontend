import MultipleSelector, { Option } from "src/components/ui/multiple-selector";

const OPTIONS: Option[] = [
  {
    label: "Speed",
    value: "Speed",
    disable: false,
    defaultSelected: true,
  },
  {
    label: "Coupling/Alignment",
    value: "Coupling/Alignment",
    disable: false,
  },
  {
    label: "Regularity/Deviation",
    value: "Regularity/Deviation",
    disable: false,
  },
  { label: "Shaft/Blades Health", value: "Shaft/Blade Health", disable: false },
  { label: "Combustion Kit", value: "Combustion Kit", disable: false },
];

type IndicatorSelectorProps = {
  selectedIndicators: Option[];
  setSelectedIndicators: React.Dispatch<React.SetStateAction<Option[]>>;
};

const IndicatorSelector = ({
  selectedIndicators,
  setSelectedIndicators,
}: IndicatorSelectorProps) => {
  return (
    <MultipleSelector
      onChange={(value) => setSelectedIndicators(value)}
      className="mt-5"
      value={selectedIndicators}
      options={OPTIONS}
      placeholder="Indicators"
      emptyIndicator={
        <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
          No results found.
        </p>
      }
    />
  );
};

export default IndicatorSelector;
