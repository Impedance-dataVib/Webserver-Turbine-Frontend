import LineGradient from "../common/graph/line-gradient";
import { Trend } from "./type";

type SelectedTrendProps = {
  trend: Trend;
};

const SelectedTrend = ({ trend }: SelectedTrendProps) => {
  return (
    <div className="h-[35vh]">
      <LineGradient
        maxValue={trend?.yMax}
        dataPointsY1={trend?.dataPointsY1}
        trendsName={trend?.trendsName}
        hideBackground={true}
        speedName={trend?.speedName || ""}
        datapoints={trend?.datapoints}
        labels={trend?.labels}
        yLabel={trend?.yLabel}
        isGradientOpposite={trend?.isGradientOpposite}
      />
    </div>
  );
};

export default SelectedTrend;
