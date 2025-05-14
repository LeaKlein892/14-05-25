import * as React from "react";
import { makeStyles } from "@mui/styles";
import { Backdrop, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  dropZoneContainer: {
    fontSize: theme.spacing(15),
  },
}));

export interface DragOverlayProps {
  isOpen: boolean;
}

export const DragOverlay = ({ isOpen = true }) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={isOpen}>
      <div>
        <CloudUploadIcon className={classes.dropZoneContainer} />
        <Typography variant="h6">Drop file to upload</Typography>
      </div>
    </Backdrop>
  );
};
