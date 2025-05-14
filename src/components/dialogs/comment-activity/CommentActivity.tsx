import * as React from "react";
import { useState } from "react";
import {
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Theme,
} from "@mui/material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { makeStyles } from "@mui/styles";
import { CommentReply } from "../../../models";
import { CommentReplies } from "./CommentReplies";
import { createStyles } from "@mui/styles";
export interface CommentActivityProps {
  open?: boolean;
  title: string;
  onReplyClicked?: (reply: string, isFile?: boolean) => void;
  onReplyRemoved?: (reply: CommentReply) => void;
  replies?: CommentReply[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: theme.palette.primary.main,
    },
  })
);

export const CommentActivity: React.FC<CommentActivityProps> = ({
  open = false,
  title,
  onReplyClicked = (reply: string) => {},
  onReplyRemoved = (reply: CommentReply) => {},
  replies = [],
}) => {
  const classes = useStyles();
  const [replyText, setReplyText] = useState("");

  const onReplyButton = () => {
    onReplyClicked(replyText);
    setReplyText("");
  };

  return open ? (
    <div>
      <DialogTitle className={classes.root}>{title}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={10}>
            <TextField
              variant="standard"
              id="filled-full-width"
              placeholder="Reply..."
              value={replyText}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setReplyText(e.currentTarget.value);
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={onReplyButton} size="large">
              <DoubleArrowIcon color="primary" />
            </IconButton>
          </Grid>
        </Grid>
      </DialogContent>
      <CommentReplies replies={replies} onReplyRemoved={onReplyRemoved} />
    </div>
  ) : (
    <div></div>
  );
};
