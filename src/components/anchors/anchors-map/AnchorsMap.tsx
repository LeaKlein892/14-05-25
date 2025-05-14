import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import TextField from "@mui/material/TextField";
import { getQueryArgs } from "../../../utils/query-params";
import PlanViewer from "../../plan/plan-viewer/PlanViewer";
import { EMPTY_PLAN_LINK } from "../../../utils/plan-utils";
import { emptyArray, emptyMap } from "../../../utils/render-utils";
import {
  OrderedPhotoRecord,
  StaticPlanAnnotationDef,
} from "../../plan/plan-annotations/PlanAnnotationsTypes";
import { usePlanAnchors } from "../../../hooks/usePlanAnchors";
import { showMessage } from "../../../utils/messages-manager";

export interface AnchorsMapProps {}

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      height: "100vh",
      position: "relative",
    },
    textFieldContainer: {
      position: "fixed",
      top: 60,
      right: 50,
      zIndex: 999,
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
  })
);

let planUrl = getQueryArgs("plan");

const AnchorsMap: React.FC<AnchorsMapProps> = () => {
  const classes = useStyles();
  const { planAnchors, changePlanAnchors } = usePlanAnchors(planUrl);
  const photoRecords = planAnchors?.photoRecords || emptyArray;

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [label, setLabel] = useState("");

  const staticPlanAnnotationDef: StaticPlanAnnotationDef = useMemo(() => {
    const locationsArray: OrderedPhotoRecord[] = photoRecords.map(
      (record, index) => ({ ...record, index })
    );
    return {
      locationsArray,
      selectedIndex: 0,
      initialPoint: { leftLocation: 0.1, topLocation: 0.1 },
      photoTourId: "",
    };
  }, [photoRecords]);

  const onMatchAnchorToPlan = useCallback(
    async (leftLocation: number, topLocation: number) => {
      try {
        await changePlanAnchors(
          selectedIndex,
          leftLocation,
          topLocation,
          label
        );
        showMessage("Anchor was placed on plan");
      } catch (e: any) {
        showMessage("Failed to match, please try again", "error");
      }
    },
    [selectedIndex, changePlanAnchors, label]
  );

  const handleSelectedIndexChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedIndex(parseInt(event.target.value) || -1);
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(event.target.value ?? "");
  };

  return (
    <div className={classes.container}>
      <div id="initial-point" className="initialPoint" title="initial-point" />
      <div className={classes.textFieldContainer}>
        <TextField
          variant="standard"
          label="Selected Index"
          value={selectedIndex}
          color="primary"
          onChange={handleSelectedIndexChange}
        />
        <TextField
          variant="standard"
          label="Label"
          value={label}
          color="primary"
          onChange={handleLabelChange}
        />
      </div>
      <PlanViewer
        plan={planUrl}
        scale={1.0}
        planLinks={EMPTY_PLAN_LINK}
        formViewMode
        sceneIdToNumberOfComments={emptyMap}
        sceneIdToDefaultComment={emptyMap}
        onMatchImageToPlan={onMatchAnchorToPlan}
        staticPlanAnnotationDef={staticPlanAnnotationDef}
      />
    </div>
  );
};

export default React.memo(AnchorsMap);
