import * as React from "react";
import { useCallback, useContext, useEffect } from "react";
import OpenSeadragon, { MouseTracker, Point } from "openseadragon";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import "./PlanAnnotations.css";
import { Badge, useMediaQuery, Theme, Tooltip } from "@mui/material";
import { createStyles, makeStyles, withStyles } from "@mui/styles";
import { OSDLocation, PlanAnnotationsProps } from "./PlanAnnotationsTypes";
import { ItemTypeEnum, LinkDetails, PlanLinks } from "../../../models";
import { ClassNameMap } from "@mui/styles/withStyles";
import {
  getProjectDetailsFromDataUrl,
  getSessionStorageItem,
} from "../../../utils/projects-utils";

const sectorDeviation = 0.18;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bigIcon: {
      height: "38px",
      display: "table-cell",
      verticalAlign: "middle",
    },
    iconLink: {
      height: "18px",
      display: "table-cell",
      verticalAlign: "middle",
    },
    iconLinkImage: {
      height: "22px",
      display: "table-cell",
      verticalAlign: "middle",
      backgroundColor: "white",
    },
    iconLinkEmbedded: {
      height: "12px",
      display: "table-cell",
      verticalAlign: "middle",
    },
    iconLinkEmbeddedImage: {
      height: "12px",
      display: "table-cell",
      verticalAlign: "middle",
    },
    pointStyle: {
      background: "yellow",
      borderRadius: "50%",
      height: "12px",
      width: "12px",
      display: "inline-block",
    },
  })
);

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      height: "12px",
      minWidth: "12px",
      maxWidth: "12px",
    },
  })
)(Badge);

export const wrapWithBadge = (e: any, value: number) => {
  if (value > 0) {
    return (
      <StyledBadge badgeContent={value} color="error" max={9}>
        {e}
      </StyledBadge>
    );
  } else return e;
};

const getOverlayId = (i: number, id: string) => id + "overlay" + i;
let mouseTrackersArray: MouseTracker[] = [];

export interface PlanDziAnnotationsProps extends PlanAnnotationsProps {
  viewer?: OpenSeadragon.Viewer;
  tileImageLoaded: boolean;
  planLinks?: PlanLinks;
  embeddedMode?: boolean;
  allowChangingPlanLinks?: boolean;
  overlayId?: string;
}

type PlanAnnotationClasses =
  | "iconLink"
  | "bigIcon"
  | "iconLinkEmbeddedImage"
  | "iconLinkEmbedded"
  | "iconLinkImage"
  | "pointStyle";

const clearMouseTrackers = () => {
  for (let tracker of mouseTrackersArray) {
    tracker.destroy();
  }
  mouseTrackersArray = [];
};

let firstTime = true;

function nonIconSrc(
  isPhotoLink: undefined | boolean,
  isZoomImageLink: undefined | boolean,
  isVideoLink: undefined | boolean
) {
  if (isZoomImageLink) {
    return "img/image.png";
  } else if (isVideoLink) {
    return "img/video.png";
  } else {
    return "img/360.png";
  }
}

function getImageSrc(
  isIconAnnotations: undefined | boolean,
  isPhotoLink: undefined | boolean,
  isZoomImageLink: undefined | boolean,
  isVideoLink: undefined | boolean
) {
  return !isIconAnnotations
    ? nonIconSrc(isPhotoLink, isZoomImageLink, isVideoLink)
    : "img/cross.png";
}

function getEmbeddedClasses(
  specialPhotoClass: undefined | boolean,
  classes: ClassNameMap<PlanAnnotationClasses>
) {
  return specialPhotoClass
    ? classes.iconLinkEmbeddedImage
    : classes.iconLinkEmbedded;
}

function getNonEmbeddedClasses(
  specialPhotoClass: undefined | boolean,
  isSite: undefined | boolean,
  classes: ClassNameMap<PlanAnnotationClasses>
) {
  return specialPhotoClass && isSite ? classes.iconLinkImage : classes.iconLink;
}

function getImageClassName(
  isIconAnnotations: undefined | boolean,
  classes: ClassNameMap<PlanAnnotationClasses>,
  embeddedMode: undefined | boolean,
  isPhotoLink: undefined | boolean,
  isZoomImageLink: undefined | boolean,
  isSite: undefined | boolean,
  isVideoLink: undefined | boolean
) {
  const specialPhotoClass = isPhotoLink || isZoomImageLink || isVideoLink;
  return isIconAnnotations
    ? classes.bigIcon
    : embeddedMode
    ? getEmbeddedClasses(specialPhotoClass, classes)
    : getNonEmbeddedClasses(specialPhotoClass, isSite, classes);
}

const PlanAnnotations: React.FC<PlanDziAnnotationsProps> = ({
  viewer,
  planLinks,
  onSceneClick,
  onZoomImageClick,
  onVideoClick,
  idToCommentsNumber,
  hidden,
  tileImageLoaded,
  isIconAnnotations = false,
  embeddedMode = false,
  allowChangingPlanLinks = false,
  overlayId = "",
}) => {
  const {
    currentScene,
    currentTour,
    lastYaw,
    setLastTopLocation,
    setLastLeftLocation,
    setLastPlanYaw,
  } = useContext(ProjectInformationContext);
  let mobileMode = useMediaQuery("(max-width: 1224px)", { noSsr: true });
  const classes = useStyles();
  let sceneTourData = getSessionStorageItem("SceneTourData");
  const leftLocation = JSON.parse(getSessionStorageItem("anchorLeftLocation"));
  const topLocation = JSON.parse(getSessionStorageItem("anchorTopLocation"));
  const anchorId =
    JSON.parse(getSessionStorageItem("anchorId")) ?? "Current anchor";
  const mapNamesToLocations = new Map<string, OSDLocation>();
  const sceneId = "point" + planLinks?.linkLocations.length + 1;
  const { building } = getProjectDetailsFromDataUrl(currentTour || "");
  const isSite = building === "Site";
  useEffect(() => {
    if (
      planLinks &&
      viewer &&
      tileImageLoaded &&
      (firstTime || allowChangingPlanLinks)
    ) {
      const linkLocations = planLinks.linkLocations;
      const tiledImage = viewer.world.getItemAt(0);
      if (tiledImage) {
        const x = tiledImage?.source.dimensions.x || 1;
        const y = tiledImage?.source.dimensions.y || 1;
        const imageAspect = x / y;
        for (let i = 0; i < linkLocations.length; i++) {
          const elementId = getOverlayId(i, overlayId);
          viewer?.addOverlay({
            element: elementId,
            location: new Point(
              linkLocations[i].leftLocation,
              linkLocations[i].topLocation / imageAspect
            ),
            checkResize: false,
          });

          if (!isIconAnnotations) {
            const linkUrl = linkLocations[i].linkUrl;
            const isZoomImageLink =
              linkLocations[i].linkItemType ===
              ItemTypeEnum.IMAGE_PLAIN_ZOOMABLE;
            const isVideoLink =
              linkLocations[i].linkItemType === ItemTypeEnum.VIDEO;
            const tracker = new MouseTracker({
              element: elementId,
              clickHandler: function (event) {
                isZoomImageLink
                  ? onZoomImageClick(linkUrl, i)
                  : isVideoLink
                  ? onVideoClick(linkUrl, i)
                  : onSceneClick(linkUrl);
              },
            });
            mouseTrackersArray.push(tracker);
          }
        }
        if (embeddedMode && leftLocation && topLocation) {
          displayAnchor(imageAspect);
        }
      }
      firstTime = false;
    }
  }, [
    viewer,
    tileImageLoaded,
    planLinks,
    onSceneClick,
    hidden,
    isIconAnnotations,
    onVideoClick,
    onZoomImageClick,
    allowChangingPlanLinks,
  ]);

  useEffect(() => {
    return () => {
      firstTime = true;
      viewer?.clearOverlays();
      clearMouseTrackers();
    };
  }, [viewer]);

  useEffect(() => {
    return () => {
      const overlayContainers = document.querySelectorAll(
        "div.link-360-overlay"
      );
      overlayContainers.forEach((container) => container.remove());
    };
  }, []);

  const compareTourAndScene = useCallback(
    (tour: string, linkDetails: LinkDetails) => {
      if (
        tour === currentTour &&
        linkDetails.sceneId === currentScene?.sceneId
      ) {
        setLastTopLocation(linkDetails.topLocation);
        setLastLeftLocation(linkDetails.leftLocation);
        setLastPlanYaw(linkDetails.planYaw || 0);
        return true;
      }
      sceneTourData = getSessionStorageItem("SceneTourData");
      let anchorScene = getSessionStorageItem("AnchorScene");
      if (
        sceneTourData &&
        tour === sceneTourData.tour &&
        !mobileMode &&
        linkDetails.sceneId === anchorScene
      ) {
        return true;
      }
      return false;
    },
    [
      currentTour,
      currentScene,
      setLastTopLocation,
      setLastLeftLocation,
      setLastPlanYaw,
    ]
  );

  const renderButtonContent = useCallback(
    (
      sceneId: string,
      sceneName?: string,
      isPhotoLink?: boolean,
      isZoomImageLink?: boolean,
      isSite?: boolean,
      isVideoLink?: boolean
    ) => {
      const badgeValue = idToCommentsNumber.get(sceneId) || 0;
      const className = getImageClassName(
        isIconAnnotations,
        classes,
        embeddedMode,
        isPhotoLink,
        isZoomImageLink,
        isSite,
        isVideoLink
      );
      return (
        <Tooltip
          disableInteractive
          title={sceneName || sceneId}
          enterDelay={300}
        >
          <div className={className}>
            {wrapWithBadge(
              <img
                src={getImageSrc(
                  isIconAnnotations,
                  isPhotoLink,
                  isZoomImageLink,
                  isVideoLink
                )}
                className={className}
                alt=""
              />,
              badgeValue
            )}
          </div>
        </Tooltip>
      );
    },
    [classes, embeddedMode, idToCommentsNumber, isIconAnnotations, isSite]
  );

  const displayAnchor = useCallback(
    (imageAspect: number) => {
      if (viewer) {
        if (topLocation && leftLocation) {
          if (!mapNamesToLocations.has("currentAnchor")) {
            viewer?.addOverlay(
              sceneId,
              new Point(leftLocation, topLocation / imageAspect)
            );
            mapNamesToLocations.set("currentAnchor", {
              leftLocation,
              topLocation,
            });
          }
        }
      }
    },
    [viewer, planLinks]
  );
  return (
    <>
      {planLinks &&
        planLinks.linkLocations.map((al, index) => {
          const isLinkSelected = compareTourAndScene(planLinks.tourDataUrl, al);
          const planYawDefined =
            (al.planYaw !== undefined &&
              al.planYaw !== null &&
              sceneTourData === null) ||
            mobileMode;
          const isPhotoLink =
            al.linkItemType === ItemTypeEnum.IMAGE_360 || al.isPhotoLink;
          const isZoomImageLink =
            al.linkItemType === ItemTypeEnum.IMAGE_PLAIN_ZOOMABLE;

          const isVideoLink = al.linkItemType === ItemTypeEnum.VIDEO;
          const planYaw = (planYawDefined ? al.planYaw : 0) as number;
          return (
            <div
              id={getOverlayId(index, overlayId)}
              key={al.linkUrl}
              style={{ display: hidden ? "none" : "block" }}
              className={"link-360-overlay"}
            >
              <button
                key={al.linkUrl}
                style={{
                  transform:
                    isLinkSelected && planYawDefined
                      ? "rotate(" +
                        (planYaw + lastYaw + sectorDeviation).toString() +
                        "rad)"
                      : "rotate(0rad)",
                }}
                className={`fixedLink ${
                  isLinkSelected
                    ? planYawDefined
                      ? embeddedMode
                        ? "highlightedSector noPointer"
                        : "highlightedSector"
                      : "highlightedLink"
                    : ""
                }`}
              >
                {renderButtonContent(
                  al.sceneId,
                  al.sceneName,
                  isPhotoLink,
                  isZoomImageLink,
                  isSite,
                  isVideoLink
                )}
              </button>
            </div>
          );
        })}
      {leftLocation && topLocation && (
        <div
          id={sceneId}
          key={"anchor"}
          title={anchorId}
          className={classes.pointStyle}
        />
      )}
    </>
  );
};

export default React.memo(PlanAnnotations);
