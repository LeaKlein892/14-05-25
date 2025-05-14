import * as React from "react";
import { DialogProps } from "../types/DialogProps";
import { Button, ButtonGroup, Dialog, Theme, Tooltip } from "@mui/material";
import GetAppIcon from "@mui/icons-material/GetApp";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { useCallback, useContext, useRef } from "react";
import { exportBase64Image } from "../../utils/file-manager";
import { analyticsError, analyticsEvent } from "../../utils/analytics";
import { showMessage } from "../../utils/messages-manager";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { delay } from "lodash-es";
import { createStyles, makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  cursor: "cell",
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonGroups: {
      position: "fixed",
      right: theme.spacing(1),
      top: theme.spacing(4),
      border: `2px solid ${theme.palette.secondary.main}`,
    },
    root: {
      ...theme.typography.button,
      backgroundColor: theme.palette.secondary.main,
      padding: theme.spacing(1),
      border: `1px solid ${theme.palette.secondary.main}`,
      position: "fixed",
      right: theme.spacing(37),
      top: theme.spacing(4),
    },
  })
);

export interface DrawingDialogProps extends DialogProps {
  blob?: any;
}

const DrawingDialog: React.FC<DrawingDialogProps> = ({
  open,
  handleClose,
  blob,
}) => {
  const canvasRef = useRef(null);
  const {
    loggedUser: { username },
  } = useContext(LoggedUserContext);
  const classes = useStyles();

  const downloadImage = useCallback(async () => {
    const canvas: any = canvasRef.current;
    if (canvas !== null) {
      try {
        const data = await canvas.exportImage("png");
        await exportBase64Image(data);
        analyticsEvent("Tour", "Tour exported as image", username);
        showMessage("Image was downloaded", "success");
        delay(handleClose, 500);
      } catch (e: any) {
        const errorMessage = "Failed to export image";
        analyticsError(errorMessage + " " + JSON.stringify(e));
        showMessage(errorMessage);
      }
    }
  }, [handleClose, username]);

  const undo = useCallback(() => {
    const canvas: any = canvasRef.current;
    if (canvas !== null) {
      analyticsEvent("Tour", "Tour image sketch undo", username);
      canvas.undo();
    }
  }, [username]);

  const redo = useCallback(() => {
    const canvas: any = canvasRef.current;
    if (canvas !== null) {
      analyticsEvent("Tour", "Tour image sketch redo", username);
      canvas.redo();
    }
  }, [username]);

  return (
    <Dialog
      open={!!open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      fullScreen
    >
      {!blob ? (
        <div />
      ) : (
        <ReactSketchCanvas
          style={style}
          ref={canvasRef}
          strokeWidth={5}
          strokeColor="red"
          backgroundImage={URL.createObjectURL(blob)}
          exportWithBackgroundImage
        />
      )}
      <div className={classes.root}>Sketch on image</div>
      <ButtonGroup
        size="large"
        color="primary"
        aria-label="large outlined primary button group"
        className={classes.buttonGroups}
      >
        <Tooltip disableInteractive title="Undo">
          <Button
            variant="contained"
            component="span"
            size="large"
            color="primary"
            onClick={undo}
          >
            <UndoIcon />
          </Button>
        </Tooltip>
        <Tooltip disableInteractive title="Redo">
          <Button
            variant="contained"
            component="span"
            size="large"
            color="primary"
            onClick={redo}
          >
            <RedoIcon />
          </Button>
        </Tooltip>
        <Tooltip disableInteractive title="Close">
          <Button
            variant="contained"
            component="span"
            size="large"
            color="primary"
            onClick={handleClose}
          >
            <CloseIcon />
          </Button>
        </Tooltip>
        <Tooltip disableInteractive title="Download">
          <Button
            variant="contained"
            component="span"
            size="large"
            color="primary"
            onClick={downloadImage}
          >
            <GetAppIcon />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Dialog>
  );
};

export default DrawingDialog;
