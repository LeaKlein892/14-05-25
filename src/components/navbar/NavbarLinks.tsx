import * as React from "react";
import { useContext } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  Tab,
  Tabs,
  Theme,
} from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { createStyles, makeStyles, withStyles } from "@mui/styles";
import MenuIcon from "@mui/icons-material/Menu";
import clsx from "clsx";
import Paper from "@mui/material/Paper";
import { AppModeEnum, ViewContext } from "../../context/ViewContext";
import { getQueryArgs } from "../../utils/query-params";
import { text } from "../../utils/translation";
import { Project, UserProfile } from "../../models";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { LoggedUserContext } from "../../context/LoggedUserContext";
export enum TabValue {
  Projects = "/project",
  Plan = "/plan",
  Tour = "/tour",
  Tasks = "/tasks",
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabsContainer: {
      marginLeft: "10px",
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    root: {
      color: theme.palette.primary.main,
      width: "100vw",
    },
    list: {
      paddingTop: 0,
      paddingBottom: 0,
    },
  })
);

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #bebebe",
  },
  list: {
    padding: "0px",
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const clientArg = getQueryArgs("client");

export interface NavbarLinksProps {
  mobileMode: boolean;
  tabValue: TabValue;
  handleChange: (event: React.ChangeEvent<{}>, newValue: TabValue) => void;
}

export const NavbarLinks: React.FC<NavbarLinksProps> = ({
  mobileMode = false,
  tabValue,
  handleChange,
}) => {
  const classes = useStyles();
  const { appMode } = useContext(ViewContext);
  const { currentProject, setCurrentProject } = useContext(
    ProjectInformationContext
  );
  const { loggedUser, setLoggedUser } = useContext(LoggedUserContext);
  const planText = text("plan", clientArg);
  const tourText = text("tour", clientArg);
  const [menuElement, setMenuElement] = React.useState<null | HTMLElement>(
    null
  );
  let history = useHistory();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuElement(event.currentTarget);
  };

  const handleClose = () => {
    setMenuElement(null);
  };
  const isPlanOrTourView =
    appMode === AppModeEnum.planView || appMode === AppModeEnum.tourView;
  const moveToRoute = (route: TabValue) => {
    history.push(route);
    handleClose();
  };

  return mobileMode ? (
    <div>
      {(loggedUser?.id || isPlanOrTourView) && (
        <>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleClick}
            edge="start"
            className={clsx(classes.menuButton)}
            size="large"
          >
            <MenuIcon />
          </IconButton>

          <StyledMenu
            id="simple-menu"
            anchorEl={menuElement}
            keepMounted
            open={Boolean(menuElement)}
            onClose={handleClose}
          >
            <Paper className={classes.root}>
              <MenuItem
                onClick={() => moveToRoute(TabValue.Projects)}
                style={{
                  display:
                    appMode !== AppModeEnum.projectView ? "none" : "flex",
                }}
              >
                Projects
              </MenuItem>
              {(currentProject || isPlanOrTourView) && (
                <>
                  <MenuItem
                    onClick={() => moveToRoute(TabValue.Plan)}
                    style={{
                      display:
                        appMode === AppModeEnum.tourView ? "none" : "flex",
                    }}
                  >
                    {planText}
                  </MenuItem>
                  <MenuItem
                    onClick={() => moveToRoute(TabValue.Tour)}
                    style={{
                      display: "flex",
                    }}
                  >
                    {tourText}
                  </MenuItem>
                  <MenuItem
                    onClick={() => moveToRoute(TabValue.Tasks)}
                    style={{
                      display:
                        appMode !== AppModeEnum.projectView ? "none" : "flex",
                    }}
                  >
                    Tasks
                  </MenuItem>
                </>
              )}
            </Paper>
          </StyledMenu>
        </>
      )}
    </div>
  ) : (
    <>
      {(loggedUser?.id || isPlanOrTourView) && (
        <>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            className={classes.tabsContainer}
            indicatorColor="secondary"
            textColor="inherit"
          >
            <Tab
              label="Projects"
              value={TabValue.Projects}
              component={Link}
              to={TabValue.Projects}
              style={{
                display:
                  appMode !== AppModeEnum.projectView ? "none" : "inline",
                padding: "12px 40px",
              }}
            />
            {(currentProject || isPlanOrTourView) && (
              <>
                <Tabs
                  value={tabValue}
                  onChange={handleChange}
                  className={classes.tabsContainer}
                  indicatorColor="secondary"
                  textColor="inherit"
                >
                  <Tab
                    label={planText}
                    value={TabValue.Plan}
                    component={Link}
                    to={TabValue.Plan}
                    style={{
                      display:
                        appMode === AppModeEnum.tourView ? "none" : "inline",
                      padding: "12px 40px",
                    }}
                  />
                  <Tab
                    label={tourText}
                    value={TabValue.Tour}
                    component={Link}
                    to={TabValue.Tour}
                    style={{
                      display: "inline",
                      padding: "12px 40px",
                    }}
                  />
                  <Tab
                    label="Tasks"
                    value={TabValue.Tasks}
                    component={Link}
                    to={TabValue.Tasks}
                    style={{
                      display:
                        appMode !== AppModeEnum.projectView ? "none" : "inline",
                      padding: "12px 40px",
                    }}
                  />
                </Tabs>
              </>
            )}
          </Tabs>
        </>
      )}
    </>
  );
};
