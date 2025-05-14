import * as React from "react";
import { Suspense, lazy, useContext, useState } from "react";
import { CommentReply } from "../../../models";
import {
  Divider,
  Grid,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { CommentReplyCloseButton } from "./CommentReplyCloseButton";
import { verifyLoggedUser } from "../../../utils/logged-user";
import { analyticsEvent } from "../../../utils/analytics";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { EmbeddedImage } from "./EmbeddedImage";
import { dateAsString } from "../../../utils/date-utils";
const ImageDialog = lazy(
  () => import("../../dialogs/image-dialog/ImageDialog")
);

export interface CommentRepliesProps {
  replies?: CommentReply[];
  onReplyRemoved: (r: CommentReply) => void;
}

export const CommentReplies: React.FC<CommentRepliesProps> = ({
  replies = [],
  onReplyRemoved,
}) => {
  const [fileName, setFileName] = useState<string>("");
  const { loggedUser } = useContext(LoggedUserContext);

  const handleCloseImage = () => {
    setFileName("");
  };

  if (replies === null) {
    return <div></div>;
  }

  const getReplyText = (reply: CommentReply) => {
    return reply.writtenBy + ": " + reply.reply;
  };

  const onReplyImageClick = (reply: CommentReply) => {
    analyticsEvent("Tasks", "Task Image Viewed", loggedUser.username);
    setFileName(reply.fileName || "");
  };

  const imageDialogIsSet = fileName !== "";

  return (
    <div>
      <List>
        {replies.map((reply, index) => {
          return (
            <div key={index}>
              <Grid container spacing={2}>
                <Grid item sm={10}>
                  {reply?.fileName ? (
                    <ListItemButton>
                      <EmbeddedImage
                        title={
                          "Image attached by " +
                          reply.writtenBy +
                          " at " +
                          dateAsString(reply.date)
                        }
                        fileName={reply.fileName}
                        onImageClick={() => onReplyImageClick(reply)}
                      />
                    </ListItemButton>
                  ) : (
                    <ListItemText
                      key={index}
                      primary={getReplyText(reply)}
                      secondary={reply.date}
                      sx={{ padding: "20px" }}
                    />
                  )}
                </Grid>
                <Grid item sm={2}>
                  <CommentReplyCloseButton
                    disabled={!verifyLoggedUser(reply.writtenBy)}
                    reply={reply}
                    onReplyRemoved={onReplyRemoved}
                  />
                </Grid>
              </Grid>
              <Divider />
            </div>
          );
        })}
      </List>
      <Suspense fallback={null}>
        {imageDialogIsSet && (
          <ImageDialog
            fileName={fileName}
            open={imageDialogIsSet}
            handleClose={handleCloseImage}
          />
        )}
      </Suspense>
    </div>
  );
};
