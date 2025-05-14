import * as React from "react";
import {
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import OpenSeaDragon, { Point, Rect } from "openseadragon";
import { createStyles, makeStyles } from "@mui/styles";
import PlanAnnotations from "../plan-annotations/PlanAnnotations";
import {
  getQueryArgs,
  getQueryArgsFromUrl,
  setOrReplaceSearchParams,
} from "../../../utils/query-params";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { useHistory } from "react-router-dom";
import { Fab, IconButton, Tooltip, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  analyticsError,
  analyticsEvent,
  analyticsPlanActions,
} from "../../../utils/analytics";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { scrollToTop } from "../../../utils/scroll-utils";
import { Comment, PhotoRecord, PlanLinks, ScanRecord } from "../../../models";
import { TitleBar } from "../../title-bar/TitleBar";
import {
  getShortPlanTitle,
  getTourDisplayName,
} from "../../../utils/display-names-utils";
import { InitialPointSelector } from "../initial-point-selector/InitialPointSelector";
import {
  CreatePhotoTourPointsInput,
  CreatePlanInitialPointInput,
} from "../../../API";
import { API, graphqlOperation } from "aws-amplify";
import {
  createPhotoTourPoints,
  createPlanInitialPoint,
  publishPhotoLink,
  sendEmail,
  updatePlanInitialPoint,
} from "../../../graphql/mutations";
import { HideAnnotationsButton } from "./HideAnnotationsButton";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { getPlanInitialPoint } from "../../../graphql/queries";
import {
  getArea,
  getBuilding,
  getFilePath,
  getFloorName,
  getProjectDetailsFromPlanUrl,
  getSessionStorageItem,
  initialPointKey,
  is3DTour,
  projectNameFromUrl,
} from "../../../utils/projects-utils";
import { dateAsDMY, dateAsHMS, dateAsYMD } from "../../../utils/date-utils";
import { LongPressDetectEvents, useLongPress } from "use-long-press";
import { ToggleBim } from "../bim/toggle-bim/ToggleBim";
import { showMessage } from "../../../utils/messages-manager";
import { ShareSpeedDial } from "../../panorama/share/ShareSpeedDial";
import { NA } from "../../../utils/clients";
import { emptyArray, emptyFn, emptyMap } from "../../../utils/render-utils";
import {
  sendRecord,
  sendSelectedProject,
  webViewMode,
} from "../../../utils/webview-messenger";
import {
  initialScreenLocation,
  ScreenLocation,
} from "../../menu-layout/MenuLayout";
import { PlanMenu } from "../plan-menu/PlanMenu";
import { PublishPhotoTour } from "../../photo-documentation/PublishPhotoTour";
import {
  deleteStorageKeyValue,
  getStorageKeyValue,
  setStorageKeyValue,
} from "../../../utils/storage-manager";
import {
  OrderedPhotoRecord,
  OSDLocation,
  StaticPlanAnnotationDef,
} from "../plan-annotations/PlanAnnotationsTypes";
import ThreeDRotationIcon from "@mui/icons-material/ThreeDRotation";
import { AreaSelector } from "../../area-selector/AreaSelector";
import theme from "../../../ui/theme";
import { ActivityWithAnchor } from "../../activity-progress/ActivityProgressModels";
import { ItemTypeEnum } from "../../../models";
const VideoDialog = lazy(
  () => import("../../dialogs/video-dialog/VideoDialog")
);
const PlanCompare = lazy(() => import("../plan-compare/PlanCompare"));
const FloatingDialog = lazy(
  () => import("../../dialogs/floating-dialog/FloatingDialog")
);

const CommentDialog = lazy(
  () => import("../../dialogs/comment-dialog/CommentDialog")
);
const DrawingDialog = lazy(() => import("../../drawing-dialog/DrawingDialog"));
const StaticPlanAnnotations = lazy(
  () => import("../plan-annotations/StaticPlanAnnotations")
);
const PhotoUploadDialog = lazy(
  () => import("../../photo-documentation/PhotoUploadDialog")
);
const ImageDialog = lazy(
  () => import("../../dialogs/image-dialog/ImageDialog")
);

const useStyles = makeStyles((theme) =>
  createStyles({
    embeddedContainer: {
      paddingTop: "29px",
      marginTop: "-29px",
      height: "100%",
    },
    planContainer: {
      paddingTop: theme.spacing(5),
      height: "100%",
    },
    planContainerMobile: {
      height: "100%",
    },
    planDzi: {
      height: "100%",
      width: "100%",
      backgroundColor: "white",
    },
    planBar: {
      margin: theme.spacing(1),
      position: "fixed",
      display: "inline",
      bottom: theme.spacing(1),
      left: "7px",
      zIndex: 1000,
      whiteSpace: "nowrap",
    },
    threeDView: {
      position: "fixed",
      top: theme.spacing(10),
      right: theme.spacing(2),
    },
    exitFab: {
      position: "fixed",
      top: theme.spacing(10),
      left: theme.spacing(2),
    },
  })
);

const photoTourId = (planUrl: string) =>
  dateAsYMD() + dateAsHMS() + "_" + planUrl;

const onShareClicked = () => window.location.href;

const sceneForPlanComment = { sceneId: "0", yaw: 0, pitch: 0, fov: 0 };

let lastPlan: string = "";
let lastRect: Rect | undefined;
let lastTitleOpened = true;
let manuallyChangedTitle = false;
const inWebViewMode = webViewMode();

let linkId = getQueryArgs("linkId");

function notifyOnPointFromProject(projectId: string) {
  if (inWebViewMode) {
    sendSelectedProject(projectId);
    setStorageKeyValue("SELECTED_PROJECT", projectId);
  }
}

function getOSDPointsFromScreen(
  viewer: OpenSeaDragon.Viewer | undefined,
  pressedX: number,
  pressedY: number,
  aspectRatio: number
): OSDLocation {
  const OSDPoint = viewer?.viewport.pointFromPixel(
    new Point(pressedX, pressedY)
  );
  const leftLocation = OSDPoint?.x || 0.5;
  const topLocation = (OSDPoint?.y || 0.5) / aspectRatio;
  return { leftLocation, topLocation };
}

let executeMatching = false;

export interface PlanViewerProps {
  scale: number;
  plan: string;
  planLinks?: PlanLinks;
  embeddedMode?: boolean;
  sceneIdToNumberOfComments: Map<string, number>;
  sceneIdToDefaultComment: Map<string, Comment>;
  formViewMode?: boolean;
  hasBim?: boolean;
  toggleBimMode?: () => void;
  subscribeToPlanLocation?: (
    state: ScanRecord,
    rotation: number,
    aspectRatio: number
  ) => void;
  onMatchImageToPlan?: (leftLocation: number, topLocation: number) => void;
  staticPlanAnnotationDef?: StaticPlanAnnotationDef;
  anchorsStatuses?: ActivityWithAnchor[];
  progressMode?: boolean;
  handleMapClose?: () => void;
  onPointClick?: (record: OrderedPhotoRecord, index: number) => void;
  openSeaDragonId?: string;
  overlayId?: string;
  dziImageId?: string;
  splitScreenLeft?: boolean;
  splitScreenRight?: boolean;
  selectedImageUrl?: string;
  switchSceneById?: (
    id?: string,
    yaw?: number,
    pitch?: number,
    fov?: number
  ) => void;
}

const PlanViewer: React.FC<PlanViewerProps> = ({
  scale,
  plan,
  planLinks,
  embeddedMode = false,
  sceneIdToNumberOfComments,
  sceneIdToDefaultComment = emptyMap,
  formViewMode = false,
  toggleBimMode = emptyFn,
  subscribeToPlanLocation,
  onMatchImageToPlan,
  hasBim = false,
  staticPlanAnnotationDef,
  anchorsStatuses,
  progressMode = false,
  handleMapClose,
  onPointClick,
  openSeaDragonId = "openSeaDragon",
  overlayId,
  dziImageId,
  splitScreenLeft = false,
  splitScreenRight = false,
  selectedImageUrl,
  switchSceneById,
}) => {
  const classes = useStyles();
  const [currentPlanLinks, setCurrentPlanLinks] = useState(planLinks);
  const [viewer, setViewer] = useState<OpenSeadragon.Viewer | undefined>();
  const [hideAnnotations, setHideAnnotations] = useState<boolean>(false);
  const [tileImageLoaded, setTileImageLoaded] = useState(false);
  const [reportFormOpened, setReportFormOpened] = useState(false);
  const [scanRecord, setScanRecord] = useState<ScanRecord | undefined>();
  const [photoRecords, setPhotoRecords] = useState<PhotoRecord[]>([]);
  const [pressedX, setPressedX] = useState<number>(0);
  const [pressedY, setPressedY] = useState<number>(0);
  const [zoomImageUrl, setZoomImageUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [indexPlanImage, setIndexPlanImage] = useState(0);
  const [openUploadImage, setOpenUploadImage] = useState<boolean>(false);
  const [showPublishButton, setShowPublishButton] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  //Definition for drawing form
  const [blob, setBlob] = useState(null);

  const {
    currentDate,
    currentProject,
    currentBuilding,
    currentFloor,
    currentArea,
    pastDate,
    setPastDate,
    setCurrentScene,
    setCurrentTour,
    currentTour,
    client,
    clientComment,
  } = useContext(ProjectInformationContext);
  let sceneTourData = getSessionStorageItem("SceneTourData");
  const is3D = is3DTour(currentTour);
  const { loggedUser } = useContext(LoggedUserContext);
  let history = useHistory();
  const longPressCallback = useCallback((e: any) => {
    if (!embeddedMode) {
      e.preventDefault();
      e.stopPropagation();
      setPressedX(e.targetTouches[0].clientX - 10);
      setPressedY(e.targetTouches[0].clientY - 10);
      setInitialPointSelectorOpen(true);
    }
  }, []);
  useEffect(() => {
    if (selectedImageUrl) setZoomImageUrl(selectedImageUrl);
  }, []);

  const longPress = useLongPress(longPressCallback, {
    cancelOnMovement: true,
    captureEvent: true,
    detect: LongPressDetectEvents.TOUCH,
  });

  const [initialPointSelectorOpen, setInitialPointSelectorOpen] =
    React.useState(false);

  const [mousePosition, setMousePosition] = useState(initialScreenLocation);

  const rotation = viewer?.viewport.getRotation() || 0;
  const pdfContentDimensions = viewer?.world.getItemAt(0)?.getContentSize();
  const aspectRatio = pdfContentDimensions
    ? pdfContentDimensions.y / pdfContentDimensions.x
    : 1;

  const togglePlanCompare = useCallback(
    (dateToCompare: string, fileName: string) => {
      if (pastDate !== dateToCompare) {
        setSelectedFileName(fileName);
        setPastDate(dateToCompare);
        setIsCompareMode(true);
      }
    },
    [selectedFileName, pastDate, isCompareMode]
  );

  const handleMenuClose = useCallback(() => {
    setMousePosition(initialScreenLocation);
  }, []);

  const onMatchScreenLocation = useCallback(
    (mousePosition: ScreenLocation) => {
      const { leftLocation, topLocation } = getOSDPointsFromScreen(
        viewer,
        mousePosition.mouseX || 0,
        mousePosition.mouseY || 0,
        aspectRatio
      );
      onMatchImageToPlan && onMatchImageToPlan(leftLocation, topLocation);
      handleMenuClose();
    },
    [viewer, aspectRatio, onMatchImageToPlan, handleMenuClose]
  );

  useEffect(() => {
    if (executeMatching) {
      onMatchScreenLocation && onMatchScreenLocation(mousePosition);
      executeMatching = false;
    }
  }, [mousePosition, onMatchScreenLocation]);

  const handleMenuClick = (event: any) => {
    if (mobileMode || embeddedMode) return;
    event.preventDefault();
    event.stopPropagation();
    const mouseX = (event.clientX || event.targetTouches[0].clientX) - 6;
    const mouseY = (event.clientY || event.targetTouches[0].clientY) - 50;
    onMatchImageToPlan && (executeMatching = true);
    setMousePosition({
      mouseX,
      mouseY,
    });
    setPressedX(mouseX);
    setPressedY(mouseY);
  };

  const handleOpenInitialPoint = useCallback(() => {
    setInitialPointSelectorOpen(true);
    const planWidthDivisionFactor = !subscribeToPlanLocation ? 2 : 4 / 3;
    setPressedX(window.innerWidth / planWidthDivisionFactor - 25);
    setPressedY(window.innerHeight / 2 - 25);
  }, [subscribeToPlanLocation]);

  const handleCloseInitialPoint = useCallback(() => {
    setInitialPointSelectorOpen(false);
  }, [setInitialPointSelectorOpen]);

  let mobileMode = useMediaQuery("(max-width: 1224px)", { noSsr: true });

  const [titleOpened, setTitleOpened] = useState(lastTitleOpened);

  useEffect(() => {
    if (!manuallyChangedTitle) {
      setTitleOpened(!mobileMode && lastTitleOpened);
    }
  }, [mobileMode]);

  const onToggleTitle = useCallback(() => {
    analyticsEvent(
      "Plan",
      "Plan TitleBar Switched",
      loggedUser.username || client || NA
    );
    lastTitleOpened = !titleOpened;
    setTitleOpened(lastTitleOpened);
    manuallyChangedTitle = true;
  }, [loggedUser.username, titleOpened, client]);

  scrollToTop();

  if (!history.location.search && !formViewMode) {
    let paramsNames = ["pdf", "scale", "date"];
    let paramsValues = [plan, scale.toString(), currentDate];

    if (client) {
      paramsNames.push("client");
      paramsValues.push(client);
    }
    if (clientComment) {
      paramsNames.push("clientComment");
      paramsValues.push(clientComment);
    }

    const urlWithParams = `${
      history.location.pathname
    }?${setOrReplaceSearchParams("", paramsNames, paramsValues)}`;
    history.replace(urlWithParams);
  }

  useEffect(() => {
    return () => {
      setTileImageLoaded(false);
      if (viewer) {
        viewer.clearOverlays();
        viewer.world.resetItems();
      }
    };
  }, [viewer]);

  useEffect(() => {
    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, []);

  useEffect(() => {
    setCurrentPlanLinks(planLinks);
  }, [planLinks]);

  const initOpenSeadragon = useCallback(() => {
    if (plan !== lastPlan) {
      lastRect = undefined;
    }
    if (viewer) {
      const openseadragonContainers = document.querySelectorAll(
        "div.openseadragon-container"
      );
      openseadragonContainers.forEach((container) => container.remove());
    }
    const viewerToSet = OpenSeaDragon({
      id: openSeaDragonId,
      prefixUrl: "openseadragon-images/",
      animationTime: 0.85,
      blendTime: 0.1,
      constrainDuringPan: false,
      maxZoomPixelRatio: 3,
      minZoomLevel: 1,
      showRotationControl: true,
      showFullPageControl: false,
      zoomPerClick: anchorsStatuses ? 1 : 1.4,
      zoomPerScroll: 1.1,
      tileSources: plan,
      visibilityRatio: 0.9,
      timeout: 60000,
      defaultZoomLevel: 1.5,
      gestureSettingsTouch: {
        scrollToZoom: false,
      },
      navigationControlAnchor: OpenSeaDragon.ControlAnchor.BOTTOM_RIGHT,
      showNavigationControl: !mobileMode || embeddedMode,
    });
    viewerToSet.addHandler("tile-loaded", () => {
      setTileImageLoaded(true);
    });
    viewerToSet.addHandler("open-failed", (error) => {
      let el = document.querySelector(".openseadragon-message") as HTMLElement;
      if (el) {
        el.textContent =
          "no connectivity, you can't display the plan, but you can still mark the location with the plus button";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.textAlign = "center";
      }
      setTileImageLoaded(false);
    });
    if (lastRect) {
      viewerToSet.addHandler("open", () => {
        viewerToSet.viewport.fitBounds(lastRect as Rect, true);
      });
    }

    setViewer(viewerToSet);
    lastPlan = plan;
  }, [plan, mobileMode, embeddedMode]);

  const handleSceneClick = useCallback(
    (url: string) => {
      const analyticsAction: analyticsPlanActions = embeddedMode
        ? "Plan Map Annotation Link Clicked"
        : "Plan Annotation Link Clicked";
      analyticsEvent(
        "Plan",
        analyticsAction,
        loggedUser.username || client || NA
      );
      lastRect = viewer?.viewport.getBounds();
      let lastScene = getQueryArgsFromUrl(url, "sceneId", 0);
      let lastTour = getQueryArgsFromUrl(url, "dataUrl");
      if (!sceneTourData) {
        setCurrentTour(lastTour);
        const sceneDefaultComment = sceneIdToDefaultComment.get(lastScene);
        if (sceneDefaultComment) {
          setCurrentScene({
            sceneId: lastScene,
            yaw: sceneDefaultComment.scene.yaw,
            pitch: sceneDefaultComment.scene.pitch,
            fov: sceneDefaultComment.scene.fov,
          });
        } else {
          setCurrentScene({ sceneId: lastScene });
        }
      } else {
        switchSceneById && switchSceneById(lastScene);
      }

      if (!embeddedMode) {
        history.push("/tour");
      }
    },
    [
      history,
      setCurrentTour,
      setCurrentScene,
      viewer,
      loggedUser.username,
      client,
      sceneIdToDefaultComment,
      embeddedMode,
      switchSceneById,
    ]
  );

  useEffect(() => {
    if (linkId && linkId !== -1 && planLinks && planLinks !== null) {
      const planLinkUrl = planLinks.linkLocations[linkId]?.linkUrl;
      linkId = undefined;
      planLinkUrl && handleSceneClick(planLinkUrl);
    }
  }, [planLinks, handleSceneClick]);

  const onTogglePlanLinks = () => {
    analyticsEvent(
      "Plan",
      hideAnnotations ? "Show Plan Annotations" : "Hide Plan Annotations",
      loggedUser.username || client || NA
      // plan
    );
    setHideAnnotations(!hideAnnotations);
  };

  const linkLocationsFiltered = planLinks?.linkLocations?.filter(
    (loc) => loc.linkItemType == "IMAGE_PLAIN_ZOOMABLE"
  );

  const onZoomImageClick = useCallback(
    (linkUrl: string, indexSelector: number) => {
      const analyticsAction: analyticsPlanActions = embeddedMode
        ? "Plan Map Annotation Link Clicked Normal Image"
        : "Plan Annotation Link Clicked Normal Image";
      analyticsEvent(
        "Plan",
        analyticsAction,
        loggedUser.username || client || NA
      );
      setIndexPlanImage(1000);
      setZoomImageUrl(linkUrl);
    },
    [embeddedMode, loggedUser.username, client]
  );

  const onVideoClick = useCallback(
    (linkUrl: string, indexSelector: number) => {
      const analyticsAction: analyticsPlanActions = embeddedMode
        ? "Plan Map Annotation Link Clicked Video"
        : "Plan Annotation Link Clicked Video";
      analyticsEvent(
        "Plan",
        analyticsAction,
        loggedUser.username || client || NA
      );
      setVideoUrl(linkUrl);
    },
    [embeddedMode, loggedUser.username, client]
  );

  const onUploadImageClick = () => {
    setOpenUploadImage(true);
  };

  const handleZoomImageClose = () => setZoomImageUrl("");
  const handleVideoClose = () => setVideoUrl("");

  const handleUploadImageClose = useCallback(() => {
    setOpenUploadImage(false);
    handleMenuClose();
  }, [handleMenuClose]);

  const moveImageToDirection = (direction: boolean) => {
    const analyticsAction: analyticsPlanActions =
      "Plan Zoomable Image Paginated";
    analyticsEvent(
      "Plan",
      analyticsAction,
      loggedUser.username || client || NA
    );
    let newIndex = indexPlanImage + (direction ? 1 : -1);
    if (linkLocationsFiltered) {
      if (newIndex < 0) {
        newIndex = linkLocationsFiltered.length - 1;
      } else if (newIndex >= linkLocationsFiltered.length) {
        newIndex = 0;
      }
      setIndexPlanImage(newIndex);
      setZoomImageUrl(linkLocationsFiltered[newIndex].linkUrl);
    }
  };

  const handleSelectImage = (linkUrl: string) => {
    setIndexPlanImage(
      linkLocationsFiltered?.findIndex((loc) => loc.linkUrl === linkUrl) ?? 0
    );
    setZoomImageUrl(linkUrl);
  };

  const planTitle = useMemo(() => {
    let { building, floor } = getProjectDetailsFromPlanUrl(plan);
    floor = getFloorName(floor);
    let ClickedCellDataStorage = getSessionStorageItem("ClickedCellData");
    return getTourDisplayName(
      "Plan",
      ClickedCellDataStorage ? ClickedCellDataStorage.Date : currentDate,
      currentProject,
      ClickedCellDataStorage
        ? ClickedCellDataStorage.Area.building
        : currentBuilding
        ? currentBuilding
        : building,
      ClickedCellDataStorage
        ? ClickedCellDataStorage.Area.floor
        : currentFloor
        ? currentFloor
        : floor
    );
  }, [
    currentArea,
    currentBuilding,
    currentFloor,
    currentDate,
    currentProject,
    plan,
  ]);

  useEffect(() => {
    initOpenSeadragon();
  }, [initOpenSeadragon]);

  const getScanRecord = useCallback((): ScanRecord => {
    const { leftLocation, topLocation } = getOSDPointsFromScreen(
      viewer,
      pressedX,
      pressedY,
      aspectRatio
    );
    const { building, floor } = getProjectDetailsFromPlanUrl(plan);
    return {
      leftLocation,
      topLocation,
      username: loggedUser.username,
      building: currentBuilding?.name || building || "",
      floor: currentArea?.name || floor || "",
      planUrl: plan,
      recordDate: dateAsHMS(),
    };
  }, [
    viewer,
    aspectRatio,
    pressedX,
    pressedY,
    loggedUser.username,
    plan,
    currentBuilding,
    currentArea,
  ]);

  let updatedScanRecordWithIndex: ScanRecord[] = emptyArray;

  const pushRecordOnIndex = (
    scanRecordsArray: ScanRecord[],
    record: ScanRecord
  ) => {
    const indexToAddBefore = Number(getStorageKeyValue("INDEX_TO_ADD_BEFORE"));
    let ifIndexPushed = false;
    updatedScanRecordWithIndex = [];
    scanRecordsArray.forEach((item: ScanRecord, index: number) => {
      if (index === indexToAddBefore) {
        scansSavedOnOffline();
        updatedScanRecordWithIndex.push(record);
        ifIndexPushed = true;
      }
      updatedScanRecordWithIndex.push(item);
    });

    if (!ifIndexPushed) {
      scansSavedOnOffline();
      updatedScanRecordWithIndex.push(record);
    }
  };

  const scansSavedOnOffline = () => {
    const savedOfflineValue = getStorageKeyValue("SCAN_SAVED_OFFLINE");
    if (savedOfflineValue !== undefined && savedOfflineValue !== null) {
      const savedOfflineValueArr = JSON.parse(savedOfflineValue);
      savedOfflineValueArr.forEach((element: ScanRecord) => {
        updatedScanRecordWithIndex.push(element);
      });
      deleteStorageKeyValue("SCAN_SAVED_OFFLINE");
      deleteStorageKeyValue("PROJECT_NAME_OF_SCANS_SAVED_OFFLINE");
    }
  };
  const onPlanStateSaved = subscribeToPlanLocation
    ? () => {
        const recordToAdd = getScanRecord();
        subscribeToPlanLocation(recordToAdd, rotation, aspectRatio);
      }
    : undefined;

  const onLocationSaved = useCallback(async () => {
    const currentTime = new Date().getTime();
    const timeInLocalStorage = getStorageKeyValue("ADD_SCAN_TIME");
    const projectFromUrl = projectNameFromUrl(plan);
    const projectName = currentProject?.id || projectFromUrl;

    let initialKey =
      Number(currentTime) < Number(timeInLocalStorage) &&
      getStorageKeyValue("CURRENT_PROJECT")
        ? getStorageKeyValue("CURRENT_PROJECT")
        : initialPointKey(projectName);

    try {
      const lastInitialPoint: any = await API.graphql({
        query: getPlanInitialPoint,
        variables: { id: initialKey },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });

      updatedScanRecordWithIndex = [];
      const recordToAdd = getScanRecord();

      if (Number(currentTime) < Number(timeInLocalStorage)) {
        pushRecordOnIndex(
          lastInitialPoint.data.getPlanInitialPoint.scanRecords,
          recordToAdd
        );
      } else {
        deleteStorageKeyValue("ADD_SCAN_TIME");
        deleteStorageKeyValue("INDEX_TO_ADD_BEFORE");
        deleteStorageKeyValue("CURRENT_PROJECT");
      }

      if (!!lastInitialPoint.data.getPlanInitialPoint) {
        if (Number(currentTime) > Number(timeInLocalStorage)) {
          lastInitialPoint.data.getPlanInitialPoint.scanRecords.forEach(
            (item: ScanRecord) => {
              updatedScanRecordWithIndex.push(item);
            }
          );
          scansSavedOnOffline();
          updatedScanRecordWithIndex.push(recordToAdd);
        }
        await API.graphql({
          query: updatePlanInitialPoint,
          variables: {
            input: {
              id: initialKey,
              scanRecords: updatedScanRecordWithIndex,
            },
          },
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
      } else {
        scansSavedOnOffline();
        updatedScanRecordWithIndex.push(recordToAdd);
        const initialPointInput: CreatePlanInitialPointInput = {
          id: initialKey,
          matched: false,
          scanRecords: updatedScanRecordWithIndex,
        };
        await API.graphql({
          query: createPlanInitialPoint,
          variables: { input: initialPointInput },
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
      }
      showMessage(
        "Initial point saved- you can start recording the camera video",
        "success"
      );
      analyticsEvent(
        "Plan",
        "Scan Started",
        loggedUser.username || client || NA
      );
      sendRecord();
    } catch (e: any) {
      showMessage(
        "Initial point saved- you can start recording the camera video",
        "success"
      );
      const myLastRecord = getScanRecord();
      const scanSavedOfflineString = getStorageKeyValue("SCAN_SAVED_OFFLINE");
      const scanSavedOfflineArr = scanSavedOfflineString
        ? [...JSON.parse(scanSavedOfflineString)]
        : [];
      scanSavedOfflineArr.push(myLastRecord);
      setStorageKeyValue(
        "SCAN_SAVED_OFFLINE",
        JSON.stringify(scanSavedOfflineArr)
      );
      const projectNameOfScanSavedOfflineString = getStorageKeyValue(
        "PROJECT_NAME_OF_SCANS_SAVED_OFFLINE"
      );
      const projectNameOfScanSavedOfflineArr =
        projectNameOfScanSavedOfflineString
          ? [...JSON.parse(projectNameOfScanSavedOfflineString)]
          : [];
      projectNameOfScanSavedOfflineArr.push(projectName);
      setStorageKeyValue(
        "PROJECT_NAME_OF_SCANS_SAVED_OFFLINE",
        JSON.stringify(projectNameOfScanSavedOfflineArr)
      );
    } finally {
      notifyOnPointFromProject(projectName);
      API.graphql({
        query: sendEmail,
        variables: {
          to: ["tomyitav@gmail.com"],
          text: `Scan performed by: ${loggedUser.username}, in plan: ${plan}`,
          link: window.location.origin,
          subject: `Castory Developers Info`,
          templateType: "developersInfo",
        },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
    }
  }, [
    client,
    currentProject,
    getScanRecord,
    loggedUser.username,
    plan,
    updatedScanRecordWithIndex,
  ]);

  const onPhotoAdded = useCallback(
    (fileName: string) => {
      const recordToAdd = getScanRecord();
      setPhotoRecords((photoRecords) => [
        ...photoRecords,
        {
          fileName,
          topLocation: recordToAdd.topLocation,
          leftLocation: recordToAdd.leftLocation,
        },
      ]);
    },
    [getScanRecord]
  );

  function publishTourById(id: string) {
    return API.graphql(
      graphqlOperation(publishPhotoLink, {
        photoTourId: id,
      })
    );
  }

  const onPublishPhotoTour = useCallback(async () => {
    const id = photoTourId(plan);
    const { building, floor } = getProjectDetailsFromPlanUrl(plan);
    const floorToSet = currentFloor?.name
      ? currentFloor?.name
      : getFloorName(floor);
    const projectId = currentProject?.id || "";
    const input: CreatePhotoTourPointsInput = {
      id,
      area: getArea(currentArea, floorToSet),
      building: getBuilding(currentBuilding, building),
      username: loggedUser.username,
      projectId,
      filesPath: getFilePath(plan, projectId),
      date: dateAsDMY(),
      photoRecords,
    };
    try {
      await API.graphql(
        graphqlOperation(createPhotoTourPoints, {
          input,
        })
      );
      await publishTourById(id);
      analyticsEvent(
        "Plan",
        "360 image tour published",
        loggedUser.username || client || NA
      );
      showMessage(
        "Photo tour published- and will be available in a few minutes",
        "success"
      );
      setPhotoRecords([]);
    } catch (e: any) {
      showMessage("Failed to publish photo, please try again...", "error");
      analyticsError("Failed to save photo tour: " + JSON.stringify(e));
    } finally {
      API.graphql({
        query: sendEmail,
        variables: {
          to: ["tomyitav@gmail.com"],
          text: `Photo tour published by: ${loggedUser.username}, in plan: ${plan}`,
          link: window.location.origin,
          subject: `Castory Developers Info`,
          templateType: "developersInfo",
        },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
    }
  }, [
    client,
    currentArea,
    currentBuilding,
    currentFloor,
    currentProject,
    loggedUser.username,
    photoRecords,
    plan,
  ]);

  const onTourReport = useCallback(async () => {
    analyticsEvent(
      "Tasks",
      "Tasks Tour Report Form Opened",
      loggedUser.username || client || NA
    );
    setScanRecord(getScanRecord());
    setReportFormOpened(true);
  }, [getScanRecord, loggedUser.username, client]);

  const handleCloseReportForm = useCallback(() => {
    setReportFormOpened(false);
    setScanRecord(undefined);
  }, [setReportFormOpened, setScanRecord]);

  const imageCallback = useCallback((canvasBlob: any) => {
    setBlob(canvasBlob);
  }, []);

  const handleDrawingClose = useCallback(() => {
    setBlob(null);
  }, []);

  const onPhotoUploadCompleted = useCallback(
    (fileName: string) => {
      setShowPublishButton(true);
      onPhotoAdded(fileName);
    },
    [onPhotoAdded]
  );

  const onPublishById = useCallback(async () => {
    try {
      await publishTourById(staticPlanAnnotationDef!.photoTourId);
      showMessage(
        "Registration completed and will be available soon",
        "success"
      );
    } catch (e: any) {
      showMessage("Failed to register points: " + e.toString(), "error");
    }
  }, [staticPlanAnnotationDef]);

  const onPublish = staticPlanAnnotationDef
    ? onPublishById
    : () => {
        setShowPublishButton(false);
        onPublishPhotoTour();
      };
  const PplanCompare = React.useCallback(
    (props: any) => (
      <PlanCompare key={"planCompare" + pastDate} {...props}></PlanCompare>
    ),
    [pastDate]
  );

  const zoomImageIsSet = zoomImageUrl !== "";
  const videoIsSet = videoUrl !== "";
  return isCompareMode ? (
    <>
      <PplanCompare fileName={selectedFileName}></PplanCompare>
      <Tooltip
        disableInteractive
        title={"exit compare mode"}
        placement={"right"}
        enterDelay={400}
        enterNextDelay={400}
      >
        <Fab
          variant="extended"
          color="primary"
          className={classes.exitFab}
          onClick={() => {
            setPastDate("");
            history.push("/project");
          }}
          style={{
            display: isCompareMode ? "flex" : "none",
          }}
        >
          <CloseIcon />
        </Fab>
      </Tooltip>
    </>
  ) : (
    <div
      onContextMenu={handleMenuClick}
      className={
        embeddedMode
          ? classes.embeddedContainer
          : mobileMode
          ? classes.planContainerMobile
          : classes.planContainer
      }
      {...longPress}
    >
      {!anchorsStatuses && (
        <div className={classes.planBar}>
          <AreaSelector
            hide={embeddedMode || reportFormOpened}
            tour={false}
            mobileMode={mobileMode}
          />
          <ToggleBim
            toggleBimMode={toggleBimMode}
            hide={embeddedMode || reportFormOpened || (!hasBim && mobileMode)}
            disabled={!hasBim}
          />
        </div>
      )}
      <div id={openSeaDragonId} className={classes.planDzi} />
      <TitleBar
        title={planTitle}
        onToggle={onToggleTitle}
        open={titleOpened}
        hide={
          embeddedMode ||
          !!onMatchImageToPlan ||
          mobileMode ||
          zoomImageIsSet ||
          getSessionStorageItem("HideTitleBar")
        }
      />
      <PlanAnnotations
        viewer={viewer}
        planLinks={planLinks}
        idToCommentsNumber={sceneIdToNumberOfComments}
        tileImageLoaded={tileImageLoaded}
        scale={1}
        isIconAnnotations={formViewMode}
        onSceneClick={handleSceneClick}
        onZoomImageClick={onZoomImageClick}
        onVideoClick={onVideoClick}
        embeddedMode={embeddedMode}
        hidden={hideAnnotations || initialPointSelectorOpen}
        allowChangingPlanLinks={
          !!subscribeToPlanLocation || splitScreenLeft || splitScreenRight
        }
        overlayId={overlayId}
      />
      {!anchorsStatuses && (
        <HideAnnotationsButton
          hideAnnotations={hideAnnotations}
          onTogglePlanLinks={onTogglePlanLinks}
          hide={embeddedMode}
        />
      )}
      {is3D && (
        <Tooltip
          disableInteractive
          title="Show 3D View"
          placement={"left"}
          enterDelay={400}
          enterNextDelay={400}
        >
          <Fab
            variant="extended"
            color="primary"
            aria-label="3D"
            size="small"
            className={classes.threeDView}
            onClick={() => history.push("/tour")}
          >
            <ThreeDRotationIcon />
          </Fab>
        </Tooltip>
      )}
      {!anchorsStatuses && (
        <InitialPointSelector
          open={initialPointSelectorOpen}
          hidden={!mobileMode || embeddedMode}
          handleOpen={handleOpenInitialPoint}
          handleClose={handleCloseInitialPoint}
          onLocationSaved={onLocationSaved}
          onPhotoAdded={onPhotoUploadCompleted}
          onTourReport={onTourReport}
          onPlanStateSaved={onPlanStateSaved}
          planTitle={planTitle}
          top={pressedY}
          left={pressedX}
          getScanRecord={getScanRecord}
          plan={plan}
        />
      )}

      {!anchorsStatuses && (
        <PublishPhotoTour
          open={showPublishButton || !!onMatchImageToPlan}
          onPublish={onPublish}
        />
      )}
      {!embeddedMode && !anchorsStatuses && (
        <ShareSpeedDial
          onShareClick={onShareClicked}
          projectLocation={planTitle}
          comments={emptyArray}
          imageCallback={imageCallback}
          planMode
        />
      )}
      {!onMatchImageToPlan && !embeddedMode && !mobileMode && (
        <PlanMenu
          triggerUploadImage={onUploadImageClick}
          handleClose={handleMenuClose}
          pressedScreen={mousePosition}
        />
      )}
      <Suspense fallback={null}>
        {!splitScreenLeft && !splitScreenRight
          ? zoomImageIsSet && (
              <ImageDialog
                fileName={zoomImageUrl}
                open={zoomImageIsSet}
                handleClose={handleZoomImageClose}
                handleMoveImageToDirection={moveImageToDirection}
                mobileMode={mobileMode}
                showCloseButton
                linkLocations={linkLocationsFiltered}
                indexPlanImage={indexPlanImage}
                dziImageId={dziImageId}
                togglePlanCompare={togglePlanCompare}
                embeddedMode={embeddedMode}
                planTitle={getShortPlanTitle(planTitle)}
                handleSelectImage={handleSelectImage}
              />
            )
          : zoomImageIsSet && (
              <FloatingDialog
                fileName={zoomImageUrl}
                open={zoomImageIsSet}
                handleClose={handleZoomImageClose}
                handleMoveImageToDirection={moveImageToDirection}
                mobileMode={mobileMode}
                showCloseButton
                linkLocations={linkLocationsFiltered}
                setIndexPlanImage={setIndexPlanImage}
                indexPlanImage={indexPlanImage}
                dziImageId={dziImageId}
                compareMode={isCompareMode}
                splitScreenLeft={splitScreenLeft}
                splitScreenRight={splitScreenRight}
                togglePlanCompare={togglePlanCompare}
                planTitle={getShortPlanTitle(planTitle)}
                handleSelectImage={handleSelectImage}
              />
            )}
        {videoIsSet && (
          <VideoDialog
            fileName={videoUrl}
            open={videoIsSet}
            handleClose={handleVideoClose}
            mobileMode={mobileMode}
            showCloseButton
            embeddedMode={embeddedMode}
            planTitle={getShortPlanTitle(planTitle)}
            splitScreenLeft={splitScreenLeft}
            splitScreenRight={splitScreenRight}
          />
        )}

        {openUploadImage && (
          <PhotoUploadDialog
            onPhotoAdded={onPhotoUploadCompleted}
            handleClose={handleUploadImageClose}
            open={openUploadImage}
            getScanRecord={getScanRecord}
            plan={plan}
          />
        )}
        {staticPlanAnnotationDef &&
          pdfContentDimensions &&
          staticPlanAnnotationDef.locationsArray.length > 0 && (
            <StaticPlanAnnotations
              staticPlanAnnotationDef={staticPlanAnnotationDef}
              viewer={viewer}
              anchorsStatuses={anchorsStatuses}
              progressMode={progressMode}
              onPointClick={onPointClick}
            />
          )}
        {!blob ? (
          <span />
        ) : (
          <DrawingDialog
            handleClose={handleDrawingClose}
            open={!!blob}
            blob={blob}
          />
        )}
        {reportFormOpened && (
          <CommentDialog
            scene={sceneForPlanComment}
            handleClose={handleCloseReportForm}
            open={reportFormOpened}
            mode={"CREATE_WITHOUT_LOCATION"}
            record={scanRecord}
          />
        )}
      </Suspense>
    </div>
  );
};

export default React.memo(PlanViewer);
