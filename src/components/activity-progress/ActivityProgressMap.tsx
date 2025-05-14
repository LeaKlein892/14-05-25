import React, { useContext, useMemo, useState } from "react";
import PlanViewer from "../plan/plan-viewer/PlanViewer";
import { emptyArray, emptyMap } from "../../utils/render-utils";
import { EMPTY_PLAN_LINK } from "../../utils/plan-utils";
import {
  StaticPlanAnnotationDef,
  OrderedPhotoRecord,
} from "../plan/plan-annotations/PlanAnnotationsTypes";
import { usePlanAnchors } from "../../hooks/usePlanAnchors";
import { useMediaQuery } from "@mui/material";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { useStyles } from "./ActivityStyles";
import {
  ActivityArea,
  ActivityMapData,
  ActivityWithAnchor,
} from "./ActivityProgressModels";
import { Progress, ProgressArea } from "../../models";

interface ActivityProgressMapProps {
  clickedCellData: ActivityMapData;
  handleMapClose?: () => void;
  onPointClick?: (
    record: OrderedPhotoRecord,
    index: number,
    area?: ActivityArea
  ) => void;
  progressByDate?: Progress | null;
}

let lastClickedAnchorIndex = 0;

export const ActivityProgressMap: React.FC<ActivityProgressMapProps> = ({
  clickedCellData,
  handleMapClose,
  onPointClick,
  progressByDate,
}) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(lastClickedAnchorIndex);
  let mobileMode = useMediaQuery("(max-width: 1224px)", { noSsr: true });
  const { currentProject } = useContext(ProjectInformationContext);
  const getLinkForArea = (building: string, floor: string) => {
    let b = currentProject?.buildings?.find((b) => b.name === building);
    let f = b && b.floors?.find((f) => f.name === floor);
    const areas = f?.areas || emptyArray;
    for (const area of areas) {
      const infos = area.infos || emptyArray;
      for (const i of infos) {
        return i.plan;
      }
    }
  };

  const diffedAnchors = clickedCellData.indicesOfMarkedAnchor || emptyArray;

  const planUrl = getLinkForArea(
    clickedCellData.Area.building,
    clickedCellData.Area.floor
  );
  const { planAnchors } = usePlanAnchors(planUrl);
  const photoRecords = planAnchors?.photoRecords || emptyArray;
  const progressMode = true;
  const staticPlanAnnotationDef: StaticPlanAnnotationDef = useMemo(() => {
    const locationsArray: OrderedPhotoRecord[] = photoRecords.map(
      (record, index) => ({ ...record, index })
    );
    return {
      locationsArray,
      selectedIndex,
      initialPoint: { leftLocation: 0.1, topLocation: 0.1 },
      photoTourId: "",
      diffedAnchors,
    };
  }, [photoRecords, selectedIndex, diffedAnchors]);

  const anchorsStatuses: ActivityWithAnchor[] = useMemo(() => {
    // Map the invisible property from ProgressArea to ActivityWithAnchor
    return clickedCellData.Activity.map((activity) => {
      // Check if this anchor has the invisible property set to true in the progressAreas
      const progressArea = progressByDate?.progressAreas?.find(
        (pa: ProgressArea) => pa.anchor === activity.anchor
      );

      return {
        ...activity,
        invisible: progressArea?.invisible || false,
      };
    });
  }, [clickedCellData]);

  const onPointClickAddFloor = (record: OrderedPhotoRecord, index: number) => {
    let pointArea = clickedCellData.Area;
    lastClickedAnchorIndex = index;
    setSelectedIndex(lastClickedAnchorIndex);
    onPointClick && onPointClick(record, index, pointArea);
  };

  return (
    <div
      className={!mobileMode ? classes.mapContainer : classes.mobileContainer}
    >
      <PlanViewer
        plan={planUrl}
        scale={1.0}
        planLinks={EMPTY_PLAN_LINK}
        formViewMode
        sceneIdToNumberOfComments={emptyMap}
        sceneIdToDefaultComment={emptyMap}
        staticPlanAnnotationDef={staticPlanAnnotationDef}
        anchorsStatuses={anchorsStatuses}
        progressMode={progressMode}
        handleMapClose={handleMapClose}
        onPointClick={onPointClickAddFloor}
      />
    </div>
  );
};

export default React.memo(ActivityProgressMap);
