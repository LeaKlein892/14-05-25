import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import {
  listProjects,
  projectInvitationByToken,
} from "../../../graphql/queries";
import { makeStyles } from "@mui/styles";
import { Button, Grid, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";

import { Project, ProjectInvitation } from "../../../models";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { getQueryArgs } from "../../../utils/query-params";
import { analyticsEvent } from "../../../utils/analytics";
import {
  deleteProjectInvitation,
  sendEmail,
  updateUserProfile,
} from "../../../graphql/mutations";
import { useHistory } from "react-router-dom";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { showMessage } from "../../../utils/messages-manager";

export interface ProjectAdmitProps {}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      paddingTop: "68px" + theme.spacing(2),
      height: "100%",
      paddingRight: theme.spacing(4),
      paddingLeft: theme.spacing(4),
    },
    gridRow: {
      paddingTop: theme.spacing(2),
    },
    title: {
      paddingTop: theme.spacing(2),
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3),
      fontFamily: theme.typography.fontFamily,
      fontSize: 35,
      color: theme.palette.primary.main,
      fontWeight: "bold",
    },
    button: {
      marginTop: theme.spacing(2),
    },
  })
);

let token = getQueryArgs("tk");
let invitationLoaded = false;
let lastInvitation: ProjectInvitation | undefined = undefined;
let lastProject: Project | undefined = undefined;

const ProjectAdmit: React.FC<ProjectAdmitProps> = () => {
  const classes = useStyles();
  const history = useHistory();
  const { loggedUser } = useContext(LoggedUserContext);
  const [projectInvitation, setProjectInvitation] = useState<
    ProjectInvitation | undefined
  >(lastInvitation);
  const [project, setProject] = useState<Project | undefined>(lastProject);
  const [finishLoading, setFinishLoading] = useState<boolean>(invitationLoaded);

  const handleJoinProject = async () => {
    analyticsEvent(
      "Project",
      "User Joined Project",
      loggedUser.username
      // project?.name
    );
    const userAlreadyProjectMember =
      projectInvitation?.projectId &&
      loggedUser.participatesInProjects?.includes(projectInvitation?.projectId);
    const newProjectsList = loggedUser.participatesInProjects
      ? [...loggedUser.participatesInProjects, projectInvitation?.projectId]
      : [projectInvitation?.projectId];
    await API.graphql(
      graphqlOperation(deleteProjectInvitation, {
        input: { id: projectInvitation?.id },
      })
    );
    lastInvitation = undefined;
    setProjectInvitation(undefined);
    invitationLoaded = false;
    lastProject = undefined;
    setProject(undefined);
    setFinishLoading(false);
    if (userAlreadyProjectMember) {
      showMessage("You are already a member of this project!", "info");
      setTimeout(() => {
        history.push("/project");
      }, 1200); //800
    } else {
      await API.graphql({
        query: sendEmail,
        variables: {
          to: ["tomyitav@gmail.com"],
          text: `user joined project! user: ${loggedUser.username}, project: ${project?.name}`,
          link: window.location.origin,
          subject: `Castory Developers Info`,
          templateType: "developersInfo",
        },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });

      await API.graphql(
        graphqlOperation(updateUserProfile, {
          input: { id: loggedUser.id, participatesInProjects: newProjectsList },
        })
      );
      showMessage("You successfully joined project!", "success");
      setTimeout(() => {
        history.push("/project");
        window.location.reload();
      }, 1200); //800
    }
  };

  const fetchInvitations = useCallback(async () => {
    if (token) {
      const projectInvitations: any = await API.graphql({
        query: projectInvitationByToken,
        variables: { token },
      });
      const fetchedInvitations: ProjectInvitation[] =
        projectInvitations.data.projectInvitationByToken.items;
      if (fetchedInvitations.length > 0) {
        lastInvitation = fetchedInvitations[0];
        setProjectInvitation({ ...lastInvitation });
      }
    }
  }, []);

  const fetchProject = useCallback(async () => {
    if (projectInvitation && projectInvitation.projectId) {
      const projects: any = await API.graphql({
        query: listProjects,
        variables: {
          filter: {
            id: { eq: projectInvitation?.projectId },
          },
        },
      });
      const fetchedProjects: Project[] = projects.data.listProjects.items;
      if (fetchedProjects.length > 0) {
        lastProject = fetchedProjects[0];
        setProject({ ...lastProject });
      }
    }
  }, [projectInvitation]);

  useEffect(() => {
    if (!lastInvitation) {
      fetchInvitations().then(() => {
        invitationLoaded = true;
      });
    }
  }, [fetchInvitations]);

  useEffect(() => {
    if (lastInvitation && projectInvitation && !lastProject) {
      fetchProject().then(() => {
        setFinishLoading(invitationLoaded && !!lastProject);
      });
    }
  }, [projectInvitation, fetchProject]);

  return (
    <div className={classes.container}>
      <Grid container>
        <Grid item xs={12} className={classes.gridRow}>
          <span className={classes.title}>
            You Have Been Invited To Project:
          </span>
        </Grid>
        {finishLoading && projectInvitation && project && (
          <Grid item xs={12} className={classes.gridRow}>
            <Button
              className={classes.button}
              color={"primary"}
              variant={"contained"}
              onClick={handleJoinProject}
            >
              Join {project?.name}
            </Button>
          </Grid>
        )}
        {finishLoading && !projectInvitation && (
          <React.Fragment>
            <Grid item xs={12} className={classes.gridRow}>
              <Typography>
                {" "}
                Invalid or expired invitation - please contact support !
              </Typography>
            </Grid>
            <Grid item xs={12} className={classes.gridRow}>
              <Button
                className={classes.button}
                color={"primary"}
                variant={"contained"}
                onClick={() => {
                  history.push("/project");
                }}
              >
                My Projects
              </Button>
            </Grid>
          </React.Fragment>
        )}
      </Grid>
    </div>
  );
};

export default React.memo(ProjectAdmit);
