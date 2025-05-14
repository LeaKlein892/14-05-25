import * as React from "react";
import { Theme, Typography } from "@mui/material";
import { createStyles } from "@mui/styles";
import { makeStyles } from "@mui/styles";
import { APP_HOME } from "../../../utils/site-routes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    text: {
      marginTop: theme.spacing(10),
    },
  })
);

export const TaskNotFound: React.FC = () => {
  const classes = useStyles();

  return (
    <Typography className={classes.text} variant="h6">
      No Task Found. <a href={APP_HOME}>Go back back to Castory</a>
    </Typography>
  );
};
