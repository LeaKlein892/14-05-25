import * as React from "react";
import { DialogProps } from "../../types/DialogProps";
import { DialogTitle, IconButton, Theme, Tooltip, Dialog } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";

export interface FloatingDialogProps extends DialogProps {
  title: string;
  splitScreenLeft?: boolean;
  splitScreenRight?: boolean;
  hideBackdrop?: boolean;
  children?: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.primary.main,
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    leftPane: {
      marginRight: "50%",
    },
    rightPane: {
      marginLeft: "50%",
    },
  })
);

export const FloatingDialogLayout: React.FC<FloatingDialogProps> = ({
  children,
  open = false,
  showCloseButton = false,
  handleClose,
  title,
  splitScreenLeft = false,
  splitScreenRight = false,
  hideBackdrop = true,
}) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      hideBackdrop={hideBackdrop}
      fullScreen
      className={
        splitScreenLeft
          ? classes.leftPane
          : splitScreenRight
          ? classes.rightPane
          : undefined
      }
    >
      <DialogTitle id="layout-dialog-title" className={classes.root}>
        {title}
        {showCloseButton ? (
          <Tooltip disableInteractive title="Close">
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClose}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <div />
        )}
      </DialogTitle>
      {children}
    </Dialog>
  );
};
