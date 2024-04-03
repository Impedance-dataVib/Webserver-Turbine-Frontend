import { Skeleton } from "src/components/ui/skeleton";
import { v4 } from 'uuid'

const DashboardSkeleton = () => {
  return (
    <div>
      <div className="grid grid-cols-1 gap-y-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-y-0 gap-x-4">
        {new Array(4).fill(4).map((_) => (
          <Skeleton key={v4()} className="h-[300px] rounded-lg bg-[#4444442f]" />
        ))}
      </div>
      <div>
        <Skeleton className="w-full my-4 h-[300px] bg-[#4444442f]" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {new Array(3).fill(3).map((_) => (
          <Skeleton key={v4()} className="h-[300px] rounded-lg bg-[#4444442f]" />
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
