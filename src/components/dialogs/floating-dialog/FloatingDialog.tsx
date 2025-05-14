import * as React from "react";
import { DialogProps } from "../../types/DialogProps";
import { createStyles, makeStyles } from "@mui/styles";

import { DialogContent, Grid, IconButton, Tooltip } from "@mui/material";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { commentImageStorageLocation } from "../../../utils/comments-utils";
import { DziImage } from "../../dzi-image/DziImage";
import { Dispatch, useCallback, useEffect, useState } from "react";
import { LinkDetails } from "../../../models";
import theme from "../../../ui/theme";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { FloatingDialogLayout } from "./FloatingDialogLayout";
import { ComparePlanSelect } from "../../plan/plan-compare/ComparePlanSelect";
import Carousel from "../Carousel/Carousel";
import { emptyFn } from "../../../utils/render-utils";

export interface FloatingDialogProps extends DialogProps {
  fileName: string;
  mobileMode?: boolean;
  dziImageId?: string;
  compareMode?: boolean;
  splitScreenLeft?: boolean;
  splitScreenRight?: boolean;
  handleMoveImageToDirection?: (direction: boolean) => void;
  linkLocations?: LinkDetails[];
  indexPlanImage?: number;
  setIndexPlanImage?: Dispatch<number>;
  togglePlanCompare?: (dateToCompare: string, fileName: string) => void;
  planTitle?: string;
  handleSelectImage?: (linkUrl: string) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
    },
    leftButton: {
      position: "absolute",
      left: "0%",
      top: "42%",
    },
    rightButton: {
      position: "absolute",
      right: "0%",
      top: "42%",
    },
    leftButtonCarouselA: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      left: "calc(33% - 95px)",
    },
    rightButtonCarouselA: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      right: "calc(33% - 95px)",
    },
    leftButtonCarouselB: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      left: "calc(7% - 95px)",
    },
    rightButtonCarouselB: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      right: "calc(60% - 95px)",
    },
    rightCarouselWrapper: {
      display: "flex",
      justifyContent: "flex",
      alignItems: "flex",
      position: "relative",
    },
    leftCarouselWrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    navigationButtons: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
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
        border: `4px solid ${theme.palette.primary.main}`,
      },
    },
    blueBorder: {
      border: "2px solid blue",
    },
    selected: {},
    imageWrapper: {
      padding: 0,
      backgroundColor: "#d8d8d8",
    },
  })
);

const FloatingDialog: React.FC<FloatingDialogProps> = ({
  open = false,
  handleClose,
  fileName,
  mobileMode = false,
  dziImageId = "dziImage",
  compareMode = false,
  splitScreenLeft = false,
  splitScreenRight = false,
  handleMoveImageToDirection,
  linkLocations,
  indexPlanImage,
  setIndexPlanImage,
  togglePlanCompare,
  planTitle = "",
  handleSelectImage = emptyFn,
}) => {
  const classes = useStyles();
  const { currentArea, currentDate, pastDate } = React.useContext(
    ProjectInformationContext
  );
  const [dialogKey, setDialogKey] = useState(0);
  const [currentFileName, setCurrentFileName] = useState(fileName);
  const dziFormat = currentFileName.endsWith(".dzi");

  useEffect(() => {
    const handleRefresh = () => {
      setDialogKey((prevKey) => prevKey + 1);
    };
    if (fileName !== undefined && fileName !== null) {
      handleRefresh();
    }
    setCurrentFileName(fileName);
  }, [fileName]);
  const options = currentArea?.infos;

  const allDates = options?.flatMap((info) => info.date);

  const filteredDates =
    allDates?.filter((date) => typeof date === "string") || [];

  const onCompareClick = (dateToCompare: string | undefined) => {
    if (dateToCompare && togglePlanCompare) {
      togglePlanCompare(dateToCompare, fileName);
    }
  };
  useEffect(() => {
    const handleRefresh = () => {
      setDialogKey((prevKey) => prevKey + 1);
    };
    if (currentFileName !== undefined && currentFileName !== null) {
      handleRefresh();
    }
  }, [currentFileName]);

  const changeImageExtension = (url: string) => {
    const splitUrl = url.split(".");
    const imageName = splitUrl[splitUrl.length - 2].split("/").pop();
    return `${url.substring(0, url.lastIndexOf("/") + 1)}low_${imageName}.JPG`;
  };

  return open ? (
    <FloatingDialogLayout
      title={splitScreenLeft ? planTitle : pastDate}
      handleClose={handleClose}
      open={open}
      maxWidth={compareMode ? "md" : "xl"}
      fullScreen={true}
      showCloseButton
      key={dialogKey}
      splitScreenLeft={splitScreenLeft}
      splitScreenRight={splitScreenRight}
    >
      <DialogContent className={classes.imageWrapper}>
        {!dziFormat ? (
          <img
            src={
              !dziFormat
                ? commentImageStorageLocation(currentFileName, true)
                : currentFileName
            }
            className={classes.root}
            alt=""
          />
        ) : (
          <DziImage src={currentFileName} id={dziImageId} />
        )}
        <Grid container className={classes.navigationButtons}>
          {handleMoveImageToDirection && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }} />
              <Tooltip disableInteractive title="Previous image">
                <IconButton
                  aria-label="left"
                  className={classes.leftButton}
                  onClick={() => handleMoveImageToDirection(false)}
                  size="large"
                >
                  <ChevronLeftIcon
                    style={{ width: "60px", height: "80px" }}
                    color="primary"
                  />
                </IconButton>
              </Tooltip>
              <Tooltip disableInteractive title="Next image">
                <IconButton
                  aria-label="right"
                  className={classes.rightButton}
                  onClick={() => handleMoveImageToDirection(true)}
                  size="large"
                >
                  <ChevronRightIcon
                    style={{ width: "60px", height: "80px" }}
                    color="primary"
                  />
                </IconButton>
              </Tooltip>
              <div style={{ flex: 1 }} />
            </div>
          )}
        </Grid>
      </DialogContent>
      <Grid
        container
        className={
          splitScreenRight
            ? classes.rightCarouselWrapper
            : classes.leftCarouselWrapper
        }
      >
        <Grid
          container
          item
          spacing={1}
          justifyContent={splitScreenRight ? "flex-start" : "center"}
        >
          <Carousel
            linkLocationsFiltered={linkLocations || []}
            mobileMode={mobileMode}
            currIndexPlanImage={indexPlanImage || 0}
            changeImageExtension={changeImageExtension}
            handleSelectImage={handleSelectImage}
            splitMode={true}
            splitScreenRight={splitScreenRight}
          />
        </Grid>
      </Grid>
      {splitScreenRight && (
        <ComparePlanSelect
          options={filteredDates}
          onCompareClick={onCompareClick}
        />
      )}
    </FloatingDialogLayout>
  ) : (
    <span />
  );
};

export default FloatingDialog;
