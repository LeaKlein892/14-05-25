import * as React from "react";
import { useCallback, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import BimModel from "../bim-model/BimModel";
import PlanViewer from "../../plan-viewer/PlanViewer";
import {
  BimViewport,
  PlanBimTransformation,
  PlanLinks,
  ScanRecord,
} from "../../../../models";
import { getQueryArgs } from "../../../../utils/query-params";
import { Fab } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import ClearIcon from "@mui/icons-material/Clear";
import { CreatePlanBimMatchingInput } from "../../../../API";
import { API, graphqlOperation } from "aws-amplify";
import {
  calculatePlanBimTransformation,
  createPlanBimMatching,
} from "../../../../graphql/mutations";
import { PublishBar } from "../../../notification-bars/publish-bar/PublishBar";
import { emptyFn, emptyMap, emptyNullFn } from "../../../../utils/render-utils";
import { useBimTransformation } from "../../../../hooks/useBimTransformation";
import { planLocationsFromBimState } from "../../../../utils/bim-calculations";
import {
  EMPTY_PLAN_LINK,
  planLinkFromLocations,
} from "../../../../utils/plan-utils";
import { showMessage } from "../../../../utils/messages-manager";
import SplitPane from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

const useStyles = makeStyles((theme) =>
  createStyles({
    pane: {
      height: "100%",
      width: "100%",
    },
    resizer: {
      width: "5px",
      backgroundColor: "black",
    },
    matchFab: {
      position: "fixed",
      zIndex: 1,
      bottom: theme.spacing(23),
      right: theme.spacing(2),
    },
    testFab: {
      position: "fixed",
      zIndex: 1,
      bottom: theme.spacing(30),
      right: theme.spacing(2),
    },
    splitter: {
      backgroundColor: "black",
    },
  })
);

let planArg = getQueryArgs("pdf");
let bimArg = getQueryArgs("bim") + "?mode=embed";

const planBimTransformation: PlanBimTransformation = {
  id: planArg,
  bimUrl: bimArg,
};

const BimMatcher: React.FC = () => {
  const classes = useStyles();

  const [bimState, setBimState] = useState<BimViewport | undefined>(undefined);
  const [planPoint, setPlanPoint] = useState<ScanRecord | undefined>(undefined);
  const [showingTest, setShowingTest] = useState(false);
  const [testPlanLink, setTestPlanLink] = useState<PlanLinks>(EMPTY_PLAN_LINK);

  const subscribeToBimState = useCallback((state: BimViewport) => {
    setBimState(state);
  }, []);

  const subscribeToPlanLocation = useCallback(
    (planLocation: ScanRecord, rotation: number, aspectRatio: number) => {
      const locationToSet = { ...planLocation };
      if (rotation === 180) {
        (locationToSet as any).topLocation =
          aspectRatio - locationToSet.topLocation;
        (locationToSet as any).leftLocation = 1 - locationToSet.leftLocation;
      }
      setPlanPoint(planLocation);
    },
    []
  );

  let transformationForValidation = useBimTransformation(planArg);

  const onMatchClick = async () => {
    if (bimState && planPoint) {
      const matchInput: CreatePlanBimMatchingInput = {
        planUrl: planArg,
        bimUrl: bimArg,
        record: planPoint,
        viewport: bimState,
      };
      try {
        await API.graphql(
          graphqlOperation(createPlanBimMatching, { input: matchInput })
        );
        showMessage("Matching plan-bim created!", "success");
        setBimState(undefined);
        setPlanPoint(undefined);
      } catch (e: any) {
        showMessage("Failed to create matching", "error");
      }
    } else {
      showMessage(
        "Failed to create matching, missing state for bim or plan",
        "error"
      );
    }
  };

  const completeMatching = async () => {
    try {
      await API.graphql(
        graphqlOperation(calculatePlanBimTransformation, {
          planUrl: planArg,
          registerByNewOnly: true,
        })
      );
      showMessage("Completed matching process!", "success");
    } catch (e: any) {
      showMessage("Failed to Complete matching process", "error");
    }
  };

  const onBimLocationTest = () => {
    if (showingTest) {
      window.location.reload();
    } else {
      if (transformationForValidation && bimState) {
        const { bimUp2CastoryUpRotationMatrix, inverseMatchMatrix } =
          transformationForValidation;
        const { eye } = bimState;
        if (bimUp2CastoryUpRotationMatrix && inverseMatchMatrix) {
          const [left, top] = planLocationsFromBimState(
            bimUp2CastoryUpRotationMatrix,
            inverseMatchMatrix,
            eye
          );
          const planLinks = planLinkFromLocations(top, left);
          setTestPlanLink(planLinks);
          setShowingTest(true);
        } else {
          showMessage("Fail: transformation matrices are missing!", "error");
        }
      } else {
        showMessage("Fail: No transformation or BIM state!", "error");
      }
    }
  };

  const panesSizes = ["auto", "5px", "auto"];

  return (
    <>
      <PublishBar
        open={true}
        message="Match BIM to Plan"
        onPublish={completeMatching}
      />
      {
        <SplitPane
          split="horizontal"
          allowResize={false}
          sizes={panesSizes}
          className={classes.resizer}
          sashRender={emptyNullFn}
          onChange={emptyFn}
        >
          <div className={classes.pane}>
            <BimModel
              planBimTransformation={planBimTransformation}
              onClose={emptyFn}
              subscribeToBimState={subscribeToBimState}
            />
          </div>
          <div className={classes.splitter}></div>
          <div className={classes.pane}>
            <PlanViewer
              plan={planArg}
              scale={1.0}
              planLinks={testPlanLink}
              formViewMode
              embeddedMode
              sceneIdToNumberOfComments={emptyMap}
              sceneIdToDefaultComment={emptyMap}
              subscribeToPlanLocation={subscribeToPlanLocation}
            />
          </div>
        </SplitPane>
      }
      <Fab
        variant="extended"
        color="primary"
        size="small"
        id="viewIn"
        aria-label="match"
        className={classes.matchFab}
        onClick={onMatchClick}
      >
        <SendIcon />
      </Fab>
      <Fab
        variant="extended"
        color="primary"
        size="small"
        id="viewIn"
        aria-label="match"
        className={classes.testFab}
        disabled={!transformationForValidation}
        onClick={onBimLocationTest}
      >
        {showingTest ? <ClearIcon /> : <NotListedLocationIcon />}
      </Fab>
    </>
  );
};

export default React.memo(BimMatcher);
