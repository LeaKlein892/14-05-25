import * as React from "react";
import { useCallback, useEffect } from "react";
import OpenSeadragon, { Point } from "openseadragon";
import "./PlanAnnotations.css";
import {
  OrderedPhotoRecord,
  OSDLocation,
  StaticPlanAnnotationDef,
} from "./PlanAnnotationsTypes";
import { emptyArray } from "../../../utils/render-utils";
import { Activity } from "../../../models";
import {
  convertStatusToString,
  getClassForStatus,
} from "../../../utils/projects-utils";
import { useStyles } from "../../activity-progress/ActivityStyles";
import { ActivityStatus } from "../../../API";
import { Tooltip } from "@mui/material";
import { ActivityWithAnchor } from "../../activity-progress/ActivityProgressModels";

const defaultInitialPoint: OSDLocation = {
  leftLocation: 0,
  topLocation: 0,
};

const mapNamesToLocations = new Map<string, OSDLocation>();

const getOverlayId = (i: number) => "frame" + i;

function getAnnotationClassName(
  record: OrderedPhotoRecord,
  selectedIndex: number,
  highestIndex: number
) {
  return selectedIndex === record.index
    ? "selectedAnnotation"
    : highestIndex === record.index
    ? "lastAnnotation"
    : "staticAnnotation";
}

function getAnchorAnnotationClasses(
  anchorsStatuses: ActivityWithAnchor[] | undefined,
  index: number,
  selectedIndex: number,
  classes: ReturnType<typeof useStyles>,
  diffedAnchors = emptyArray
) {
  if (!anchorsStatuses) return "";

  const activityStatusClass = getClassForStatus(
    anchorsStatuses[index]?.activity.status as ActivityStatus,
    classes
  );

  if (anchorsStatuses[index]?.invisible) {
    return `${activityStatusClass} ${classes.invisiblePoint}`;
  }

  if (anchorsStatuses[index]?.activity.previousStatus) {
    return `${activityStatusClass} ${classes.manuallyChangedPoint}`;
  }

  if (diffedAnchors.includes(index)) {
    return `${activityStatusClass} ${classes.markedPoint}`;
  }

  return `${activityStatusClass} ${
    selectedIndex === index ? classes.lastClickedPoint : ""
  }`;
}

export interface StaticPlanAnnotationsProps {
  viewer?: OpenSeadragon.Viewer;
  staticPlanAnnotationDef?: StaticPlanAnnotationDef;
  anchorsStatuses?: ActivityWithAnchor[];
  progressMode?: boolean;
  onPointClick?: (record: OrderedPhotoRecord, index: number) => void;
  diffedAnchors?: number[];
}

const StaticPlanAnnotations: React.FC<StaticPlanAnnotationsProps> = ({
  viewer,
  staticPlanAnnotationDef,
  anchorsStatuses,
  progressMode = false,
  onPointClick,
}) => {
  const classes = useStyles();
  let photoRecords = staticPlanAnnotationDef?.locationsArray || emptyArray;
  const markedAnchors = staticPlanAnnotationDef?.diffedAnchors || emptyArray;
  const selectedIndex = staticPlanAnnotationDef?.selectedIndex || 0;
  const highestIndex = photoRecords[photoRecords.length - 1]?.index || 0;
  const { leftLocation, topLocation } =
    staticPlanAnnotationDef?.initialPoint || defaultInitialPoint;

  const displayAnchors = useCallback(
    (imageAspect: number) => {
      if (viewer) {
        for (let i = 0; i < photoRecords.length; i++) {
          const currentPhotoRecord = photoRecords[i];
          const { leftLocation, topLocation, fileName } = currentPhotoRecord;
          if (!mapNamesToLocations.has(fileName)) {
            viewer.addOverlay(
              getOverlayId(i),
              new Point(leftLocation, topLocation / imageAspect)
            );
            mapNamesToLocations.set(fileName, { leftLocation, topLocation });
          }
        }
      }
    },
    [viewer, photoRecords]
  );

  useEffect(() => {
    if (viewer) {
      const tiledImage = viewer.world.getItemAt(0);
      const x = tiledImage?.source?.dimensions?.x || 1;
      const y = tiledImage?.source?.dimensions?.y || 1;
      const imageAspect = x / y;
      if (progressMode) {
        if (x !== 1 && y !== 1) {
          displayAnchors(imageAspect);
        }
      } else {
        for (let i = 0; i < photoRecords.length; i++) {
          const currentPhotoRecord = photoRecords[i];
          const { leftLocation, topLocation, fileName } = currentPhotoRecord;
          if (!mapNamesToLocations.has(fileName)) {
            viewer.addOverlay(
              getOverlayId(i),
              new Point(leftLocation, topLocation / imageAspect)
            );
            mapNamesToLocations.set(fileName, { leftLocation, topLocation });
          } else {
            const nameLocationRecord = mapNamesToLocations.get(fileName)!;
            if (
              nameLocationRecord.leftLocation !== leftLocation ||
              nameLocationRecord.topLocation !== topLocation
            ) {
              viewer.updateOverlay(
                getOverlayId(i),
                new Point(leftLocation, topLocation / imageAspect)
              );
              mapNamesToLocations.set(fileName, { leftLocation, topLocation });
            }
          }
        }
        if (leftLocation !== 0 && topLocation !== 0) {
          viewer?.addOverlay(
            "initial-point",
            new Point(leftLocation, topLocation / imageAspect)
          );
        }
      }
    }
  }, [
    viewer,
    photoRecords,
    leftLocation,
    topLocation,
    anchorsStatuses,
    displayAnchors,
  ]);

  useEffect(() => {
    return () => {
      anchorsStatuses && mapNamesToLocations.clear();
    };
  }, [anchorsStatuses, photoRecords]);

  const getUpdatedTitle = (activity: Activity) => {
    return `
      Updated from status: ${convertStatusToString(
        activity.previousStatus as ActivityStatus
      )}<br/>
      To status: ${convertStatusToString(
        activity.status as ActivityStatus
      )}<br/>
      Reason: ${activity.updateReason}<br/>
      By user: ${activity.updater}<br/>
      Date of Update: ${activity.dateManuallyUpdated}
    `;
  };

  const getTooltipTitle = (activity: Activity, isInvisible: boolean) => {
    if (activity.previousStatus) {
      // For manually updated activities, keep the existing detailed tooltip
      return getUpdatedTitle(activity);
    } else {
      // For regular activities, add "(Not certain)" if the anchor is invisible
      const statusText = convertStatusToString(
        activity.status as ActivityStatus
      );
      return isInvisible ? `${statusText} (Not certain)` : statusText;
    }
  };

  return (
    <>
      {photoRecords.length > 0 &&
        photoRecords.map((record, index) =>
          anchorsStatuses &&
          anchorsStatuses[index]?.activity.status ===
            ActivityStatus.IRRELEVANT ? (
            <div id={getOverlayId(index)} key={`link-${getOverlayId(index)}`} />
          ) : (
            <Tooltip
              disableInteractive
              key={`link-${getOverlayId(index)}`}
              title={
                !anchorsStatuses ? (
                  getOverlayId(record.index + 1)
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: getTooltipTitle(
                        anchorsStatuses[index]?.activity,
                        anchorsStatuses[index]?.invisible || false
                      ),
                    }}
                  />
                )
              }
            >
              <div
                id={getOverlayId(index)}
                className={
                  anchorsStatuses
                    ? getAnchorAnnotationClasses(
                        anchorsStatuses,
                        index,
                        selectedIndex,
                        classes,
                        markedAnchors
                      )
                    : getAnnotationClassName(
                        record,
                        selectedIndex,
                        highestIndex
                      )
                }
                onClick={() => onPointClick && onPointClick(record, index)}
              />
            </Tooltip>
          )
        )}
    </>
  );
};

export default React.memo(StaticPlanAnnotations);
