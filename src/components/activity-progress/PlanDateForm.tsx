import React from "react";
import { Button, DialogContent, DialogActions, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DialogLayout } from "../dialogs/dialog-layout/DialogLayout";
import { makeStyles, createStyles } from "@mui/styles";
import { updatePlannedDate } from "../../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";
import dayjs from "dayjs";
import { showMessage } from "../../utils/messages-manager";

const useStyles = makeStyles(() =>
  createStyles({
    datePickerContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
  })
);

const PlanDateForm = ({
  open,
  handleClose,
  activity,
  project,
  building,
  floor,
}: {
  open: boolean;
  handleClose: () => void;
  activity: string;
  project: string;
  building: string;
  floor: string;
}) => {
  const classes = useStyles();
  const [startDate, setStartDate] = React.useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = React.useState<dayjs.Dayjs | null>(null);

  const handleSave = () => {
    if (!startDate || !endDate) {
      return;
    }
    try {
      const formattedStartDate = startDate.format("DD-MM-YYYY");
      const formattedEndDate = endDate.format("DD-MM-YYYY");
      const result = API.graphql(
        graphqlOperation(updatePlannedDate, {
          activity: activity,
          project: project,
          building: building,
          floor: floor,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        })
      ) as Promise<any>;
      showMessage("Planned dates updated successfully", "success");
      handleClose();
    } catch (error) {
      console.error("Error updating planned dates:", error);
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DialogLayout
        title={`Set Planned Date For ${activity} building ${building} floor ${floor}`}
        handleClose={handleClose}
        open={open}
        maxWidth="lg"
        showCloseButton
      >
        <DialogContent>
          <div className={classes.datePickerContainer}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => setEndDate(date)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </DialogLayout>
    </LocalizationProvider>
  );
};
export default PlanDateForm;
