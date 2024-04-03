import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import ModuleRender from "./ModuleRender";
import { ICSSClasses, IModuleTabs, ITrendsData, IWebSocketData } from "./type";
import { Skeleton } from "src/components/ui/skeleton";
import { convertUTCDateToLocalTime } from "src/app/utils/helper";
import DashboardSkeleton from "./DashboardSkeleton";

type ModuleTabRendererProps = {
  moduleTabs: IModuleTabs[];
  websocketsData: IWebSocketData | undefined;
  classes: ICSSClasses;
  trendsData: ITrendsData | undefined;
  setActiveModule: (module: number) => void;
  activeModule: number;
};

const ModuleTabRenderer = ({
  classes,
  moduleTabs,
  trendsData,
  websocketsData,
  setActiveModule,
  activeModule,
}: ModuleTabRendererProps) => {
  return (
    <div>
      {moduleTabs.length > 0 && (
        <Tabs
          value={moduleTabs[activeModule].name}
          defaultValue={moduleTabs[0].name}
        >
          <TabsList className="w-full flex items-center justify-between">
            <p className="text-[#3B3E40] font-medium text-xl">Dashboard</p>
            <div className="w-fit">
              {moduleTabs.map((tab, index) => (
                <TabsTrigger
                  value={tab.name}
                  onClick={() => {
                    console.log(index)
                    setActiveModule(index);
                  }}
                >
                  {JSON.parse(tab.from_data).asset_name.toUpperCase()} -
                  {JSON.parse(tab.from_data).equipment_name.toUpperCase()}
                </TabsTrigger>
              ))}
            </div>
            <div className="flex items-center justify-between">
              {!trendsData && (
                <>
                  <Skeleton className="w-[200px] h-[60px] mr-2" />
                  <Skeleton className="w-[200px] h-[60px]" />
                </>
              )}
              {trendsData && (
                <>
                  <span className="bg-[#444] text-white p-4 rounded-md font-medium mr-4">
                    Speed:&nbsp;
                    {
                      websocketsData?.globalIndicator?.find(
                        (indicator) => indicator.indicatorName === "Speed"
                      )?.indicatorValue
                    }
                    &nbsp;RPM
                  </span>
                  <span className="bg-[#444] text-white p-4 rounded-md font-medium">
                    {trendsData?.alertUpdatedOn &&
                      `Updated on ${convertUTCDateToLocalTime(
                        trendsData?.alertUpdatedOn as string
                      )}`}
                  </span>
                </>
              )}
            </div>
          </TabsList>
          {!trendsData && <DashboardSkeleton />}
          {moduleTabs.map((tab) => (
            <TabsContent value={tab.name} key={tab.id}>
              <ModuleRender
                moduleId={tab.id}
                type={tab.module_type}
                processName={tab.process_name}
                formData={tab.from_data}
                moduleData={websocketsData}
                classes={classes}
                trendsData={trendsData}
                moduleType={tab.module_type}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default ModuleTabRenderer;
