import * as React from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Divider, Menu, Theme, Typography } from "@mui/material";

export interface ScreenLocation {
  mouseX: number | null;
  mouseY: number | null;
}

export interface MenuLayoutProps {
  handleClose: () => void;
  pressedScreen: ScreenLocation;
  title?: string;
  children?: React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
    },
    header: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

export const initialScreenLocation: ScreenLocation = {
  mouseX: null,
  mouseY: null,
};

export const MenuLayout: React.FC<MenuLayoutProps> = ({
  handleClose,
  pressedScreen,
  title,
  children,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Menu
        keepMounted
        open={pressedScreen.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          pressedScreen.mouseY !== null && pressedScreen.mouseX !== null
            ? { top: pressedScreen.mouseY, left: pressedScreen.mouseX }
            : undefined
        }
      >
        <Typography variant="h6" color="primary" className={classes.header}>
          {title}
        </Typography>
        <Divider light />
        {children}
      </Menu>
    </div>
  );
};
