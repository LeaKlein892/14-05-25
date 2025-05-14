import * as React from "react";
import IconButton from "@mui/material/IconButton";
import { Publish } from "@mui/icons-material";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import { NotificationBarLayout } from "../notification-bar-layout/NotificationBarLayout";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    publish: {
      padding: theme.spacing(0.5),
    },
  })
);

export interface PublishBarProps {
  open: boolean;
  message: string;
  onPublish: () => void;
}

export const PublishBar: React.FC<PublishBarProps> = ({
  open,
  message,
  onPublish,
}) => {
  const classes = useStyles();

  return (
    <NotificationBarLayout
      open={open}
      message={message}
      action={
        <IconButton
          aria-label="close"
          color="secondary"
          className={classes.publish}
          onClick={onPublish}
          size="large"
        >
          <Publish />
        </IconButton>
      }
    />
  );
};
