import * as React from "react";
import { useCallback, useContext, useState } from "react";
import { Button, MenuItem, Menu } from "@mui/material";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { Area, Floor, Building, UserProfile } from "../../models";
import { analyticsEvent } from "../../utils/analytics";
import {
  compareByNumericName,
  planExistsForFloor,
} from "../../utils/projects-utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useHistory } from "react-router-dom";
import { useStyles } from "./SelectorStyles";

export interface FloorSelectorProps {
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

export const FloorSelector: React.FC<FloorSelectorProps> = ({
  tour = false,
  mobileMode,
  update,
  loggedUser,
  planOpened,
  setPlanOpened,
}) => {
  const classes = useStyles();
  const { currentBuilding, currentArea, currentFloor, currentDate } =
    useContext(ProjectInformationContext);

  const [floorselectedOption, setfloorSelectedOption] = useState(currentFloor);

  const [anchorElF, setAnchorElF] = useState(null);

  const handleFloorClick = useCallback((event: any) => {
    setAnchorElF(event.currentTarget);
  }, []);

  const handleFloorClose = useCallback(() => {
    setAnchorElF(null);
  }, []);

  let history = useHistory();

  const changeFloor = useCallback(
    (FloorName: string) => {
      const analyticsAction = tour
        ? "Floor Switched in tour"
        : "Floor Switched in plan";
      const analyticsEventType = tour ? "Tour" : "Plan";
      analyticsEvent(analyticsEventType, analyticsAction, loggedUser.username);
      let f: Floor | undefined = currentBuilding?.floors?.find(
        (floor) => floor.name === FloorName
      );
      setfloorSelectedOption(f);
      const areas = f?.areas || [];
      for (const currentArea of areas) {
        const infos = currentArea.infos || [];
        let currentInfo = infos.find((ci) => ci.date === currentDate);
        if (currentInfo) {
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
            f
          );

          !tour && history.push("/plan");
          return;
        }

        const mostRecentDate = infos
          .filter((info) => info.date !== "blueprint")
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];

        if (mostRecentDate) {
          if (tour && setPlanOpened) {
            setPlanOpened(!planOpened);
          } else {
            history.push("/project");
          }
          update(
            mostRecentDate.plan,
            mostRecentDate.date,
            mostRecentDate.tour,
            currentArea,
            f
          );
          !tour && history.push("/plan");
          return;
        }
      }

      if (!tour) {
        const blueprintDate = areas
          .flatMap((area) => area.infos || [])
          .find((info) => info.date === "blueprint");

        if (blueprintDate) {
          history.push("/project");
          update(
            blueprintDate.plan,
            blueprintDate.date,
            blueprintDate.tour,
            currentArea,
            f
          );
          history.push("/plan");
        }
      }
    },
    [
      setPlanOpened,
      currentArea,
      currentDate,
      currentBuilding,
      loggedUser.username,
      tour,
      planOpened,
      update,
      history,
    ]
  );

  return (
    <div>
      <Button
        className={
          tour ? classes.selectContainerTour : classes.selectContainerPlan
        }
        onClick={handleFloorClick}
        title="switch Floor"
        endIcon={<KeyboardArrowDownIcon />}
      >
        {floorselectedOption?.name && floorselectedOption?.name?.length <= 3
          ? `Floor ${floorselectedOption?.name}`
          : `${floorselectedOption?.name}`}
      </Button>
      <Menu
        anchorEl={anchorElF}
        open={Boolean(anchorElF)}
        onClose={handleFloorClose}
      >
        {" "}
        {currentBuilding?.floors?.sort(compareByNumericName).map((floor) => (
          <MenuItem
            key={floor.name}
            className={
              mobileMode
                ? floor.name === currentFloor?.name
                  ? classes.mobileModeSelectedmenuItemPlan
                  : classes.mobileModemenuItem
                : tour
                ? floor.name === currentFloor?.name
                  ? classes.selectedMenuItemPlan
                  : classes.menuItem
                : floor.name === currentFloor?.name
                ? classes.selectedMenuItemPlan
                : classes.menuItem
            }
            onClick={() => {
              changeFloor(floor.name);
              handleFloorClose();
            }}
            disabled={tour && !planExistsForFloor(floor)}
          >
            {tour
              ? planExistsForFloor(floor)
                ? `Floor ${floor.name}`
                : `Floor ${floor.name}-no Tours`
              : `Floor ${floor.name}`}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
