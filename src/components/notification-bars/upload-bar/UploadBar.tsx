import * as React from "react";
import { useState } from "react";
import { NotificationBarLayout } from "../notification-bar-layout/NotificationBarLayout";
import IconButton from "@mui/material/IconButton";
import { Publish } from "@mui/icons-material";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import PublishSharpIcon from "@mui/icons-material/PublishSharp";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";
import { text } from "../../../utils/translation";
import { webViewMode } from "../../../utils/webview-messenger";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    upload: {
      padding: theme.spacing(1),
    },
  })
);

export interface UploadBarProps {
  onUploadAction: () => void;
}

export const UploadBar: React.FC<UploadBarProps> = ({ onUploadAction }) => {
  const classes = useStyles();
  const message = text("upload_videos");

  const hide = !webViewMode();
  const [open, setOpen] = useState(true);

  const toggleBar = () => setOpen(!open);

  return (
    <>
      {!hide && (
        <NotificationBarLayout
          open={open}
          message={message}
          action={
            <>
              <IconButton
                aria-label="close"
                color="primary"
                className={classes.upload}
                onClick={onUploadAction}
                size="large"
              >
                <Publish />
              </IconButton>
              <IconButton
                aria-label="close"
                color="secondary"
                className={classes.upload}
                onClick={toggleBar}
                size="large"
              >
                <CloseSharpIcon />
              </IconButton>
            </>
          }
          elementOnClosed={
            <IconButton
              aria-label="expand"
              color="secondary"
              onClick={toggleBar}
              size="large"
            >
              <PublishSharpIcon />
            </IconButton>
          }
        />
      )}
    </>
  );
};
