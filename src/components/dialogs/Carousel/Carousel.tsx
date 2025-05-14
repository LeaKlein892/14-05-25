import React, { useState } from "react";
import { Grid, IconButton, Tooltip } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { LinkDetails } from "../../../models";
import theme from "../../../ui/theme";

interface CarouselProps {
  linkLocationsFiltered: LinkDetails[];
  mobileMode: boolean;
  currIndexPlanImage: number;
  changeImageExtension: (linkUrl: string) => string;
  handleSelectImage: (linkUrl: string) => void;
  splitMode?: boolean;
  splitScreenRight?: boolean;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      height: "100%",
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
        border: `4px solid ${theme.palette.primary.dark}`,
      },
    },
    selected: {
      borderColor: "blue",
    },
    carouselButton: {
      height: "50%",
      alignSelf: "center",
    },
  })
);

const getCarouselSize = (
  mobileMode: boolean,
  splitMode: boolean,
  splitScreenRight: boolean,
  linkLocationsFiltered: string | any[]
) => {
  return Math.min(
    mobileMode
      ? 3
      : splitMode
      ? splitScreenRight
        ? window.innerWidth / 330
        : window.innerWidth / 200
      : window.innerWidth / 165,
    linkLocationsFiltered.length
  );
};

const Carousel: React.FC<CarouselProps> = ({
  linkLocationsFiltered = [],
  mobileMode,
  currIndexPlanImage,
  changeImageExtension,
  handleSelectImage,
  splitMode = false,
  splitScreenRight = false,
}) => {
  const classes = useStyles();
  const maxVisible = getCarouselSize(
    mobileMode,
    splitMode,
    splitScreenRight,
    linkLocationsFiltered
  );

  const [startIndex, setStartIndex] = useState(currIndexPlanImage);
  const moveCarousel = (isRight: boolean) => {
    const shift = isRight ? 1 : -1;
    const newStartIndex =
      (startIndex + shift + linkLocationsFiltered.length) %
      linkLocationsFiltered.length;
    setStartIndex(newStartIndex);
  };

  const visibleImages = Array.from({ length: maxVisible }).map((_, index) => {
    const visibleIndex = (startIndex + index) % linkLocationsFiltered.length;
    return linkLocationsFiltered[visibleIndex];
  });

  return (
    <Grid container item justifyContent={splitScreenRight ? "start" : "center"}>
      <Tooltip disableInteractive title="left">
        <IconButton
          aria-label="left"
          onClick={() => moveCarousel(false)}
          className={classes.carouselButton}
          size="small"
        >
          <ChevronLeftIcon />
        </IconButton>
      </Tooltip>
      {visibleImages.map((linkLocation, index) => (
        <Grid item key={`image-${index}-${linkLocation.sceneName}`}>
          <Tooltip
            title={` ${(startIndex + index) % linkLocationsFiltered.length}`}
          >
            <img
              className={`${classes.carouselImage} ${
                currIndexPlanImage ===
                linkLocationsFiltered.indexOf(linkLocation)
                  ? classes.selected
                  : ""
              }`}
              src={changeImageExtension(linkLocation.linkUrl)}
              alt={linkLocation.sceneName}
              onClick={() => handleSelectImage(linkLocation.linkUrl)}
            />
          </Tooltip>
        </Grid>
      ))}
      <Tooltip disableInteractive title="right">
        <IconButton
          aria-label="right"
          onClick={() => moveCarousel(true)}
          className={classes.carouselButton}
          size="small"
        >
          <ChevronRightIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
};

export default Carousel;
