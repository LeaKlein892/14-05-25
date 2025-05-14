import * as React from "react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { usePhotoTourPoints } from "../../../hooks/usePhotoTourPoints";
import { createStyles, makeStyles } from "@mui/styles";
import { getNumberQueryArgs, getQueryArgs } from "../../../utils/query-params";
import {
  emptyArray,
  emptyFn,
  emptyMap,
  emptyNullFn,
} from "../../../utils/render-utils";
import PlanViewer from "../../plan/plan-viewer/PlanViewer";
import { EMPTY_PLAN_LINK } from "../../../utils/plan-utils";
import { PanoramaSwitcher } from "../panorama-switcher/PanoramaSwitcher";
import { showMessage } from "../../../utils/messages-manager";
import { StaticPlanAnnotationDef } from "../../plan/plan-annotations/PlanAnnotationsTypes";
import SplitPane from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

function getPlanUrlFromPointsId(pointsId: String) {
  const splitUnderscore = pointsId.split("_");
  if (splitUnderscore && splitUnderscore[1]) {
    return splitUnderscore[1];
  }
  return "";
}

const useStyles = makeStyles((theme) =>
  createStyles({
    pane: {
      height: "100%",
      width: "100%",
      backgroundColor: "white",
    },
    resizer: {
      width: "5px",
      backgroundColor: "black",
    },
    splitter: {
      backgroundColor: "black",
      height: "100%",
    },
  })
);

let pointsId = getQueryArgs("points", "");
let leftLocation = getNumberQueryArgs("left", 0)!;
let topLocation = getNumberQueryArgs("top", 0)!;
let markedAsRegistered = false;

export interface PlanImagesRegistratorProps {}

const PlanImagesRegistrator: React.FC<PlanImagesRegistratorProps> = () => {
  const classes = useStyles();
  const { photoTourPoints, updatePhotoLocation, markTourPointsAsRegistered } =
    usePhotoTourPoints(pointsId);
  const planUrl = getPlanUrlFromPointsId(pointsId);
  const photoRecords = photoTourPoints?.photoRecords || emptyArray;
  const filesPath = photoTourPoints?.filesPath;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const staticPlanAnnotationDef: StaticPlanAnnotationDef = useMemo(() => {
    const locationsArray = photoRecords
      .map((record, index) => ({ ...record, index }))
      .filter(
        ({ leftLocation, topLocation }) =>
          leftLocation !== 0 || topLocation !== 0
      );
    return {
      locationsArray,
      selectedIndex: selectedImageIndex,
      initialPoint: { leftLocation, topLocation },
      photoTourId: pointsId,
    };
  }, [selectedImageIndex, photoRecords]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setSelectedImageIndex((prevIndex) =>
          prevIndex === 0 ? photoRecords.length - 1 : prevIndex - 1
        );
      } else if (event.key === "ArrowRight") {
        setSelectedImageIndex((prevIndex) =>
          prevIndex === photoRecords.length - 1 ? 0 : prevIndex + 1
        );
      }
    },
    [photoRecords]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown as any);
    return () => {
      window.removeEventListener("keydown", handleKeyDown as any);
    };
  }, [handleKeyDown]);

  const handlePreviousClick = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === 0 ? photoRecords.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = useCallback(() => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex === photoRecords.length - 1 ? 0 : prevIndex + 1
    );
  }, [photoRecords.length]);

  const handleNextMissing = useCallback(() => {
    setSelectedImageIndex((prevIndex) => {
      let nextIndex = prevIndex === photoRecords.length - 1 ? 0 : prevIndex + 1;
      while (
        !photoRecords[nextIndex].needsManualRegistration &&
        nextIndex !== 0
      ) {
        nextIndex = nextIndex === photoRecords.length - 1 ? 0 : nextIndex + 1;
      }
      return nextIndex;
    });
  }, [photoRecords]);

  const onMatchImageToPlan = useCallback(
    async (leftLocation: number, topLocation: number) => {
      try {
        await updatePhotoLocation(
          selectedImageIndex,
          leftLocation,
          topLocation
        );
        showMessage("Image location was matched");
      } catch (e: any) {
        showMessage("Failed to match, please try again", "error");
      } finally {
        if (!markedAsRegistered) {
          markedAsRegistered = true;
          markTourPointsAsRegistered();
        }
      }
    },
    [selectedImageIndex, updatePhotoLocation, markTourPointsAsRegistered]
  );

  const panesSizes = ["auto", "5px", "auto"];

  return (
    <>
      {
        <SplitPane
          split="vertical"
          allowResize={false}
          sizes={panesSizes}
          className={classes.resizer}
          sashRender={emptyNullFn}
          onChange={emptyFn}
        >
          <div className={classes.pane}>
            <div
              id="initial-point"
              className="initialPoint"
              title="initial-point"
            />
            <PlanViewer
              plan={planUrl}
              scale={1.0}
              planLinks={EMPTY_PLAN_LINK}
              formViewMode
              sceneIdToNumberOfComments={emptyMap}
              sceneIdToDefaultComment={emptyMap}
              onMatchImageToPlan={onMatchImageToPlan}
              staticPlanAnnotationDef={staticPlanAnnotationDef}
            />
          </div>
          <div className={classes.splitter}></div>
          <div className={classes.pane}>
            <PanoramaSwitcher
              photoRecords={photoRecords}
              selectedImageIndex={selectedImageIndex}
              setSelectedImageIndex={setSelectedImageIndex}
              handlePreviousClick={handlePreviousClick}
              handleNextClick={handleNextClick}
              handleNextMissing={handleNextMissing}
              filesPath={filesPath}
            />
          </div>
        </SplitPane>
      }
    </>
  );
};

export default React.memo(PlanImagesRegistrator);
