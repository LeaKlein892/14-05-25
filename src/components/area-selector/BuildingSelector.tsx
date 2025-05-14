import * as React from "react";
import { useCallback, useContext, useState } from "react";
import { Button, MenuItem, Menu, Badge } from "@mui/material";
import BuildingIcon from "@mui/icons-material/Apartment";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { Area, Floor, Building, UserProfile } from "../../models";
import { analyticsEvent } from "../../utils/analytics";
import { planExistsForBuilding } from "../../utils/projects-utils";
import { useHistory } from "react-router-dom";
import { useStyles } from "./SelectorStyles";

export interface BuildingSelectorProps {
  tour: boolean;
  mobileMode: boolean;
  update: (
    currentPlan: string,
    currentDate: string,
    currentTour?: string,
    currentArea?: Area,
    currentFloor?: Floor,
    currentBuilding?: Building
  ) => void;
  loggedUser: UserProfile;
  planOpened?: boolean;
  setPlanOpened?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BuildingSelector: React.FC<BuildingSelectorProps> = ({
  tour = false,
  mobileMode,
  update,
  loggedUser,
  planOpened,
  setPlanOpened,
}) => {
  const classes = useStyles();
  const { currentBuilding, currentProject } = useContext(
    ProjectInformationContext
  );

  const [anchorElB, setAnchorElB] = useState(null);

  const handleBuildingClick = useCallback((event: any) => {
    setAnchorElB(event.currentTarget);
  }, []);

  const handleBuildingClose = useCallback(() => {
    setAnchorElB(null);
  }, []);

  let history = useHistory();

  const changeBuilding = useCallback(
    (buildingName: string) => {
      const currentBuilding: Building | undefined =
        currentProject?.buildings?.find((b) => b.name === buildingName);
      const analyticsAction = tour
        ? "Building Switched in tour"
        : "Building Switched in plan";
      const analyticsEventType = tour ? "Tour" : "Plan";
      analyticsEvent(analyticsEventType, analyticsAction, loggedUser.username);

      if (currentBuilding) {
        const floors = currentBuilding.floors ?? [];
        for (const currentFloor of floors) {
          const areas = currentFloor.areas ?? [];
          for (const currentArea of areas) {
            const infos = currentArea.infos ?? [];
            for (const currentInfo of infos) {
              if (currentInfo.plan && currentInfo.date !== "blueprint") {
                if (tour && setPlanOpened) {
                  setPlanOpened(!planOpened);
                } else {
                  history.push("/project");
                }
                update(
                  currentInfo.plan,
                  currentInfo.date,
                  currentInfo.tour,
                  currentArea,
                  currentFloor,
                  currentBuilding
                );
                !tour && history.push("/plan");
                return;
              }
            }
          }
        }
      }
    },
    [
      setPlanOpened,
      currentProject,
      loggedUser.username,
      update,
      tour,
      planOpened,
      history,
    ]
  );

  return (
    <div>
      <Button
        title="switch Building"
        className={tour ? classes.buttonTour : classes.buttonPlan}
        onClick={handleBuildingClick}
      >
        <Badge
          badgeContent={
            currentBuilding?.name?.length
              ? currentBuilding?.name?.length > 2
                ? 0
                : currentBuilding?.name
              : 0
          }
          color="primary"
        >
          <BuildingIcon />
        </Badge>
      </Button>

      <Menu
        anchorEl={anchorElB}
        open={Boolean(anchorElB)}
        onClose={handleBuildingClose}
      >
        {" "}
        {currentProject?.buildings?.map((building) => (
          <MenuItem
            key={building.name}
            className={
              mobileMode
                ? building.name === currentBuilding?.name
                  ? classes.mobileModeSelectedmenuItemPlan
                  : classes.mobileModemenuItem
                : tour
                ? building.name === currentBuilding?.name
                  ? classes.selectedMenuItemPlan
                  : classes.menuItem
                : building.name === currentBuilding?.name
                ? classes.selectedMenuItemPlan
                : classes.menuItem
            }
            onClick={() => {
              changeBuilding(building.name);
              handleBuildingClose();
            }}
          >
            {tour
              ? planExistsForBuilding(building)
                ? `Building ${building.name}`
                : `Building ${building.name}-no Tours`
              : `Building ${building.name}`}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
