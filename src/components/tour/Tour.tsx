import * as React from "react";
import {
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { SceneView } from "../panorama/types";
import { Info, NearestScene, Project } from "../../models";
import { TourControls } from "./TourControls";
import { useTourInfo } from "../../hooks/useTourInfo";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { API } from "aws-amplify";
import { nearestScene } from "../../graphql/queries";

import { AppModeEnum, ViewContext } from "../../context/ViewContext";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { analyticsEvent } from "../../utils/analytics";
import { COMPARE_3D, isBimMode } from "../../utils/compare-tour-utils";
import { CenterPageLoader } from "../loader/CenterPageLoader";
import { useBimTransformation } from "../../hooks/useBimTransformation";
import { emptyArray } from "../../utils/render-utils";
import { showMessage } from "../../utils/messages-manager";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { isReseller } from "../../utils/clients";
import { EmbeddedView } from "../embedded-view/EmbeddedView";
import { getDefaults, getSessionStorageItem, is3DTour } from "../../utils/projects-utils";                                                                       
import SceneLoader from "../scene-loader/SceneLoader";
import useChannel, { TourTableChannelProps } from "../../hooks/useChannels";
import { useHistory } from "react-router-dom";


const SplitTourView = lazy(() => import("./SplitTourView"));

let lastSceneId = "";

const Tour: React.FC = () => {
  const [compareToTour, setCompareToTour] = useState<Info | undefined>(
    undefined
  );

  const { appMode } = useContext(ViewContext);
  const { loggedUser } = useContext(LoggedUserContext);
  const {
    currentPlan,
    currentDate,
    currentScene,
    lastYaw,
    lastPitch,
    currentTour,
    client,
    setCurrentScene,
    anchorId,
  } = useContext(ProjectInformationContext);

  const is3D = is3DTour(currentTour);
  let history = useHistory();

  const addParametersToURL = (
    url: string,
    leftLocation: number,
    topLocation: number,
    currentAnchorId: string
  ): string => {
    return `location?pdf=${url}&anchorId=${currentAnchorId}&anchorLeftLocation=${leftLocation}&anchorTopLocation=${topLocation}`;
  };

  const broadcast = useChannel<TourTableChannelProps>({
    subscribeToMessages: anchorId !== undefined && anchorId !== "",
    channelName: "tour-table-channel",
    messageHandler: (message: MessageEvent) => {
      const curFloor = getSessionStorageItem("currentFloor");
      const curBuilding = getSessionStorageItem("currentBuilding");
      if (
        message.data.floor != curFloor ||
        message.data.building != curBuilding
      ) {
        const newUrl = addParametersToURL(
          message.data.anchor,
          message.data.leftLocation,
          message.data.topLocation,
          message.data.anchorId
        );
        sessionStorage.setItem(
          "currentBuilding",
          JSON.stringify(message.data.building)
        );
        sessionStorage.setItem(
          "currentFloor",
          JSON.stringify(message.data.floor)
        );
        history.replace(newUrl);
      } else {
        sessionStorage.setItem(
          "anchorLeftLocation",
          JSON.stringify(message.data.leftLocation)
        );
        sessionStorage.setItem(
          "anchorTopLocation",
          JSON.stringify(message.data.topLocation)
        );
        sessionStorage.setItem(
          "anchorId",
          JSON.stringify(message.data.anchorId)
        );
        if (message.data.scene) {
          sessionStorage.setItem("isBroadcast", JSON.stringify(true));
          setCurrentScene({ sceneId: message.data.scene });
        }
      }
    },
  });

  const { compareToTourData, comparableTours } = useTourInfo(
    currentTour,
    "",
    false,
    compareToTour
  );
  let planBimTransformation = useBimTransformation(currentPlan || "");

  const [sceneToCompare, setSceneToCompare] = useState<SceneView | undefined>();
  const [split, setSplit] = useState(false);

  const [locked, setLocked] = useState(true);
  const {
    loggedUser: { username },
  } = useContext(LoggedUserContext);


  const switchLock = useCallback(() => {
    const analyticEventToReport = locked
      ? "Split Views Unlocked"
      : "Split Views Locked";
    analyticsEvent("Tour", analyticEventToReport, username);
    showMessage(analyticEventToReport);
    setLocked(!locked);

  }, [locked, username]);

  const handleClose = useCallback(() => {
    if (sceneToCompare) {
      analyticsEvent(
        "Tour",
        !isBimMode(sceneToCompare)
          ? "Past Tour Closed"
          : "Tour Compared to Bim Closed",
        loggedUser.username
      );
    }
    setSceneToCompare(undefined);
  }, [loggedUser.username, sceneToCompare]);

  const handleOpen = useCallback(
    (scene?: SceneView) => {
      setSceneToCompare(scene);
      analyticsEvent(
        "Tour",
        !isBimMode(scene) ? "Past Tour Opened" : "Tour Compared to Bim Opened",
        loggedUser.username
      );
    },
    [loggedUser.username]
  );

  const getNearestScene = useCallback(
    async (
      originalTourPlanLinksId: string,
      originalScene: SceneView | undefined,
      otherTourPlanLinksId: string
    ) => {
      if (originalScene && otherTourPlanLinksId !== "") {
        const nearest: any = await API.graphql({
          query: nearestScene,
          variables: {
            originalTourPlanLinksId,
            originalSceneId: originalScene.sceneId,
            otherTourPlanLinksId,
            originalYaw: lastYaw,
          },
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        const scene: NearestScene = nearest.data.nearestScene;
        let result = Object.assign({}, originalScene);
        result.sceneId = scene.sceneId;
        result.yaw = scene.yaw;
        return result;
      }
    },
    [lastYaw]
  );

  const handleCompareTour = useCallback(
    async (tourToCompare: Info | undefined) => {
      setCompareToTour(tourToCompare);
      lastSceneId = currentScene?.sceneId || "";
      if (tourToCompare) {
        if (tourToCompare.date === COMPARE_3D) {
          const sceneForBim = { sceneId: COMPARE_3D };
          handleOpen(sceneForBim);
        } else {
          try {
            const scene = await getNearestScene(
              `${currentDate}_${currentPlan}`,
              Object.assign({}, currentScene, {
                yaw: lastYaw,
                pitch: lastPitch,
              }),
              tourToCompare ? `${tourToCompare.date}_${tourToCompare.plan}` : ""
            );
            handleOpen(scene);
          } catch (e: any) {
            analyticsEvent(
              "Tour",
              "Past Tour was not found",
              loggedUser.username
            );
            showMessage("Past view was not found for selected date", "warning");
          }
        }
      } else {
        handleClose();
      }
    },
    [
      setCompareToTour,
      currentDate,
      currentPlan,
      currentScene,
      handleClose,
      handleOpen,
      loggedUser.username,
      lastYaw,
      lastPitch,
      getNearestScene,
    ]
  );

  useEffect(() => {
    if (sceneToCompare) {
      setSplit(true);
    } else {
      setSplit(false);
    }
  }, [sceneToCompare]);

  useEffect(() => {
    if (split && locked) {
      if (
        currentScene?.sceneId &&
        currentScene?.sceneId !== lastSceneId &&
        !isBimMode(sceneToCompare)
      ) {
        lastSceneId = currentScene?.sceneId;
        handleCompareTour(compareToTour);
      }
    }
  }, [split, currentScene, locked]);

  useEffect(() => {
    lastSceneId = "";
  }, []);

  useEffect(() => {
    setSplit(false);
  }, [currentTour]);

  return (
    <React.Fragment>
      <Suspense fallback={<CenterPageLoader loading={true} />}>
        {(appMode === AppModeEnum.projectView ||
          (appMode === AppModeEnum.planView && isReseller(client))) && (
          <TourControls
            comparableTours={comparableTours || emptyArray}
            onCompareTour={handleCompareTour}
            hasBim={!!planBimTransformation}
          />
        )}
        {!split ? (
          !is3D ? (
            <SceneLoader />
          ) : (
            <EmbeddedView src={currentTour} />
          )
        ) : (
          <SplitTourView
            sceneToCompare={sceneToCompare}
            compareToTourData={compareToTourData}
            dataUrl={compareToTour?.tour || ""}
            onClose={handleClose}
            locked={locked}
            switchLock={switchLock}
            planBimTransformation={planBimTransformation}
          />
        )}
      </Suspense>
    </React.Fragment>
  );
};

export default React.memo(Tour);
