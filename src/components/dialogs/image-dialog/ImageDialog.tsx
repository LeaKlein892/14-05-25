import * as React from "react";
import { DialogProps } from "../../types/DialogProps";
import { DialogLayout } from "../dialog-layout/DialogLayout";
import { Storage } from "aws-amplify";
import { createStyles, makeStyles } from "@mui/styles";

import {
  Button,
  DialogActions,
  DialogContent,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";

import GetAppIcon from "@mui/icons-material/GetApp";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import * as FileSaver from "file-saver";
import { commentImageStorageLocation } from "../../../utils/comments-utils";
import { showMessage } from "../../../utils/messages-manager";
import { analyticsError } from "../../../utils/analytics";
import { DziImage } from "../../dzi-image/DziImage";
import { Dispatch, useCallback, useEffect, useState } from "react";
import { LinkDetails } from "../../../models";
import theme from "../../../ui/theme";
import { ComparePlanSelect } from "../../plan/plan-compare/ComparePlanSelect";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { downloadFile } from "../../../utils/file-manager";
import Carousel from "../Carousel/Carousel";
import { emptyFn } from "../../../utils/render-utils";
let startedFileDownload = false;

export interface ImageDialogProps extends DialogProps {
  fileName: string;
  mobileMode?: boolean;
  dziImageId?: string;
  handleMoveImageToDirection?: (direction: boolean) => void;
  linkLocations?: LinkDetails[];
  indexPlanImage?: number;
  togglePlanCompare?: (dateToCompare: string, fileName: string) => void;
  embeddedMode?: boolean;
  planTitle?: string;
  handleSelectImage?: (linkUrl: string) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    image: {
      width: "100%",
      height: "auto",
      maxHeight: "100%",
      objectFit: "contain",
    },
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
    leftButtonCarousel: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      left: "calc(30% - 95px)",
    },
    rightButtonCarousel: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      right: "calc(30% - 95px)",
    },
    carouselWrapper: {
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
    grid: {
      padding: theme.spacing(5),
    },
    imageWrapper: {
      padding: 0,
      backgroundColor: "#d8d8d8",
    },
  })
);

const ImageDialog: React.FC<ImageDialogProps> = ({
  open = false,
  handleClose,
  fileName,
  mobileMode = false,
  dziImageId = "dziImage",
  handleMoveImageToDirection,
  linkLocations,
  indexPlanImage,
  togglePlanCompare,
  embeddedMode,
  planTitle: planTitle = "",
  handleSelectImage = emptyFn,
}) => {
  const classes = useStyles();
  const { currentArea } = React.useContext(ProjectInformationContext);
  const [dialogKey, setDialogKey] = useState(0);
  const [currentFileName, setCurrentFileName] = useState(fileName);
  const dziFormat = currentFileName.endsWith(".dzi");

  const downloadImage = async () => {
    if (currentFileName && !startedFileDownload) {
      startedFileDownload = true;
      showMessage("Starting to download image...");

      try {
        if (!dziFormat) {
          const result: any = await Storage.get(
            commentImageStorageLocation(currentFileName),
            {
              download: true,
            }
          );
          FileSaver.saveAs(result.Body, currentFileName);
        } else {
          await downloadFile(currentFileName);
        }
        showMessage("Image download completed", "success");
      } catch (e: any) {
        const errorMessage = "Failed to download image: " + e.toString();
        showMessage(errorMessage, "error");
        analyticsError(errorMessage);
      } finally {
        setTimeout(() => {
          startedFileDownload = false;
        }, 1500);
      }
    }
  };

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
    <DialogLayout
      title={planTitle !== "" ? `${planTitle}` : `Uploaded Image `}
      handleClose={handleClose}
      open={open}
      maxWidth={"xl"}
      fullScreen={mobileMode || planTitle !== ""}
      showCloseButton
      key={dialogKey}
    >
      <DialogContent className={classes.imageWrapper}>
        {!dziFormat ? (
          <img
            src={
              !dziFormat
                ? commentImageStorageLocation(currentFileName, true)
                : currentFileName
            }
            className={classes.image}
            alt=""
          />
        ) : (
          <DziImage
            src={currentFileName}
            id={dziImageId}
            mobileMode={mobileMode}
          />
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
      <Grid container className={classes.carouselWrapper}>
        <Carousel
          linkLocationsFiltered={linkLocations || []}
          mobileMode={mobileMode}
          currIndexPlanImage={indexPlanImage || 0}
          changeImageExtension={changeImageExtension}
          handleSelectImage={handleSelectImage}
        />
        <DialogActions style={{ position: "absolute", bottom: 0, right: 0 }}>
          <Tooltip disableInteractive title="Download">
            <Button
              variant="text"
              component="span"
              size="small"
              color="primary"
              onClick={downloadImage}
            >
              <GetAppIcon />
            </Button>
          </Tooltip>
        </DialogActions>
      </Grid>
      {!mobileMode && !embeddedMode ? (
        <ComparePlanSelect
          options={filteredDates}
          onCompareClick={onCompareClick}
        ></ComparePlanSelect>
      ) : null}
    </DialogLayout>
  ) : (
    <span />
  );
};

export default ImageDialog;
