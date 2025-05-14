import * as React from "react";
import { Grid, Theme } from "@mui/material";
import { createStyles } from "@mui/styles";
import { Comment } from "../../../models";
import { makeStyles } from "@mui/styles";
import { CommentLocationIcon } from "./CommentLocationIcon";
import { commentHasLocation } from "../../../utils/comments-utils";
import { CommentRepliesIcon } from "./CommentRepliesIcon";
import {
  TourDetails,
  getProjectDetailsFromDataUrl,
} from "../../../utils/projects-utils";
import {
  getLocationDisplayName,
  getLocationDisplayNameFromDataUrl,
} from "../../../utils/display-names-utils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    informationIconsLine: {
      height: theme.spacing(2),
      maxWidth: theme.spacing(36),
    },
    verticalAlignGridRow: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
    },
  })
);

export interface CommentIconsLineProps {
  comment: Comment;
  tourDetails: TourDetails | undefined;
}

export const CommentIconsLine: React.FC<CommentIconsLineProps> = ({
  comment,
  tourDetails,
}) => {
  const classes = useStyles();

  const dataUrl = comment.dataUrl;
  const locationText = dataUrl
    ? getLocationDisplayNameFromDataUrl(comment.dataUrl)
    : getLocationDisplayName(
        comment?.record?.building
          ? { name: comment?.record?.building }
          : tourDetails?.building,
        comment?.record?.floor
          ? { name: comment?.record?.floor }
          : tourDetails?.floor,
        tourDetails?.area
      );

  return (
    <div className={classes.informationIconsLine}>
      <Grid container>
        <Grid item sm={2} className={classes.verticalAlignGridRow}>
          <CommentRepliesIcon numberOfReplies={comment.replies?.length} />
        </Grid>
        <Grid item sm={10} className={classes.verticalAlignGridRow}>
          <CommentLocationIcon
            gotLocation={commentHasLocation(comment)}
            locationText={locationText}
          />
        </Grid>
      </Grid>
    </div>
  );
};
