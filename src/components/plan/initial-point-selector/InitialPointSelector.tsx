import * as React from "react";
import { lazy, Suspense, useContext, useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/lab/SpeedDialIcon";
import { SpeedDialAction } from "@mui/material";
import { createStyles } from "@mui/styles";
import { makeStyles } from "@mui/styles";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ReportIcon from "@mui/icons-material/Report";
import { LocationMarker } from "./LocationMarker";
import CompareIcon from "@mui/icons-material/Compare";
import { webViewMode } from "../../../utils/webview-messenger";
import { ViewContext } from "../../../context/ViewContext";
import {
  isTimeExceedingDays,
  setStorageKeyTime,
} from "../../../utils/storage-manager";
import { ScanRecord } from "../../../models";
const InitialPointDialog = lazy(() => import("./InitialPointDialog"));
const ScanInstructionsDialog = lazy(() => import("./ScanInstructionsDialog"));
const PhotoUploadDialog = lazy(
  () => import("../../photo-documentation/PhotoUploadDialog")
);

const useStyles = makeStyles((theme) =>
  createStyles({
    speedDial: {
      position: "fixed",
      bottom: theme.spacing(20),
      right: "10px",
    },
  })
);

type ScanOptionName = "Report" | "Photo" | "Video" | "Compare";
type ScanOptionFunction = () => void;

interface ScanOption {
  icon: any;
  name: ScanOptionName;
}

const actions: Array<ScanOption> = [
  { icon: <ReportIcon />, name: "Report" },
  { icon: <PhotoCameraIcon />, name: "Photo" },
  { icon: <VideoCallIcon />, name: "Video" },
];

const wrapActionsArray = (
  actions: Array<ScanOption>,
  compareFn?: () => void
): Array<ScanOption> => {
  return compareFn
    ? [...actions, { icon: <CompareIcon />, name: "Compare" }]
    : actions;
};

const wrapActionsMap = (
  actionMap: Map<ScanOptionName, ScanOptionFunction>,
  compareFn?: () => void
): Map<ScanOptionName, ScanOptionFunction> => {
  const mapToReturn = new Map(actionMap);
  compareFn && mapToReturn.set("Compare", compareFn);
  return mapToReturn;
};

export interface InitialPointSelectorProps {
  open: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  onLocationSaved: () => void;
  planTitle: string;
  onTourReport: () => void;
  onPhotoAdded?: (fileName: string) => void;
  onPlanStateSaved?: () => void;
  hidden?: boolean;
  top?: number;
  left?: number;
  getScanRecord: () => ScanRecord;
  plan: string;
}

export const InitialPointSelector: React.FC<InitialPointSelectorProps> = ({
  open,
  handleOpen,
  handleClose,
  onLocationSaved,
  onPhotoAdded = () => {},
  onTourReport,
  onPlanStateSaved,
  hidden = false,
  planTitle,
  top,
  left,
  getScanRecord,
  plan,
}) => {
  const classes = useStyles();
  const { openUploader } = useContext(ViewContext);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const onClickVideo = () => {
    setVideoDialogOpen(true);
  };

  const onClickPhoto = () => {
    setPhotoDialogOpen(true);
  };

  const nameToFunction = new Map<ScanOptionName, ScanOptionFunction>([
    ["Report", onTourReport],
    ["Photo", onClickPhoto],
    ["Video", onClickVideo],
  ]);

  const handlePointSaved = () => {
    onLocationSaved();
    handleDialogVideoClose();
    webViewMode() && openUploader(true);
    const scanTimeExceedingDays = isTimeExceedingDays(
      "SHOWED_SCAN_INSTRUCTIONS",
      7
    );
    if (scanTimeExceedingDays) {
      setStorageKeyTime("SHOWED_SCAN_INSTRUCTIONS");
      setSaved(true);
    }
    handleClose();
  };

  const handleDialogVideoClose = () => {
    setVideoDialogOpen(false);
  };

  const handleDialogPhotoClose = () => {
    setPhotoDialogOpen(false);
  };

  const handleInstructionClosed = () => {
    setSaved(false);
  };

  return (
    <div>
      <SpeedDial
        ariaLabel="Initial point selector"
        className={classes.speedDial}
        hidden={onPlanStateSaved ? false : hidden}
        FabProps={{
          size: "small",
          variant: "extended",
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {wrapActionsArray(actions, onPlanStateSaved).map((action) => {
          return (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={wrapActionsMap(nameToFunction, onPlanStateSaved).get(
                action.name
              )}
            />
          );
        })}
      </SpeedDial>
      <LocationMarker open={open} top={top} left={left} />
      <Suspense fallback={null}>
        {videoDialogOpen && (
          <InitialPointDialog
            open={videoDialogOpen}
            handlePointSaved={handlePointSaved}
            handleClose={handleDialogVideoClose}
            planTitle={planTitle}
          />
        )}
        {saved && (
          <ScanInstructionsDialog
            open={saved}
            handleClose={handleInstructionClosed}
          />
        )}
        {photoDialogOpen && (
          <PhotoUploadDialog
            onPhotoAdded={onPhotoAdded}
            handleClose={handleDialogPhotoClose}
            open={photoDialogOpen}
            getScanRecord={getScanRecord}
            plan={plan}
          />
        )}
      </Suspense>
    </div>
  );
};
