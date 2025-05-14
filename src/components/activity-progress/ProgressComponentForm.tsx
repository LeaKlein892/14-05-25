import * as React from "react";
import { DialogLayout } from "../dialogs/dialog-layout/DialogLayout";
import { DialogProps } from "../types/DialogProps";
import {
  CircularProgress,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { makeStyles, createStyles } from "@mui/styles";
import { CategoryChildren } from "../../models";
import { activityLabel, getCellDataPart } from "./progress-operations";
import { fetchActivityProgress } from "../../hooks/useActivityProgress";
import { useEffect, useState } from "react";

export interface ProgressComponentFormProps extends DialogProps {
  aggregated: CategoryChildren[];
  mobileMode?: boolean;
  cellData: any;
  project: string;
  date: string;
  labels?: string[];
}
const useStyles = makeStyles(() =>
  createStyles({
    loadingContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "300px",
      width: "600px",
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
    totalRow: {
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
    calculate: {
      marginTop: "20px",
    },
  })
);

const ProgressComponentForm: React.FC<ProgressComponentFormProps> = ({
  aggregated,
  open = false,
  handleClose,
  mobileMode = false,
  cellData,
  project,
  date,
  labels = [],
}) => {
  const classes = useStyles();
  const { building, floor, activity } = getCellDataPart(cellData);
  const [childrenWithProgress, setChildrenWithProgress] = useState<
    { name: string; weight?: number; progress: number }[]
  >([]);

  const getProgressByDate = async (activities: string[]) => {
    try {
      const results = await Promise.all(
        activities.map((activity) =>
          fetchActivityProgress(project, building, floor, activity)
        )
      );

      const progressMap = activities.reduce((acc, activity, index) => {
        const progressItem = results[index].find((item) => item.date === date);
        acc[activity] = progressItem ? progressItem.progress.toFixed(0) : 0;
        return acc;
      }, {} as Record<string, number>);

      return progressMap;
    } catch (error) {
      console.error("Error fetching progress by date:", error);
      return {};
    }
  };

  useEffect(() => {
    const fetchChildrenWithProgress = async () => {
      const activityNames = aggregated.map((child) => child.name);
      const progressMap = await getProgressByDate(activityNames);

      const updatedChildren = aggregated.map((child) => ({
        ...child,
        progress: progressMap[child.name] ?? 0,
      }));

      setChildrenWithProgress(updatedChildren);
    };

    fetchChildrenWithProgress();
  }, [project, building, floor, aggregated]);

  const total = childrenWithProgress?.reduce(
    (sum, child) => sum + (child.weight ? child.weight * child.progress : 0),
    0
  );
  return (
    <DialogLayout
      title={`${activity} components`}
      handleClose={handleClose}
      open={open}
      showCloseButton
      maxWidth="sm"
    >
      <div>
        {childrenWithProgress.length > 0 ? (
          <DialogContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableHeader}>
                    Category
                  </TableCell>
                  <TableCell className={classes.tableHeader}>Weight</TableCell>
                  <TableCell className={classes.tableHeader}>
                    Actual Progress
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {childrenWithProgress?.map((child) => (
                  <TableRow key={child.name}>
                    <TableCell>{activityLabel(child.name, labels)}</TableCell>
                    <TableCell>{child.weight ? child.weight : 0}</TableCell>
                    <TableCell
                      className={
                        child.progress >= 100
                          ? classes.done
                          : child.progress < 1
                          ? classes.notStarted
                          : classes.inProgress
                      }
                    >
                      {child.progress}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {mobileMode || (
              <div>
                <h1 className={classes.calculate}>Calculated value:</h1>

                <div className={classes.totalRow}>
                  {childrenWithProgress?.map((child, index) => (
                    <h3 key={index}>
                      {`(${child.weight ? child.weight : 0} x ${
                        child.progress
                      }%)`}
                      {index < childrenWithProgress.length - 1 ? " +" : " ="}
                    </h3>
                  ))}
                  <h2
                    className={
                      total >= 100
                        ? classes.done
                        : total < 1
                        ? classes.notStarted
                        : classes.inProgress
                    }
                  >
                    {total?.toFixed(0)}%
                  </h2>
                </div>
              </div>
            )}
          </DialogContent>
        ) : (
          <DialogContent className={classes.loadingContainer}>
            <CircularProgress />
          </DialogContent>
        )}
      </div>
    </DialogLayout>
  );
};

export default ProgressComponentForm;
