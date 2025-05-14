import * as React from "react";
import { lazy, Suspense } from "react";
import { useContext, useEffect, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import {
  Divider,
  Grid,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { Project } from "../../../models";
import { BuildingsList } from "../buildings-list/BuildingsList";
import { ProjectInfo } from "../project-info/ProjectInfo";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PublishIcon from "@mui/icons-material/Publish";
import "./ProjectViewer.css";
import { FilterSortButton } from "../../filter-sort-button/FilterSortButton";
import {
  compareDatesStrings,
  getAllToursAndPlansMap,
} from "../../../utils/projects-utils";
import { analyticsEvent } from "../../../utils/analytics";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { getQueryArgs } from "../../../utils/query-params";
import { useHistory } from "react-router-dom";
import { emptyFn } from "../../../utils/render-utils";
import theme from "../../../ui/theme";
import TimelineIcon from "@mui/icons-material/Timeline";
import BuildingIcon from "@mui/icons-material/Apartment";
import { CenterPageLoader } from "../../loader/CenterPageLoader";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { NA } from "../../../utils/clients";

const ActivityProgress = lazy(
  () => import("../../activity-progress/ActivityProgress")
);
const MultiFileUploader = lazy(
  () => import("../../multi-file-uploader/MultiFileUploader")
);

export interface ProjectViewerProps {
  project?: Project;
  onInvite: (project: Project | undefined) => void;
}

let redirected = false;
const loadTour = getQueryArgs("loadTour");
const loadPlan = getQueryArgs("loadPlan");

const detailsStyles = { paddingBottom: "0px", paddingTop: "10px" };

const useStyles = makeStyles((theme) =>
  createStyles({
    projectView: {
      minHeight: "100%",
      overflowX: "hidden",
    },
    fixStyles: {
      margin: theme.spacing(0), //fix grid bug
    },
    darker: {
      background: "rgba(0,0,0,0.4)",
      width: "100%",
    },
    filtersLine: {
      position: "relative",
      display: "flex",
      borderRadius: theme.shape.borderRadius,
    },
    mobileFilterLine: {
      marginTop: -10,
      marginLeft: 0,
    },
    darkerToLight: {
      backgroundImage:
        "linear-gradient(rgba(0,0,0,0.4) 20px, rgba(0,0,0,0.2) 50px, rgba(0,0,0,0))",
    },
    divider: {
      border: `1px solid ${theme.palette.info.light}}`,
    },
  })
);

let previousInitialChecked: string[] | undefined;
let lastProject: string | undefined;
const scanStyle = { marginLeft: "70px", marginTop: "20px" };
const rightButtonStyle = { zIndex: 110 };

export const ProjectViewer: React.FC<ProjectViewerProps> = ({
  project,
  onInvite,
}) => {
  const { client } = useContext(ProjectInformationContext);
  const classes = useStyles();
  const { loggedUser } = useContext(LoggedUserContext);
  let history = useHistory();
  const backgroundStyle = {
    backgroundImage: `url(${project?.imageURL})`,
    backgroundSize: "100%",
    backgroundRepeat: "repeat",
  };

  const [scanDates, setScanDates] = useState<string[]>([]);
  const [checkedFilters, setCheckedFilters] = useState<string[] | undefined>(
    previousInitialChecked
  );
  const [showTimelineIcon, setShowTimelineIcon] = useState<Boolean>(
    JSON.parse(sessionStorage.getItem("projectView") || "false")
  );
  const [showUpload, setShowUpload] = useState(false);
  const mobileMode = useMediaQuery(theme.breakpoints.down("lg"), {
    noSsr: true,
  });

  const onUploadClick = () => setShowUpload(true);

  const handleCloseUpload = () => setShowUpload(false);

  const handleScanFilterChange = (filterBy: string[]) => {
    analyticsEvent("Project", "Scan dates filtered", loggedUser.username);
    previousInitialChecked = filterBy;
    setCheckedFilters(previousInitialChecked);
  };

  useEffect(() => {
    if (project) {
      if (project.name !== lastProject) {
        previousInitialChecked = undefined;
        setCheckedFilters(undefined);
        lastProject = project.name;
      }
      const toursDetailsMap = getAllToursAndPlansMap(project);
      const scansSet = new Set<string>();
      toursDetailsMap.forEach((value) => {
        scansSet.add(value.info.date);
      });
      const scanArray = Array.from(scansSet);
      setScanDates(scanArray);
    }
  }, [project]);

  useEffect(() => {
    if (loadTour && !redirected) {
      redirected = true;
      history.push("/tour");
    }
    if (loadPlan && !redirected) {
      redirected = true;
      history.push("/plan");
    }
  }, [history]);

  const handleIconToggle = () => {
    analyticsEvent(
      "Progress",
      "Project View Mode Toggled",
      loggedUser.username || client || NA
    );
    setShowTimelineIcon(!showTimelineIcon);
    sessionStorage.clear();
    sessionStorage.setItem("projectView", showTimelineIcon ? "false" : "true");
  };

  const getGridSize = mobileMode ? 6 : 4;

  return (
    <div className={classes.projectView} style={backgroundStyle}>
      <Grid container item md={12} className={classes.fixStyles}>
        <Grid item md={12} className={classes.darker}>
          <Grid
            container
            direction="row"
            className={`${classes.filtersLine} ${
              mobileMode ? classes.mobileFilterLine : ""
            }`}
          >
            <Grid item xs={getGridSize} md={getGridSize}>
              {!showTimelineIcon && (
                <div style={scanStyle}>
                  <FilterSortButton
                    title={"Scans"}
                    noSortMode
                    onSort={emptyFn}
                    onSortDesc={emptyFn}
                    onFilter={handleScanFilterChange}
                    filterOptions={scanDates}
                    initialChecked={checkedFilters}
                    variant="outlined"
                    color="secondary"
                    sortFn={compareDatesStrings}
                  />
                </div>
              )}
            </Grid>

            {!mobileMode && (
              <Grid
                item
                xs={4}
                md={4}
                justifySelf="end"
                alignSelf="center"
                justifyItems="end"
              >
                <ProjectInfo project={project} />
              </Grid>
            )}

            <Grid
              container
              item
              justifyContent="flex-end"
              justifySelf="end"
              alignSelf="center"
              xs={getGridSize}
              md={getGridSize}
            >
              <Grid item>
                <IconButton
                  aria-label={"invite"}
                  onClick={() => onInvite(project)}
                  size="large"
                  style={rightButtonStyle}
                >
                  <Tooltip
                    disableInteractive
                    title={"invite to project"}
                    placement={"left"}
                    enterDelay={400}
                    enterNextDelay={400}
                  >
                    <PersonAddIcon className={"white-icon"} />
                  </Tooltip>
                </IconButton>
              </Grid>
              {!mobileMode && (
                <Grid item>
                  <IconButton
                    style={rightButtonStyle}
                    aria-label={"Upload"}
                    onClick={onUploadClick}
                    size="large"
                  >
                    <Tooltip
                      disableInteractive
                      title={"Upload to projects"}
                      placement={"left"}
                      enterDelay={400}
                      enterNextDelay={400}
                    >
                      <PublishIcon className={"white-icon"} />
                    </Tooltip>
                  </IconButton>
                </Grid>
              )}
              <Grid item>
                <IconButton
                  aria-label={"Progress"}
                  size="large"
                  style={rightButtonStyle}
                >
                  <Tooltip
                    disableInteractive
                    title={
                      showTimelineIcon ? "View buildings" : "View progress"
                    }
                    placement={"left"}
                    enterDelay={400}
                    enterNextDelay={400}
                  >
                    {!showTimelineIcon ? (
                      <TimelineIcon
                        onClick={handleIconToggle}
                        className={"white-icon"}
                      />
                    ) : (
                      <BuildingIcon
                        className={"white-icon"}
                        onClick={handleIconToggle}
                      />
                    )}
                  </Tooltip>
                </IconButton>
              </Grid>
            </Grid>
            {mobileMode && (
              <Grid
                item
                xs={12}
                md={5}
                justifySelf="center"
                alignSelf="center"
                justifyItems="center"
              >
                <ProjectInfo project={project} />
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} className={classes.darker} style={detailsStyles}>
          <Divider variant="middle" className={classes.divider} />
        </Grid>
        <Grid item xs={12} className={classes.darkerToLight}>
          {showTimelineIcon ? (
            <Suspense fallback={<CenterPageLoader loading={true} />}>
              <ActivityProgress />
            </Suspense>
          ) : (
            <BuildingsList
              project={project}
              scanFilters={checkedFilters || scanDates}
            />
          )}
        </Grid>
      </Grid>
      <Suspense fallback={null}>
        {showUpload && (
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <MultiFileUploader
              handleClose={handleCloseUpload}
              open={showUpload}
            />
          </div>
        )}
      </Suspense>
    </div>
  );
};
