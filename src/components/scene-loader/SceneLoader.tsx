import * as React from "react";
import { useCallback, useContext, useEffect, useState, useRef } from "react";
import {
  encodeParam,
  getQueryArgs,
  setOrReplaceSearchParams,
} from "../../utils/query-params";
import { Data } from "../../typings/panoramas";
import Pano from "../panorama/pano/Pano";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { useHistory } from "react-router-dom";
import { AppModeEnum, ViewContext } from "../../context/ViewContext";
import { FriendlyError } from "../friendly-error/FriendlyError";
import { analyticsError } from "../../utils/analytics";
import { useUserSceneNames } from "../../hooks/useUserSceneNames";
import { scrollToTop } from "../../utils/scroll-utils";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import {
  getSessionStorageItem,
  initProjectRecord,
} from "../../utils/projects-utils";
import { emptyArray } from "../../utils/render-utils";
import { showMessage } from "../../utils/messages-manager";

let dataDirectoryUrl = getQueryArgs("dataUrl");
let sceneId = getQueryArgs("sceneId", "");
let yaw = getQueryArgs("yaw", 0);
let pitch = getQueryArgs("pitch", 0);
let fov = getQueryArgs("fov", 0);

export interface SceneLoaderProps {
  preventFastMode?: boolean;
  handleTourClose?: () => void;
}

const SceneLoader: React.FC<SceneLoaderProps> = React.memo(
  ({ preventFastMode = false, handleTourClose }) => {
    const { appMode, setNavbarOpen } = useContext(ViewContext);
    const [panoKey, setPanoKey] = useState(0);
    scrollToTop();

    let sceneTourData = getSessionStorageItem("SceneTourData");
    const [anchorScene, setanchorScene] = useState(
      getSessionStorageItem("AnchorScene")
    );
    const {
      currentScene,
      setCurrentScene,
      currentTour,
      setCurrentTour,
      currentPlan,
      currentDate,
      currentProject,
      client,
    } = useContext(ProjectInformationContext);

    const {
      loggedUser: { participatesInProjects = emptyArray },
    } = useContext(LoggedUserContext);

    let userScenes = useUserSceneNames(
      sceneTourData?.tour ? sceneTourData.tour : currentTour,
      appMode !== AppModeEnum.tourView
    );

    if (anchorScene) {
      sceneId = anchorScene;
      yaw = anchorScene.yaw || 0;
      pitch = anchorScene.pitch || 0;
      fov = anchorScene.fov || 0;
    } else {
      if (
        currentScene &&
        currentScene.sceneId &&
        currentScene.sceneId !== "" &&
        sceneId !== currentScene.sceneId
      ) {
        sceneId = currentScene.sceneId;
        yaw = currentScene.yaw || 0;
        pitch = currentScene.pitch || 0;
        fov = currentScene.fov || 0;
      }
    }

    const shouldChooseProject =
      (!(sceneTourData?.plan ? sceneTourData.plan : currentPlan) ||
        (sceneTourData?.plan
          ? sceneTourData.plan === ""
          : currentPlan === "")) &&
      appMode === AppModeEnum.projectView &&
      !currentProject;
    const noTourForBlueprint = !sceneTourData
      ? currentDate === "blueprint" && appMode === AppModeEnum.projectView
      : sceneTourData?.date === "blueprint" &&
        appMode === AppModeEnum.projectView;

    let history = useHistory();

    const setSceneInUrl = useCallback(
      (urlSearch: string, newSceneId: string) => {
        const paramNames = ["sceneId"];
        const paramValues = [newSceneId];
        if (client) {
          paramNames.push("client");
          paramValues.push(client);
        }
        const newUrl = `${history.location.pathname}?${setOrReplaceSearchParams(
          urlSearch,
          paramNames,
          paramValues
        )}`;
        history.replace(newUrl);
      },
      [history, client]
    );

    if (!history.location.search) {
      setSceneInUrl(
        `dataUrl=${encodeParam(
          "dataUrl",
          sceneTourData?.tour ? sceneTourData.tour : currentTour
        )}`,
        sceneId
      );
    }

    const selectedScene = { sceneId, yaw, pitch, fov };

    const data = useRef<Data>({
      scenes: [],
      name: "",
      settings: {
        mouseViewMode: "drag",
      },
    });

    const [errorMsg, setErrorMsg] = useState("");

    const refetchData = useCallback(async () => {
      try {
        const jsonData = await fetch(
          (sceneTourData?.tour ? sceneTourData.tour : currentTour) +
            "/data.json"
        );
        const tourData = await jsonData.json();
        data.current = tourData;
        setPanoKey((prevKey) => prevKey + 1);
        document.title = tourData.name;
      } catch (e: any) {
        if (!shouldChooseProject && !noTourForBlueprint) {
          analyticsError(
            "Failed to load pano data: " + JSON.stringify(e),
            true
          );
          setErrorMsg(e.toString());
        }
      }
    }, [
      sceneTourData?.tour ? sceneTourData.tour : currentTour,
      shouldChooseProject,
      noTourForBlueprint,
    ]);

    const handleSceneChange = useCallback(
      (newSceneId: string) => {
        if (sceneTourData) {
          sessionStorage.setItem("AnchorScene", JSON.stringify(newSceneId));
          setanchorScene(newSceneId);
        } else {
          setCurrentScene({ sceneId: newSceneId });
          setSceneInUrl(history.location.search, newSceneId);
        }
      },
      [
        setCurrentScene,
        history.location.search,
        setSceneInUrl,
        anchorScene,
        sceneTourData,
        setanchorScene,
      ]
    );

    useEffect(() => {
      if (
        appMode === AppModeEnum.tourView &&
        participatesInProjects &&
        participatesInProjects.length > 0
      ) {
        initProjectRecord(
          participatesInProjects,
          sceneTourData?.tour ? sceneTourData.tour : currentTour,
          selectedScene
        );
      }
    }, [
      participatesInProjects,
      sceneTourData?.tour ? sceneTourData.tour : currentTour,
      selectedScene,
      anchorScene,
      appMode,
    ]);

    useEffect(() => {
      if (
        sceneTourData?.tour
          ? sceneTourData.tour
          : currentTour && sceneTourData?.tour
          ? sceneTourData.tour
          : currentTour !== ""
      ) {
        refetchData();
      } else {
        setCurrentTour(dataDirectoryUrl);
      }
    }, [
      sceneTourData?.tour ? sceneTourData.tour : currentTour,
      refetchData,
      setCurrentTour,
    ]);

    const renderError = () => {
      analyticsError(
        "SceneLoader Error. ShouldChooseProject: " +
          shouldChooseProject +
          " errorMessage: " +
          JSON.stringify(errorMsg)
      );
      return shouldChooseProject ? (
        <FriendlyError
          link="/project"
          message="No project selected!"
          linkText="Select Project"
        />
      ) : noTourForBlueprint ? (
        <FriendlyError
          link="/project"
          message="No tour found for the selected date. Please select a different record"
          linkText="Select a new scan date"
        />
      ) : (
        <FriendlyError
          message={`Error in loading: ${errorMsg}`}
        ></FriendlyError>
      );
    };

    useEffect(() => {
      if (errorMsg && errorMsg !== "") {
        setNavbarOpen(false);
        if (errorMsg.includes("not valid JSON")) {
          history.push("/plan");
          showMessage(
            "No tour found. Please click on one of the links",
            "warning"
          );
        }
      }
    }, [errorMsg, setNavbarOpen]);

    return !shouldChooseProject && !noTourForBlueprint && errorMsg === "" ? (
      <React.Fragment>
        <Pano
          data={data.current}
          dataUrl={sceneTourData?.tour ? sceneTourData.tour : currentTour}
          onSceneChange={handleSceneChange}
          selectedScene={selectedScene}
          userSceneNames={userScenes}
          preventFastMode={preventFastMode}
          key={panoKey}
          handleTourClose={handleTourClose}
        />
      </React.Fragment>
    ) : (
      renderError()
    );
  }
);

export default SceneLoader;
