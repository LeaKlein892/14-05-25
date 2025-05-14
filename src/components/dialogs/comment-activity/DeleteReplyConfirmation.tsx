import * as React from "react";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Theme,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { DialogLayout } from "../dialog-layout/DialogLayout";
import { DialogProps } from "../../types/DialogProps";
import { createStyles } from "@mui/styles";
export interface DeleteReplyConfirmationProps extends DialogProps {
  handleDelete: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    deleteLabel: {
      color: theme.palette.error.main,
    },
  })
);

export const DeleteReplyConfirmation: React.FC<
  DeleteReplyConfirmationProps
> = ({ open = false, handleClose, handleDelete }) => {
  const classes = useStyles();

  return (
    <DialogLayout
      open={open}
      handleClose={handleClose}
      showCloseButton
      title="Delete task reply?"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you would like to delete this reply?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Cancel
        </Button>
        <Button onClick={handleDelete} className={classes.deleteLabel}>
          Delete
        </Button>
      </DialogActions>
    </DialogLayout>
  );
};
