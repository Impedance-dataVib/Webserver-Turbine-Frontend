import {
  CellTowerOutlined,
  DescriptionOutlined,
  SyncDisabled,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Grid } from "@mui/material";
import { toPng } from "html-to-image";
import { useEffect, useMemo, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import CardWidget from "src/app/components/card";
import {
  buildLiveStatusData,
  convertUTCDateToLocalTime,
} from "src/app/utils/helper";
import Trends from "../Dashboard1/Trends";
import ReportsCard from "../common/reports";
import LiveStatus from "../dashboard/pages/module/live-status";
import Signal from "../dashboard/pages/module/signal";
import { SIGNAL_STATUS_QUALITY, webSocketData } from "../dashboard/schema";

import GlobalIndicators from "./GlobalIndicators";
import { ICSSClasses, IModuleTabs, ITrendsData, IWebSocketData } from "./type";

type ModuleRenderProps = {
  moduleId: number;
  type: IModuleTabs["module_type"];
  processName: IModuleTabs["process_name"];
  formData: IModuleTabs["from_data"];
  moduleData: IWebSocketData | undefined;
  classes: ICSSClasses;
  trendsData: ITrendsData | undefined;
  moduleType: IModuleTabs["module_type"];
};

const ModuleRender = ({
  moduleId,
  type,
  moduleData,
  classes,
  trendsData,
  processName,
  formData,
  moduleType,
}: ModuleRenderProps) => {
  const [activeModule, setActiveModule] = useState<number>(0);
  const [signalData, setSignalData] = useState<any>({});
  const [isLiveSocket, setIsliveSocket] = useState<boolean>(false);
  const [isLatestReportOpen, setIsLatestReportOpen] = useState<boolean>(false);
  const [isLiveStatusOpen, setIsLiveStatusOpen] = useState<boolean>(false);
  const [trendsCylinder, setTrendsCylinder] = useState<string[]>([]);
  const [liveStatus, setLiveStatus] = useState<any>({});
  const [currentMode, setCurrentMode] = useState<any>("");
  const [documents, setDocuments] = useState<any>([]);
  const elementRef = useRef<(HTMLDivElement | null)[]>([]);
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { sendMessage, lastMessage } = useWebSocket(
    process.env.REACT_APP_LIVE_WEBSOCKET_URL ||
      `ws:${window.location.hostname}:8082`,
    {
      onMessage: () => {
        if (sendMessage) sendMessage(processName);
      },
      shouldReconnect: (closeEvent) => true,
    },
    isLiveSocket
  );

  useEffect(() => {
    if (lastMessage !== undefined) {
      const data = lastMessage?.data;
      if (data) {
        let parsedData = data;
        if (parsedData?.Status !== "Failed") {
          parsedData = buildLiveStatusData(parsedData);
          setLiveStatus(parsedData);
        }
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (isLiveSocket) {
      sendMessage(processName);
    }
  }, [isLiveSocket]);

  useEffect(() => {
    const data = SIGNAL_STATUS_QUALITY.find(
      (val) => val.id == moduleData?.currentStatus.title
    );
    setSignalData(data || SIGNAL_STATUS_QUALITY[0]);
  }, [moduleData?.currentStatus]);

  useEffect(() => {
    setIsliveSocket(isLatestReportOpen || isLiveStatusOpen);
  }, [isLatestReportOpen, isLiveStatusOpen]);

  useEffect(() => {
    const trendsCylinderArr = ["Trends"];
    if (
      trendsData?.cylinder_specific_indicators &&
      trendsData?.cylinder_specific_indicators.length > 0
    ) {
      trendsCylinderArr.push("Cylinder Specific Indicator");
    }
    setTrendsCylinder(trendsCylinderArr);
  }, [trendsData]);
  const parsedFormData = JSON.parse(formData);

  useEffect(() => {
    const fileName = `${parsedFormData?.asset_name} - ${
      parsedFormData?.equipment_name
    } - ${convertUTCDateToLocalTime(new Date())}`;
    if (documents.length > 0) {
      setTimeout(function () {
        elementRef.current.map((val: any) => {
          if (val) {
            toPng(val, { quality: 0.5 })
              .then((dataUrl: string) => {
                const link = document.createElement("a");
                link.download = `${fileName}.png`;
                link.href = dataUrl;
                setIsLoading(false);
                link.click();
                setDocuments([]);
              })
              .catch((err) => {
                setIsLoading(false);
                setDocuments([]);
              });
          }
        });
      }, 1000);
    }
  }, [documents]);

  return (
    <div>
      {trendsData && (
        <>
          <div className="rounded-md h-full mt-4">
            <GlobalIndicators
              moduleData={moduleData}
              trendsData={trendsData || []}
              globalIndicators={moduleData?.globalIndicator}
            />
          </div>
          <div className="bg-white rounded-lg my-4 px-8 py-2 shadow-md">
            <Trends trends={trendsData?.trends} fullScreen={true} />
          </div>
          <div className="grid grid-cols-1 gap-y-4 md:grid-cols-3 md:gap-y-0 gap-x-4">
            <Grid item lg={4} md={12} sm={12}>
              <CardWidget
                headerLabel="Live Diagnostic Status"
                headerIcon={<VisibilityOutlined />}
                content={
                  <LiveStatus
                    liveStatus={liveStatus}
                    processName={processName}
                    currentMode={currentMode}
                    setCurrentMode={setCurrentMode}
                  />
                }
                initiallyCollapsed={true}
                setIsLiveStatusOpen={setIsLiveStatusOpen}
                fullScreenContent={
                  <LiveStatus
                    liveStatus={liveStatus}
                    processName={processName}
                    currentMode={currentMode}
                    setCurrentMode={setCurrentMode}
                  />
                }
              />
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
              <CardWidget
                headerLabel={
                  moduleType === "Engine"
                    ? signalData?.description || ""
                    : signalData?.turbineMessage ||
                      signalData?.description ||
                      ""
                }
                headerIcon={
                  signalData?.resultType === "success" ? (
                    <CellTowerOutlined color="success" />
                  ) : (
                    <SyncDisabled color="error" />
                  )
                }
                content={
                  <Signal
                    moduleType={moduleType}
                    signals={moduleData?.signals}
                    formData={formData}
                  />
                }
                initiallyCollapsed={true}
                fullScreenContent={
                  <Signal
                    moduleType={moduleType}
                    signals={moduleData?.signals}
                    formData={formData}
                  />
                }
              />
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
              <CardWidget
                headerLabel="Latest Reports"
                setIsLatestReportOpen={setIsLatestReportOpen}
                headerIcon={<DescriptionOutlined />}
                content={
                  <ReportsCard
                    liveStatus={liveStatus}
                    processName={processName}
                    formData={formData}
                    moduleId={moduleId}
                    setData={setData}
                    setDocuments={setDocuments}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                  />
                }
                initiallyCollapsed={true}
                fullScreenContent={
                  <ReportsCard
                    liveStatus={liveStatus}
                    processName={processName}
                    formData={formData}
                    moduleId={moduleId}
                    setData={setData}
                    setDocuments={setDocuments}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                  />
                }
              />
            </Grid>
          </div>
        </>
      )}
    </div>
  );
};

export default ModuleRender;
