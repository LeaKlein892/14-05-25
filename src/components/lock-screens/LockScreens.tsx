import * as React from "react";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import { IconButton, Tooltip, useMediaQuery } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import clsx from "clsx";
import theme from "../../ui/theme";

const useStyles = makeStyles(() =>
  createStyles({
    lock: {
      position: "fixed",
      zIndex: 100,
    },
    lockBigDesktop: {
      left: "48.5%",
      bottom: "50%",
    },
    lockSmallDesktop: {
      left: "48.2%",
      bottom: "50%",
    },
    lockTablet: {
      left: "47.5%",
      bottom: "45%",
    },
    lockMobile: {
      left: "46.5%",
      bottom: "43%",
    },
  })
);

export interface LockScreensProps {
  locked: boolean;
  switchLock: () => void;
}

export const LockScreens: React.FC<LockScreensProps> = ({
  locked,
  switchLock,
}) => {
  const classes = useStyles();
  const smallDesktopMode = useMediaQuery(theme.breakpoints.down("xl"), {
    noSsr: true,
  });
  const tabletMode = useMediaQuery(theme.breakpoints.down("xl"), {
    noSsr: true,
  });
  const mobileMode = useMediaQuery(theme.breakpoints.down("lg"), {
    noSsr: true,
  });

  const lockClass = () => {
    if (mobileMode) {
      return classes.lockMobile;
    }
    if (tabletMode) {
      return classes.lockTablet;
    }
    if (smallDesktopMode) {
      return classes.lockSmallDesktop;
    }
    return classes.lockBigDesktop;
  };

  return (
    <Tooltip
      disableInteractive
      title={locked ? "Unsync Views" : "Sync Views"}
      placement={"bottom"}
      enterDelay={400}
      enterNextDelay={400}
    >
      <IconButton
        onClick={switchLock}
        className={clsx(classes.lock, lockClass())}
        aria-label="lock"
        color="secondary"
        size="large"
      >
        {locked ? (
          <LockTwoToneIcon fontSize="large" />
        ) : (
          <LockOpenTwoToneIcon fontSize="large" />
        )}
      </IconButton>
    </Tooltip>
  );
};
