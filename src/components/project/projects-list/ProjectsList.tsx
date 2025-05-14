import * as React from "react";
import makeStyles from "@mui/styles/makeStyles";
import {
  ImageList,
  ImageListItem,
  ImageListItemBar,
  IconButton,
  ListSubheader,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import createStyles from "@mui/styles/createStyles";
import { Project } from "../../../models";
import theme from "../../../ui/theme";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useEffect } from "react";
import { useState } from "react";

export interface ProjectListProps {
  projects: Project[];
  noProjects?: boolean;
  onProjectSelected: (selectedProject: Project) => void;
  onInvite: (project: Project) => void;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    projectsList: {
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      marginLeft: theme.spacing(6),
      marginRight: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
    title: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(3),
      fontFamily: theme.typography.fontFamily,
      fontSize: 35,
      color: theme.palette.primary.main,
      fontWeight: "bold",
    },
    project: {
      "&:hover": {
        opacity: "85%",
      },
    },
    projectDiv: {
      cursor: "pointer",
      opacity: "90%",
      height: "100%",
    },
    projectImage: {
      width: "100%",
      height: "100%",
    },
    projectPanel: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingRight: theme.spacing(2),
      height: "80px",
    },
    projectPanelTitle: {
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.secondary.light,
      fontSize: 23,
      paddingBottom: theme.spacing(1),
    },
    projectPanelSubTitle: {
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.secondary.contrastText,
      fontSize: 16,
      wordWrap: "break-word", // not sure its needed
    },
    icon: {
      color: "rgba(255, 255, 255, 0.54)",
    },
  })
);

export const ProjectsList: React.FC<ProjectListProps> = ({
  projects,
  noProjects = false,
  onProjectSelected,
  onInvite,
}) => {
  const classes = useStyles();
  const tileCols = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true })
    ? 1
    : 2;

  const [noProjectsMessage, setNoProjectsMessage] =
    useState<boolean>(noProjects);

  const handleInviteClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    currentProject: Project
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onInvite(currentProject);
  };

  useEffect(() => {
    setNoProjectsMessage(noProjects);
  }, [noProjects]);

  return (
    <div className={classes.projectsList}>
      <ImageList sx={{ overflow: "hidden" }} rowHeight={300} gap={20} cols={2}>
        <ImageListItem key="Subheader" cols={2} style={{ height: "auto" }}>
          <ListSubheader component="div" className={classes.title}>
            Projects
          </ListSubheader>
        </ImageListItem>
        {projects.map((project) => (
          <ImageListItem
            key={project.id}
            className={classes.project}
            onClick={() => onProjectSelected(project)}
            cols={tileCols}
          >
            <div className={classes.projectDiv}>
              <img
                className={classes.projectImage}
                src={project.imageURL}
                alt={project.name}
              />
              <ImageListItemBar
                classes={{
                  root: classes.projectPanel,
                  title: classes.projectPanelTitle,
                  subtitle: classes.projectPanelSubTitle,
                  actionIcon: classes.icon,
                }}
                title={project.name}
                subtitle={project.description}
                actionIcon={
                  <IconButton
                    aria-label={"invite"}
                    onClick={(e) => handleInviteClick(e, project)}
                    size="large"
                  >
                    <Tooltip
                      disableInteractive
                      title={"invite to project"}
                      placement={"top"}
                      enterDelay={400}
                      enterNextDelay={400}
                    >
                      <PersonAddIcon className={classes.icon} />
                    </Tooltip>
                  </IconButton>
                }
                actionPosition={"right"}
              />
            </div>
          </ImageListItem>
        ))}
        {noProjectsMessage && (
          <ImageListItem key="noBuildings" cols={2}>
            <Typography>
              No Projects Yet. To add or join project{" "}
              <a href={"https://castory-ai.com/#contact"}>contact us</a>
            </Typography>
          </ImageListItem>
        )}
      </ImageList>
    </div>
  );
};
