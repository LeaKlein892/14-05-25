import * as React from "react";
import { useCallback, useContext, useState } from "react";
import { Button, MenuItem, Menu } from "@mui/material";
import TodayIcon from "@mui/icons-material/Today";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { Area, Floor, Building, UserProfile } from "../../models";
import { analyticsEvent } from "../../utils/analytics";
import { compareInfosByDate } from "../../utils/projects-utils";
import { useHistory } from "react-router-dom";
import { useStyles } from "./SelectorStyles";

export interface DateSelectorProps {
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

export const DateSelector: React.FC<DateSelectorProps> = ({
  tour = false,
  mobileMode,
  update,
  loggedUser,
  planOpened,
  setPlanOpened,
}) => {
  const classes = useStyles();
  const { currentArea, currentDate } = useContext(ProjectInformationContext);

  const [anchorElD, setAnchorElD] = useState(null);

  const handleDateClick = useCallback((event: any) => {
    setAnchorElD(event.currentTarget);
  }, []);

  const handleDateClose = useCallback(() => {
    setAnchorElD(null);
  }, []);

  let history = useHistory();

  const changeDate = useCallback(
    (d: string) => {
      const selectedInfo = currentArea?.infos?.find((info) => info.date === d);
      if (selectedInfo) {
        const analyticsAction = tour
          ? "Date Switched in tour"
          : "Date Switched in plan";
        const analyticsEventType = tour ? "Tour" : "Plan";
        analyticsEvent(
          analyticsEventType,
          analyticsAction,
          loggedUser.username
        );
        tour && setPlanOpened
          ? setPlanOpened(!planOpened)
          : history.push("/project");
        update(
          selectedInfo.plan,
          selectedInfo.date,
          selectedInfo.tour,
          currentArea
        );
        !tour && history.push("/plan");
      }
    },
    [
      setPlanOpened,
      currentArea,
      tour,
      planOpened,
      update,
      history,
      loggedUser.username,
    ]
  );

  return (
    <div>
      <Button
        title="switch Date"
        className={tour ? classes.buttonTour : classes.buttonPlan}
        onClick={handleDateClick}
      >
        <TodayIcon />
      </Button>
      <Menu
        anchorEl={anchorElD}
        open={Boolean(anchorElD)}
        onClose={handleDateClose}
      >
        {currentArea?.infos
          ?.sort(compareInfosByDate)
          .filter((info) => (tour ? info.date !== "blueprint" : true))
          .map((info) => (
            <MenuItem
              key={info.date}
              className={
                mobileMode
                  ? info.date === currentDate
                    ? classes.mobileModeSelectedmenuItemPlan
                    : classes.mobileModemenuItem
                  : tour
                  ? info.date === currentDate
                    ? classes.selectedMenuItemPlan
                    : classes.menuItem
                  : info.date === currentDate
                  ? classes.selectedMenuItemPlan
                  : classes.menuItem
              }
              onClick={() => {
                changeDate(info.date);
                handleDateClose();
              }}
            >
              {info.date}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
};
