import * as React from "react";
import { DialogProps } from "../../types/DialogProps";
import { DialogLayout } from "../../dialogs/dialog-layout/DialogLayout";
import {
  Avatar,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Theme,
} from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import DoneIcon from "@mui/icons-material/Done";
import { blue } from "@mui/material/colors";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avatar: {
      backgroundColor: blue[100],
      color: blue[600],
    },
  })
);

const ScanInstructionsDialog: React.FC<DialogProps> = ({
  open = false,
  handleClose,
}) => {
  const classes = useStyles();

  return (
    <DialogLayout
      open={open}
      handleClose={handleClose}
      title="Video recording instructions"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <ListItem key={1}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>{<DoneIcon />}</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Make sure the camera in video mode" />
          </ListItem>
          <ListItem key={2}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>{<DoneIcon />}</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Start recording the video using the red circle button" />
          </ListItem>
          <ListItem key={3}>
            <ListItemAvatar>
              <Avatar className={classes.avatar}>{<DoneIcon />}</Avatar>
            </ListItemAvatar>
            <ListItemText primary="Verify on the touch screen that the video has started by seeing the timer counting" />
          </ListItem>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          Got it!
        </Button>
      </DialogActions>
    </DialogLayout>
  );
};

export default ScanInstructionsDialog;
