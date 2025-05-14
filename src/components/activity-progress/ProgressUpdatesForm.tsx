import * as React from "react";
import { DialogLayout } from "../dialogs/dialog-layout/DialogLayout";
import { DialogProps } from "../types/DialogProps";
import {
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { LineChart } from "@mui/x-charts/LineChart";
import { useActivityProgress } from "../../hooks/useActivityProgress";
import { CircularProgress } from "@mui/material";
import RunningWithErrorsSharpIcon from "@mui/icons-material/RunningWithErrorsSharp";
import { useActivityPlannedDates } from "../../hooks/useActivityPlannedDates";
import { stringAsDMY } from "../../utils/date-utils";
import {
  activityLabel,
  DelayedProperties,
  delayProbabilityMessage,
  getCellDataPart,
  getDelayLevel,
} from "./progress-operations";

export interface ProgressUpdatesFormProps extends DialogProps {
  cellData: string;
  mobileMode?: boolean;
  handleNavigateToTour: (date: string) => void;
  project: string;
  cellDelayPercentage: DelayedProperties;
  labels?: string[];
  dod: number;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
    },
    flexContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
    },
    tableContainer: {
      maxHeight: 400,
      flex: 1,
      marginRight: 16,
    },
    tableContainerMobile: {
      width: "100%",
    },
    chartContainer: {
      flex: 1,
      width: "100%",
    },
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    tableHeader: {
      fontWeight: "bold",
    },
    done: {
      color: "green",
    },
    inProgress: {
      color: "orange",
    },
    notStarted: {
      color: "red",
    },
    irrelevant: {
      color: "grey",
    },
    tableRow: {
      cursor: "pointer",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
      borderRadius: "4px",
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    },
    highSeverityIcon: {
      color: "#000000",
    },
    mediumSeverityIcon: {
      color: "#847e7e",
    },
  })
);

const ProgressUpdatesForm: React.FC<ProgressUpdatesFormProps> = ({
  open = false,
  handleClose,
  cellData,
  mobileMode = false,
  handleNavigateToTour,
  project,
  cellDelayPercentage,
  labels,
  dod,
}) => {
  const classes = useStyles();
  const { building, floor, activity } = getCellDataPart(cellData);
  const activityProgress = useActivityProgress(
    project,
    building,
    floor,
    activity
  );
  const activityPlannedDates = useActivityPlannedDates(
    activity,
    project,
    building,
    floor
  );

  const transformActivityProgressDates = (activityProgress: any) => {
    const updatedData = activityProgress.map((item: { date: string }) => ({
      ...item,
      date: item.date ? stringAsDMY(item.date) : null,
    }));
    return updatedData;
  };

  const formTitle = `Progress trend- building: ${building}, floor: ${floor},  ${activityLabel(
    activity,
    labels
  )}`;

  return (
    <DialogLayout
      title={formTitle}
      handleClose={handleClose}
      open={open}
      maxWidth={"lg"}
      fullScreen={mobileMode}
      showCloseButton
    >
      <div>
        {activityProgress.length >= 1 && (
          <DialogContent>
            {activityPlannedDates[0] !== 1 && (
              <Typography variant="h6" justifySelf={"center"} paddingBottom={2}>
                Planned start: {activityPlannedDates[0].startDate}.,
                {mobileMode ? <br /> : " "}
                Planned finish: {activityPlannedDates[0].endDate}.
              </Typography>
            )}
            {getDelayLevel(cellDelayPercentage.probability) !== "low" && (
              <Typography variant="h6" color="error" justifySelf={"center"}>
                {delayProbabilityMessage(cellDelayPercentage.probability)}
                <RunningWithErrorsSharpIcon
                  className={
                    getDelayLevel(cellDelayPercentage.probability) === "high"
                      ? classes.highSeverityIcon
                      : classes.mediumSeverityIcon
                  }
                />
                <br />
                {cellDelayPercentage.reason}
              </Typography>
            )}
            <div
              className={classes.flexContainer}
              style={mobileMode ? { flexDirection: "column-reverse" } : {}}
            >
              <div
                className={`${classes.tableContainer} ${
                  mobileMode && classes.tableContainerMobile
                }`}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHeader}>
                        Date
                      </TableCell>
                      <TableCell className={classes.tableHeader}>
                        Actual progress
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activityProgress
                      .slice()
                      .reverse()
                      .map((item, index) => (
                        <Tooltip title={"View site at status update"}>
                          <TableRow
                            className={classes.tableRow}
                            key={index}
                            onClick={() => handleNavigateToTour(item.date)}
                          >
                            <TableCell>{item.date}</TableCell>
                            <TableCell
                              className={
                                item.progress >= dod
                                  ? classes.done
                                  : item.progress < 1
                                  ? classes.notStarted
                                  : classes.inProgress
                              }
                            >
                              {item.progress}%
                            </TableCell>
                          </TableRow>
                        </Tooltip>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <div className={classes.chartContainer}>
                <LineChart
                  xAxis={[
                    {
                      id: "date",
                      dataKey: "date",
                      scaleType: "time",
                      valueFormatter: (value) => value.toLocaleDateString(),
                      labelStyle: {
                        fontSize: 15,
                        transform: `translateY(0px)`,
                      },
                      tickLabelStyle: {
                        angle: 45,
                        textAnchor: "start",
                        fontSize: 16,
                      },
                    },
                  ]}
                  margin={{ bottom: 80 }}
                  yAxis={[
                    {
                      valueFormatter: (value) => `${value}%`,
                      colorMap: {
                        type: "piecewise",
                        thresholds: [1, dod - 1],
                        colors: ["red", "yellow", "green"],
                      },
                    },
                  ]}
                  series={[
                    {
                      id: "progress",
                      curve: "linear",
                      dataKey: "progress",
                      valueFormatter: (value) => `${value}%`,
                    },
                  ]}
                  dataset={transformActivityProgressDates(activityProgress)}
                  height={300}
                  onMarkClick={(data, index) => {
                    index.dataIndex !== undefined
                      ? handleNavigateToTour(
                          activityProgress[index.dataIndex].date
                        )
                      : console.log("No data found");
                  }}
                />
              </div>
            </div>
          </DialogContent>
        )}
        {activityProgress.length < 1 && (
          <DialogContent className={classes.loadingContainer}>
            <CircularProgress />
          </DialogContent>
        )}

        {activityProgress[0] === 1 && (
          <DialogContent>
            <Typography variant="body1">
              No status changes were found
            </Typography>
          </DialogContent>
        )}
      </div>
    </DialogLayout>
  );
};

export default ProgressUpdatesForm;
