import * as React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Theme,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { DialogProps } from "../types/DialogProps";
import { DialogLayout } from "../dialogs/dialog-layout/DialogLayout";

export interface PublishPhotosConfirmationProps extends DialogProps {
  handlePhotosPublish: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    publishLabel: {
      color: theme.palette.success.main,
    },
  })
);

export const PublishPhotosConfirmation: React.FC<
  PublishPhotosConfirmationProps
> = ({ open = false, handleClose, handlePhotosPublish }) => {
  const classes = useStyles();

  return (
    <DialogLayout
      open={open}
      handleClose={handleClose}
      maxWidth="md"
      showCloseButton
      title="Would you like to publish photo tour?"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Please make sure you would like to publish photo documentation. You
          can also add more photos to your documentation by clicking the cancel
          button
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Cancel
        </Button>
        <Button onClick={handlePhotosPublish} className={classes.publishLabel}>
          Publish
        </Button>
      </DialogActions>
    </DialogLayout>
  );
};
