import * as React from "react";
import { useContext, useEffect, useMemo } from "react";
import {
  CssBaseline,
  Divider,
  Drawer,
  Fab,
  IconButton,
  List,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { AppModeEnum, ViewContext } from "../../../context/ViewContext";
import { SideBarItem } from "./side-bar-item/SideBarItem";
import { TokenStatus } from "../../../hooks/useTourToken";
import { GREENBOOK } from "../../../utils/clients";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    logo: {
      marginLeft: "auto",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    toggleClose: {
      position: "fixed",
      top: "10vh",
      left: drawerWidth,
      zIndex: 1,
    },
    toggle: {
      position: "fixed",
      top: theme.spacing(9),
      left: theme.spacing(1),
      zIndex: 1000,
    },
    toggleNoNavbar: {
      position: "fixed",
      top: theme.spacing(1),
      left: theme.spacing(1),
      zIndex: 1000,
    },
    toggleNoNavbarMobile: {
      position: "fixed",
      top: theme.spacing(5),
      left: theme.spacing(1),
      zIndex: 1000,
    },
  })
);

export interface SceneBasicDetails {
  name: string;
  id: string;
  entityId?: string;
}

export interface SideBarProps {
  sceneDetails: SceneBasicDetails[];
  onSceneClick?: (id: string) => void;
  tokenStatus?: TokenStatus;
}

export interface ToggleSideBarProps {
  open: boolean;
  handleDrawerClose: () => void;
  mobileMode: boolean;
}

export const ToggleSideBar = ({
  open,
  handleDrawerClose,
  mobileMode,
}: ToggleSideBarProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const { client } = useContext(ProjectInformationContext);

  return open ? (
    <Tooltip
      disableInteractive
      title={"open side bar"}
      placement={"right"}
      enterDelay={400}
      enterNextDelay={400}
    >
      <Fab
        variant="extended"
        size="small"
        color="inherit"
        onClick={handleDrawerClose}
        className={
          client === GREENBOOK
            ? mobileMode
              ? classes.toggleNoNavbarMobile
              : classes.toggleNoNavbar
            : classes.toggle
        }
      >
        {theme.direction === "ltr" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </Fab>
    </Tooltip>
  ) : (
    <div />
  );
};

let lastNavbarOpen = false;

export const SideBar: React.FC<SideBarProps> = ({
  sceneDetails,
  onSceneClick = (id: string) => {},
  tokenStatus = "NO_TOKEN",
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const { appMode, navbarOpen, setNavbarOpen } = useContext(ViewContext);
  const mobileMode = useMediaQuery(theme.breakpoints.down("lg"), {
    noSsr: true,
  });

  useEffect(() => {
    const initialNavbarState = mobileMode
      ? false
      : appMode === AppModeEnum.tourView
      ? true
      : lastNavbarOpen;
    setNavbarOpen(initialNavbarState);
  }, [setNavbarOpen, appMode, mobileMode]);

  const handleDrawerOpen = () => {
    setNavbarOpen(true);
    lastNavbarOpen = true;
  };

  const handleDrawerClose = () => {
    setNavbarOpen(false);
    lastNavbarOpen = false;
  };

  const listElement = useMemo(() => {
    return (
      <List>
        {sceneDetails.map((sceneDetail, index) => {
          const onItemClick = () => {
            onSceneClick(sceneDetail.id);
          };
          return (
            <SideBarItem
              sceneDetails={sceneDetail}
              onClick={onItemClick}
              tokenStatus={tokenStatus}
              key={index}
            />
          );
        })}
      </List>
    );
  }, [sceneDetails, onSceneClick, tokenStatus]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <ToggleSideBar
        open={!navbarOpen}
        handleDrawerClose={handleDrawerOpen}
        mobileMode={mobileMode}
      />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={navbarOpen}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Typography variant="h6" color="primary" align="left">
            Scenes
          </Typography>
          <IconButton onClick={handleDrawerClose} size="large">
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        {listElement}
      </Drawer>
    </div>
  );
};
