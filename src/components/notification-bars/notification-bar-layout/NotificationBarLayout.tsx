import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import { emptyFn } from "../../../utils/render-utils";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import { SnackbarCloseReason } from "@mui/material/Snackbar/Snackbar";

const barAnchor = {
  vertical: "top",
  horizontal: "center",
} as any;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: 10,
      position: "fixed",
      top: theme.spacing(9),
    },
    expand: {
      zIndex: 2000,
      position: "fixed",
      top: theme.spacing(1),
      right: "50%",
    },
  })
);

export interface NotificationBarLayoutProps {
  open: boolean;
  message: string;
  action?: React.ReactNode;
  onClose?: (
    event: React.SyntheticEvent<any> | Event,
    reason: SnackbarCloseReason
  ) => void;
  elementOnClosed?: React.ReactNode;
}

export const NotificationBarLayout: React.FC<NotificationBarLayoutProps> = ({
  open,
  message,
  action,
  onClose = emptyFn,
  elementOnClosed,
}) => {
  const classes = useStyles();

  return open ? (
    <Snackbar
      anchorOrigin={barAnchor}
      open={open}
      onClose={onClose}
      className={classes.root}
      message={message}
      action={action}
    />
  ) : (
    <>
      {elementOnClosed && (
        <div className={classes.expand}>{elementOnClosed}</div>
      )}
    </>
  );
};
