import * as React from "react";
import { useContext } from "react";
import { DialogProps } from "../../types/DialogProps";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Theme,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import { analyticsEvent } from "../../../utils/analytics";
import { DialogLayout } from "../../dialogs/dialog-layout/DialogLayout";
import { makeStyles } from "@mui/styles";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { text } from "../../../utils/translation";
import { sendWifiCommand } from "../../../utils/webview-messenger";
import { ViewContext } from "../../../context/ViewContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    uploadLabel: {
      color: theme.palette.primary.main,
    },
  })
);

export const UploadDialog: React.FC<DialogProps> = ({
  open = false,
  handleClose,
}) => {
  const { loggedUser } = useContext(LoggedUserContext);
  const { openUploader } = useContext(ViewContext);
  const classes = useStyles();

  const handleUploadConfirmation = () => {
    analyticsEvent("Account", "User Upload Confirmed", loggedUser.username);
    sendWifiCommand("CONNECT_WIFI");
    openUploader(false);
    handleClose();
  };

  return (
    <DialogLayout
      open={open}
      handleClose={handleClose}
      title={text("account_upload_title")}
      maxWidth="sm"
      showCloseButton
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text("account_upload_content")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleUploadConfirmation}
          className={classes.uploadLabel}
        >
          Connect
        </Button>
      </DialogActions>
    </DialogLayout>
  );
};
