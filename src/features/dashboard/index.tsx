import { useContext, useEffect, useState, useRef } from "react";
import {
  Alert,
  AlertTitle,
  Box,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
  Button,
  Tooltip,
} from "@mui/material";
import useWebSocket from "react-use-websocket";
import { makeStyles } from "tss-react/mui";
import { useTranslation } from "react-i18next";
import DashboardApi from "./dashboardApi";
import ModuleMonitoringPage from "./pages/module";
import TabPanel from "src/app/components/tab-panel";
import appContext from "src/app/context";
import * as dateFns from "date-fns";
import { buildData, buildSoketData } from "src/app/utils/helper";
import api from "../../app/api";

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

export interface IActiveModule {
  name: string;
  index: number;
}

function tabProps(index: number) {
  return {
    id: `dashboard-module-tab-${index}`,
    "aria-controls": `dashboard-module-tabpanel-${index}`,
  };
}

const TabModuleRender = ({
  moduleId,
  type,
  moduleData,
  classes,
  trendsData,
  processName,
  formData,
  moduleType,
}: any) => {
  const { t } = useTranslation();

  switch (type) {
    case "Engine":
    case "Torque":
    case "Turbine":
    case "Motor":
    case "Bearing":
      return (
        <Box>
          <ModuleMonitoringPage
            moduleId={moduleId}
            moduleData={moduleData}
            classes={classes}
            trendsData={trendsData}
            processName={processName}
            formData={formData}
            moduleType={moduleType}
          />
        </Box>
      );
    default:
      return (
        <Box>
          <Typography component="span" variant="body1">
            {t("dashboard.type.not.supported", { ns: "dashboard" })}
          </Typography>{" "}
        </Box>
      );
  }
};

const DashboardPage = () => {
  const [moduleTabs, setModuleTabs] = useState<any[]>([]);
  const [webSocketsData, setWebSocketsData] = useState({});
  const [isDataAvailable, setIsDataAvailable] = useState<any>(undefined);
  const [trendsData, setTrendsData] = useState({});
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
        setWebSocketsData({});
        setTrendsData({});
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
        setTrendsData(parsedData);
      })
      .catch((e) => {
        console.error(e);
        setTrendsData({});
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
            setWebSocketsData({});
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
        setWebSocketsData({});
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

  const onActiveModuleChange = (event: any, params: any) => {
    setActiveModule(params);
  };
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
    <Box>
      {showLicenseExpiryMsg && (
        <Box sx={{ my: 1 }}>
          <Alert
            severity="warning"
            onClose={() => {
              clearInterval(intervalHandle.current);
              setShowLicenseExpiryMsg(false);
            }}
          >
            <AlertTitle>
              {t("dashboard.lic.alert.title", { ns: "dashboard" })}
            </AlertTitle>
            <Typography variant="caption" component={"span"}>
              {t("dashboard.lic.alert.text.part1", { ns: "dashboard" })}{" "}
              {licExpiryText}
            </Typography>
          </Alert>
        </Box>
      )}
      {isLoading && (
        <Box sx={{ my: 1 }}>
          <LinearProgress />
        </Box>
      )}
      {isDataAvailable && (
        <Box sx={{ my: 1 }}>
          <Alert
            sx={{ display: "flex" }}
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
                <Button
                  size="small"
                  sx={{ ml: "30px" }}
                  variant="outlined"
                  onClick={handleClick}
                >
                  Restart WebSocket
                </Button>
              )}
            </Box>
          </Alert>
        </Box>
      )}
      <Box sx={{ display: "flex", mb: 2 }}>
        <Typography variant="h5">
          {t("dashboard.heading.text", { ns: "dashboard" })}
        </Typography>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Typography component="span" variant="body1">
            {isLoading
              ? t("dashboard.loading.module.text", { ns: "dashboard" })
              : t("dashboard.module.text", { ns: "dashboard" })}
          </Typography>
          <Box sx={{ minWidth: "50vw", maxWidth: "50vw" }}>
            <Tabs
              value={activeModule}
              onChange={onActiveModuleChange}
              aria-label="select modules"
              classes={{
                root: classes.tabsRoot,
                indicator: classes.tabIndicator,
              }}
              variant="scrollable"
              scrollButtons="auto"
            >
              {moduleTabs?.map((tabElement: any, index: number) => (
                <Tooltip
                  title={tabElement.name}
                  key={`toolTip${tabElement?.id}`}
                >
                  <Tab
                    label={
                      <Box>
                        {JSON.parse(tabElement.from_data).asset_name} -
                        {JSON.parse(tabElement.from_data).equipment_name}
                      </Box>
                    }
                    {...tabProps(index)}
                    classes={{
                      root: classes.tabRoot,
                      selected: classes.activeTab,
                    }}
                  />
                </Tooltip>
              ))}
            </Tabs>
          </Box>
        </Box>
      </Box>

      {moduleTabs?.map((item: any, index: any) => (
        <TabPanel key={item.id} value={activeModule} index={index}>
          <TabModuleRender
            moduleId={item.id}
            type={item.module_type}
            processName={item.process_name}
            formData={item.from_data}
            moduleData={webSocketsData}
            classes={classes}
            trendsData={trendsData}
            moduleType={item.module_type}
          />
        </TabPanel>
      ))}
    </Box>
  );
};
export default DashboardPage;
