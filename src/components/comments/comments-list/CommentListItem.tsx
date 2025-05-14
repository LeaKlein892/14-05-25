import * as React from "react";
import { useCallback, useContext, useMemo, useState } from "react";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  ListItem,
  ListItemText,
  Theme,
  Tooltip,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  ListItemButton,
} from "@mui/material";
import PhotoIcon from "@mui/icons-material/Photo";
import { Comment } from "../../../models";
import { alpha } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import {
  commentHasLocation,
  getShareUrlFromComment,
} from "../../../utils/comments-utils";
import { verifyLoggedUser } from "../../../utils/logged-user";
import { CommentPressFunction } from "../CommentTypes";
import DoneIcon from "@mui/icons-material/Done";
import { DeleteCommentDialog } from "../../dialogs/delete-comment-dialog/DeleteCommentDialog";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { analyticsEvent } from "../../../utils/analytics";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { TourDetails } from "../../../utils/projects-utils";
import { CommentIconsLine } from "./CommentIconsLine";
import { CommentLabelsList } from "./commentLabelsList";
import { ShareButton } from "../../panorama/share/ShareButton";
import { showMessage } from "../../../utils/messages-manager";
import { dateAsString } from "../../../utils/date-utils";
import ImageDialog from "../../dialogs/image-dialog/ImageDialog";
import { Task } from "@mui/icons-material";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    fixGridBug: {
      margin: theme.spacing(0),
    },
    remove: {
      color: theme.palette.error.main,
      "&:hover": {
        backgroundColor: alpha(theme.palette.error.light, 0.25),
      },
      margin: theme.spacing(2),
    },
    icon: {
      margin: theme.spacing(4),
    },
    iconButton: {
      margin: theme.spacing(0),
    },
    text: {
      display: "block",
    },
    iconContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: theme.spacing(1),
    },
  })
);

export interface CommentListItemProps {
  comment: Comment;
  tourDetails: TourDetails | undefined;
  onClickComment: CommentPressFunction;
  triggerEditComment: (comment: Comment) => void;
  afterCommentSelected: () => void;
}

const CommentListItem: React.FC<CommentListItemProps> = ({
  comment,
  tourDetails,
  onClickComment,
  triggerEditComment,
  afterCommentSelected,
}) => {
  const classes = useStyles();
  const lastImage = comment.replies
    ?.filter((reply) => reply.fileName)
    .pop()?.fileName;
  const [open, setOpen] = useState(false);

  const onImageClick = () => {
    analyticsEvent("Tasks", "Tasks Show Image From List", loggedUser.username);
    setOpen(true);
  };

  const handleCloseImage = () => setOpen(false);
  const imageFile = comment.replies?.find(
    (findfFileName) => findfFileName.fileName != null
  );
  const [fileName, setFileName] = useState(
    imageFile?.fileName ? imageFile?.fileName : ""
  );
  const [taskName, setTaskName] = useState(
    comment.description ? comment.description : ""
  );
  const listItemStyle = useMemo(() => {
    return {
      root: classes.text,
      button: classes.text,
    };
  }, [classes]);

  const primary = useMemo(() => {
    return (
      <Grid container>
        <Grid item sm={6}>
          {comment.description}
        </Grid>
        <Grid item sm={6} justifyContent={"flex-end"}>
          <CommentLabelsList
            issueTypes={
              comment.customIssueTypes
                ? comment.customIssueTypes.length > 0
                  ? comment.customIssueTypes
                  : comment.issueTypes
                : comment.issueTypes
            }
          />
        </Grid>
      </Grid>
    );
  }, [comment.description, comment.issueTypes]);

  const [showDelete, setShowDelete] = useState(false);
  const { loggedUser } = useContext(LoggedUserContext);

  const onRemove = () => {
    setShowDelete(true);
  };

  const handleDeleteClosed = () => {
    setShowDelete(false);
    afterCommentSelected();
  };

  const title = comment.title;
  const createdAt = (comment as any).createdAt;
  const updatedAt = (comment as any).updatedAt;

  const commentDetails = useMemo(() => {
    return (
      title +
      " reported at " +
      dateAsString(createdAt) +
      " last modified at " +
      dateAsString(updatedAt)
    );
  }, [title, createdAt, updatedAt]);

  const onClickItem = useCallback(() => {
    analyticsEvent("Tasks", "Task Viewed", loggedUser.username);
    if (commentHasLocation(comment)) {
      onClickComment(
        comment.scene.sceneId,
        comment.scene.yaw,
        comment.scene.pitch,
        comment.scene.fov,
        comment.dataUrl
      );
      afterCommentSelected();
    } else {
      triggerEditComment(comment);
    }
  }, [
    afterCommentSelected,
    comment,
    loggedUser.username,
    onClickComment,
    triggerEditComment,
  ]);

  const onShare = () => {
    analyticsEvent(
      "Tasks",
      "Tasks Shared From Tasks List",
      loggedUser.username
    );
    const fullUrl = getShareUrlFromComment(comment);
    navigator?.clipboard?.writeText(fullUrl);
    showMessage("Link copied to clipboard!");
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2} xs className={classes.fixGridBug}>
        <Grid container md={8} lg={9}>
          <Grid item xs={2} sm={1}>
            {comment.resolved ? (
              <DoneIcon color="primary" className={classes.icon} />
            ) : (
              <ErrorOutlineIcon color="error" className={classes.icon} />
            )}
          </Grid>
          <Grid item xs={10} sm={11}>
            <ListItemButton classes={listItemStyle} onClick={onClickItem}>
              <ListItemText primary={primary} secondary={commentDetails} />
              <CommentIconsLine comment={comment} tourDetails={tourDetails} />
            </ListItemButton>
          </Grid>
        </Grid>

        <Grid item md={4} lg={3}>
          <Box className={classes.iconContainer}>
            {lastImage && (
              <Tooltip
                disableInteractive
                title={"View image"}
                placement={"bottom"}
                enterDelay={400}
                enterNextDelay={400}
              >
                <IconButton onClick={onImageClick} color="primary">
                  <PhotoIcon />
                </IconButton>
              </Tooltip>
            )}
            <ShareButton onShare={onShare} styling={classes.iconButton} />
            <Tooltip
              disableInteractive
              title={"edit comment"}
              placement={"bottom"}
              enterDelay={400}
              enterNextDelay={400}
            >
              <IconButton
                color="primary"
                className={classes.iconButton}
                aria-label="edit comment"
                onClick={() => triggerEditComment(comment)}
                size="large"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            {
              <ImageDialog
                fileName={fileName}
                mobileMode={true}
                planTitle={taskName}
                handleClose={handleCloseImage}
                open={open}
              />
            }
            <Tooltip
              disableInteractive
              title={"delete comment"}
              placement={"bottom"}
              enterDelay={400}
              enterNextDelay={400}
            >
              <IconButton
                className={classes.remove}
                aria-label="delete comment"
                disabled={!verifyLoggedUser(comment.writtenBy)}
                onClick={onRemove}
                size="large"
              >
                <DeleteForeverIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>
      <DeleteCommentDialog
        open={showDelete}
        commentId={comment.id || ""}
        handleDeleteClosed={handleDeleteClosed}
      />
      <Divider />
    </div>
  );
};

export default React.memo(CommentListItem);
