import * as React from "react";
import { DialogProps } from "../../types/DialogProps";
import { DialogLayout } from "../../dialogs/dialog-layout/DialogLayout";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Theme,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";

export interface InitialPointDialogProps extends DialogProps {
  handlePointSaved: () => void;
  planTitle: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    saveLabel: {
      color: theme.palette.success.main,
    },
  })
);

const InitialPointDialog: React.FC<InitialPointDialogProps> = ({
  open = false,
  handleClose,
  handlePointSaved,
  planTitle,
}) => {
  const classes = useStyles();

  return (
    <DialogLayout
      open={open}
      handleClose={handleClose}
      title="Save initial scan point?"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {"Please make sure this is your starting point: " + planTitle}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Cancel
        </Button>
        <Button onClick={handlePointSaved} className={classes.saveLabel}>
          Save
        </Button>
      </DialogActions>
    </DialogLayout>
  );
};

export default InitialPointDialog;
