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
import { useActivityPlannedDates } from "../../hooks/useActivityPlannedDates";
import { activityLabel } from "./progress-operations";

export interface ProgressPlannedFormProps extends DialogProps {
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

const ProgressPlannedForm: React.FC<ProgressPlannedFormProps> = ({
  project,
  open = false,
  handleClose,
  activity,
  mobileMode = false,
  labels,
}) => {
  const classes = useStyles();
  const activityPlannedDates = useActivityPlannedDates(activity, project);

  return (
    <DialogLayout
      title={`Planned progress for ${activityLabel(activity, labels)}`}
      handleClose={handleClose}
      open={open}
      maxWidth={"md"}
      fullScreen={mobileMode}
      showCloseButton
    >
      <div>
        {activityPlannedDates.length >= 1 && activityPlannedDates[0] !== 1 && (
          <DialogContent>
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
                        Area
                      </TableCell>
                      <TableCell className={classes.tableHeader}>
                        Start date
                      </TableCell>
                      <TableCell className={classes.tableHeader}>
                        End date
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activityPlannedDates.map((item, index) => (
                      <TableRow className={classes.tableRow} key={index}>
                        <TableCell>
                          Building {item.building} Floor {item.floor}
                        </TableCell>
                        <TableCell>{item.startDate}</TableCell>
                        <TableCell>{item.endDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </DialogContent>
        )}
        {activityPlannedDates.length < 1 && (
          <DialogContent className={classes.loadingContainer}>
            <CircularProgress />
          </DialogContent>
        )}

        {activityPlannedDates[0] === 1 && (
          <DialogContent>
            <Typography variant="body1">No planned dates were found</Typography>
          </DialogContent>
        )}
      </div>
    </DialogLayout>
  );
};

export default ProgressPlannedForm;
