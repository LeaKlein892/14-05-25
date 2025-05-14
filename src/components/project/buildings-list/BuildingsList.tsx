import * as React from "react";
import { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import { Grid, useMediaQuery } from "@mui/material";
import { createStyles } from "@mui/styles";
import { Building, Project } from "../../../models";
import { BuildingCard } from "../building-card/BuildingCard";
import { doesBuildingContainAnyDate } from "../../../utils/projects-utils";
import { delay } from "lodash-es";

const useStyles = makeStyles((theme) =>
  createStyles({
    buildings: {
      paddingRight: theme.spacing(3),
    },
    buildingInfo: {
      "&::-webkit-scrollbar": {
        width: "0.4em",
      },
      "&::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0,0,0,.1)",
        outline: "1px solid slategrey",
      },
      padding: theme.spacing(2),
      background: theme.palette.info.light,
      borderRadius: "3px",
      display: "block",
      overflow: "scroll",
      margin: "10px",
    },
    noBuildingsMessage: {
      color: theme.palette.info.light,
      fontSize: 20,
    },
    oneBuildingsLine: {
      height: "73vh",
    },
    multipleBuildingsLines: {
      height: "38vh",
    },
    mobileBuildingInfo: {
      height: "35vh",
    },
  })
);
let lastOffsetY = 0;
let lastProjectName = "";

export interface BuildingsListProps {
  project?: Project;
  scanFilters?: string[];
}

export const BuildingsList: React.FC<BuildingsListProps> = ({
  project,
  scanFilters,
}) => {
  const classes = useStyles();

  const projectName = project?.name || "";

  useEffect(() => {
    if (projectName === lastProjectName) {
      delay(() => {
        window.scrollTo(0, lastOffsetY);
      }, 300);
    }
    const onScroll = () => {
      lastOffsetY = window.pageYOffset;
    };
    window.addEventListener("scroll", onScroll);
    lastProjectName = projectName || "";
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [projectName]);

  const buildingsCount = project?.buildings?.length || 0;
  const mobileMode = useMediaQuery("(max-width: 1224px)", { noSsr: true });

  return (
    <Grid container item className={classes.buildings} xs={12}>
      {buildingsCount > 0 ? (
        project?.buildings
          ?.filter((building) =>
            doesBuildingContainAnyDate(building, scanFilters)
          )
          .map((building: Building, index: number) => (
            <Grid item xs={12} md={6} key={`${project.name}_${building.name}`}>
              <div
                className={`${classes.buildingInfo} ${
                  mobileMode
                    ? classes.mobileBuildingInfo
                    : buildingsCount > 2
                    ? classes.multipleBuildingsLines
                    : classes.oneBuildingsLine
                }`}
              >
                <BuildingCard
                  building={building}
                  project={project}
                  scanFilters={scanFilters}
                  projectName={projectName}
                  index={index}
                />
              </div>
            </Grid>
          ))
      ) : (
        <Grid item xs={12}>
          <span className={classes.noBuildingsMessage}>No Buildings</span>
        </Grid>
      )}
    </Grid>
  );
};
