import * as React from "react";
import { useContext } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { emptyFn, emptyMap, emptyNullFn } from "../../../utils/render-utils";
import PlanViewer from "../plan-viewer/PlanViewer";
import { usePlanLinks } from "../../../hooks/usePlanLinks";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import SplitPane from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

const useStyles = makeStyles((theme) =>
  createStyles({
    rightPane: {
      height: "100%",
      width: "100%",
    },
    leftPane: {
      height: "100%",
      width: "100%",
    },
    resizer: {
      width: "5px",
      backgroundColor: "black",
    },
    splitter: {
      backgroundColor: "black",
    },
  })
);

interface PlanCompareProps {
  fileName: string;
}

const PlanCompare: React.FC<PlanCompareProps> = ({ fileName }) => {
  const { currentPlan, currentDate, pastDate } = useContext(
    ProjectInformationContext
  );
  const classes = useStyles();
  const planUrl = currentPlan ? currentPlan : "";
  const currentPlanDate = currentDate;
  let planLinks = usePlanLinks(planUrl, currentPlanDate);
  let pastPlanLinks = usePlanLinks(planUrl, pastDate);
  const PlanViewerA = React.useCallback(
    (props: any) => <PlanViewer key={pastDate} {...props}></PlanViewer>,
    [pastDate]
  );
  const PlanViewerB = React.useCallback(
    (props: any) => (
      <PlanViewer key={pastDate + currentDate} {...props}></PlanViewer>
    ),
    [pastDate]
  );

  const panesSizes = ["auto", "5px", "auto"];

  return (
    <>
      {
        <SplitPane
          split="vertical"
          allowResize={false}
          sizes={panesSizes}
          onChange={emptyFn}
          sashRender={emptyNullFn}
          className={classes.resizer}
        >
          <PlanViewerA
            plan={planUrl}
            scale={1.0}
            planLinks={planLinks}
            sceneIdToNumberOfComments={emptyMap}
            sceneIdToDefaultComment={emptyMap}
            openSeaDragonId="leftOpenSeaDragon"
            overlayId="leftOverlayId"
            dziImageId="leftDziImage"
            splitScreenLeft
            selectedImageUrl={fileName}
          />
          <div className={classes.splitter}></div>
          <PlanViewerB
            plan={planUrl}
            scale={1.0}
            sceneIdToNumberOfComments={emptyMap}
            planLinks={pastPlanLinks}
            sceneIdToDefaultComment={emptyMap}
            openSeaDragonId="rightOpenSeaDragon"
            overlayId="rightOverlayId"
            dziImageId="rightDziImage"
            splitScreenRight
          />
        </SplitPane>
      }
    </>
  );
};
export default React.memo(PlanCompare);
