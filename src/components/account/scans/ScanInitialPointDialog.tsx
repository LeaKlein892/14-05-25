import * as React from "react";
import { useEffect, useState } from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  Typography,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { DialogLayout } from "../../dialogs/dialog-layout/DialogLayout";
import { DialogProps } from "../../types/DialogProps";
import { PlanInitialPoint, ScanRecord } from "../../../models";
import { useHistory } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcone from "@mui/icons-material/Add";
import { updatePlanInitialPoint } from "../../../graphql/mutations";
import { API } from "aws-amplify";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api";
import { emptyArray } from "../../../utils/render-utils";
import {
  setStorageKeyValue,
  setStorageWithExpiration,
} from "../../../utils/storage-manager";
import { text } from "../../../utils/translation";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    uploadLabel: {
      color: theme.palette.primary.main,
    },
  })
);
export interface ScanInitialPointDialogProps extends DialogProps {
  fileName: string;
  mobileMode?: boolean;
  ScanInitialPoint: PlanInitialPoint | undefined;
}
export const ScanInitialPointDialog: React.FC<ScanInitialPointDialogProps> = ({
  fileName,
  open = false,
  mobileMode,
  handleClose,
  ScanInitialPoint,
}) => {
  let history = useHistory();
  const classes = useStyles();
  const [scanRecords, setScanRecords] = useState<ScanRecord[]>(emptyArray);
  const [index, setIndex] = useState<number>(0);
  const [addScan, setAddScan] = useState<boolean>(false);

  useEffect(() => {
    if (ScanInitialPoint?.scanRecords) {
      const reversedCopy = [...ScanInitialPoint.scanRecords].reverse();
      setScanRecords(reversedCopy);
    }
  }, [ScanInitialPoint?.scanRecords]);

  const handleDeleteClick = async (data: string) => {
    try {
      const updatedScanRecords =
        scanRecords?.filter((item) => item.recordDate !== data) ?? [];
      await API.graphql({
        query: updatePlanInitialPoint,
        variables: {
          input: {
            id: ScanInitialPoint?.id,
            scanRecords: updatedScanRecords,
          },
        },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
      if (updatedScanRecords.length > 0) {
        setScanRecords([...updatedScanRecords]);
      } else {
        handleClose();
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };
  const handleAddClick = (indexFromTable: number, project: string) => {
    setIndex((ScanInitialPoint?.scanRecords?.length || 0) - indexFromTable);
    setAddScan(true);
  };
  const handleConfirmDialogClose = () => {
    setAddScan(false);
  };
  const handelConfirm = () => {
    handleConfirmDialogClose();
    setStorageWithExpiration("ADD_SCAN_TIME");
    setStorageKeyValue("INDEX_TO_ADD_BEFORE", index.toString());
    setStorageKeyValue(
      "CURRENT_PROJECT",
      ScanInitialPoint?.id ? ScanInitialPoint.id : ""
    );
    history.push("/project");
  };
  return (
    <DialogLayout
      handleClose={handleClose}
      open={open}
      maxWidth="xs"
      showCloseButton
      fullScreen={mobileMode}
      title="My Scan records"
    >
      <DialogContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Building</TableCell>
              <TableCell>Floor</TableCell>
              <TableCell>Date</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scanRecords?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.building}</TableCell>
                <TableCell>{item.floor}</TableCell>
                <TableCell>{item.recordDate}</TableCell>
                <TableCell>
                  <Tooltip disableInteractive title="Delete" placement="top">
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteClick(item.recordDate)}
                      size="large"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    disableInteractive
                    title="Add before"
                    placement="top"
                  >
                    <IconButton
                      aria-label="Add"
                      onClick={() => {
                        if (ScanInitialPoint && ScanInitialPoint.id)
                          handleAddClick(
                            index,
                            ScanInitialPoint.id.split("_")[0]
                          );
                      }}
                      size="large"
                    >
                      <AddIcone />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {addScan && (
          <DialogLayout
            handleClose={handleConfirmDialogClose}
            open={open}
            maxWidth="sm"
            fullScreen={false}
            showCloseButton
            title=""
          >
            <Typography variant="subtitle2" align="center">
              {text("add_scan_before")}
            </Typography>
            <DialogContent>
              <DialogActions>
                <Button onClick={handelConfirm} className={classes.uploadLabel}>
                  OK
                </Button>
                <Button
                  onClick={handleConfirmDialogClose}
                  className={classes.uploadLabel}
                >
                  Cancel
                </Button>
              </DialogActions>
            </DialogContent>
          </DialogLayout>
        )}
      </DialogContent>
    </DialogLayout>
  );
};
