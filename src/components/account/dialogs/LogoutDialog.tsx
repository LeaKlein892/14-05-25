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
import { createStyles, makeStyles } from "@mui/styles";
import { analyticsError, analyticsEvent } from "../../../utils/analytics";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { DialogLayout } from "../../dialogs/dialog-layout/DialogLayout";
import { LoggedUserContext } from "../../../context/LoggedUserContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    errorLabel: {
      color: theme.palette.error.main,
    },
  })
);

export const LogoutDialog: React.FC<DialogProps> = ({
  open = false,
  handleClose,
}) => {
  let history = useHistory();
  const { loggedUser } = useContext(LoggedUserContext);
  const classes = useStyles();

  const handleLogout = async () => {
    analyticsEvent("Account", "User Signed Out", loggedUser.username);
    try {
      await Auth.signOut();
      history.push("/project");
      window.location.reload();
    } catch (e: any) {
      console.log("Failed to log out");
      analyticsError("Failed to log out: " + e.toString());
    }
    handleClose();
  };

  return (
    <DialogLayout
      open={open}
      handleClose={handleClose}
      title="Logout from Castory?"
      maxWidth="sm"
      showCloseButton
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to logout?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleLogout} className={classes.errorLabel}>
          Logout
        </Button>
      </DialogActions>
    </DialogLayout>
  );
};
