import * as React from "react";
import { useContext, useMemo } from "react";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import { TransitionProps } from "@mui/material/transitions";
import {
  AppBar,
  Dialog,
  IconButton,
  Slide,
  SlideProps,
  Toolbar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Comment, Info } from "../../../models";
import CommentsList from "../../comments/comments-list/CommentsList";
import { DialogProps } from "../../types/DialogProps";
import { CommentPressFunction } from "../../comments/CommentTypes";
import { TourDetails } from "../../../utils/projects-utils";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogTitle: {
      color: theme.palette.primary.main,
    },
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  })
);

const Transition = React.forwardRef(function Transition(
  props: TransitionProps &
    Omit<SlideProps, "direction"> & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export interface CommentsListDialogProps extends DialogProps {
  commentList: Comment[];
  onCommentSelected?: CommentPressFunction;
  triggerEditComment?: (comment?: Comment) => void;
}

const CommentsListDialog: React.FC<CommentsListDialogProps> = ({
  open = false,
  commentList = [],
  onCommentSelected = () => {},
  triggerEditComment = (comment?: Comment) => {},
  handleClose,
}) => {
  const classes = useStyles();

  const { currentBuilding, currentArea, currentFloor } = useContext(
    ProjectInformationContext
  );

  const handleCreateNonLocatedComment = () => {
    triggerEditComment(undefined);
  };

  const commentsWithTourDetails = useMemo(() => {
    const newMap = new Map<Comment, TourDetails | undefined>();
    let currentTourDetails: TourDetails | undefined = undefined;
    if (currentBuilding && currentArea && currentFloor) {
      currentTourDetails = {
        info: new Info({
          date: "",
          plan: "",
          tour: "",
        }),
        building: currentBuilding,
        area: currentArea,
        floor: currentFloor,
      };
    }
    commentList.map((c) => newMap.set(c, currentTourDetails));
    return newMap;
  }, [commentList, currentBuilding, currentFloor, currentArea]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Comments
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleCreateNonLocatedComment}
            aria-label="Comment"
            title="Comment"
            size="large"
          >
            <AddIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleClose}
            aria-label="Close"
            title="Close"
            size="large"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <CommentsList
        commentList={commentsWithTourDetails}
        onCommentSelected={onCommentSelected}
        triggerEditComment={triggerEditComment}
        handleClose={handleClose}
      />
    </Dialog>
  );
};

export default CommentsListDialog;
