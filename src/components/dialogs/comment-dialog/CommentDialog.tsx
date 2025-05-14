import * as React from "react";
import { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormLabel,
  Grid,
  IconButton,
  TextField,
  Theme,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import {
  createComment,
  syncNonLocatedComment,
  updateComment,
} from "../../../graphql/mutations";
import { API } from "aws-amplify";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { DialogMode, SelectedScene } from "../../panorama/types";
import * as Yup from "yup";
import { DialogProps } from "../../types/DialogProps";
import { CreateCommentInput, IssueTypeEnum } from "../../../API";
import { Comment, CommentReply, ScanRecord } from "../../../models";
import { verifyLoggedUser } from "../../../utils/logged-user";
import { DeleteCommentDialog } from "../delete-comment-dialog/DeleteCommentDialog";
import { CommentActivity } from "../comment-activity/CommentActivity";
import { analyticsError, analyticsEvent } from "../../../utils/analytics";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { IssueTypeSelect } from "../../comments/issue-type-select/IssueTypeSelect";
import { ImageUploader } from "./ImageUploader";
import { Loader } from "../../loader/Loader";
import { AppModeEnum, ViewContext } from "../../../context/ViewContext";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { PlanLocationDialog } from "./PlanLocationDialog";
import { NON_LOCATED } from "../../../utils/tasks-issue-types-utils";
import theme from "../../../ui/theme";
import CloseIcon from "@mui/icons-material/Close";
import { ShareButton } from "../../panorama/share/ShareButton";
import { getShareUrlFromComment } from "../../../utils/comments-utils";
import { showMessage } from "../../../utils/messages-manager";
import { EXPONET, RAMDOR, supportInfo } from "../../../utils/clients";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { text } from "../../../utils/translation";
import {
  getFloorName,
  getProjectDetailsFromDataUrl,
  projectNameFromUrl,
} from "../../../utils/projects-utils";
import { getLocationDisplayName } from "../../../utils/display-names-utils";
import { CommentLocationIcon } from "../../comments/comments-list/CommentLocationIcon";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.primary.main,
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    dialogContent: {
      overflow: "visible",
    },
    dialog: {
      overflow: "visible",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    errorLabel: {
      color: theme.palette.error.main,
    },
    shareButton: {
      margin: "7px 0px",
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })
);

const paperProps: any = { style: { overflowY: "visible" } };

const schema = Yup.object().shape({
  mail: Yup.string().ensure().email().required("Required"),
  name: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  issueTypes: Yup.array(),
});

const dataUrlOrDefault = (dataUrl: string) =>
  dataUrl === "" ? NON_LOCATED : dataUrl;
console.log("dataUrlOrDefault", dataUrlOrDefault);

const syncCreatedComment = (
  record: ScanRecord | undefined,
  createdComment: any
) => {
  if (record) {
    API.graphql({
      query: syncNonLocatedComment,
      variables: {
        id: createdComment.data.createComment.id,
      },
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    });
  }
};

export interface CommentDialogProps extends DialogProps {
  scene: SelectedScene;
  lastSelectedComment?: Comment;
  mode?: DialogMode;
  record?: ScanRecord;
  preventShowingPlan?: boolean;
}

const CommentDialog: React.FC<CommentDialogProps> = ({
  open = false,
  handleClose,
  scene,
  lastSelectedComment,
  mode = "CREATE",
  record,
  preventShowingPlan = false,
}) => {
  const classes = useStyles();
  const { loggedUser } = useContext(LoggedUserContext);
  const { appMode } = useContext(ViewContext);

  const {
    currentProject,
    currentTour: dataUrl,
    clientComment,
    commentId,
    userId,
    client,
  } = useContext(ProjectInformationContext);
  console.log("dataurl from dialog", dataUrl);
  // console.log("currentTour", currentTour);
  
  const { username, role, id, email } = loggedUser;
  const writtenBy = username || userId;

  useEffect(() => {
    setFormError(
      id || client === RAMDOR || client === EXPONET
        ? ""
        : "Login required to comment"
    );
  }, [id, client]);

  const [formIssueTypes, setFormIssueTypes] = useState<IssueTypeEnum[]>([]);
  const [formCustomIssueTypes, setFormCustomIssueTypes] = useState<string[]>(
    []
  );
  const [fileIsUploading, setFileIsUploading] = useState(false);
  const [formError, setFormError] = useState(
    id ? "" : "Login required to comment"
  );
  const [showDelete, setShowDelete] = useState(false);
  const [showPlanLocation, setShowPlanLocation] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  const isEdit = mode === "EDIT";
  const isView =
    isEdit &&
    !verifyLoggedUser(lastSelectedComment?.writtenBy) &&
    !(userId === lastSelectedComment?.writtenBy);
  const { building, floor } = getProjectDetailsFromDataUrl(dataUrl);
  const dialogTitle = isView
    ? text("comment_view", client) + lastSelectedComment?.writtenBy
    : isEdit
    ? text("comment_edit", client)
    : text("comment_create", client);
  const defaultDescription = isEdit
    ? lastSelectedComment?.description
    : clientComment;
  const [description, setDescription] = useState<string>(
    defaultDescription || ""
  );

  const descriptionIsEmpty = !isEdit && (!description || description === "");

  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"), {
    noSsr: true,
  });

  useEffect(() => {
    if (id) {
      if (descriptionIsEmpty) {
        setFormError("Please fill description field");
      } else {
        setFormError("");
      }
    }
  }, [description, descriptionIsEmpty, id]);

  useEffect(() => {
    if (clientComment) {
      setDescription(clientComment);
    }
  }, [clientComment]);

  const generateTitle = () => {
    const roleInTitle = role ? ", " + role : "";
    const reporter =
      username && username !== "" ? username : userId || client || "";
    return "Comment from " + reporter + roleInTitle + " (" + email + ") ";
  };

  const handleSubmit = async () => {
    setCommentSubmitted(true);
    const sceneToSet =
      mode === "CREATE"
        ? scene
        : {
            sceneId: null,
            yaw: null,
            pitch: null,
            fov: null,
          };
    const commentInput: CreateCommentInput = {
      dataUrl: dataUrlOrDefault(dataUrl),
      title: generateTitle(),
      description: description !== "" ? description : defaultDescription,
      scene: sceneToSet,
      writtenBy,
      role: role || "",
      projectId: currentProject?.id || projectNameFromUrl(dataUrl),
      mail: email,
      issueTypes: formIssueTypes,
      customIssueTypes: formCustomIssueTypes,
    };
    if (record) {
      commentInput.record = record;
    }
    if (commentId) {
      commentInput.id = commentId;
    }
    try {
      const isValid = await schema.isValid({
        name: username || client,
        mail: email || supportInfo(client || "").mail,
        description: commentInput.description,
        issueTypes: [...formIssueTypes],
        customIssueTypes: [...formCustomIssueTypes],
      });
      if (!isValid) {
        id && setFormError(text("comment_fill_description", client));
        return;
      }
      if (isEdit) {
        analyticsEvent(
          "Tasks",
          "Task Edited",
          username
          //  dataUrl
        );
        await API.graphql({
          query: updateComment,
          variables: {
            input: {
              title: commentInput.title,
              description: commentInput.description,
              id: lastSelectedComment?.id,
              issueTypes: commentInput.issueTypes,
              customIssueTypes: commentInput.customIssueTypes,
            },
          },
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
      } else {
        analyticsEvent(
          "Tasks",
          record ? "Task Created During Tour" : "Task Created",
          username
        );
        const createdComment = await API.graphql({
          query: createComment,
          variables: { input: commentInput },
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        syncCreatedComment(record, createdComment);
      }
      setTimeout(() => {
        showMessage(text("comment_created", client), "success");
        setFormError("");
        setDescription("");
        handleClose();
      }, 300);
    } catch (e: any) {
      const errorMessage = text("comment_creation_failed", client);
      showMessage(errorMessage, "error");
      analyticsError(errorMessage + e.toString());
      console.log(errorMessage, e);
    } finally {
      setCommentSubmitted(false);
    }
  };

  const handleResolve = async () => {
    if (isEdit && lastSelectedComment) {
      analyticsEvent(
        "Tasks",
        !lastSelectedComment.resolved ? "Task Resolved" : "Task UnResolved",
        username

        //  dataUrl
      );
      await API.graphql({
        query: updateComment,
        variables: {
          input: {
            id: lastSelectedComment.id,
            resolved: !lastSelectedComment.resolved,
          },
        },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
      setTimeout(() => {
        handleClose();
      }, 300);
    }
  };

  const isIssueTypeEnum = (value: any): value is IssueTypeEnum => {
    return Object.values(IssueTypeEnum).includes(value);
  };

  const handleIssueTypesChanged = (values: any[]) => {
    if (values.length > 0 && isIssueTypeEnum(values[0].value)) {
      setFormIssueTypes([...values]);
    } else {
      setFormCustomIssueTypes([...values]);
    }
  };

  const handleDeleteClicked = () => {
    setShowDelete(true);
  };

  const handleDeleteClosed = () => {
    setShowDelete(false);
    handleClose();
  };

  const onCancel = () => {
    setFormError("");
    handleClose();
  };

  const onReplyClicked = async (reply: string, isFile = false) => {
    const newReplyProps = {
      reply: "Attached image " + reply,
      fileName: reply,
    };
    const fileProperties = isFile ? newReplyProps : {};
    const newReply: CommentReply = {
      reply,
      writtenBy,
      date: new Date().toString(),
      mail: email,
      role,
    };
    const replyToAdd = Object.assign({}, newReply, fileProperties);
    if (mode !== "EDIT") {
      analyticsEvent(
        "Tasks",
        record ? "Task Created During Tour" : "Task Created",
        username
      );
      const sceneToSet =
        mode === "CREATE"
          ? scene
          : {
              sceneId: null,
              yaw: null,
              pitch: null,
              fov: null,
            };
      const commentInput: CreateCommentInput = {
        dataUrl: dataUrlOrDefault(dataUrl),
        title: generateTitle(),
        description,
        scene: sceneToSet,
        writtenBy,
        role: role || "",
        projectId: currentProject?.id || projectNameFromUrl(dataUrl),
        mail: email,
        replies: [replyToAdd],
        issueTypes: formIssueTypes,
        customIssueTypes: formCustomIssueTypes,
      };
      if (record) {
        commentInput.record = record;
      }
      if (commentId) {
        commentInput.id = commentId;
      }
      const createdComment = await API.graphql({
        query: createComment,
        variables: { input: commentInput },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
      syncCreatedComment(record, createdComment);
      setTimeout(() => {
        setFormError("");
        setFileIsUploading(false);
        setDescription("");
        handleClose();
      }, 300);
    } else {
      analyticsEvent(
        "Tasks",
        "Task Reply Added",
        username
        // dataUrl +
      );
      const currentReplies =
        lastSelectedComment?.replies !== undefined &&
        lastSelectedComment?.replies !== null
          ? lastSelectedComment.replies
          : [];
      await API.graphql({
        query: updateComment,
        variables: {
          input: {
            id: lastSelectedComment?.id,
            replies: [replyToAdd, ...currentReplies],
          },
        },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
      setFileIsUploading(false);
    }
  };
  const isCreate = mode === "CREATE";
  const onReplyRemoved = async (reply: CommentReply) => {
    analyticsEvent(
      "Tasks",
      "Task Reply Removed",
      username
      //dataUrl
    );
    const filteredReplies = lastSelectedComment?.replies?.filter(
      (r) => r.date !== reply.date
    );
    await API.graphql({
      query: updateComment,
      variables: {
        input: {
          id: lastSelectedComment?.id,
          replies: filteredReplies,
        },
      },
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    });
  };

  const handleClosePlanLocation = () => {
    setShowPlanLocation(false);
  };

  const onPlanLocationClicked = () => {
    analyticsEvent("Tasks", "Task Plan Location Viewed", loggedUser.username);
    setShowPlanLocation(true);
  };

  const onTaskShare = () => {
    analyticsEvent(
      "Tasks",
      "Tasks Shared From Comment Dialog",
      loggedUser.username
    );
    const fullUrl = getShareUrlFromComment(lastSelectedComment);
    navigator?.clipboard?.writeText(fullUrl);
    showMessage("Link copied to clipboard!");
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
      scroll="body"
      className={classes.dialog}
      PaperProps={paperProps}
    >
      <DialogTitle id="form-dialog-title" className={classes.root}>
        {dialogTitle}
        <Tooltip disableInteractive title="Close">
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleClose}
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {!isView && (
          <DialogContentText>
            {text("comment_create_title", client)}
          </DialogContentText>
        )}
        <Grid container spacing={3}>
          {isView && (
            <Grid item xs={12}>
              <CommentLocationIcon
                gotLocation
                locationText={getLocationDisplayName(
                  {
                    name: building || "",
                  },
                  {
                    name: getFloorName(floor),
                  }
                )}
              />
            </Grid>
          )}
          <Grid item xs={8}>
            <TextField
              variant="standard"
              autoFocus={username !== "" || isEdit}
              id="filled-multiline-static"
              label="Description"
              defaultValue={defaultDescription}
              multiline
              disabled={isView}
              rows={3}
              fullWidth
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setDescription(e.currentTarget.value);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <ImageUploader
              onUploadStart={() => {
                setCommentSubmitted(true);
                setFileIsUploading(true);
              }}
              onUploadComplete={() => {
                setCommentSubmitted(false);
                setFileIsUploading(false);
              }}
              onReplyClicked={onReplyClicked}
              disabled={!id || descriptionIsEmpty}
              tooltip={
                descriptionIsEmpty
                  ? "Add description to attach file"
                  : "Attach file"
              }
            />
            <ShareButton
              onShare={onTaskShare}
              hide={!isEdit}
              styling={classes.shareButton}
            />
          </Grid>
          <Grid item xs={2}>
            <Loader loading={fileIsUploading} />
          </Grid>
          <Grid item xs={10}>
            <IssueTypeSelect
              disabled={isView}
              defaultValue={
                isEdit
                  ? lastSelectedComment?.issueTypes &&
                    lastSelectedComment.issueTypes.length > 0
                    ? lastSelectedComment.issueTypes
                    : lastSelectedComment?.customIssueTypes
                  : []
              }
              onIssueTypesSelectionChanged={handleIssueTypesChanged}
              currentProject={currentProject}
            />
          </Grid>
          <Grid item xs={2}>
            <Tooltip
              disableInteractive
              title={text("comment_plan_location", client)}
              placement={"left"}
              enterDelay={400}
              enterNextDelay={400}
            >
              <IconButton
                disabled={
                  (lastSelectedComment && !lastSelectedComment.record) ||
                  (preventShowingPlan && appMode !== AppModeEnum.tourView) ||
                  mode === "CREATE_WITHOUT_LOCATION"
                }
                color="primary"
                size="large"
              >
                <MapOutlinedIcon onClick={onPlanLocationClicked} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <FormLabel className={classes.errorLabel} component="legend">
          {formError}
        </FormLabel>
        {isEdit && (
          <>
            <Button onClick={handleResolve} disabled={!isEdit} color="primary">
              {lastSelectedComment?.resolved
                ? text("comment_reopen", client)
                : text("comment_resolve", client)}
            </Button>
            <Button
              onClick={handleDeleteClicked}
              className={classes.errorLabel}
              color="secondary"
              disabled={isCreate || isView}
            >
              {text("delete", client)}
            </Button>
          </>
        )}
        <Button onClick={onCancel} color="primary">
          {text("cancel", client)}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={
            (!id && !(client === RAMDOR) && !(client === EXPONET)) ||
            isView ||
            descriptionIsEmpty ||
            commentSubmitted
          }
          color="primary"
        >
          {text("submit", client)}
        </Button>
      </DialogActions>
      <Divider />

      <CommentActivity
        title={text("comment_replies", client)}
        open={isEdit}
        onReplyClicked={onReplyClicked}
        onReplyRemoved={onReplyRemoved}
        replies={lastSelectedComment?.replies}
      />
      <DeleteCommentDialog
        open={showDelete}
        commentId={lastSelectedComment?.id || ""}
        handleDeleteClosed={handleDeleteClosed}
      />
      <PlanLocationDialog
        record={lastSelectedComment?.record}
        handleClose={handleClosePlanLocation}
        open={showPlanLocation}
      />
    </Dialog>
  );
};

export default CommentDialog;
