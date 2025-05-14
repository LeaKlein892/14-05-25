import * as React from "react";
import { FloatingPanel } from "../../floating-panel/FloatingPanel";
import PlanWrapper from "../plan-wrapper/PlanWrapper";
import CloseIcon from "@mui/icons-material/Close";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { IconButton, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import { useCallback, useContext, useEffect, useState } from "react";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { analyticsEvent, analyticsPlanActions } from "../../../utils/analytics";
import clsx from "clsx";
import { AreaSelector } from "../../area-selector/AreaSelector";
import { getSessionStorageItem } from "../../../utils/projects-utils";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { getQueryArgs } from "../../../utils/query-params";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    mapNav: {
      backgroundColor: theme.palette.grey[800],
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
    },
    operation: {
      color: theme.palette.secondary.main,
      position: "relative",
      height: "31px",
      width: "19px",
    },
    drag: {
      color: theme.palette.secondary.main,
      position: "relative",
      height: "19px",
      width: "19px",
      top: "0px",
    },
    leftShift: {
      left: "85%",
    },
    padOperation: {
      left: "9px",
    },
  })
);

export interface PlanMapProps {
  hide?: boolean;
  initialOpened?: boolean;
  switchSceneById?: (
    id?: string,
    yaw?: number,
    pitch?: number,
    fov?: number
  ) => void;
}

let lastOpen = true;
let hadFirstToggle = false;

const PlanMap: React.FC<PlanMapProps> = ({
  hide = false,
  initialOpened = true,
  switchSceneById,
}) => {
  const classes = useStyles();
  const { loggedUser } = useContext(LoggedUserContext);
  const { currentScene } = useContext(ProjectInformationContext);
  const [planOpened, setPlanOpened] = useState(
    hadFirstToggle ? lastOpen : initialOpened
  );
  let mobileMode = useMediaQuery("(max-width: 1224px)", { noSsr: true });
  const height = planOpened ? 220 : 30;
  const width = planOpened ? 315 : 30;
  const minHeight = planOpened ? 150 : 30;
  const minWidth = planOpened ? 270 : 30;
  let sceneTourData = getSessionStorageItem("SceneTourData");

  useEffect(() => {
    if (!hadFirstToggle) {
      setPlanOpened(initialOpened);
    }
  }, [initialOpened]);

  const togglePlanMap = useCallback(() => {
    hadFirstToggle = true;
    lastOpen = !planOpened;
    setPlanOpened(!planOpened);
    const analyticsAction: analyticsPlanActions = lastOpen
      ? "Plan Map Opened"
      : "Plan Map Closed";
    analyticsEvent("Plan", analyticsAction, loggedUser.username);
  }, [planOpened, loggedUser.username]);

  const isBroadcast = getQueryArgs("client")
    ? JSON.parse(getSessionStorageItem("isBroadcast"))
    : false;

  useEffect(() => {
    if (isBroadcast) setPlanOpened(false);
  }, [currentScene]);

  useEffect(() => {
    if (isBroadcast) {
      setPlanOpened(true);
      sessionStorage.setItem("isBroadcast", JSON.stringify(false));
    }
  }, [planOpened]);

  return planOpened ? (
    <FloatingPanel
      hide={hide}
      key={1}
      initialHeight={height}
      initialWidth={width}
      minHeight={minHeight}
      minWidth={minWidth}
      preventResize={mobileMode}
      preventDrag={mobileMode}
    >
      <div className={classes.mapNav}>
        <IconButton
          className={classes.operation}
          onClick={togglePlanMap}
          size="large"
        >
          <CloseIcon className={`close-map ${classes.operation}`} />
        </IconButton>

        {!mobileMode && (
          <DragIndicatorIcon
            className={clsx(classes.drag, classes.leftShift)}
          />
        )}

        {!sceneTourData && (
          <AreaSelector
            hide={false}
            tour={true}
            mobileMode={mobileMode}
            planOpened={planOpened}
            setPlanOpened={setPlanOpened}
          />
        )}
      </div>
      <PlanWrapper embeddedMode={true} switchSceneById={switchSceneById} />
    </FloatingPanel>
  ) : (
    <FloatingPanel
      hide={hide}
      key={2}
      initialHeight={30}
      initialWidth={45}
      preventResize
      preventDrag={mobileMode}
    >
      <div className={classes.mapNav}>
        <IconButton
          className={`close-map ${classes.operation} ${
            mobileMode ? classes.padOperation : ""
          }`}
          onClick={togglePlanMap}
          size="large"
        >
          <MapOutlinedIcon className={classes.operation} />
        </IconButton>
        {!mobileMode && <DragIndicatorIcon className={classes.drag} />}
      </div>
    </FloatingPanel>
  );
};
export default React.memo(PlanMap);
