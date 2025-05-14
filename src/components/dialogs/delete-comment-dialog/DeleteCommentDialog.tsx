import * as React from "react";
import { useContext } from "react";
import { TransitionProps } from "@mui/material/transitions";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  SlideProps,
  Theme,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import { API } from "aws-amplify";
import { deleteComment } from "../../../graphql/mutations";
import { makeStyles } from "@mui/styles";
import { analyticsEvent } from "../../../utils/analytics";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { text } from "../../../utils/translation";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";

export interface DeleteCommentDialogProps {
  open: boolean;
  commentId: string;
  handleDeleteClosed: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps &
    Omit<SlideProps, "direction"> & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.primary.main,
    },
    errorLabel: {
      color: theme.palette.error.main,
    },
  })
);

export const DeleteCommentDialog: React.FC<DeleteCommentDialogProps> = ({
  open = false,
  commentId = "",
  handleDeleteClosed = () => {},
}) => {
  const classes = useStyles();
  const { loggedUser } = useContext(LoggedUserContext);
  const { client } = useContext(ProjectInformationContext);

  const handleDeleteClicked = async () => {
    analyticsEvent("Tasks", "Task Deleted", loggedUser.username);
    await API.graphql({
      query: deleteComment,
      variables: { input: { id: commentId } },
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    });
    setTimeout(() => {
      handleDeleteClosed();
    }, 300);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleDeleteClosed}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title" className={classes.root}>
        {`${text("comment_delete", client)}?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {text("comment_delete_explained", client)}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDeleteClosed} color="primary">
          {text("cancel", client)}
        </Button>
        <Button
          onClick={handleDeleteClicked}
          color="primary"
          className={classes.errorLabel}
        >
          {text("delete", client)}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
