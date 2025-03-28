import React from "react";
import { Dvr, Error, Warning } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import uniqueIDGenarator from "src/app/utils/uniqueIDGenarator";
const AlertsAndInstructions = ({
  moduleData,
  isModalOpen = false,
  alertData,
}: any) => {
  const getGridSize = (val: any) => {
    if (isModalOpen) {
      return 4;
    }
    return !val?.isTorque ? 6 : 12;
  };
  const renderInstruction = (
    instructionIndex: any,
    instruction: any,
    isModalOpen: any,
    isTorque: any
  ) => {
    return (
      <>
        {isModalOpen || instructionIndex < 2 ? (
          <Box
            key={`instruction${instructionIndex}`}
            sx={{
              color: "#4d4e4e",
              letterSpacing: "0.07px",
              pl: isTorque ? 0 : 3,
            }}
          >
            <Box
              sx={{
                "&:before": {
                  content: '"-"',
                  float: "left",
                  mr: 1,
                },
                mb: 1,
              }}
            >
              {!isTorque && (
                <Typography component={"span"} variant={"body2"}>
                  {instruction}
                </Typography>
              )}
              {isTorque && (
                <>
                  <Typography component={"span"} variant={"body2"} sx={{}}>
                    {instruction?.message}
                  </Typography>
                  <Typography
                    component={"span"}
                    variant={"body2"}
                    sx={{ marginLeft: 1, fontWeight: 300 }}
                  >
                    [{instruction?.time}]
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        ) : null}
      </>
    );
  };

  const getThumbIcon = (instructionType: string) => {
    switch (instructionType) {
      case "success":
        return <ThumbUpIcon color={instructionType} />;
      case "error":
        return <Error color={instructionType} />;
      case "warning":
        return <Warning color={instructionType} />;
      default:
        return;
    }
  };
  return (
    <Box>
      <Grid
        spacing={moduleData?.isAlert ? 2 : 0}
        // maxHeight="240px"
        overflow={"auto"}
      >
        {alertData.length !== 0 &&
          alertData.map((val: any) => (
            <Grid
              key={`alertData$-${val?.instructionName}`}
              item
              xs={12}
              md={12}
              lg={getGridSize(val)}
            >
              <Box
                sx={
                  val?.isTorque ? { display: "flex", flexDirection: "row" } : {}
                }
              >
                <Box sx={{ display: "flex" }}>
                  <Box sx={{ mr: 1, color: "#4d4e4e" }}>
                    {getThumbIcon(val?.instructionType)}
                  </Box>
                  {!val?.isTorque && (
                    <Box>
                      <Typography
                        component={"span"}
                        variant={"body2"}
                        sx={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#4d4e4e",
                          letterSpacing: "0.36px",
                        }}
                      >
                        {val?.instructionName}
                      </Typography>
                    </Box>
                  )}
                </Box>
                {val.instructions &&
                  val.instructions.map(
                    (instruction: string, instructionIndex: any) => (
                      <Box key={`ins${uniqueIDGenarator(10)}`}>
                        {renderInstruction(
                          instructionIndex,
                          instruction,
                          isModalOpen,
                          val?.isTorque
                        )}
                      </Box>
                    )
                  )}
              </Box>
            </Grid>
          ))}
        {alertData.length === 0 && (
          <div className="text-red-400 font-medium mt-4">No Alerts</div>
        )}
      </Grid>
    </Box>
  );
};
export default AlertsAndInstructions;
