import HelpIcon from "@mui/icons-material/Help";
import SpeedIcon from "@mui/icons-material/Speed";
import {
  Alert,
  AlertTitle,
  Box,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "src/components/ui/tooltip";
import LineGradientTrends from "src/features/common/graph/line-gradient-trends";
import FullScreenLoader from "../../app/components/fullscreen-loader";
import dateFormat from "../../app/utils/dateFormat";
import { useGetAllModules, useGetAllTrends } from "../hooks";
import AddIndicatorDialog from "./AddIndicatorDialog";
import { DatePickerWithRange } from "./DatePickerWithRange";
import RPMRangeModal from "./RPMRangeModal";
import { DateRangeType, RPMRangeType } from "./types";
import { Option } from "src/components/ui/multiple-selector";

const TrendsPage = () => {
  const [options, setOption] = useState([]);
  const [selectedIndicators, setSelectedIndicators] = React.useState<Option[]>(
    []
  );

  let startDate = new Date();
  startDate.setDate(startDate.getDate() - 6);
  const { data: allModules } = useGetAllModules();

  const [dateRangeValues, setDateRangeValues] = useState<DateRangeType>({
    to: new Date(),
    from: new Date(),
  });

  const [moduleId, setModuleId] = useState<string>("");
  const [rpmRange, setRPMRange] = useState<RPMRangeType>({
    rpm_min: 0,
    rpm_max: 0,
  });
  const [moduleType, setModuleType] = useState("");
  const [openIndicatorsModal, setIndicatorsModal] = useState(false);
  const { data, isLoading, getAllTrends, errorMessage, isError, setIsError } =
    useGetAllTrends(moduleId, dateRangeValues, rpmRange, allModules);

  const [rpmModal, setRPMModal] = useState(false);

  const assetHandler = (e: any) => {
    setModuleId(e.target.value);
  };

  const calculatedButtonDate = useMemo(() => {
    if (dateRangeValues?.from && dateRangeValues?.to) {
      return `${dateFormat(dateRangeValues?.from)}-${dateFormat(
        dateRangeValues?.to
      )}`;
    }
    return "StartDate-EndDate";
  }, [dateRangeValues]);

  const calculateButtonRPM = useMemo(() => {
    const min = rpmRange.rpm_min > 0 ? `${rpmRange.rpm_min}RPM` : "Min RPM";
    const max = rpmRange.rpm_max > 0 ? `${rpmRange.rpm_max}RPM` : "Max RPM";
    return `${min}-${max}`;
  }, [rpmRange]);

  useEffect(() => {
    if (allModules.length > 0 && allModules) {
      setModuleId(allModules[0].id);
    }
  }, [allModules]);

  useEffect(() => {
    if (moduleId && moduleId !== "") {
      getAllTrends(
        moduleId,
        { startDate: dateRangeValues.from, endDate: dateRangeValues.to },
        rpmRange,
        allModules
      );
    }
  }, [moduleId, dateRangeValues, rpmRange, allModules]);

  useEffect(() => {
    const moduleType = allModules.find((val: any) => val?.id === moduleId);
    setModuleType(moduleType?.module_type || "");
  }, [moduleId]);

  useEffect(() => {
    if (data?.dataSet && data?.dataSet.length > 0) {
      const titles = data?.dataSet.map((val: any) => val?.title);
      setOption(titles);
      // setSelectedIndicators([titles[0]]);
      setSelectedIndicators([
        {
          label: titles[0],
          value: titles[0],
          disable: false,
        },
      ]);
    } else {
      setOption([]);
      setSelectedIndicators([]);
    }
  }, [data]);

  return (
    <Box>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ display: "flex", flex: 1, flexDirection: "row" }}>
          <Typography
            variant="h5"
            padding={2}
            sx={{ fontWeight: 600, fontSize: "24px" }}
          >
            Trends
          </Typography>
          <Box sx={{ marginTop: "10px" }}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <IconButton>
                    <HelpIcon></HelpIcon>
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {" "}
                    To apply the RPM filter, Please note that the RPM range has
                    to be inserted before selecting any indicator.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Box>
        </Box>
        <Grid
          sx={{
            display: "flex",
            p: 2,
            justifyContent: "flex-end",
            marginRight: 1,
          }}
          container
          spacing={1}
        >
          <Grid item>
            <DatePickerWithRange
              dateRangeValues={dateRangeValues}
              setDateRangeValues={setDateRangeValues}
            />
          </Grid>
          <Grid item>
            <Button
              variant="outline"
              className="hover:bg-[#444] hover:text-white"
              onClick={() => setRPMModal(true)}
            >
              <SpeedIcon className="mr-2" />
              MIN RPM - MAX RPM
            </Button>
            {rpmModal && (
              <RPMRangeModal
                setRPMRange={setRPMRange}
                open={rpmModal}
                setOpen={setRPMModal}
              />
            )}
          </Grid>
          <Grid item>
            <AddIndicatorDialog
              selectedIndicators={selectedIndicators}
              setSelectedIndicators={setSelectedIndicators}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "flex-end", marginRight: 3 }}
      ></Box>
      {isError && errorMessage && (
        <Box sx={{ my: 1 }}>
          <Alert
            sx={{ display: "flex" }}
            severity="error"
            onClose={() => {
              setIsError(false);
            }}
          >
            <AlertTitle>{errorMessage}</AlertTitle>
          </Alert>
        </Box>
      )}
      <div className="bg-white rounded-lg shadow-sm px-2 py-4">
        {isLoading && <FullScreenLoader></FullScreenLoader>}
        {data?.dataSet && data?.dataSet.length > 0 && (
          <LineGradientTrends
            dataPoints={data?.dataSet}
            labels={data?.labels}
            maxRpm={data?.maxRpm}
            yLabel={moduleType !== "Torque" ? "Percentage (%)" : "Power"}
            selectedValue={selectedIndicators.map((item) => item.label)}
          />
        )}
      </div>
    </Box>
  );
};
export default TrendsPage;
