import * as React from "react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import { Switch, Tooltip } from "@mui/material";
import { analyticsEvent } from "../../../utils/analytics";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { ViewContext } from "../../../context/ViewContext";
import { getOppositeDirectionYaw, modulo2PI } from "../../../utils/pano-utils";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { NA } from "../../../utils/clients";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fastModeSwitch: {
      position: "fixed",
      zIndex: 1,
      bottom: theme.spacing(2),
      left: theme.spacing(2),
    },
    fastModeSwitchNavBarOpen: {
      position: "fixed",
      zIndex: 1,
      bottom: theme.spacing(2),
      left: theme.spacing(32),
    },
    fastModeTooltip: {
      whiteSpace: "pre-line",
    },
  })
);

export type FastModeDirection = "INC" | "DEC";

const sideArrowDiff = 0.3926991;

export interface FastModeProps {
  currentIndex?: number;
  higherIndex: number;
  actionOnIndex: (
    index: number,
    yaw?: number,
    pitch?: number,
    fov?: number
  ) => void;
  currentDirection?: FastModeDirection;
  getTargetsForHotspotByIndexes: (
    fromIndex: number,
    toIndex: number
  ) => {
    targetFov: number;
    targetPitch: number;
    targetYaw: number;
  };
  getCurrentDirection: (
    fromSceneIndex: number,
    toUpSceneIndex: number,
    toDownSceneIndex: number
  ) => FastModeDirection;
  setFastModeDirection: Dispatch<SetStateAction<"INC" | "DEC" | undefined>>;
}

let lastIsFastMode: boolean = true;

const ArrowUpKeyCode = "ArrowUp";
const ArrowDownKeyCode = "ArrowDown";
const ArrowLeftKeyCode = "ArrowLeft";
const ArrowRightKeyCode = "ArrowRight";

export const FastMode: React.FC<FastModeProps> = ({
  currentIndex,
  higherIndex,
  actionOnIndex,
  getTargetsForHotspotByIndexes,
  getCurrentDirection,
  setFastModeDirection,
}) => {
  const classes = useStyles();

  const [isFastMode, setIsFastMode] = useState<boolean>(lastIsFastMode);

  const { loggedUser } = useContext(LoggedUserContext);
  const { navbarOpen } = useContext(ViewContext);
  const { lastYaw, setLastYaw, client } = useContext(ProjectInformationContext);

  const handleCtrlAndArrow = useCallback(
    (e: Event) => {
      if (
        ((e as KeyboardEvent).ctrlKey || isFastMode) &&
        ((e as KeyboardEvent).code === ArrowUpKeyCode ||
          (e as KeyboardEvent).code === ArrowDownKeyCode)
      ) {
        const lastSceneIndex = currentIndex;
        if (lastSceneIndex !== undefined) {
          const upSceneIndex =
            lastSceneIndex + 1 > higherIndex ? 0 : lastSceneIndex + 1; // check if need to jump from last to first
          const downSceneIndex =
            lastSceneIndex - 1 < 0 ? higherIndex : lastSceneIndex - 1; // check if need to jump from first to last
          const currentDirection = getCurrentDirection(
            lastSceneIndex,
            upSceneIndex,
            downSceneIndex
          );
          const moveToSceneIndex =
            ((e as KeyboardEvent).code === ArrowUpKeyCode &&
              currentDirection === "INC") ||
            ((e as KeyboardEvent).code === ArrowDownKeyCode &&
              currentDirection === "DEC")
              ? upSceneIndex
              : downSceneIndex;
          const targetInfo = getTargetsForHotspotByIndexes(
            lastSceneIndex,
            moveToSceneIndex
          );
          analyticsEvent(
            "Tour",
            (e as KeyboardEvent).ctrlKey
              ? "Fast Mode Arrow Clicked With Ctrl"
              : "Fast Mode Arrow Clicked With Switch ON",
            loggedUser.username || client || NA
          );
          const yawToSet =
            (e as KeyboardEvent).code === ArrowUpKeyCode
              ? targetInfo.targetYaw
              : getOppositeDirectionYaw(targetInfo.targetYaw);
          const pitchToSet = targetInfo.targetPitch;
          actionOnIndex(
            moveToSceneIndex,
            yawToSet,
            pitchToSet,
            targetInfo.targetFov
          );
          setLastYaw(yawToSet);
          e.preventDefault();
          e.stopPropagation();
        }
      }
      if (
        ((e as KeyboardEvent).ctrlKey || isFastMode) &&
        ((e as KeyboardEvent).code === ArrowLeftKeyCode ||
          (e as KeyboardEvent).code === ArrowRightKeyCode)
      ) {
        analyticsEvent(
          "Tour",
          "Fast Mode Side Rotation",
          loggedUser.username || client || NA
        );
        const diffForYaw =
          (e as KeyboardEvent).code === ArrowLeftKeyCode
            ? -1 * sideArrowDiff
            : (e as KeyboardEvent).code === ArrowRightKeyCode
            ? sideArrowDiff
            : 0;
        const yawToSet = modulo2PI(lastYaw + diffForYaw);
        actionOnIndex(currentIndex || 0, yawToSet);
        setLastYaw(yawToSet);
        setFastModeDirection(undefined);
      }
    },
    [
      actionOnIndex,
      currentIndex,
      higherIndex,
      isFastMode,
      getTargetsForHotspotByIndexes,
      getCurrentDirection,
      loggedUser.username,
      client,
      lastYaw,
      setLastYaw,
      setFastModeDirection,
    ]
  );

  const toggleFastMode = useCallback(() => {
    analyticsEvent(
      "Tour",
      lastIsFastMode ? "Fast Mode Toggled - OFF" : "Fast Mode Toggled - ON",
      loggedUser.username || client || NA
    );
    lastIsFastMode = !lastIsFastMode;
    setIsFastMode(lastIsFastMode);
  }, [setIsFastMode, loggedUser.username, client]);

  useEffect(() => {
    window.addEventListener("keydown", handleCtrlAndArrow);

    return () => {
      window.removeEventListener("keydown", handleCtrlAndArrow);
    };
  }, [handleCtrlAndArrow]);

  return (
    <Tooltip
      disableInteractive
      title={
        <span>
          <p>
            <i>Fast Mode:</i>
          </p>
          <p>Use ↑ and ↓ buttons to scroll through frames!</p>
          <p>You can also use ← and → buttons to rotate in frame</p>
        </span>
      }
      placement={"left"}
      enterDelay={50}
      enterNextDelay={50}
      className={classes.fastModeTooltip}
    >
      <Switch
        defaultChecked={isFastMode}
        onChange={toggleFastMode}
        className={
          navbarOpen ? classes.fastModeSwitchNavBarOpen : classes.fastModeSwitch
        }
        color="secondary"
      />
    </Tooltip>
  );
};
