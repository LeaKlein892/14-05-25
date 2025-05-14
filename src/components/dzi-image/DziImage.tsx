import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import OpenSeaDragon from "openseadragon";
import { createStyles, makeStyles } from "@mui/styles";

const useStyles = makeStyles(() =>
  createStyles({
    imageDzi: {
      height: "100%",
      width: "100%",
      border: "1px solid gray",
    },
  })
);

export interface DziImageProps {
  src: string;
  id?: string;
  mobileMode?: boolean;
}

export const DziImage: React.FC<DziImageProps> = ({
  src,
  id = "dziImage",
  mobileMode = false,
}) => {
  const [viewer, setViewer] = useState<OpenSeadragon.Viewer | undefined>();
  const classes = useStyles();

  const initOpenSeadragon = useCallback(() => {
    const viewerToSet = OpenSeaDragon({
      id: id,
      prefixUrl: "openseadragon-images/",
      animationTime: 0.85,
      blendTime: 0.1,
      constrainDuringPan: false,
      maxZoomPixelRatio: 3,
      showRotationControl: false,
      showFullPageControl: mobileMode ? false : true,
      zoomPerClick: 1.4,
      zoomPerScroll: 1.1,
      tileSources: src,
      timeout: 60000,
      gestureSettingsTouch: {
        scrollToZoom: false,
      },
      navigationControlAnchor: OpenSeaDragon.ControlAnchor.BOTTOM_RIGHT,
    });
    setViewer(viewerToSet);
  }, [src, id]);

  useEffect(() => {
    initOpenSeadragon();
  }, [initOpenSeadragon]);

  useEffect(() => {
    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [viewer]);

  return <div id={id} className={classes.imageDzi} />;
};
