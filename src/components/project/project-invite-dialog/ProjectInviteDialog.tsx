import * as React from "react";
import { ChangeEvent, useCallback, useContext, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  TextField,
} from "@mui/material";
import { Project } from "../../../models";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { inviteUser } from "../../../graphql/mutations";
import { analyticsError, analyticsEvent } from "../../../utils/analytics";
import { API, graphqlOperation } from "aws-amplify";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import * as Yup from "yup";
import { showMessage } from "../../../utils/messages-manager";

export interface ProjectInviteDialogProps {
  project: Project | undefined;
  open: boolean;
  onClose: () => void;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      color: theme.palette.primary.main,
    },
    inviteIcon: {
      paddingRight: theme.spacing(2),
      width: theme.spacing(6),
    },
  })
);

const ProjectInviteDialog: React.FC<ProjectInviteDialogProps> = ({
  project,
  open,
  onClose,
}) => {
  const classes = useStyles();

  const { loggedUser } = useContext(LoggedUserContext);
  const username = loggedUser.username ?? "";
  const [mailTo, setMailTo] = useState<string>("");
  const [emailValidationError, setEmailValidationError] =
    useState<boolean>(false);

  const handleClose = useCallback(() => {
    setMailTo("");
    onClose();
  }, [onClose]);

  const schema = Yup.object().shape({
    email: Yup.string().ensure().email().required("Required"),
  });

  const validateEmail = useCallback(async () => {
    const isValid = await schema.isValid({
      email: mailTo,
    });
    if (!isValid) {
      setEmailValidationError(true);
    }
    return isValid;
  }, [mailTo, schema]);

  const handleInvite = useCallback(async () => {
    const isEmailValid = await validateEmail();
    if (isEmailValid && project?.id) {
      analyticsEvent("Project", "Project Invitation Created", username);

      (
        API.graphql(
          graphqlOperation(inviteUser, {
            from: username,
            email: mailTo,
            projectId: project?.id ?? "",
            projectName: project?.name ?? "",
          })
        ) as Promise<any>
      )
        .then(() => {
          showMessage("Your invitation was sent!", "success");
        })
        .catch((e) => {
          console.log("Got Error: ", e);
          showMessage("Error sending invitation, please try again...", "error");
          analyticsError("Error sending email: " + JSON.stringify(e));
        });
      setTimeout(() => {
        handleClose();
      }, 100);
    }
  }, [handleClose, username, mailTo, project, validateEmail]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="sm"
      fullWidth
      scroll="body"
    >
      <DialogTitle id="form-dialog-title" className={classes.title}>
        <PersonAddIcon color={"primary"} className={classes.inviteIcon} />
        {`Invite members to project : ${project?.name}`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>Add members to project:</DialogContentText>
        <TextField
          variant="standard"
          size="small"
          id="mail"
          label="Mail Addresses"
          type="input"
          fullWidth
          onChange={(
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
          ) => {
            setMailTo(event.target.value);
          }}
          error={emailValidationError}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleInvite} color="primary">
          Invite
        </Button>
      </DialogActions>
      <Divider />
    </Dialog>
  );
};

export default ProjectInviteDialog;
