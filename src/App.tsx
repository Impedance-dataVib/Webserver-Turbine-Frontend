import { CssBaseline, ThemeProvider } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import FullScreenLoader from "./app/components/fullscreen-loader";
import Layout from "./app/components/layout";
import ProtectedRoute from "./app/components/protectedRoute";
import UnsavedPrompt from "./app/components/unsavedPrompt";
import appContext from "./app/context";
import { lightTheme } from "./app/theme";
import { useQuery } from "./app/utils/helper";
import CommonApi from "./commonApi";
import Dashboard from "./features/Dashboard1";
import Trends1 from "./features/Trends1";
import ConfigurationPage, {
  ManageConfigurationPage,
} from "./features/configuration";
import DashboardPage from "./features/dashboard";
import DownloadPage from "./features/downloads";
import FileBrowserPage from "./features/fileBrowser";
import HelpPage from "./features/help";
import LoginPage from "./features/login/login";
import LogoutPage from "./features/login/logout";
import NotepadPage from "./features/notepad";
import SettingsPage from "./features/settings";
import SystemConfiguration from "./features/systemConfiguration";

const AppRoutes = ({
  isUnsaved,
  setNavigatePath,
  setIsUnsaved,
  openConfirmBox,
  navigatePath,
  setOpenconfirmmBox,
}: any) => (
  <Routes>
    <Route path="/" element={<DashboardPage />} />
    {/* <Route path="login" element={<LoginPage />} /> */}
    <Route path="logout" element={<LogoutPage />} />
    <Route
      path="/trends/*"
      element={
        <ProtectedRoute>
          <Trends1 />
        </ProtectedRoute>
      }
    ></Route>
    <Route path="/dashboard/*" element={<Dashboard />}></Route>
    <Route
      path="/configuration"
      element={
        <ProtectedRoute>
          <ManageConfigurationPage />
        </ProtectedRoute>
      }
    ></Route>
    <Route
      path="/configuration/:configId"
      element={
        <ProtectedRoute>
          <ConfigurationPage
            setNavigatePath={setNavigatePath}
            navigatePath={navigatePath}
            isUnsaved={isUnsaved}
            setIsUnsaved={setIsUnsaved}
            openConfirmBox={openConfirmBox}
            setOpenconfirmmBox={setOpenconfirmmBox}
          />
        </ProtectedRoute>
      }
    />
    <Route
      path="/notepad/*"
      element={
        <ProtectedRoute>
          <NotepadPage />
        </ProtectedRoute>
      }
    ></Route>
    <Route
      path="/file-browser/*"
      element={
        <ProtectedRoute>
          <FileBrowserPage />
        </ProtectedRoute>
      }
    ></Route>
    <Route
      path="/help/*"
      element={
        <ProtectedRoute>
          <HelpPage />
        </ProtectedRoute>
      }
    ></Route>
    <Route
      path="/settings/*"
      element={
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      }
    ></Route>

    <Route
      path="/systemconfiguration/*"
      element={
        <ProtectedRoute>
          <SystemConfiguration /> 
        </ProtectedRoute>
      }
    />
    <Route
      path="/download/*"
      element={
        <ProtectedRoute>
          <DownloadPage />
        </ProtectedRoute>
      }
    />
  </Routes>
);

const LoginRoutes = (
  <Routes>
    <Route path="login" element={<LoginPage />} />
  </Routes>
);

export const LICENSE_STATUS = {
  INACTIVE: "inactive",
  ACTIVE: "active",
};

function App() {
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [openConfirmBox, setOpenconfirmmBox] = useState(false);
  const [navigatePath, setNavigatePath] = useState(null);
  const queryParams = useQuery();
  const [activeTheme] = useState<any>(lightTheme);

  const [licenseInfo, setLicenseInfo] = useState<any>();
  const [licenseStatus, setLicenseStatus] = useState<string>();
  const [licenseLoading, setLicenseLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const path = useLocation();

  const onLoadCheckLicense = () => {
    setLicenseLoading(true);
    CommonApi.getLicenseInfo()
      .then((res) => {
        setLicenseLoading(false);
        const lic = res.data;
        setLicenseInfo(lic);
        if (lic !== undefined && String(lic.isActive) === "true") {
          // set license active
          setLicenseStatus(LICENSE_STATUS.ACTIVE);
          if (lic.expiryDate === undefined) {
            // set license as inactive
            setLicenseStatus(LICENSE_STATUS.INACTIVE);
            return;
          }
          if (lic.configCount >= 1) {
            // redirect to dashboard
            const redirectTo = queryParams.get("redirectTo");
            navigate(redirectTo || "/dashboard");
            return;
          } else {
            // redirect to configuration screen
            navigate("/configuration");
            return;
          }
        } else {
          // redirect to activate license screen
          setLicenseStatus(LICENSE_STATUS.INACTIVE);
        }
      })
      .catch((e) => {
        setLicenseInfo(undefined);
        setLicenseStatus(LICENSE_STATUS.INACTIVE);
        setLicenseLoading(false);
        // Show login screen, then show license import screen
      });
  };

  useEffect(() => {
    onLoadCheckLicense();
  }, []);

  if (licenseStatus === LICENSE_STATUS.INACTIVE) {
    navigate("/login?inactive=true");
  }
  const appContextProviderValues = useMemo(() => {
    return { licenseInfo, licenseStatus, onLoadCheckLicense };
  }, [licenseStatus, licenseInfo, onLoadCheckLicense]);
  return (
    <div className="App">
      <Suspense fallback={<FullScreenLoader />}>
        <SnackbarProvider
          maxSnack={4}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={2500}
        >
          <appContext.Provider value={appContextProviderValues}>
            <ThemeProvider theme={activeTheme}>
              <CssBaseline />
              {licenseLoading ? (
                <FullScreenLoader />
              ) : (
                <>
                  {path && ["/login"].includes(path.pathname) ? (
                    <>{LoginRoutes}</>
                  ) : (
                    <Layout
                      isUnsaved={isUnsaved}
                      openConfirmBox={openConfirmBox}
                      setOpenconfirmmBox={setOpenconfirmmBox}
                      setNavigatePath={setNavigatePath}
                    >
                      <UnsavedPrompt isUnsaved={isUnsaved} />
                      <AppRoutes
                        navigatePath={navigatePath}
                        setNavigatePath={setNavigatePath}
                        isUnsaved={isUnsaved}
                        setIsUnsaved={setIsUnsaved}
                        openConfirmBox={openConfirmBox}
                        setOpenconfirmmBox={setOpenconfirmmBox}
                      />
                    </Layout>
                  )}
                </>
              )}
            </ThemeProvider>
          </appContext.Provider>
        </SnackbarProvider>
      </Suspense>
    </div>
  );
}

export default App;
