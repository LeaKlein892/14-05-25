import React, { useContext, useEffect, useState } from "react";

import { makeStyles } from "@mui/styles";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Switch,
} from "@mui/material";
import { APP_HOME } from "../../../utils/site-routes";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { API, graphqlOperation } from "aws-amplify";
import { updateUserProfile } from "../../../graphql/mutations";
import { showMessage } from "../../../utils/messages-manager";
import { analyticsError, analyticsEvent } from "../../../utils/analytics";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  formControl: {
    margin: theme.spacing(13),
  },
  backToHome: {
    marginTop: theme.spacing(3),
  },
}));

const Setting = () => {
  const classes = useStyles();
  const {
    loggedUser: { id, unsubscribedToEmails, username },
  } = useContext(LoggedUserContext);
  const [subscribed, setSubscribed] = useState(true);

  const handleChange = async (event: any) => {
    const checked = event.target.checked;
    analyticsEvent("Account", "User Updated Mail Settings", username);
    setSubscribed(checked);
    try {
      await API.graphql(
        graphqlOperation(updateUserProfile, {
          input: { id, unsubscribedToEmails: !checked },
        })
      );
      showMessage("Mail setting were updated.", "success");
    } catch (err) {
      const errorMessage = "Failed to update mail settings.";
      showMessage(errorMessage, "error");
      analyticsError(errorMessage + JSON.stringify(err));
    }
  };

  useEffect(() => {
    setSubscribed(!unsubscribedToEmails);
  }, [unsubscribedToEmails]);

  const handleClickHome = () => {
    window.location.replace(APP_HOME);
  };

  return (
    <div className={classes.root}>
      <FormControl
        variant="standard"
        component="fieldset"
        className={classes.formControl}
      >
        <FormLabel component="legend">Account Notifications</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={subscribed}
                onChange={handleChange}
                name="receiveEmails"
                color="primary"
              />
            }
            label="Receive emails"
          />
        </FormGroup>
        <Button
          className={classes.backToHome}
          variant="contained"
          onClick={handleClickHome}
          color="primary"
        >
          Back to Home Screen
        </Button>
      </FormControl>
    </div>
  );
};

export default Setting;
