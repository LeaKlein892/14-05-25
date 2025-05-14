import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Tooltip } from "@mui/material";
import { createStyles } from "@mui/styles";
import { Project } from "../../../models";
import { ProjectsList } from "../projects-list/ProjectsList";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { ProjectViewer } from "../project-viewer/ProjectViewer";
import Fab from "@mui/material/Fab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getDefaults } from "../../../utils/projects-utils";
import { ViewContext } from "../../../context/ViewContext";
import { analyticsEvent } from "../../../utils/analytics";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { clearProjectSession } from "../../../utils/project-session-manager";
import { emptyArray } from "../../../utils/render-utils";
import { onUserAuth } from "../../../utils/logged-user";
import {
  clearCacheProgress,
  getCachedProgress,
} from "../../activity-progress/progress-cache";

const ProjectInviteDialog = React.lazy(
  () => import("../project-invite-dialog/ProjectInviteDialog")
);

export interface ProjectsViewProps {
  user: any;
  signOut: any;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    view: {
      paddingTop: theme.spacing(8),
      height: "100%",
    },
    projectViewer: {
      height: "100%",
    },
    backFab: {
      position: "fixed",
      top: theme.spacing(8.5),
      left: theme.spacing(0.8),
      zIndex: 1200,
      height: "38px",
    },
  })
);

let fetchedProjects = false;
let noProjectsForUser = false;

const ProjectsView: React.FC<ProjectsViewProps> = ({ user }) => {
  const classes = useStyles();
  const {
    currentProject,
    setCurrentProject,
    setCurrentPlan,
    setCurrentTour,
    setCurrentArea,
    setCurrentFloor,
    setCurrentBuilding,
    setCurrentDate,
    setCurrentScene,
    setProjects,
    projects,
  } = useContext(ProjectInformationContext);
  const { setPlanScale } = useContext(ViewContext);
  const { setLoggedUser } = useContext(LoggedUserContext);

  useEffect(() => {
    if (user && user.username) {
      onUserAuth(user, setLoggedUser, setProjects);
    }
  }, [user]);

  const [isProjectTreeOpen, setIsProjectTreeOpen] = useState<boolean>(
    currentProject !== undefined
  );
  const [noProjects, setNoProjects] = useState<boolean>(noProjectsForUser);
  const [isProjectInviteDialogOpen, setIsProjectInviteDialogOpen] =
    useState<boolean>(false);
  const [projectToInvite, setProjectToInvite] = useState<Project | undefined>();

  useEffect(() => {
    if (currentProject === undefined) {
      setIsProjectTreeOpen(false);
    }
  }, [currentProject]);

  document.title = currentProject?.name || "Castory Web App";

  const handleInviteClick = (project: Project | undefined) => {
    setProjectToInvite(project);
    setIsProjectInviteDialogOpen(true);
  };

  const handleInviteClose = () => {
    setIsProjectInviteDialogOpen(false);
    setProjectToInvite(undefined);
  };

  const handleProjectSelected = (selectedProject: Project) => {
    analyticsEvent("Project", "Project Selected", user.username || "");
    setCurrentProject(selectedProject);
    getCachedProgress(selectedProject.id).progress === emptyArray &&
      clearCacheProgress();

    const defaults = getDefaults(selectedProject);
    clearProjectSession();
    setCurrentPlan(defaults.info.plan);
    setPlanScale(defaults.info.scale || 1);
    setCurrentTour(defaults.info.tour);
    setCurrentDate(defaults.info.date);
    setCurrentArea(defaults.area);
    setCurrentFloor(defaults.floor);
    setCurrentBuilding(defaults.building);
    setCurrentScene({
      sceneId: defaults.info.sceneId ? defaults.info.sceneId.toString() : "0",
    });

    setIsProjectTreeOpen(true);
  };

  useEffect(() => {
    if (projects && projects.length > 0 && !fetchedProjects) {
      fetchedProjects = true;
      if (noProjectsForUser) {
        noProjectsForUser = false;
        setNoProjects(false);
      }
    }
    if (projects && projects.length === 0 && !noProjectsForUser) {
      noProjectsForUser = true;
      setNoProjects(true);
    }
  }, [projects]);

  return (
    <React.Fragment>
      <div className={classes.view}>
        <div hidden={isProjectTreeOpen}>
          <ProjectsList
            projects={projects || emptyArray}
            onProjectSelected={handleProjectSelected}
            noProjects={noProjects}
            onInvite={handleInviteClick}
          />
        </div>
        <div hidden={!isProjectTreeOpen} className={classes.projectViewer}>
          <ProjectViewer
            project={currentProject}
            onInvite={handleInviteClick}
          />
        </div>
        <React.Suspense fallback={null}>
          {isProjectInviteDialogOpen && (
            <ProjectInviteDialog
              project={projectToInvite}
              open={isProjectInviteDialogOpen}
              onClose={handleInviteClose}
            />
          )}
        </React.Suspense>
      </div>
      <Tooltip
        disableInteractive
        title={"back to projects list"}
        placement={"right"}
        enterDelay={400}
        enterNextDelay={400}
      >
        <Fab
          variant="extended"
          color="primary"
          className={classes.backFab}
          onClick={() => {
            setIsProjectTreeOpen(false);
          }}
          style={{
            display: isProjectTreeOpen ? "flex" : "none",
          }}
        >
          <ArrowBackIcon />
        </Fab>
      </Tooltip>
    </React.Fragment>
  );
};

export default React.memo(ProjectsView);
