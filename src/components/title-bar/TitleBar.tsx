import React, { useContext, useState } from "react";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { SnackbarOrigin } from "@mui/material/Snackbar/Snackbar";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { getSessionStorageItem } from "../../utils/projects-utils";
const centerOfPage = window.innerWidth / 2;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      zIndex: 2000,
    },
    splitMode: {
      zIndex: 1300,
      position: "sticky",
      marginTop: "-55px",
      marginLeft: `${centerOfPage}px`,
    },
    tour: {
      zIndex: 1300,
      position: "sticky",
      marginTop: "-95px",
      marginLeft: `${centerOfPage}px`,
    },
    expand: {
      zIndex: 1000,
      position: "fixed",
      bottom: theme.spacing(3),
      right: "45%",
    },
    close: {
      padding: theme.spacing(0.5),
    },
  })
);

const anchorOrigin: SnackbarOrigin = {
  vertical: "bottom",
  horizontal: "center",
};

const snackbarStyle = (inCompareMode: boolean): React.CSSProperties => ({
  bottom: "3vh",
  left: inCompareMode ? "calc(50% - 23vh)" : "50%",
  transform: "translateX(-50%)",
});

export interface TitleBarProps {
  title: string;
  onToggle?: () => void;
  open?: boolean;
  hide?: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  title = "",
  onToggle = () => {},
  open = true,
  hide = false,
}) => {
  const { inCompareMode } = useContext(ProjectInformationContext);

  const handleClose = (
    event: React.SyntheticEvent<any> | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    onToggle();
  };

  const classes = useStyles();

  return !hide ? (
    open ? (
      <div>
        <Snackbar
          anchorOrigin={anchorOrigin}
          open={open}
          style={snackbarStyle(!!inCompareMode)}
          onClose={handleClose}
          className={
            getSessionStorageItem("ShowProgressOnMap") &&
            !getSessionStorageItem("DisplayTour")
              ? classes.splitMode
              : getSessionStorageItem("DisplayTour")
              ? classes.tour
              : classes.root
          }
          message={title}
          action={
            <React.Fragment>
              <IconButton
                aria-label="close"
                color="secondary"
                className={classes.close}
                onClick={handleClose}
                size="large"
              >
                <CloseIcon />
              </IconButton>
            </React.Fragment>
          }
        />
      </div>
    ) : (
      <div>
        <IconButton
          aria-label="expand"
          color="secondary"
          className={
            getSessionStorageItem("ShowProgressOnMap")
              ? classes.splitMode
              : classes.expand
          }
          onClick={onToggle}
          size="large"
        >
          <ExpandLessIcon />
        </IconButton>
      </div>
    )
  ) : (
    <div />
  );
};
