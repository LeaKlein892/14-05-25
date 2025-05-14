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
  Typography,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { CircularProgress } from "@mui/material";
import {
  activityLabel,
  delayProbabilityMessage,
  normalizeActivityName,
} from "./progress-operations";
import { useProgressDelayedActivities } from "../../hooks/useProgressDelayedActivities";

export interface ProgressDelaysFormProps extends DialogProps {
  project: string;
  activity: string;
  mobileMode?: boolean;
  labels?: string[];
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
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    tableHeader: {
      fontWeight: "bold",
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
  })
);

const ProgressDelaysForm: React.FC<ProgressDelaysFormProps> = ({
  project,
  open = false,
  handleClose,
  activity,
  mobileMode = false,
  labels,
}) => {
  const classes = useStyles();
  const progressDelayedCells = useProgressDelayedActivities(project);

  const filteredDelays = React.useMemo(() => {
    return new Map(
      Array.from(progressDelayedCells).filter(([key, _]) =>
        key.includes(normalizeActivityName(activity))
      )
    );
  }, [progressDelayedCells, activity]);

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Once filteredDelays is defined (even if empty), we're done loading
    setIsLoading(false);
  }, [filteredDelays]);

  return (
    <DialogLayout
      title={`Delay risks for ${activityLabel(activity, labels)}`}
      handleClose={handleClose}
      open={open}
      maxWidth={"lg"}
      fullScreen={mobileMode}
      showCloseButton
    >
      <div>
        {isLoading ? (
          <DialogContent
            className={classes.loadingContainer}
            style={{
              height: "60vh",
            }}
          >
            <CircularProgress />
          </DialogContent>
        ) : filteredDelays.size > 0 ? (
          <DialogContent
            style={{
              height: "60vh",
            }}
          >
            <div
              className={classes.flexContainer}
              style={mobileMode ? { flexDirection: "column-reverse" } : {}}
            >
              <div
                className={`${classes.tableContainer} ${
                  mobileMode && classes.tableContainerMobile
                }`}
              >
                <Table size="medium">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableHeader}>
                        Area
                      </TableCell>
                      <TableCell className={classes.tableHeader}>
                        Risk
                      </TableCell>
                      <TableCell className={classes.tableHeader}>
                        Explanation
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Array.from(filteredDelays.entries()).map(
                      ([key, details], index) => {
                        const [building, floor, activityName] = key.split("#");
                        return (
                          <TableRow className={classes.tableRow} key={index}>
                            <TableCell>
                              Building {building} Floor {floor}
                            </TableCell>
                            <TableCell>
                              {delayProbabilityMessage(details.probability)}
                            </TableCell>
                            <TableCell>{details.reason}</TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        ) : (
          <DialogContent>
            <Typography variant="body1">No delays were found</Typography>
          </DialogContent>
        )}
      </div>
    </DialogLayout>
  );
};

export default ProgressDelaysForm;
