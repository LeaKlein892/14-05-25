import * as React from "react";
import { useCallback, useContext } from "react";
import { FormControl } from "@mui/material";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { Area, Floor, Building } from "../../models";
import { setSessionKey } from "../../utils/project-session-manager";
import { AppModeEnum, ViewContext } from "../../context/ViewContext";
import { FloorSelector } from "./FloorSelector";
import { BuildingSelector } from "./BuildingSelector";
import { DateSelector } from "./DateSelector";
import { useStyles } from "./SelectorStyles";

export interface AreaSelectorProps {
  hide: boolean;
  tour: boolean;
  mobileMode: boolean;
  planOpened?: boolean;
  setPlanOpened?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AreaSelector: React.FC<AreaSelectorProps> = ({
  hide = false,
  tour = false,
  mobileMode,
  planOpened,
  setPlanOpened,
}) => {
  const classes = useStyles();
  const { loggedUser } = useContext(LoggedUserContext);
  const { appMode } = useContext(ViewContext);
  const {
    setCurrentFloor,
    setCurrentPlan,
    setCurrentDate,
    setCurrentArea,
    setCurrentTour,
    setCurrentBuilding,
    currentProject,
  } = useContext(ProjectInformationContext);

  const updateContextAndStorage = useCallback(
    (
      currentPlan: string,
      currentDate: string,
      currentTour?: string,
      currentArea?: Area,
      currentFloor?: Floor,
      currentBuilding?: Building
    ) => {
      setCurrentPlan(currentPlan);
      setSessionKey("Plan", currentPlan);

      setCurrentDate(currentDate);
      setSessionKey("Date", currentDate);

      if (currentTour) {
        setCurrentTour(currentTour);
        setSessionKey("Tour", currentTour);
      }

      if (currentArea) {
        setCurrentArea(currentArea);
        setSessionKey("Area", JSON.stringify(currentArea));
      }

      if (currentFloor) {
        setCurrentFloor(currentFloor);
        setSessionKey("Floor", JSON.stringify(currentFloor));
      }

      if (currentBuilding) {
        setCurrentBuilding(currentBuilding);
        setSessionKey("Building", JSON.stringify(currentBuilding));
      }
    },
    [
      setCurrentArea,
      setCurrentBuilding,
      setCurrentDate,
      setCurrentFloor,
      setCurrentPlan,
      setCurrentTour,
    ]
  );

  return !hide && appMode === AppModeEnum.projectView ? (
    <FormControl variant="standard" className={classes.formControl}>
      <div className={classes.switch}>
        <FloorSelector
          tour={tour}
          mobileMode={mobileMode}
          update={updateContextAndStorage}
          loggedUser={loggedUser}
          planOpened={planOpened && planOpened}
          setPlanOpened={setPlanOpened && setPlanOpened}
        />
        {currentProject?.buildings?.length &&
          currentProject?.buildings?.length !== 1 && (
            <BuildingSelector
              tour={tour}
              mobileMode={mobileMode}
              update={updateContextAndStorage}
              loggedUser={loggedUser}
              planOpened={planOpened && planOpened}
              setPlanOpened={setPlanOpened && setPlanOpened}
            />
          )}
        <DateSelector
          tour={tour}
          mobileMode={mobileMode}
          update={updateContextAndStorage}
          loggedUser={loggedUser}
          planOpened={planOpened && planOpened}
          setPlanOpened={setPlanOpened && setPlanOpened}
        />
      </div>
    </FormControl>
  ) : (
    <div />
  );
};
