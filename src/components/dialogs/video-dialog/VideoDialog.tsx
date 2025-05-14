import * as React from "react";
import { DialogProps } from "../../types/DialogProps";
import ReactPlayer from "react-player";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DialogLayout } from "../dialog-layout/DialogLayout";
import { FloatingDialogLayout } from "../floating-dialog/FloatingDialogLayout";

export interface VideoDialogProps extends DialogProps {
  fileName: string;
  mobileMode?: boolean;
  embeddedMode?: boolean;
  planTitle?: string;
  splitScreenLeft?: boolean;
  splitScreenRight?: boolean;
}
const VideoDialog: React.FC<VideoDialogProps> = ({
  open = false,
  handleClose,
  fileName,
  mobileMode = false,
  planTitle = "",
  splitScreenLeft = false,
  splitScreenRight = false,
}) => {
  const LayoutComponent =
    splitScreenRight || splitScreenLeft ? FloatingDialogLayout : DialogLayout;
  return (
    <LayoutComponent
      title={planTitle || "Uploaded video"}
      handleClose={handleClose}
      open={open}
      maxWidth={"xl"}
      fullScreen={mobileMode || planTitle !== ""}
      showCloseButton
      splitScreenLeft={splitScreenLeft}
      splitScreenRight={splitScreenRight}
    >
      <DialogContent>
        <ReactPlayer
          url={fileName}
          playing={false}
          controls={true}
          width="100%"
          height="100%"
        />
      </DialogContent>
      <DialogActions />
    </LayoutComponent>
  );
};

export default VideoDialog;
