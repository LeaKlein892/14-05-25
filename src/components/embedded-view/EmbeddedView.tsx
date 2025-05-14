import * as React from "react";
import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) =>
  createStyles({
    viewContainer: {
      paddingTop: theme.spacing(8),
      height: "100%",
      width: "100%",
    },
  })
);

export interface EmbeddedViewProps {
  src: string;
}

export const EmbeddedView: React.FC<EmbeddedViewProps> = ({ src }) => {
  const classes = useStyles();
  return <iframe src={src} className={classes.viewContainer} />;
};
