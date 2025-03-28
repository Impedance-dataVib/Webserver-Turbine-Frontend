import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import SpeedoMeter from "src/features/common/graph/speedo-meter";

const GlobalIndicatorChart = ({
  globalIndicator,
  fullScreen,
  isTorqueModule,
}: any) => {
  const [styling, setStyling] = useState({});
  useEffect(() => {
    setStyling(
      fullScreen
        ? { display: "flex", flexDirection: "row" }
        : { overflow: "auto", display: "flex", flexDirection: "column" }
    );
  }, [fullScreen]);

  const show = useMemo(() => {
    if (fullScreen === false) {
      return globalIndicator.slice(0, 3);
    }
    return globalIndicator;
  }, [fullScreen, globalIndicator]);

  return (
    <Grid
      container
      spacing={1}
      sx={{
        height: globalIndicator && !fullScreen ? "100%" : "",
        ...styling,
        maxHeight: globalIndicator && !fullScreen ? "240px" : "",
      }}
    >
      {globalIndicator &&
        show.map((val: any) => (
          <Grid
            key={`globalIndicator-${val.indicatorName}`}
            item
            sx={{ display: "flex", flexDirection: "column" }}
            lg={4}
            md={12}
            sm={12}
          >
            <Typography
              variant="body1"
              component={"span"}
              textAlign={"center"}
              sx={{ mb: 1, fontWeight: "500", cursor: "pointer" }}
              title={val?.tooltip}
            >
              {val?.indicatorName}
            </Typography>
            <Box
              sx={{
                height: "65%",
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <SpeedoMeter
                maxValue={val.indicatorMax}
                isGradientOpposite={val?.isGradientOpposite}
                minValue={val?.indicatorMin}
                value={val?.indicatorValue}
                isPercent={val?.isPercentage}
                isGradientColor={val?.isGradientColor}
                indicatorType={val?.indicatorType}
                indicatorUnit={val?.indicatorUnit}
                isTorqueModule={isTorqueModule}
                indicatorName={val?.indicatorName}
                height={150}
              />
            </Box>
          </Grid>
        ))}
    </Grid>
  );
};
export default GlobalIndicatorChart;
