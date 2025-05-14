import * as React from "react";
import { useContext, useState } from "react";
import SpeedDial from "@mui/material/SpeedDial";
import { SpeedDialAction } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { createStyles } from "@mui/styles";
import FileCopyOutlinedIcon from "@mui/icons-material/FileCopyOutlined";
import ShareIcon from "@mui/icons-material/Share";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { analyticsError, analyticsEvent } from "../../../utils/analytics";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { exportReportHtml } from "../../../utils/file-manager";
import { Comment } from "../../../models";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { dateAsDMY } from "../../../utils/date-utils";
import { showMessage } from "../../../utils/messages-manager";
import { NA } from "../../../utils/clients";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { delay } from "lodash-es";
import { emptyFn } from "../../../utils/render-utils";
import { APP_PLAN } from "../../../utils/site-routes";
import {
  sendCopyText,
  sendMail,
  sendWhatsapp,
  webViewMode,
} from "../../../utils/webview-messenger";

const useStyles = makeStyles((theme) =>
  createStyles({
    speedDial: {
      position: "fixed",
      zIndex: 1,
      bottom: theme.spacing(6.5),
      right: theme.spacing(2),
    },
  })
);

type ShareOptionName = "Copy" | "WhatsApp" | "Mail" | "Image" | "Report";
type ShareOptionFunction = () => void;

interface ShareOption {
  icon: any;
  name: ShareOptionName;
}

const inWebView = webViewMode();

const basicActions: Array<ShareOption> = [
  { icon: <FileCopyOutlinedIcon />, name: "Copy" },
  { icon: <WhatsAppIcon />, name: "WhatsApp" },
  { icon: <MailOutlineOutlinedIcon />, name: "Mail" },
];

const actions: Array<ShareOption> = inWebView
  ? basicActions
  : [
      ...basicActions,
      { icon: <PhotoLibraryIcon />, name: "Image" },
      { icon: <NoteAddIcon />, name: "Report" },
    ];

const getPlanUrl = (currentDate: string, currentPlan?: string): string => {
  if (currentDate === "" || !currentPlan) {
    return "";
  }
  return (
    APP_PLAN +
    "?pdf=" +
    encodeURIComponent(currentPlan) +
    "&date=" +
    currentDate
  );
};

function extractScreenshotFromVideoStream(
  stream: any,
  imageCallback: (blob: any) => void
) {
  const videoTrack = stream.getVideoTracks();
  let track = videoTrack[videoTrack.length - 1];
  let capture = new ImageCapture(track);
  let canvas = document.createElement("canvas");
  capture.grabFrame().then((bitmap: any) => {
    track.stop();

    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    canvas?.getContext("2d")?.drawImage(bitmap, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        imageCallback(blob);
      }
    });
  });
}

export interface ShareButtonProps {
  onShareClick: () => string;
  projectLocation: string;
  comments: Comment[];
  planMode?: boolean;
  imageCallback?: (blob: any) => void;
}

export const ShareSpeedDial: React.FC<ShareButtonProps> = ({
  onShareClick,
  projectLocation,
  comments,
  planMode = false,
  imageCallback = emptyFn,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { loggedUser } = useContext(LoggedUserContext);
  const { currentPlan, currentDate, client } = useContext(
    ProjectInformationContext
  );

  const toggleOpen = () => {
    setOpen(!open);
  };

  const onCopy = () => {
    analyticsEvent(
      "Tour",
      "Tour shared by copy link",
      loggedUser.username || client || NA
    );
    const tourUrl: string = onShareClick();
    if (inWebView) {
      sendCopyText(tourUrl);
    } else {
      navigator?.clipboard?.writeText(tourUrl);
    }
    showMessage("Link copied to clipboard!");
  };

  const onWhatsApp = () => {
    analyticsEvent(
      "Tour",
      "Tour shared by WhatsApp",
      loggedUser.username || client || NA
    );
    const tourUrl: string = onShareClick();
    const message = encodeURIComponent(tourUrl);
    inWebView
      ? sendWhatsapp(message)
      : window.open("https://wa.me/?text=" + message, "_blank");
  };

  const onMail = () => {
    analyticsEvent(
      "Tour",
      "Tour shared by mail",
      loggedUser.username || client || NA
    );
    const tourUrl: string = onShareClick();
    const subject = "Shared view from Castory";
    inWebView
      ? sendMail(subject, tourUrl)
      : window.location.assign(
          "mailto:?subject=" + subject + "&body=" + encodeURIComponent(tourUrl)
        );
  };

  const onImage = () => {
    if (
      navigator &&
      navigator.mediaDevices &&
      (navigator.mediaDevices as any).getDisplayMedia
    ) {
      return (navigator.mediaDevices as any)
        .getDisplayMedia()
        .then((stream: any) => {
          // Grab frame from stream
          delay(() => {
            extractScreenshotFromVideoStream(stream, imageCallback);
          }, 500);
        })
        .catch((e: any) => {
          const errorMessage = "Failed to export as image";
          analyticsError(errorMessage + " " + JSON.stringify(e));
          showMessage(errorMessage, "error");
        });
    } else {
      showMessage("Cannot export image on this device", "warning");
    }
  };

  const onReport = () => {
    analyticsEvent(
      "Tour",
      "Tour report generated",
      loggedUser.username || client || NA
    );
    const tourUrl = !planMode ? onShareClick() : undefined;
    const calculatedPlanUrl = getPlanUrl(currentDate, currentPlan);
    const planUrl = calculatedPlanUrl !== "" ? calculatedPlanUrl : undefined;
    exportReportHtml({
      reportedBy: loggedUser.username || client || "Not Available",
      reportedAt: dateAsDMY(),
      numberOfOpenTasks: comments.length,
      projectLocation,
      tourUrl,
      planUrl,
    });
  };

  const nameToFunction = new Map<ShareOptionName, ShareOptionFunction>([
    ["Copy", onCopy],
    ["WhatsApp", onWhatsApp],
    ["Mail", onMail],
    ["Image", onImage],
    ["Report", onReport],
  ]);

  const runShareFunction = (shareOptionName: ShareOptionName) => {
    const functionToRun = nameToFunction.get(shareOptionName);
    if (functionToRun) {
      functionToRun();
    }
  };

  return (
    <SpeedDial
      ariaLabel="Initial point selector"
      className={classes.speedDial}
      FabProps={{
        size: "small",
        variant: "extended",
      }}
      icon={<ShareIcon />}
      onClose={toggleOpen}
      onOpen={toggleOpen}
      open={open}
      direction="left"
    >
      {actions.map((action) => {
        return (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipPlacement="bottom"
            onClick={() => runShareFunction(action.name)}
          />
        );
      })}
    </SpeedDial>
  );
};
