import * as React from "react";
import { useContext } from "react";
import clsx from "clsx";
import { AppBar, Theme, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { LogoButton } from "./LogoButton";
import { NavbarLinks, TabValue } from "./NavbarLinks";
import { ViewContext } from "../../context/ViewContext";
import { AccountMenu } from "../account/AccountMenu";
import { getQueryArgs } from "../../utils/query-params";
import { GREENBOOK, JM } from "../../utils/clients";
import { Loader } from "../loader/Loader";
import { BackgroundTasksContext } from "../../context/BackgroundTasksContext";
import { SearchInput } from "./SearchInput";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { LoggedUserContext } from "../../context/LoggedUserContext";

const drawerWidth = 240;
const clientArg = getQueryArgs("client");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: 50,
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
    hide: {
      display: "none",
    },
  })
);

export const Navbar: React.FC = React.memo(() => {
  const classes = useStyles();

  const { appMode, tabValue, setTabValue, navbarOpen } =
    useContext(ViewContext);
  const { areBackgroundTasksRunning, currentTask, totalTasks } = useContext(
    BackgroundTasksContext
  );
  const { projects } = useContext(ProjectInformationContext);
  const { loggedUser } = useContext(LoggedUserContext);
  const theme = useTheme();

  const mobileMode = useMediaQuery(theme.breakpoints.down("lg"), {
    noSsr: true,
  });

  const handleChange = (event: React.ChangeEvent<{}>, newValue: TabValue) => {
    sessionStorage.removeItem("DisplayTour");
    sessionStorage.removeItem("SceneTourData");
    sessionStorage.removeItem("AnchorScene");
    sessionStorage.removeItem("ShowProgressOnMap");
    sessionStorage.removeItem("ClickedCellData");
    setTabValue(newValue);
  };

  return clientArg === GREENBOOK || clientArg === JM ? (
    appMode && (
      <LogoButton
        loggedUser={loggedUser}
        mobileMode={mobileMode}
        transparent
        projectsCount={projects ? projects.length : 0}
        appMode={appMode}
      />
    )
  ) : (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: tabValue === TabValue.Tour && navbarOpen,
        })}
      >
        <Toolbar>
          <NavbarLinks
            mobileMode={mobileMode}
            tabValue={tabValue}
            handleChange={handleChange}
          />
          <Loader
            loading={areBackgroundTasksRunning}
            color="secondary"
            current={currentTask}
            total={totalTasks}
          />
          {appMode && (
            <SearchInput
              projectsCount={projects?.length || 0}
              appMode={appMode}
            />
          )}
          {appMode && (
            <LogoButton
              loggedUser={loggedUser}
              mobileMode={mobileMode}
              projectsCount={projects ? projects.length : 0}
              appMode={appMode}
            />
          )}
          <AccountMenu />
        </Toolbar>
      </AppBar>
    </>
  );
});
