import { Alert, AlertTitle, Box, LinearProgress } from "@mui/material";
import * as dateFns from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useWebSocket from "react-use-websocket";
import appContext from "src/app/context";
import { buildData, buildSoketData } from "src/app/utils/helper";
import { Button } from "src/components/ui/button";
import { makeStyles } from "tss-react/mui";
import api from "../../app/api";
import ModuleTabRenderer from "./ModuleTabRenderer";
import DashboardApi from "./dashboardApi";
import { IModuleTabs, ITrendsData, IWebSocketData } from "./type";

const useStyles = makeStyles()((theme) => {
  return {
    trendsTabRoot: {
      minHeight: "auto",
    },
    tabsRoot: {
      height: "34px",
      minHeight: "34px",
    },
    tabRoot: {
      background: "#fff",
      borderRadius: "4px",
      border: "1px solid #f7f7f7",
      height: "34px",
      minHeight: "34px",
      "&.Mui-selected": {
        background: theme.palette.primary.main,
        color: "#fff",
      },
    },
    tabIndicator: {
      display: "none",
    },
    activeTab: {
      background: theme.palette.primary.main,
      color: "#fff",
    },
  };
});

const Dashboard = () => {
  const [moduleTabs, setModuleTabs] = useState<IModuleTabs[]>([]);
  const [webSocketsData, setWebSocketsData] = useState<
    IWebSocketData | undefined
  >(undefined);
  const [isDataAvailable, setIsDataAvailable] = useState<any>(undefined);
  const [trendsData, setTrendsData] = useState<ITrendsData | undefined>(
    undefined
  );
  const [isWebsocketConnect, setIsWebSocketConnect] = useState(true);
  const [isWebSocketFailed, setIsWebSocketFailed] = useState(false);
  const [activeModule, setActiveModule] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLicenseExpiryMsg, setShowLicenseExpiryMsg] =
    useState<boolean>(false);
  const [licExpiryText, setLicExpiryText] = useState<string>("");
  const { classes } = useStyles();
  const { t } = useTranslation();
  const { licenseInfo, licenseStatus } = useContext(appContext);
  const intervalHandle = useRef();
  const { sendMessage, lastMessage } = useWebSocket(
    process.env.REACT_APP_WEBSOCKET_URL ||
      `ws:${window.location.hostname}:8081`,
    {
      onMessage: () => {
        if (sendMessage) sendMessage(moduleTabs[activeModule].process_name);
      },
      onError: (e) => {
        setIsDataAvailable(
          "Failed to connect web socket server. Please try to start websocket by clicking this button."
        );
        setIsWebSocketFailed(true);

        setIsLoading(false);
      },
      shouldReconnect: (closeEvent) => true,
    },
    isWebsocketConnect
  );

  useEffect(() => {
    return () => setIsWebSocketConnect(false);
  }, []);
  useEffect(() => {
    if (moduleTabs.length > 0) {
      if (moduleTabs[activeModule].process_name) {
        setIsLoading(true);
        setWebSocketsData(undefined);
        setTrendsData(undefined);
        sendMessage(moduleTabs[activeModule].process_name);
        dashBoardApiCall(moduleTabs[activeModule].id);
        const interval = setInterval(() => {
          dashBoardApiCall(moduleTabs[activeModule].id);
        }, 3 * 60 * 1000);

        //Clearing the interval
        return () => clearInterval(interval);
      } else {
        setIsLoading(false);
      }
    }
  }, [moduleTabs, activeModule]);

  function dashBoardApiCall(datas: any) {
    DashboardApi.getTrendsData(datas)
      .then((val) => {
        const parsedData = buildData(val);
        setTrendsData(parsedData as any);
      })
      .catch((e) => {
        console.error(e);
        setTrendsData(undefined);
      });
  }

  useEffect(() => {
    if (lastMessage) {
      const data = lastMessage?.data;
      if (data) {
        try {
          let parsedData = JSON.parse(data);

          if (parsedData?.Status === "Failed") {
            setIsDataAvailable(parsedData?.Message);
            setIsWebSocketFailed(false);
            setWebSocketsData(undefined);
          } else {
            parsedData = buildSoketData(
              parsedData,
              moduleTabs[activeModule].module_type,
              moduleTabs[activeModule].from_data
            );
            setIsDataAvailable(undefined);
            setIsWebSocketFailed(false);
            setWebSocketsData(parsedData);
          }
          setIsLoading(false);
        } catch (ex) {
          console.error(ex);
          setIsLoading(false);
          setIsDataAvailable("Something went wrong");
          setIsWebSocketFailed(false);
        }
      } else {
        setIsDataAvailable(
          "Process file not found on server. Please check the configurations."
        );
        setIsWebSocketFailed(false);
        setWebSocketsData(undefined);
      }
    }
  }, [lastMessage]);

  useEffect(() => {
    if (licenseInfo && licenseStatus && intervalHandle) {
      // @ts-expect-error
      intervalHandle.current = setInterval(() => {
        const expiryDate = licenseInfo?.expiryDate;
        if (
          expiryDate !== undefined &&
          String(expiryDate)?.trim()?.length >= 0
        ) {
          const parsedExpiryDate = dateFns.parse(
            expiryDate,
            "yyyy-MM-dd HH:mm:ss",
            new Date()
          );

          const currentDate = new Date();
          const fifteenDaysBeforeExpiry = dateFns.subDays(parsedExpiryDate, 15);
          if (dateFns.isBefore(fifteenDaysBeforeExpiry, currentDate)) {
            // in 15 days range
            setShowLicenseExpiryMsg(true);
            setLicExpiryText(
              dateFns.format(parsedExpiryDate, "dd MMM yyyy, H:mm a")
            );
          } else {
            setShowLicenseExpiryMsg(false);
            setLicExpiryText("");
          }
        }
      }, 3000);
    }
    return () => {
      if (intervalHandle.current) {
        clearInterval(intervalHandle.current);
      }
    };
  }, [licenseInfo, licenseStatus, intervalHandle]);

  useEffect(() => {
    setIsLoading(true);
    DashboardApi.getModules()
      .then((res) => {
        if (res.length) setModuleTabs(res || []);
        else {
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setModuleTabs([]);
        setIsLoading(false);
      });
  }, []);

  const handleClick = () => {
    api.get(
      `${window.location.origin}/client-portal-api/app/start_dashboard_socket.php`
    );

    api.get(
      `${window.location.origin}/client-portal-api/app/start_signal_socket.php`
    );

    api.get(
      `${window.location.origin}/client-portal-api/app/start_status_socket.php`
    );
    window.location.reload();
  };

  return (
    <div>
      <div>
        {isLoading && (
          <Box sx={{ my: 1 }}>
            <LinearProgress />
          </Box>
        )}
        {isDataAvailable && (
          <Box sx={{ my: 1 }}>
            <Alert
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              severity="error"
              onClose={() => {
                clearInterval(intervalHandle.current);
                setIsDataAvailable(false);
                setIsWebSocketFailed(false);
              }}
            >
              <Box sx={{ display: "flex" }}>
                <AlertTitle>{isDataAvailable}</AlertTitle>
                {isWebSocketFailed && (
                  <Button className="bg-[#444]" onClick={handleClick}>
                    Restart WebSocket
                  </Button>
                )}
              </Box>
            </Alert>
          </Box>
        )}
        <ModuleTabRenderer
          classes={classes}
          moduleTabs={moduleTabs}
          trendsData={trendsData}
          websocketsData={webSocketsData}
          activeModule={activeModule}
          setActiveModule={(module) => setActiveModule(module)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
