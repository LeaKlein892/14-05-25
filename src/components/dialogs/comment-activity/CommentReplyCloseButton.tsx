import * as React from "react";
import { makeStyles } from "@mui/styles";
import { IconButton, Theme } from "@mui/material";
import { createStyles } from "@mui/styles";

import { CommentReply } from "../../../models";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { DeleteReplyConfirmation } from "./DeleteReplyConfirmation";

export interface CommentReplyCloseButtonProps {
  disabled?: boolean;
  reply: CommentReply;
  onReplyRemoved: (reply: CommentReply) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    close: {
      color: theme.palette.error.main,
    },
  })
);

export const CommentReplyCloseButton: React.FC<
  CommentReplyCloseButtonProps
> = ({ disabled = false, reply, onReplyRemoved }) => {
  const classes = useStyles();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const onReplyDeleteClicked = () => {
    setShowDeleteConfirmation(true);
  };

  const onReplyDeleteConfirmed = () => {
    onReplyRemoved(reply);
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      <div>
        {disabled ? (
          <IconButton disabled={disabled} size="large">
            <CloseIcon onClick={() => onReplyRemoved(reply)} />
          </IconButton>
        ) : (
          <IconButton disabled={disabled} size="large">
            <CloseIcon
              className={classes.close}
              onClick={onReplyDeleteClicked}
            />
          </IconButton>
        )}
      </div>
      <DeleteReplyConfirmation
        open={showDeleteConfirmation}
        handleClose={() => setShowDeleteConfirmation(false)}
        handleDelete={onReplyDeleteConfirmed}
      />
    </>
  );
};
