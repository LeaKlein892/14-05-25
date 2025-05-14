import * as React from "react";
import { Card, CardHeader, CardMedia, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { commentImageStorageLocation } from "../../../utils/comments-utils";
import { createStyles } from "@mui/styles";
export interface EmbeddedImageProps {
  title: string;
  fileName: string;
  onImageClick: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 800,
      width: 500,
    },
    media: {
      height: 0,
      paddingTop: "56.25%", // 16:9
    },
    expand: {
      transform: "rotate(0deg)",
      marginLeft: "auto",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
  })
);

export const EmbeddedImage: React.FC<EmbeddedImageProps> = ({
  title,
  fileName,
  onImageClick,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.root} onClick={onImageClick}>
      <CardHeader subheader={title} />
      <CardMedia
        className={classes.media}
        image={commentImageStorageLocation(fileName, true)}
        title="Uploaded image"
      />
    </Card>
  );
};
