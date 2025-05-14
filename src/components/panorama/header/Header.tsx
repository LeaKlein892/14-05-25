import * as React from "react";
import { Typography, TypographyProps } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";

interface StyledTypographyProps extends TypographyProps {
  tourMode?: boolean;
}

const useStyles = makeStyles<Theme, StyledTypographyProps>((theme) => ({
  root: ({ tourMode }) => ({
    position: tourMode ? "fixed" : "relative",
    top: tourMode ? "4vh" : "10vh",
    right: "4vh",
    zIndex: 1,
    textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
    color: theme.palette.secondary.main,
  }),
}));

export interface HeaderProps {
  text: string;
  show?: boolean;
  tourMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  text,
  show = true,
  tourMode = false,
}) => {
  const classes = useStyles({ tourMode });
  const textToShow = show ? text : "";

  return (
    <Typography variant="h6" className={classes.root} dir="rtl">
      {textToShow}
    </Typography>
  );
};
