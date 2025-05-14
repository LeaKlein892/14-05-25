import * as React from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Fab, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const useStyles = makeStyles((theme) =>
  createStyles({
    hideShowLinksFab: {
      position: "fixed",
      bottom: theme.spacing(14),
      right: theme.spacing(2),
    },
  })
);

export interface HideAnnotationsButtonProps {
  hideAnnotations: boolean;
  onTogglePlanLinks: () => void;
  hide?: boolean;
}

export const HideAnnotationsButton: React.FC<HideAnnotationsButtonProps> = ({
  hideAnnotations,
  onTogglePlanLinks,
  hide = false,
}) => {
  const classes = useStyles();

  return !hide ? (
    <Tooltip
      disableInteractive
      title={hideAnnotations ? "show links" : "hide links"}
      placement={"left"}
      enterDelay={400}
      enterNextDelay={400}
    >
      <Fab
        variant="extended"
        color="primary"
        aria-label="add"
        size="small"
        className={classes.hideShowLinksFab}
        onClick={onTogglePlanLinks}
      >
        {hideAnnotations ? <VisibilityIcon /> : <VisibilityOffIcon />}
      </Fab>
    </Tooltip>
  ) : (
    <div />
  );
};
