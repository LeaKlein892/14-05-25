import * as React from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocationOffOutlinedIcon from "@mui/icons-material/LocationOffOutlined";
import { Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import { makeStyles } from "@mui/styles";

export interface CommentLocationIconProps {
  gotLocation?: boolean;
  locationText?: string;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    icon: {
      height: "16px",
    },
    text: {
      fontSize: 12,
    },
    root: {
      height: theme.spacing(2),
    },
  })
);

export const CommentLocationIcon: React.FC<CommentLocationIconProps> = ({
  gotLocation = true,
  locationText = "",
}) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      {gotLocation ? (
        <LocationOnOutlinedIcon color="disabled" className={classes.icon} />
      ) : (
        <LocationOffOutlinedIcon color="disabled" className={classes.icon} />
      )}
      <Typography
        color="textSecondary"
        display="inline"
        classes={{
          root: classes.root,
          body1: classes.text,
        }}
      >
        {locationText}
      </Typography>
    </React.Fragment>
  );
};
