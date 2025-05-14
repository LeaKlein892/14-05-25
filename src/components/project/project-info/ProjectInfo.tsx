import * as React from "react";
import { makeStyles } from "@mui/styles";
import { Grid } from "@mui/material";
import { createStyles } from "@mui/styles";
import { Project } from "../../../models";
import { useState } from "react";
import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { scrollToTop } from "../../../utils/scroll-utils";
import { DataUsage } from "./DataUsage";

export interface ProjectInfoProps {
  project?: Project;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      textAlign: "right",
      fontFamily: theme.typography.fontFamily,
      color: theme.palette.info.light,
      paddingRight: theme.spacing(4),
      paddingLeft: theme.spacing(4),
      paddingBottom: theme.spacing(0),
      marginRight: theme.spacing(3),
    },
    projectName: {
      fontSize: "21px",
      fontWeight: "bold",
      letterSpacing: "2px",
    },
    projectDescription: {
      fontSize: "16px",
      fontStyle: "italic",
    },
    infoButton: {
      marginLeft: theme.spacing(1),
      color: theme.palette.info.light,
      marginTop: "-11px",
    },
    icon: {
      height: "20px",
      width: "20px",
    },
  })
);

export const ProjectInfo: React.FC<ProjectInfoProps> = ({ project }) => {
  const classes = useStyles();
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsInfoOpen(false);
    scrollToTop();
  }, [project]);

  return (
    <div className={classes.container}>
      <Grid container>
        <Grid item xs={12} style={{ paddingBottom: "0px" }}>
          <span className={classes.projectName}>{project?.name}</span>
          <IconButton
            aria-label="info"
            onClick={() => setIsInfoOpen(!isInfoOpen)}
            className={classes.infoButton}
            size="large"
          >
            {isInfoOpen ? (
              <CloseIcon className={classes.icon} />
            ) : (
              <InfoIcon className={classes.icon} />
            )}
          </IconButton>
        </Grid>
        <Grid item xs={12} hidden={!isInfoOpen}>
          <span hidden={!isInfoOpen} className={classes.projectDescription}>
            {project?.description}
          </span>
        </Grid>
        <Grid item xs={12} sm={6}>
          <span hidden={!isInfoOpen}>
            {"Contractor : " + (project?.contractor || "")}
          </span>
        </Grid>
        <Grid item xs={12} sm={6}>
          <span hidden={!isInfoOpen}>
            {"Owner : " + (project?.owner || "")}
          </span>
        </Grid>
        <Grid item xs={12} sm={6}>
          <span hidden={!isInfoOpen}>
            {"Architect : " + (project?.architect || "")}
          </span>
        </Grid>
        <Grid item xs={12} sm={6}>
          <span hidden={!isInfoOpen}>
            {"Project Management : " + (project?.projectManagement || "")}
          </span>
        </Grid>
        <Grid item xs={12} sm={6}>
          <span>
            {project && isInfoOpen && <DataUsage projectId={project.id} />}
          </span>
        </Grid>
      </Grid>
    </div>
  );
};
