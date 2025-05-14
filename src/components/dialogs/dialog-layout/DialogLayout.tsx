import * as React from "react";
import { DialogProps } from "../../types/DialogProps";
import { Dialog, DialogTitle, IconButton, Theme, Tooltip } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";

export interface DialogLayoutProps extends DialogProps {
  title: string;
  children?: React.ReactNode;
  disableBackdropClick?: boolean;
  scroll?: DialogProps["scroll"];
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
  })
);

export const DialogLayout: React.FC<DialogLayoutProps> = ({
  children,
  open = false,
  showCloseButton = false,
  fullScreen = false,
  handleClose,
  maxWidth = false,
  title,
  disableBackdropClick = false,
  scroll = "paper",
}) => {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={() => (disableBackdropClick ? undefined : handleClose)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={!!maxWidth}
      maxWidth={maxWidth}
      fullScreen={fullScreen}
      scroll={scroll}
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
