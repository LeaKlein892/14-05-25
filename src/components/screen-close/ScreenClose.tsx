import * as React from "react";
import { makeStyles } from "@mui/styles";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import IconButton from "@mui/material/IconButton";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";

export interface ScreenCloseProps {
  onClose: () => void;
}

const useStyles = makeStyles((theme) => ({
  close: {
    position: "fixed",
    top: theme.spacing(8),
    right: 0,
    zIndex: 1,
    textShadow: "-1px 0 black, 0 1px black, 1px 0 black, 0 -1px black",
  },
}));

export const ScreenClose: React.FC<ScreenCloseProps> = ({ onClose }) => {
  const { inCompareMode, setInCompareMode } = React.useContext(
    ProjectInformationContext
  );
  const classes = useStyles();
  const handleClose = () => {
    setInCompareMode(false);
    onClose();
  };
  return (
    <IconButton
      aria-label="close"
      color="secondary"
      className={classes.close}
      onClick={handleClose}
      size="large"
    >
      <CancelTwoToneIcon />
    </IconButton>
  );
};
