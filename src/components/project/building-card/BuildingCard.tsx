import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { useMediaQuery } from "@mui/material";

import {
  Area,
  AreaTypeEnum,
  Building,
  Floor,
  Info,
  Project,
} from "../../../models";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { useHistory } from "react-router-dom";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import BuildingIcon from "@mui/icons-material/Apartment";
import { ViewContext } from "../../../context/ViewContext";
import {
  compareByNumericName,
  compareInfosByDate,
  doesFloorContainAnyDate,
} from "../../../utils/projects-utils";
import { analyticsEvent } from "../../../utils/analytics";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { capitalize } from "lodash-es";
import theme from "../../../ui/theme";
import { emptyArray } from "../../../utils/render-utils";

export interface BuildingCardProps {
  building: Building;
  project: Project;
  scanFilters?: string[];
  projectName?: string;
  index: number;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    content: {
      padding: "3px 0px",
    },
    contentMobile: {
      padding: "5px 0px",
    },
    header: {
      paddingBottom: theme.spacing(1),
      color: theme.palette.primary.main,
      fontSize: 20,
      fontFamily: theme.typography.fontFamily,
      fontWeight: "bold",
    },
    buildingIcon: {
      verticalAlign: "middle",
      height: "27px",
      width: "27px",
    },
    buildingName: {
      marginLeft: theme.spacing(1),
      verticalAlign: "middle",
    },
  })
);

let lastExpanded: string[][] = [emptyArray];
let lastProjectName: string | undefined;
let lastSelected: string = "";

export const BuildingCard: React.FC<BuildingCardProps> = ({
  building,
  project,
  scanFilters,
  projectName,
  index,
}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState<string[]>(
    lastExpanded[index] || emptyArray
  );
  const [selected, setSelected] = useState<string>(lastSelected);

  let history = useHistory();
  const {
    setCurrentScene,
    setCurrentTour,
    currentPlan,
    currentDate,
    setCurrentArea,
    setCurrentFloor,
    setCurrentBuilding,
    setCurrentDate,
    setCurrentPlan,
  } = useContext(ProjectInformationContext);
  const { setPlanScale } = useContext(ViewContext);
  const { loggedUser } = useContext(LoggedUserContext);
  const mobileMode = useMediaQuery(theme.breakpoints.down("lg"), {
    noSsr: true,
  });

  const handleAreaClick = async (
    project: Project,
    floor: Floor,
    area: Area,
    info: Info
  ) => {
    const id = `${project.name}_${building.name}_${floor.name}_${area.name}_${info.date}`;
    setSelected(id);
    lastSelected = id;
    analyticsEvent("Project", "Project Area Selected", loggedUser.username);
    if (currentPlan !== info.plan || currentDate !== info.date) {
      setCurrentTour("");
      setPlanScale(info.scale || 1);
      setCurrentScene({
        sceneId: info.sceneId ? info.sceneId.toString() : "0",
      });
      setCurrentPlan(info.plan);
      setCurrentDate(info.date);
      setCurrentBuilding(building);
      setCurrentFloor(floor);
      setCurrentArea(area);
    }
    history.push("/plan");
  };

  const getAreaTypeViewName = (
    areaTypeEnum?: AreaTypeEnum | keyof typeof AreaTypeEnum
  ) => {
    if (!areaTypeEnum) {
      return "";
    }
    return capitalize(areaTypeEnum);
  };

  const handleExpansion = (newItem: string): void => {
    if (expanded.includes(newItem)) {
      setExpanded((prevExpanded) =>
        prevExpanded.filter((item) => item !== newItem)
      );
    } else {
      setExpanded((prevExpanded) => [...prevExpanded, newItem]);
    }
  };

  useEffect(() => {
    lastExpanded[index] = expanded;
  }, [expanded]);

  useEffect(() => {
    if (projectName != lastProjectName) {
      lastExpanded = [emptyArray];
      lastSelected = "";
      lastProjectName = projectName;
    }
  }, []);
  return (
    <div>
      <div className={classes.header}>
        <BuildingIcon className={classes.buildingIcon} />
        <span
          className={classes.buildingName}
        >{`Building ${building.name}`}</span>
      </div>
      <SimpleTreeView
        key={`${project.name}_${building.name}`}
        expandedItems={expanded}
        selectedItems={selected}
      >
        {building.floors
          ?.filter((floor) => doesFloorContainAnyDate(floor, scanFilters))
          .sort(compareByNumericName)
          .map((floor) => (
            <TreeItem
              className={mobileMode ? classes.contentMobile : classes.content}
              key={`${project.name}_${building.name}_${floor.name}`}
              itemId={`${project.name}_${building.name}_${floor.name}`}
              label={`Floor ${floor.name}`}
              onClick={() =>
                handleExpansion(
                  `${project.name}_${building.name}_${floor.name}`
                )
              }
            >
              {floor.areas?.sort(compareByNumericName).map((area) =>
                area.type === AreaTypeEnum.FLOOR ? (
                  <div
                    key={`${project.name}_${building.name}_${floor.name}_${area.name}`}
                  >
                    {area.infos
                      ?.sort((info, otherInfo) =>
                        compareInfosByDate(info, otherInfo, mobileMode)
                      )
                      .map((info) => {
                        return scanFilters === undefined ||
                          scanFilters.includes(info.date) ? (
                          <TreeItem
                            className={
                              mobileMode
                                ? classes.contentMobile
                                : classes.content
                            }
                            key={`${project.name}_${building.name}_${floor.name}_${area.name}_${info.date}`}
                            itemId={`${project.name}_${building.name}_${floor.name}_${area.name}_${info.date}`}
                            label={`${getAreaTypeViewName(area.type)} ${
                              area.name
                            } \u00A0\u00A0|\u00A0\u00A0 ${info.date}`}
                            onClick={() => {
                              handleAreaClick(project, floor, area, info);
                            }}
                          />
                        ) : (
                          <div />
                        );
                      })}
                  </div>
                ) : (
                  <TreeItem
                    className={
                      mobileMode ? classes.contentMobile : classes.content
                    }
                    key={`${project.name}_${building.name}_${floor.name}_${area.name}`}
                    itemId={`${project.name}_${building.name}_${floor.name}_${area.name}`}
                    label={`${getAreaTypeViewName(area.type)} ${area.name}`}
                  >
                    {area.infos?.sort(compareInfosByDate).map((info) => {
                      return scanFilters === undefined ||
                        scanFilters.includes(info.date) ? (
                        <TreeItem
                          className={
                            mobileMode ? classes.contentMobile : classes.content
                          }
                          key={`${project.name}_${building.name}_${floor.name}_${area.name}_${info.date}`}
                          itemId={`${project.name}_${building.name}_${floor.name}_${area.name}_${info.date}`}
                          label={`${getAreaTypeViewName(area.type)} ${
                            area.name
                          } \u00A0\u00A0|\u00A0\u00A0 ${info.date}`}
                          onClick={() => {
                            handleAreaClick(project, floor, area, info);
                          }}
                        />
                      ) : (
                        <div />
                      );
                    })}
                  </TreeItem>
                )
              )}
            </TreeItem>
          ))}
      </SimpleTreeView>
    </div>
  );
};
