import * as React from "react";
import { lazy, Suspense, useEffect, useState } from "react";
import { SceneView } from "../panorama/types";
import { Data } from "../../typings/panoramas";
import { createStyles, makeStyles } from "@mui/styles";
import { isBimMode } from "../../utils/compare-tour-utils";
import { PlanBimTransformation } from "../../models";
import { CenterPageLoader } from "../loader/CenterPageLoader";
import { LockScreens } from "../lock-screens/LockScreens";
import { emptyFn, emptyNullFn } from "../../utils/render-utils";
import SceneLoader from "../scene-loader/SceneLoader";
import SplitPane from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

const BimModel = lazy(() => import("../plan/bim/bim-model/BimModel"));
const PastPano = lazy(() => import("../panorama/pano/PastPano"));

const useStyles = makeStyles(() =>
  createStyles({
    pane: {
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

export interface SplitTourViewProps {
  sceneToCompare?: SceneView;
  compareToTourData: Data;
  dataUrl: string;
  locked: boolean;
  switchLock: () => void;
  onClose: () => void;
  planBimTransformation?: PlanBimTransformation;
}

const panesSizes = ["auto", "5px", "auto"];

const SplitTourView: React.FC<SplitTourViewProps> = ({
  sceneToCompare,
  compareToTourData,
  dataUrl,
  onClose,
  locked,
  switchLock,
  planBimTransformation,
}) => {
  const classes = useStyles();

  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(1);
  }, []);

  return (
    <>
      {
        <SplitPane
          split="vertical"
          allowResize={false}
          sizes={panesSizes}
          className={classes.resizer}
          onChange={emptyFn}
          sashRender={emptyNullFn}
        >
          <div className={classes.pane}>
            <SceneLoader preventFastMode={isBimMode(sceneToCompare)} />
          </div>
          <div className={classes.splitter}></div>
          <div className={classes.pane}>
            <Suspense fallback={<CenterPageLoader loading={true} />}>
              {!isBimMode(sceneToCompare) || !planBimTransformation ? (
                key > 0 && (
                  <PastPano
                    data={compareToTourData}
                    onSceneChange={emptyFn}
                    handleClose={onClose}
                    dataUrl={dataUrl}
                    locked={locked}
                    selectedScene={sceneToCompare as any}
                    key={key}
                  />
                )
              ) : (
                <BimModel
                  planBimTransformation={planBimTransformation}
                  onClose={onClose}
                  syncToSceneChanges={locked}
                />
              )}
            </Suspense>
          </div>
        </SplitPane>
      }
      <LockScreens locked={locked} switchLock={switchLock} />
    </>
  );
};

export default SplitTourView;
