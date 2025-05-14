import * as React from "react";
import { Avatar, List, ListItem, ListItemAvatar } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import ListItemText from "@mui/material/ListItemText";
import { DialogProps } from "../types/DialogProps";
import { DialogLayout } from "../dialogs/dialog-layout/DialogLayout";

const useStyles = makeStyles(() =>
  createStyles({
    install: {
      display: "flex",
      justifyContent: "center",
    },
    share: {
      margin: "0px 4px",
    },
  })
);

const InstallPWA: React.FC<DialogProps> = ({ open, handleClose }) => {
  const classes = useStyles();

  return (
    <DialogLayout
      title="Install Castory on your device"
      open={open}
      handleClose={handleClose}
      showCloseButton
    >
      <List>
        <ListItem className={classes.install}>
          <ListItemAvatar>
            <Avatar variant="square" src="/logos/apple-touch-icon.png" />
          </ListItemAvatar>
          <ListItemText primary="Install the app on your home screen for better experience" />
        </ListItem>
        <ListItem className={classes.install}>
          <p>
            Tap
            <img
              src="/img/apple-share.png"
              className={classes.share}
              alt="Add to homescreen"
              height="20"
              width="20"
            />
            then &quot;Add to Home Screen&quot;
            <img
              src="/img/add.png"
              className={classes.share}
              alt="Add to homescreen"
              height="20"
              width="20"
            />
          </p>
        </ListItem>
      </List>
    </DialogLayout>
  );
};

export default InstallPWA;
