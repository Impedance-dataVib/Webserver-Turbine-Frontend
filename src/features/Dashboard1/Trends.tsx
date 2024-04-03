import { Box, Grid, Typography } from "@mui/material";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import SelectedTrend from "./SelectedTrend";
import { ITrendsData, Trend } from "./type";

type SelectedTrend = string;

type TrendsProps = {
  trends: ITrendsData["trends"];
  fullScreen: boolean;
};

export default function Trends({ trends, fullScreen }: TrendsProps) {
  const [trendsData, setTrendsData] = useState(trends);
  const [selectedTrend, setSelectedTrend] = useState<SelectedTrend>(
    trendsData[0].trendsName
  );

  useEffect(() => {
    if (!fullScreen) {
      setTrendsData(() =>
        trends.filter((v: any) => v.chartType === "LineGradient")
      );
    } else {
      setTrendsData(trends);
    }
  }, [fullScreen, trends]);

  return (
    <>
      <Grid>
        <div className="flex items-center justify-between w-full mt-2 border-b pb-2 mb-2">
          <div className="flex items-center bg-accent rounded-md p-4">
            <TrendingUp className="mr-2" />
            <p className="font-semibold text-[#444]">Trends</p>
          </div>
          <Select
            onValueChange={(value: SelectedTrend) => setSelectedTrend(value)}
            defaultValue={selectedTrend}
          >
            <SelectTrigger className="w-[350px]">
              <SelectValue placeholder="Chart" />
            </SelectTrigger>
            <SelectContent>
              {trendsData.map((trend) => (
                <SelectItem value={trend.trendsName}>
                  {trend.trendsName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-[98%]">
          <Box
            sx={{
              height: fullScreen ? "40vh" : "30vh",
              width: "100%",
            }}
          >
            <p className="text-center text-[#444] font-medium">
              {selectedTrend}
            </p>
            {selectedTrend && (
              <SelectedTrend
                trend={
                  trendsData.find(
                    (trend) => trend.trendsName === selectedTrend
                  ) as Trend
                }
              />
            )}
          </Box>
        </div>
        {trendsData.length === 0 && (
          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <Typography textAlign={"center"} sx={{ width: "100%" }}>
              No Trend Data found
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
}
