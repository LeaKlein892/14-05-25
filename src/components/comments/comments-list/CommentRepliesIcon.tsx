import * as React from "react";
import { Typography } from "@mui/material";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
export interface CommentLocationIconProps {
  numberOfReplies?: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icon: {
      height: "15px",
    },
    text: {
      fontSize: 12,
    },
    root: {
      height: theme.spacing(2),
    },
  })
);

export const CommentRepliesIcon: React.FC<CommentLocationIconProps> = ({
  numberOfReplies,
}) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <ModeCommentOutlinedIcon color="disabled" className={classes.icon} />
      <Typography
        color="textSecondary"
        display="inline"
        classes={{
          root: classes.root,
          body1: classes.text,
        }}
      >
        {numberOfReplies}
      </Typography>
    </React.Fragment>
  );
};
