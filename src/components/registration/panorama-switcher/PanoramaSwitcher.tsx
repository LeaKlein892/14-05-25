import React, { Dispatch, useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { PhotoRecord } from "../../../models";
import { emptyArray } from "../../../utils/render-utils";
import { Pannellum } from "pannellum-react";
import { PUBLIC_BUCKET } from "../../../utils/aws-utils";

const LOW_RES_PREFIX = "low_";

const fileNameByRes = (fileName: string, highRes: boolean = false) =>
  `${highRes ? "" : LOW_RES_PREFIX}${fileName}`;

const getImageSrc = (
  filesPath: string,
  fileName: string,
  highRes: boolean = false
) => `${PUBLIC_BUCKET}${filesPath}${fileNameByRes(fileName, highRes)}`;

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
  },
  imageWrapper: {
    flexGrow: 1,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  carouselWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(2),
  },
  carouselImage: {
    width: "75px",
    height: "75px",
    objectFit: "cover",
    cursor: "pointer",
    marginRight: theme.spacing(1),
    border: "2px solid transparent",
    borderRadius: "4px",
    "&:hover, &.Mui-selected": {
      border: `2px solid ${theme.palette.primary.main}`,
    },
  },
  selected: {},
  indexInput: {
    width: "200px",
    marginRight: theme.spacing(4),
    paddingBottom: "5px",
  },
  needsManualRegistration: {
    border: `2px solid red`,
  },
  grid: {
    padding: theme.spacing(5),
  },
  nextMissingButton: {
    color: "red",
    fontFamily: "Courier New', Courier, monospace",
    border: `2px solid red`,
    cursor: "pointer",
  },
}));

export interface PanoramaSwitcherProps {
  photoRecords?: PhotoRecord[];
  selectedImageIndex: number;
  setSelectedImageIndex: Dispatch<number>;
  handlePreviousClick: () => void;
  handleNextClick: () => void;
  handleNextMissing: () => void;
  filesPath?: string;
}

export const PanoramaSwitcher: React.FC<PanoramaSwitcherProps> = ({
  photoRecords = emptyArray,
  selectedImageIndex,
  setSelectedImageIndex,
  handlePreviousClick,
  handleNextClick,
  handleNextMissing,
  filesPath = "",
}) => {
  const classes = useStyles();
  const panImage = React.useRef(null);

  const [indexInput, setIndexInput] = useState("");
  const indexInputRef = useRef<HTMLInputElement>(null); // Reference to the Go to input field
  const [highRes, setHighRes] = useState(false);

  const handleHighResChange = (event: any) => {
    setHighRes(event.target.checked);
  };

  const handleIndexInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setIndexInput(value);
  };

  const handleIndexInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      const index = parseInt(indexInput);
      if (!isNaN(index) && index >= 1 && index <= photoRecords.length) {
        setSelectedImageIndex(index - 1);
        setIndexInput("");
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "g" && indexInputRef.current) {
        event.preventDefault();
        indexInputRef.current.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [photoRecords]);

  return (
    <Box className={classes.root}>
      <Box className={classes.imageWrapper}>
        <Pannellum
          width="100%"
          height="100%"
          ref={panImage}
          pitch={10}
          yaw={180}
          hfov={110}
          showZoomCtrl={false}
          image={
            getImageSrc(
              filesPath,
              photoRecords[selectedImageIndex]?.fileName,
              highRes
            ) + "?resize=800%2C600"
          }
          autoLoad
        />
      </Box>
      <Grid container className={classes.carouselWrapper}>
        <Grid className={classes.grid}>
          <Button
            className={classes.nextMissingButton}
            onClick={handleNextMissing}
          >
            Next Missing
          </Button>
        </Grid>
        {photoRecords
          .slice(
            Math.max(selectedImageIndex - 2, 0),
            Math.min(selectedImageIndex + 3, photoRecords.length)
          )
          .map((record, index) => (
            <Grid item key={`image-${index}-${record.fileName}`}>
              <img
                className={`${classes.carouselImage} ${
                  selectedImageIndex ===
                  index + Math.max(selectedImageIndex - 2, 0)
                    ? classes.selected
                    : ""
                } ${
                  record.needsManualRegistration &&
                  classes.needsManualRegistration
                }`}
                src={getImageSrc(filesPath, record.fileName)}
                alt={`${index}`}
                onClick={() =>
                  setSelectedImageIndex(
                    index + Math.max(selectedImageIndex - 2, 0)
                  )
                }
              />
            </Grid>
          ))}
      </Grid>
      <Box display="flex" justifyContent="center">
        <IconButton onClick={handlePreviousClick} size="large">
          <ArrowBackIos />
        </IconButton>
        <Typography variant="body1">
          {selectedImageIndex + 1}/{photoRecords.length}
        </Typography>
        <IconButton onClick={handleNextClick} size="large">
          <ArrowForwardIos />
        </IconButton>

        <TextField
          variant="standard"
          className={classes.indexInput}
          label="Go to"
          value={indexInput}
          onChange={handleIndexInputChange}
          onKeyPress={handleIndexInputKeyPress}
          inputProps={{ style: { textAlign: "center" } }}
          inputRef={indexInputRef}
        />
        <FormControl variant="standard" component="fieldset">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={highRes}
                  onChange={handleHighResChange}
                  name="setHighRes"
                  color="primary"
                />
              }
              label="Set high resolution"
            />
          </FormGroup>
        </FormControl>
      </Box>
    </Box>
  );
};
