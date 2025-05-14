import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { createStyles } from "@mui/styles";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      marginTop: "35vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  })
);

export interface LoaderProps {
  loading: boolean;
}

export const CenterPageLoader = ({ loading }: LoaderProps) => {
  const classes = useStyles();

  return loading ? (
    <div className={classes.root}>
      <CircularProgress size={75} />
    </div>
  ) : (
    <div></div>
  );
};
