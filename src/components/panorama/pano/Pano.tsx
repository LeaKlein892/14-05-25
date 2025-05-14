import * as React from "react";
import {
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./Pano.css";
import { Data, LinkHotspot, PanoScene } from "../../../typings/panoramas";
import Marzipano from "marzipano";
import { Header } from "../header/Header";
import { SceneBasicDetails, SideBar } from "../side-bar/SideBar";
import Fab from "@mui/material/Fab";
import HighlightIcon from "@mui/icons-material/Highlight";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import CloseIcon from "@mui/icons-material/Close";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import { DialogMode, SelectedScene } from "../types";
import { PanoMenu } from "../pano-menu/PanoMenu";
import { TitleBar } from "../../title-bar/TitleBar";
import { Comment, UserSceneName } from "../../../models";
import { IconButton, Tooltip, useMediaQuery } from "@mui/material";
import { analyticsEvent } from "../../../utils/analytics";
import { useComments } from "../../../hooks/useComments";
import { CommentsHotspotsLayer } from "../hotspots-layers/CommentsHotspotsLayer";
import LinksHotspotsLayer, {
  DataLink,
} from "../hotspots-layers/LinksHotspotsLayer";
import { useUserLinks } from "../../../hooks/useUserLinks";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { AppModeEnum, ViewContext } from "../../../context/ViewContext";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { getTourDisplayName } from "../../../utils/display-names-utils";
import { useTourToken } from "../../../hooks/useTourToken";
import { FastMode, FastModeDirection } from "../fast-mode/FastMode";
import {
  getAnglesDifference,
  getFullTourUrl,
  preLoadPreviewImages,
  shouldLazyLoad,
} from "../../../utils/pano-utils";
import { ShareSpeedDial } from "../share/ShareSpeedDial";
import {
  LongPressDetectEvents,
  LongPressOptions,
  useLongPress,
} from "use-long-press";
import { NA } from "../../../utils/clients";
import { isNil } from "lodash-es";
import {
  initialScreenLocation,
  ScreenLocation,
} from "../../menu-layout/MenuLayout";
import {
  getProjectDetailsFromDataUrl,
  getSessionStorageItem,
  getFloorName,
} from "../../../utils/projects-utils";

const DrawingDialog = lazy(() => import("../../drawing-dialog/DrawingDialog"));
const PlanMap = lazy(() => import("../../plan/plan-map/PlanMap"));
const CommentsListDialog = lazy(
  () => import("../../dialogs/comments-list-dialog/CommentsListDialog")
);
const CommentDialog = lazy(
  () => import("../../dialogs/comment-dialog/CommentDialog")
);
const PanoFilters = lazy(() => import("./PanoFilters"));

function rotateView(view: any, yaw?: number, pitch?: number, fov?: number) {
  const rotatedView = { ...view };
  if (yaw) {
    rotatedView.yaw = yaw;
  }
  if (pitch) {
    rotatedView.pitch = pitch;
  }
  if (fov) {
    rotatedView.fov = fov;
  }
  return rotatedView;
}

export interface PanoProps {
  data: Data;
  dataUrl: string;
  onSceneChange: (sceneId: string) => void;
  selectedScene?: SelectedScene;
  userSceneNames?: UserSceneName[];
  preventFastMode?: boolean;
  handleTourClose?: () => void;
}

const velocity = 0.7;
const friction = 3;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: 500,
      position: "relative",
      minHeight: 200,
    },
    listFab: {
      position: "fixed",
      zIndex: 1,
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    shareFab: {
      position: "fixed",
      zIndex: 1,
      bottom: theme.spacing(8),
      right: theme.spacing(2),
    },
    decreaseFab: {
      position: "fixed",
      zIndex: 1,
      bottom: theme.spacing(14),
      right: theme.spacing(2),
    },
    increaseFab: {
      position: "fixed",
      zIndex: 1,
      bottom: theme.spacing(20),
      right: theme.spacing(2),
    },
    brightnessIcon: {
      position: "fixed",
      zIndex: 1,
      bottom: theme.spacing(2.7),
      left: theme.spacing(10),
    },
    brightnessIconMobile: {
      position: "fixed",
      zIndex: 1,
      bottom: theme.spacing(2.7),
      left: theme.spacing(2.7),
    },
    closeButton: {
      color: "white",
    },
  })
);

const mergeIntoCombinedSceneDetails = (
  idToUserScene: Map<string, UserSceneName>,
  combinedSceneDetails: SceneBasicDetails[],
  sceneIdToName: Map<string, string>
) => {
  idToUserScene.forEach((value, id) => {
    const indexForId = combinedSceneDetails.findIndex((s) => s.id === id);
    combinedSceneDetails[indexForId] = {
      id,
      name: idToUserScene.get(id)
        ? idToUserScene.get(id)?.sceneName || ""
        : sceneIdToName.get(id) || "",
      entityId: idToUserScene.get(id)?.id,
    };
  });
};

// Last scene
let lastSceneId: string | undefined;
let lastDataUrl: string | undefined;
let lastSceneFrame: { yaw: number; pitch: number; fov: number } | undefined;

let lastSceneIdToSceneIndexMap = new Map<string, number>();
let lastTitleOpened = true;

// Pano viewer
let viewer: any = undefined;

const Pano: React.FC<PanoProps> = React.memo(
  ({
    data,
    dataUrl,
    onSceneChange,
    selectedScene,
    userSceneNames = [],
    preventFastMode,
    handleTourClose,
  }) => {
    const classes = useStyles();

    const mobileMode = useMediaQuery("(max-width: 960px)", { noSsr: true });

    const {
      settings: { mouseViewMode },
      scenes,
    } = data;

    let sceneTourData = getSessionStorageItem("SceneTourData");
    const [anchorScene, setAnchorScene] = useState(
      getSessionStorageItem("AnchorScene")
    );

    const { loggedUser } = useContext(LoggedUserContext);
    const tokenStatus = useTourToken(dataUrl);
    const {
      setLastYaw,
      lastYaw,
      setLastPitch,
      currentProject,
      currentBuilding,
      currentFloor,
      currentArea,
      currentDate,
      currentScene,
      client,
      manualBuilding,
      manualFloor,
    } = useContext(ProjectInformationContext);
    const { appMode } = useContext(ViewContext);

    const tourOnly = appMode === AppModeEnum.tourView;

    const sceneBasicDetails = useMemo<SceneBasicDetails[]>(() => {
      let sceneIdToName: Map<string, string> = new Map();
      let combinedSceneDetails: SceneBasicDetails[] = scenes.map((s) => {
        return { name: s.name, id: s.id };
      });
      for (let scene of scenes) {
        sceneIdToName.set(scene.id, scene.name);
      }
      let idToUserScene: Map<string, UserSceneName> = new Map();
      for (let userScene of userSceneNames) {
        idToUserScene.set(userScene.sceneId, userScene);
      }
      mergeIntoCombinedSceneDetails(
        idToUserScene,
        combinedSceneDetails,
        sceneIdToName
      );
      return combinedSceneDetails;
    }, [scenes, userSceneNames]);

    //Definition for comment form
    const [openCommentForm, setOpenCommentForm] = useState(false);
    const [lastSelectedComment, setLastSelectedComment] = useState<Comment>();
    const [commentDialogMode, setCommentDialogMode] =
      useState<DialogMode>("CREATE");

    //Definition for drawing form
    const [blob, setBlob] = useState(null);

    // Definitions for fast mode
    const [fastModeDirection, setFastModeDirection] = useState<
      FastModeDirection | undefined
    >(undefined);
//לאה
    const handleCloseComment = () => {
      setOpenCommentForm(false);
      setCommentDialogMode("CREATE");
    };

    const [panoBrightness, setPanoBrightness] = useState(100);

    const handleBrightnessChange = (newBrightness: number) => {
      setPanoBrightness(newBrightness);
    };

    const [panoSaturate, setPanoSaturate] = useState(100);

    const handleSaturateChange = (newSaturate: number) => {
      setPanoSaturate(newSaturate);
    };

    const [panoContrast, setPanoContrast] = useState(100);

    const handleContrastChange = (newContrast: number) => {
      setPanoContrast(newContrast);
    };
    const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);

    const handleFiltersClick = (event: React.MouseEvent<HTMLElement>) => {
      setFilterAnchor(!filterAnchor ? event.currentTarget : null);
    };

    const handleMenuClose = useCallback(() => {
      setMousePosition(initialScreenLocation);
    }, []);

    const triggerCommentForm = useCallback(() => {
      handleMenuClose();
      setOpenCommentForm(true);
    }, [handleMenuClose]);

    const triggerLinkForm = useCallback(() => {
      handleMenuClose();
    }, [handleMenuClose]);

    // Definitions for comments list
    const [openList, setOpenList] = useState(false);

    // Definitions for title bar
    const [openTitle, setOpenTitle] = useState(lastTitleOpened);

    useEffect(() => {
      const shouldTitleBarOpen = mobileMode ? !mobileMode : lastTitleOpened;
      setOpenTitle(shouldTitleBarOpen);
    }, [mobileMode]);

    useEffect(() => {
      return () => {
        setPanoBrightness(100);
        setPanoContrast(100);
        setPanoSaturate(100);
      };
    }, []);

    const handleCloseList = () => {
      setOpenList(false);
    };

    const triggerEditComment = useCallback(
      (comment?: Comment) => {
        const editMode: DialogMode = comment
          ? "EDIT"
          : "CREATE_WITHOUT_LOCATION";
        setCommentDialogMode(editMode);
        setLastSelectedComment(comment);
        if (editMode === "EDIT") {
          handleCloseList();
        }
        triggerCommentForm();
      },
      [triggerCommentForm]
    );

    const triggerEditLink = useCallback(
      (link?: LinkHotspot) => {
        const editMode: DialogMode = link ? "EDIT" : "CREATE";
        triggerLinkForm();
      },
      [triggerLinkForm]
    );

    // Layers data
    const [dataLinks, setDataLinks] = useState<DataLink[]>([]);
    let comments = useComments(dataUrl);
    let userLinks = useUserLinks(dataUrl, !tourOnly);

    const dataLinksBySceneIds: Map<string, Array<DataLink>> = useMemo(() => {
      let dataLinksBySceneIds = new Map<string, Array<DataLink>>();
      dataLinks.forEach((dl) => {
        if (dataLinksBySceneIds.has(dl.sceneId)) {
          dataLinksBySceneIds.get(dl.sceneId)?.push(dl);
        } else {
          const dlsArray = new Array<DataLink>();
          dlsArray.push(dl);
          dataLinksBySceneIds.set(dl.sceneId, dlsArray);
        }
      });
      return dataLinksBySceneIds;
    }, [dataLinks]);

    const panorama = useRef(null);
    const [sceneName, setSceneName] = useState("");

    const [sceneFrame, setSceneFrame] = useState({
      yaw: lastSceneFrame?.yaw || 0,
      pitch: lastSceneFrame?.pitch || 0,
      fov: lastSceneFrame?.fov || 0,
    });

    const [mousePosition, setMousePosition] = useState<ScreenLocation>(
      initialScreenLocation
    );

    const handleMenuClick = (event: any) => {
      event.preventDefault();
      event.stopPropagation();
      const mouseX = (event.clientX || event.targetTouches[0].clientX) - 2;
      const mouseY = (event.clientY || event.targetTouches[0].clientY) - 4;
      setMousePosition({
        mouseX,
        mouseY,
      });
    };

    //Setup pano ref
    const panoScenes = useRef<PanoScene[]>([]);

    const [sceneIdToSceneIndexMap, setSceneIdToSceneIndexMap] = useState<
      Map<string, number>
    >(lastSceneIdToSceneIndexMap);

    const getTargetsForHotspotByIndexes = useCallback(
      (fromIndex: number, toIndex: number) => {
        let targetFrameInfo = {
          targetFov: 0,
          targetPitch: 0,
          targetYaw: 0,
        };

        const fromSceneId = scenes[fromIndex].id;
        const fromSceneHotspots = dataLinksBySceneIds.get(fromSceneId);

        fromSceneHotspots?.forEach((dataLink) => {
          if (sceneIdToSceneIndexMap.get(dataLink.hotspot.target) === toIndex) {
            targetFrameInfo = {
              targetFov: dataLink.hotspot.targetFov || 0,
              targetPitch: dataLink.hotspot.targetPitch || 0,
              targetYaw: dataLink.hotspot.targetYaw || 0,
            };
          }
        });

        return targetFrameInfo;
      },
      [dataLinksBySceneIds, sceneIdToSceneIndexMap, scenes]
    );

    const getMiddlePoint = () => {
      if (viewer) {
        const view = viewer.view();
        const screenCoordinates = view.screenToCoordinates({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
        return screenCoordinates;
      }
    };

    const calcCurrentDirection: (
      fromSceneId: string,
      toUpSceneId: string,
      toDownSceneId: string
    ) => FastModeDirection = useCallback(
      (fromSceneId: string, toUpSceneId: string, toDownSceneId: string) => {
        let upLinkHotspot: DataLink | undefined = undefined;
        let downLinkHotspot: DataLink | undefined = undefined;

        const currentSceneDataLinks = dataLinksBySceneIds.get(fromSceneId);
        if (currentSceneDataLinks) {
          currentSceneDataLinks.forEach((dataLink) => {
            if (dataLink.hotspot.target === toUpSceneId) {
              upLinkHotspot = dataLink;
            } else if (dataLink.hotspot.target === toDownSceneId) {
              downLinkHotspot = dataLink;
            }
          });
        }

        if (downLinkHotspot !== undefined && upLinkHotspot !== undefined) {
          const middlePoint = getMiddlePoint();
          const upDiffFromMiddle = getAnglesDifference(
            middlePoint.yaw,
            (upLinkHotspot as DataLink).hotspot.yaw
          );
          const downDiffFromMiddle = getAnglesDifference(
            middlePoint.yaw,
            (downLinkHotspot as DataLink).hotspot.yaw
          );
          return Math.abs(upDiffFromMiddle) > Math.abs(downDiffFromMiddle)
            ? "DEC"
            : "INC";
        } else if (
          downLinkHotspot !== undefined &&
          upLinkHotspot === undefined
        ) {
          return "DEC";
        } else {
          return "INC";
        }
      },
      [dataLinksBySceneIds]
    );

    const getCurrentDirectionByIndex: (
      fromSceneIndex: number,
      toUpSceneIndex: number,
      toDownSceneIndex: number
    ) => FastModeDirection = useCallback(
      (
        fromSceneIndex: number,
        toUpSceneIndex: number,
        toDownSceneIndex: number
      ) => {
        if (fastModeDirection) {
          return fastModeDirection;
        } else {
          const currentSceneId = scenes[fromSceneIndex].id;
          const upSceneId = scenes[toUpSceneIndex].id;
          const downSceneId = scenes[toDownSceneIndex].id;

          const newDirection = calcCurrentDirection(
            currentSceneId,
            upSceneId,
            downSceneId
          );
          setFastModeDirection(newDirection);
          return newDirection;
        }
      },
      [fastModeDirection, setFastModeDirection, calcCurrentDirection, scenes]
    );

    const switchScene = useCallback(
      (scene: any, yaw?: number, pitch?: number, fov?: number) => {
        // stopAutorotate();
        const rotatedView = rotateView(
          scene.data.initialViewParameters,
          yaw,
          pitch,
          fov
        );
        scene.view.setParameters(rotatedView);
        scene.scene.switchTo();
        setSceneName(
          sceneBasicDetails?.find((s) => s.id === scene.data.id)?.name ||
            scene.data.name
        );
        lastSceneId = scene.data.id;
        onSceneChange(scene.data.id);
      },
      [onSceneChange, sceneBasicDetails]
    );

    const findSceneById = (id: string) => {
      const indexOfScene = lastSceneIdToSceneIndexMap.get(id);
      return indexOfScene !== undefined
        ? panoScenes.current[indexOfScene]
        : null;
    };

    const doesSceneIdExist = (id: string) => {
      return lastSceneIdToSceneIndexMap.has(id);
    };

    const lastSceneIndex = useMemo(() => {
      return selectedScene
        ? sceneIdToSceneIndexMap.get(selectedScene?.sceneId)
        : undefined;
    }, [sceneIdToSceneIndexMap, selectedScene]);

    const switchSceneById = useCallback(
      (id?: string, yaw?: number, pitch?: number, fov?: number) => {
        if (id) {
          const scene = findSceneById(id);
          if (scene) {
            switchScene(scene, yaw, pitch, fov);
          }
        }
      },
      [switchScene]
    );

    const switchSceneByIndex = useCallback(
      (index: number, yaw?: number, pitch?: number, fov?: number) => {
        const scene = panoScenes.current[index];
        if (scene) {
          switchScene(scene, yaw, pitch, fov);
        }
      },
      [switchScene]
    );

    const onSceneClick = useCallback(
      (sceneId: string, yaw?: number) => {
        switchSceneById(sceneId, yaw);
        setFastModeDirection(undefined);
      },
      [switchSceneById]
    );

    const longPressCallback = useCallback((e: any) => {
      if (viewer) {
        const x = e.targetTouches[0].clientX;
        const y = e.targetTouches[0].clientY;
        const view = viewer.view();
        markSceneFromScreenLocation(view, x, y);
        handleMenuClick(e);
      }
    }, []);

    const longPress = useLongPress(longPressCallback, {
      cancelOnMovement: true,
      captureEvent: true,
      detect: LongPressDetectEvents.TOUCH,
    });

    const markSceneFromScreenLocation = (view: any, x: number, y: number) => {
      const screenCoordinates = view.screenToCoordinates({
        x,
        y,
      });
      lastSceneFrame = {
        yaw: screenCoordinates.yaw,
        pitch: screenCoordinates.pitch,
        fov: viewer?.view()?._fov,
      };
      setSceneFrame({
        yaw: lastSceneFrame.yaw,
        pitch: lastSceneFrame.pitch,
        fov: lastSceneFrame.fov,
      });
    };

    const prevData = useRef<Data | null>(null);
    const prevDataUrl = useRef<string>("");

    useEffect(() => {
      if (
        prevData.current === data ||
        prevDataUrl.current === dataUrl ||
        data.scenes.length === 0 ||
        dataUrl === undefined
      ) {
        return;
      }
      prevData.current = data;
      prevDataUrl.current = dataUrl;
      const viewerOpts = {
        controls: { mouseViewMode },
      };
      if (scenes.length === 0) return;
      const urlPrefix = dataUrl + "/tiles";
      if (dataUrl && dataUrl !== "" && selectedScene?.sceneId) {
        preLoadPreviewImages(urlPrefix, selectedScene.sceneId, scenes.length);
      }
      const viewInElement = document.querySelector("#viewIn");
      const viewOutElement = document.querySelector("#viewOut");
      const panoElement = panorama.current;
      viewer = new Marzipano.Viewer(panoElement, viewerOpts);
      const onMouseUp = (e: any) => {
        lastSceneFrame = {
          yaw: viewer?.view()?._yaw,
          pitch: viewer?.view()?._pitch,
          fov: viewer?.view()?._fov,
        };
        setSceneFrame({
          yaw: lastSceneFrame.yaw,
          pitch: lastSceneFrame.pitch,
          fov: lastSceneFrame.fov,
        });

        const yawToSet = lastSceneFrame.yaw;
        const pitchToSet = lastSceneFrame.pitch;
        if (!sceneTourData) {
          if (yawToSet) {
            setLastYaw(lastSceneFrame.yaw);
          }
          if (pitchToSet) {
            setLastPitch(lastSceneFrame.pitch);
          }
        }
        setFastModeDirection(undefined);
      };
      const onContextMenu = (e: any) => {
        const view = viewer.view();
        markSceneFromScreenLocation(view, e.clientX, e.clientY);
      };

      (panoElement as unknown as HTMLElement).addEventListener(
        "mouseup",
        onMouseUp
      );
      (panoElement as unknown as HTMLElement).addEventListener(
        "touchend",
        onMouseUp
      );
      (panoElement as unknown as HTMLElement).addEventListener(
        "contextmenu",
        onContextMenu
      );
      if (!mobileMode && !isNil(viewInElement) && !isNil(viewOutElement)) {
        const controls = viewer.controls();
        controls.registerMethod(
          "inElement",
          new Marzipano.ElementPressControlMethod(
            viewInElement,
            "zoom",
            -velocity,
            friction
          ),
          true
        );
        controls.registerMethod(
          "outElement",
          new Marzipano.ElementPressControlMethod(
            viewOutElement,
            "zoom",
            velocity,
            friction
          ),
          true
        );
      }

      panoScenes.current = scenes.map((data) => {
        const { id, initialViewParameters, levels, faceSize } = data;
        const source = Marzipano.ImageUrlSource.fromString(
          urlPrefix + "/" + id + "/{z}/{f}/{y}/{x}.jpg",
          { cubeMapPreviewUrl: urlPrefix + "/" + id + "/preview.jpg" }
        );
        const limiter = Marzipano.RectilinearView.limit.traditional(
          5 * faceSize,
          (100 * Math.PI) / 180,
          (120 * Math.PI) / 180
        );
        const view = new Marzipano.RectilinearView(
          initialViewParameters,
          limiter
        );
        const geometry = new Marzipano.CubeGeometry(levels);

        const scene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
          pinFirstLevel: !shouldLazyLoad(scenes.length, mobileMode),
        });

        return {
          data,
          scene,
          view,
        };
      });

      let idToIndexMap = new Map<string, number>();
      panoScenes.current.forEach((scene, index) =>
        idToIndexMap.set(scene.data.id, index)
      );
      lastSceneIdToSceneIndexMap = idToIndexMap;
      setSceneIdToSceneIndexMap(new Map(idToIndexMap));

      const dataLinks: DataLink[] = [];
      panoScenes.current.forEach((panoScene) => {
        const { data } = panoScene;
        const sceneId = panoScene.data.id;

        data.linkHotspots.forEach((hotspot, index) => {
          dataLinks.push({
            hotspot: { ...hotspot, id: `${sceneId}_${index}` },
            sceneId: sceneId,
          });
        });
      });

      setDataLinks([...dataLinks]);

      const sceneToSwitch = selectedScene
        ? selectedScene
        : { sceneId: "0", yaw: 0, pitch: 0, fov: undefined };
      if (sceneToSwitch.sceneId === lastSceneId) {
        sceneToSwitch.yaw = lastSceneFrame?.yaw || sceneToSwitch.yaw;
        sceneToSwitch.pitch = lastSceneFrame?.pitch || sceneToSwitch.pitch;
        sceneToSwitch.fov = lastSceneFrame?.fov || sceneToSwitch.fov;
      }

      const scene = doesSceneIdExist(sceneToSwitch.sceneId)
        ? panoScenes.current[idToIndexMap.get(sceneToSwitch.sceneId) || 0]
        : panoScenes.current[0];
      switchScene(
        scene,
        sceneToSwitch.yaw,
        sceneToSwitch.pitch,
        sceneToSwitch.fov
      );

      return () => {
        panoScenes.current = [];
        (panoElement as unknown as HTMLElement).removeEventListener(
          "mouseup",
          onMouseUp
        );
        (panoElement as unknown as HTMLElement).removeEventListener(
          "touchend",
          onMouseUp
        );
        (panoElement as unknown as HTMLElement).removeEventListener(
          "contextmenu",
          onContextMenu
        );
        if (viewer) {
          viewer.destroy();
        }
      };
    }, [
      data,
      dataUrl,
      mouseViewMode,
      scenes,
      setFastModeDirection,
      setLastYaw,
      //selectedScene, DO NOT! include selected scene in dependencies !
      // switchScene,
    ]);

    useEffect(() => {
      if (sceneTourData) {
        if (anchorScene) {
          const { sceneId } = anchorScene;
          if (sceneId !== lastSceneId && sceneId) {
            lastSceneId = sceneId;
            onSceneClick(sceneId, lastYaw);
          }
        }
      } else if (currentScene) {
        const { sceneId } = currentScene;
        if (sceneId !== lastSceneId) {
          lastSceneId = sceneId;
          onSceneClick(sceneId, lastYaw);
        }
      }
    }, [anchorScene, currentScene, lastYaw]);

    useEffect(() => {
      if (openCommentForm && commentDialogMode === "EDIT") {
        const commentToUpdate = comments.find(
          (c) => c.id === lastSelectedComment?.id
        );
        if (commentToUpdate) {
          setLastSelectedComment(commentToUpdate);
        }
      }
    }, [comments, commentDialogMode, lastSelectedComment, openCommentForm]);

    const getSceneId = useCallback(() => {
      return sceneBasicDetails.find((i) => i.name === sceneName)?.id || "";
    }, [sceneBasicDetails, sceneName]);

    const onShareClicked = useCallback(() => {
      const sceneIdStr = getSceneId();
      return getFullTourUrl(sceneFrame, dataUrl, sceneIdStr);
    }, [getSceneId, dataUrl, sceneFrame]);

    const onListClicked = useCallback(async () => {
      analyticsEvent(
        "Tour",
        "Tasks List Opened",
        loggedUser.username || client || NA
      );
      setOpenList(true);
    }, [loggedUser.username, client]);

    const onToggleTitleBar = useCallback(() => {
      analyticsEvent(
        "Tour",
        "Tour TitleBar Switched",
        loggedUser.username || client || NA
      );
      lastTitleOpened = !openTitle;
      setOpenTitle(lastTitleOpened);
    }, [loggedUser.username, openTitle, client]);

    const tourTitle = useMemo<string>(() => {
      let clickedCellDataStorage = getSessionStorageItem("ClickedCellData");
      let existsManualBuilding = undefined;
      let existsManualFloor = undefined;
      let { building, floor } = getProjectDetailsFromDataUrl(dataUrl);
      floor = getFloorName(floor);
      if (manualBuilding) {
        existsManualBuilding = {
          name: manualBuilding,
          floors: [],
        };
      }
      if (manualFloor) {
        existsManualFloor = {
          name: manualFloor,
          areas: [],
        };
      }
      return getTourDisplayName(
        "Plan",
        clickedCellDataStorage && clickedCellDataStorage.Date !== ""
          ? clickedCellDataStorage.Date
          : currentDate,
        currentProject,
        clickedCellDataStorage && clickedCellDataStorage.Area.building !== ""
          ? clickedCellDataStorage.Area.building
          : currentBuilding ?? existsManualBuilding ?? building,
        clickedCellDataStorage && clickedCellDataStorage.Area.floor !== ""
          ? clickedCellDataStorage.Area.floor
          : currentFloor ?? existsManualFloor ?? floor
      );
    }, [
      currentArea,
      currentBuilding,
      currentFloor,
      currentDate,
      currentProject,
      manualBuilding,
      manualFloor,
      dataUrl,
    ]);

    useEffect(() => {
      if (dataUrl !== lastDataUrl) {
        lastDataUrl = dataUrl;
        lastSceneId = undefined;
        lastSceneFrame = undefined;
      }
    }, [dataUrl]);

    const imageCallback = useCallback((canvasBlob: any) => {
      setBlob(canvasBlob);
    }, []);

    const handleDrawingClose = useCallback(() => {
      setBlob(null);
    }, []);

    const panoStyle = useMemo(
      () => ({
        cursor: "context-menu",
        filter: `brightness(${panoBrightness}%) saturate(${panoSaturate}%) contrast(${panoContrast}%)`,
      }),
      [panoBrightness, panoSaturate, panoContrast]
    );

    return (
      <React.Fragment>
        <Header text={sceneName} tourMode={!!client} show={!client} />
        <SideBar
          sceneDetails={sceneBasicDetails}
          onSceneClick={onSceneClick}
          tokenStatus={tokenStatus}
        />
        {!sceneTourData && (
          <ShareSpeedDial
            onShareClick={onShareClicked}
            projectLocation={tourTitle}
            comments={comments}
            imageCallback={imageCallback}
          />
        )}
        {!sceneTourData && !mobileMode ? (
          <Tooltip
            disableInteractive
            title={"zoom out"}
            placement={"left"}
            enterDelay={400}
            enterNextDelay={400}
          >
            <Fab
              variant="extended"
              color="primary"
              id="viewOut"
              aria-label="zoom out"
              size="small"
              className={classes.decreaseFab}
              onClick={() => {
                analyticsEvent(
                  "Tour",
                  "Pano Zoom Out",
                  loggedUser.username || client || NA
                  // dataUrl
                );
              }}
            >
              <ZoomOutIcon />
            </Fab>
          </Tooltip>
        ) : (
          <div />
        )}
        {!sceneTourData && !mobileMode ? (
          <Tooltip
            disableInteractive
            title={"zoom in"}
            placement={"left"}
            enterDelay={400}
            enterNextDelay={400}
          >
            <Fab
              variant="extended"
              color="primary"
              size="small"
              id="viewIn"
              aria-label="zoom in"
              className={classes.increaseFab}
              onClick={() => {
                analyticsEvent(
                  "Tour",
                  "Pano Zoom In",
                  loggedUser.username || client || NA
                  // dataUrl
                );
              }}
            >
              <ZoomInIcon />
            </Fab>
          </Tooltip>
        ) : (
          <div />
        )}
        {!sceneTourData && (
          <Tooltip
            disableInteractive
            title={"comments"}
            placement={"left"}
            enterDelay={400}
            enterNextDelay={400}
          >
            <Fab
              variant="extended"
              color="primary"
              id="List"
              size="small"
              aria-label="comments"
              className={classes.listFab}
              onClick={onListClicked}
            >
              <FormatListNumberedIcon />
            </Fab>
          </Tooltip>
        )}
        {!mobileMode && !preventFastMode && !sceneTourData && (
          <FastMode
            currentIndex={lastSceneIndex}
            higherIndex={panoScenes.current.length - 1}
            actionOnIndex={switchSceneByIndex}
            getTargetsForHotspotByIndexes={getTargetsForHotspotByIndexes}
            getCurrentDirection={getCurrentDirectionByIndex}
            setFastModeDirection={setFastModeDirection}
          />
        )}
        {!sceneTourData && (
          <Tooltip
            disableInteractive
            title={"Enhance current view"}
            placement={"right"}
            enterDelay={400}
            enterNextDelay={400}
          >
            <IconButton
              color="secondary"
              size="small"
              aria-label="filters"
              className={
                mobileMode
                  ? classes.brightnessIconMobile
                  : classes.brightnessIcon
              }
              onClick={handleFiltersClick}
            >
              <HighlightIcon />
            </IconButton>
          </Tooltip>
        )}
        <div
          onContextMenu={handleMenuClick}
          style={panoStyle}
          className="pano-container"
          {...longPress}
          ref={panorama}
        >
          {panoScenes.current.length !== 0 ? (
            <CommentsHotspotsLayer
              commentsList={comments}
              onHotspotClick={triggerEditComment}
              scenes={panoScenes}
              sceneIdToSceneIndexMap={sceneIdToSceneIndexMap}
            />
          ) : (
            <div />
          )}
          {panoScenes.current.length !== 0 && (
            <LinksHotspotsLayer
              linksList={userLinks}
              dataLinksList={dataLinks}
              userSceneNames={userSceneNames}
              onHotspotClick={switchSceneById}
              onContextMenuClick={triggerEditLink}
              scenes={panoScenes}
              sceneIdToSceneIndexMap={sceneIdToSceneIndexMap}
            />
          )}
          <PanoMenu
            handleClose={handleMenuClose}
            pressedScreen={mousePosition}
            triggerCommentForm={triggerCommentForm}
          />
        </div>
        <Suspense fallback={null}>
          {!blob ? (
            <span />
          ) : (
            <DrawingDialog
              handleClose={handleDrawingClose}
              open={!!blob}
              blob={blob}
            />
          )}
          {!tourOnly && data.scenes.length !== 0 && !!dataUrl && (
            <PlanMap
              hide={tourOnly}
              initialOpened={!mobileMode}
              switchSceneById={switchSceneById}
            />
          )}
          {openList && (
            <CommentsListDialog
              open={openList}
              commentList={comments}
              onCommentSelected={switchSceneById}
              triggerEditComment={triggerEditComment}
              handleClose={handleCloseList}
            />
          )}
          {openCommentForm && (
            <CommentDialog
              open={openCommentForm}
              handleClose={handleCloseComment}
              scene={{ ...sceneFrame, sceneId: getSceneId() }}
              lastSelectedComment={lastSelectedComment}
              mode={commentDialogMode}
              preventShowingPlan
            />
          )}
          {!!filterAnchor && !sceneTourData && (
            <div>
              <PanoFilters
                onBrightnessChange={handleBrightnessChange}
                onSaturateChange={handleSaturateChange}
                onContrastChange={handleContrastChange}
                anchorEl={filterAnchor}
                changePanoFiltersVisible={handleFiltersClick}
                panoBrightness={panoBrightness}
                panoSaturate={panoSaturate}
                panoContrast={panoContrast}
              />
            </div>
          )}
        </Suspense>

        <TitleBar
          title={tourTitle}
          onToggle={onToggleTitleBar}
          open={openTitle}
        />
      </React.Fragment>
    );
  }
);
export default Pano;
