import React, {
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseIcon from "@mui/icons-material/Close";
import RunningWithErrorsSharpIcon from "@mui/icons-material/RunningWithErrorsSharp";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import SplitPane from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import { ActivityStatus } from "../../API";
import {
  Activity,
  Building,
  Info,
  PlanLinks,
  Progress,
  ProgressArea,
  UserProfile,
  ProgressCategory,
} from "../../models";
import { useStyles } from "./ActivityStyles";
import { MenuLayout } from "../menu-layout/MenuLayout";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { usePlanLinks } from "../../hooks/usePlanLinks";
import SceneLoader from "../scene-loader/SceneLoader";
import { setSessionKey } from "../../utils/project-session-manager";
import { ProgressTable } from "./ProgressTable";
import ProgressSelectorLayout from "./ProgressSelectorLayout";
import { showMessage } from "../../utils/messages-manager";
import {
  ActivityAnchorRecord,
  ActivityArea,
  ActivityMapData,
  ActivityWithAnchor,
  SwitchStatus,
} from "./ActivityProgressModels";
import { emptyFn, emptyNullFn } from "../../utils/render-utils";
import { analyticsEvent } from "../../utils/analytics";
import { NA } from "../../utils/clients";
import {
  activityLabel,
  DelayedProperties,
  DisplayMode,
  getCellDataPart,
  getDelayLevel,
  getLocationId,
  getRowIdFromLocationAndActivity,
  getRowWithActivityId,
  groupProgressByArea,
  setPrecisionOfDivision,
} from "./progress-operations";
import {
  convertStatusToString,
  findNearestScene,
  getAllToursAndPlansMap,
  getFloorName,
  getProjectDetailsFromDataUrl,
  getSessionStorageItem,
  TourDetails,
} from "../../utils/projects-utils";
import { OrderedPhotoRecord } from "../plan/plan-annotations/PlanAnnotationsTypes";
import { DialogLayout } from "../dialogs/dialog-layout/DialogLayout";
import { useCommentsByProjectId } from "../../hooks/useCommentsByProjectId";
import { Comment } from "../../models";

const CommentsListDialog = lazy(
  () => import("../dialogs/comments-list-dialog/CommentsListDialog")
);
const ActivityProgressMap = lazy(() => import("./ActivityProgressMap"));
const ProgressUpdatesForm = lazy(() => import("./ProgressUpdatesForm"));
const ProgressPlannedForm = lazy(() => import("./ProgressPlannedForm"));
const ProgressDelaysForm = lazy(() => import("./ProgressDelaysForm"));
const ProgressGanttForm = lazy(() => import("./ProgressGanttForm"));
const ProgressComponentForm = lazy(() => import("./ProgressComponentForm"));
const PlanDateForm = lazy(() => import("./PlanDateForm"));
let lastShowCaptures = true;
let lastFullScreen = false;
const splitPanesSizes = ["60%", "40%"];
const fullScreenPanesSizes = ["100%", "0%"];
let nextClickedCell = getSessionStorageItem("clickedCell") || "";
let toursDetailsMap = new Map<string, TourDetails>();

export interface UserProgressProps {
  progressByDate?: Progress | null;
  findLinkForArea?: (building: string, floor: string) => void;
  findLatestDate?: (building: string, floor: string) => string;
  findClosestDate?: (
    building: string,
    floor: string,
    date: string
  ) => string | undefined;
  showProgressInPercentage?: boolean | null;
  showProgressDiffPercentage?: boolean | null;
  progressForPastDate?: Progress | null;
  findswitch: (
    status: ActivityStatus,
    building: string,
    floor: string,
    activityName: string
  ) => SwitchStatus[];
  calculateActivityProgressByAnchors: (
    activities: ActivityWithAnchor[]
  ) => ActivityStatus;
  onPointClickToEdit?: () => void;
  openEditing?: boolean;
  handleCloseEditingDialog?: () => void;
  updateStatus?: (
    status: ActivityStatus,
    reason: string,
    row: Progress,
    activityIndex: number,
    activity: Activity,
    index: number,
    previousStatus: ActivityStatus
  ) => void;
  loggedUser: UserProfile;
  inFloorMode: boolean;
  labels?: string[];
  projectLastCapture?: string;
  dod: number;
  categories?: ProgressCategory[];
}

const UserProgress: React.FC<UserProgressProps> = ({
  progressByDate,
  findLinkForArea,
  findClosestDate,
  findLatestDate,
  showProgressInPercentage,
  showProgressDiffPercentage,
  progressForPastDate,
  onPointClickToEdit,
  openEditing,
  handleCloseEditingDialog,
  updateStatus,
  loggedUser,
  calculateActivityProgressByAnchors,
  labels,
  inFloorMode = true,
  projectLastCapture,
  dod,
  categories,
}) => {
  const classes = useStyles();
  const {
    setCurrentFloor,
    setCurrentPlan,
    setCurrentDate,
    setCurrentArea,
    setCurrentTour,
    setCurrentBuilding,
    setCurrentScene,
    currentProject,
    client,
  } = useContext(ProjectInformationContext);
  const mobileMode = useMediaQuery("(max-width: 1224px)", { noSsr: true });
  const isDisabled = !loggedUser.progressEditor;
  const history = useHistory();

  useEffect(() => {
    if (currentProject) {
      toursDetailsMap = getAllToursAndPlansMap(currentProject);
    }
  }, [currentProject]);

  const [contextMenuPosition, setContextMenuPosition] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [averageMenuPosition, setAverageMenuPosition] = useState<{
    x: number | null;
    y: number | null;
  }>({ x: null, y: null });
  const [cellDelayPercentage, setCellDelayPercentage] =
    useState<DelayedProperties>({
      probability: -1,
      reason: "",
    });
  const [averageClickedCell, setAverageClickedCell] = useState<string>("");
  const [progressTrendOpen, setProgressTrendOpen] = useState(false);
  const [planDateFormOpen, setPlanDateFormOpen] = useState(false);
  const [progressPlannedOpen, setProgressPlannedOpen] = useState(false);
  const [expectedDelaysOpen, setExpectedDelaysOpen] = useState<boolean>(false);
  const [ganttChartOpen, setGanttChartOpen] = useState<boolean>(false);
  const [showComponentForm, setShowComponentForm] = useState<boolean>(false);

  const [displayTour, setDisplayTour] = useState<boolean>(
    getSessionStorageItem("DisplayTour") || false
  );
  const [isFullScreen, setIsFullScreen] = useState(lastFullScreen);

  const [openComment, setOpenComment] = useState(false);
  const [filterdComment, setFilterdComment] = useState<Comment[]>([]);
  const comments = useCommentsByProjectId(
    currentProject ? currentProject.id : "",
    true
  );
  const hasMatchingComment = useCallback(
    (building: string, floor: string): boolean => {
      return comments.some((com) => {
        const dataUrl = com.dataUrl;
        const res = getProjectDetailsFromDataUrl(dataUrl);
        const floorFromUrl = getFloorName(res?.floor);
        const buildingFromUrl = res?.building;
        return buildingFromUrl === building && floorFromUrl === floor;
      });
    },
    [comments]
  );

  const hasInvisibleAnchors = useCallback(
    (building: string, floor: string): boolean => {
      return (
        progressByDate?.progressAreas?.some(
          (pa) =>
            pa.building === building &&
            pa.floor === floor &&
            pa.invisible === true
        ) || false
      );
    },
    [progressByDate]
  );

  const hasMatchingCommentForActivity = useCallback(
    (category: string): boolean => {
      return comments.some((com) =>
        com.customIssueTypes?.some((c) => {
          const englishCategoryIndex = labels?.findIndex(
            (label) => label === category
          );
          const hebrewCategory =
            labels && englishCategoryIndex && labels[englishCategoryIndex + 1];
          return c === category || c === hebrewCategory;
        })
      );
    },
    [comments]
  );

  const hasMatchingCommentForCellIntersection = useCallback(
    (building: string, floor: string, activity: string): boolean => {
      return comments.some((com) => {
        const dataUrl = com.dataUrl;
        const res = getProjectDetailsFromDataUrl(dataUrl);
        const floorFromUrl = getFloorName(res?.floor);
        const buildingFromUrl = res?.building;
        const isForThisLocation =
          buildingFromUrl === building && floorFromUrl === floor;
        const englishCategoryIndex = labels?.findIndex(
          (label) => label === activity
        );
        const hebrewCategory =
          labels && englishCategoryIndex && labels[englishCategoryIndex + 1];
        const isForThisActivity = com.customIssueTypes?.some(
          (c) => c === activity || c === hebrewCategory
        );

        return isForThisLocation && isForThisActivity;
      });
    },
    [comments]
  );

  const openComments = useCallback(
    (building: string, floor: string): void => {
      const filteredComments = comments.filter((com) => {
        const urlLength = com.dataUrl.length;
        return (
          com.dataUrl.substring(urlLength - 4, urlLength - 5) === building &&
          com.dataUrl.substring(urlLength, urlLength - 1) === floor
        );
      });
      setFilterdComment(filteredComments);
      setOpenComment(true);
    },
    [comments]
  );

  const handleCommentsClose = () => {
    setOpenComment(false);
  };

  const handleMenuClose = () => {
    setContextMenuPosition({ x: null, y: null });
    nextClickedCell = "";
  };

  const handleAverageMenuClose = () => {
    setAverageMenuPosition({ x: null, y: null });
  };

  const onCommentSelected = useCallback(
    (
      sceneId?: string,
      yaw?: number,
      pitch?: number,
      fov?: number,
      dataUrl?: string
    ) => {
      if (dataUrl) {
        const tourDetails = toursDetailsMap.get(dataUrl);
        setCurrentTour(dataUrl);
        if (sceneId) {
          setCurrentScene({
            sceneId: sceneId.toString(),
            yaw: yaw ?? undefined,
            pitch: pitch ?? undefined,
            fov: fov ?? undefined,
          });
        }
        if (tourDetails) {
          setCurrentPlan(tourDetails.info.plan);
          setCurrentDate(tourDetails.info.date);
          setCurrentArea(tourDetails.area);
          setCurrentFloor(tourDetails.floor);
          setCurrentBuilding(tourDetails.building);

          setSessionKey("Plan", tourDetails.info.plan);
          setSessionKey("Date", tourDetails.info.date);
          setSessionKey("Tour", dataUrl);
          setSessionKey("Area", JSON.stringify(tourDetails.area));
          setSessionKey("Floor", JSON.stringify(tourDetails.floor));
          setSessionKey("Building", JSON.stringify(tourDetails.building));
          if (sceneId) {
            setSessionKey(
              "Scene",
              JSON.stringify({ sceneId: sceneId.toString(), yaw, pitch, fov })
            );
          }
        } else {
          console.error("ERROR! Tour details not found for dataUrl:", dataUrl);
          showMessage(
            "Could not find the tour details for this comment.",
            "error"
          );
          return;
        }
        handleCommentsClose();
        handleMenuClose();
        handleAverageMenuClose();
        history.push("/tour");
      } else {
        console.error("ERROR! Comment dataUrl is missing.");
        showMessage("Comment is missing necessary tour information.", "error");
      }
    },
    [
      history,
      setCurrentArea,
      setCurrentBuilding,
      setCurrentDate,
      setCurrentFloor,
      setCurrentPlan,
      setCurrentScene,
      setCurrentTour,
      loggedUser,
      client,
      showMessage,
      handleCommentsClose,
      handleMenuClose,
      handleAverageMenuClose,
    ]
  );

  const handleFullScreenClick = () => {
    analyticsEvent(
      "Progress",
      "Progress Full Screen Mode",
      loggedUser?.username || client || "NA"
    );
    lastFullScreen = !lastFullScreen;
    setIsFullScreen(lastFullScreen);
  };
  const panesSizes = isFullScreen ? fullScreenPanesSizes : splitPanesSizes;
  const editMode = getSessionStorageItem("EditingMap");

  const [showProgressOnMap, setShowProgressOnMap] = useState<boolean | null>(
    getSessionStorageItem("ShowProgressOnMap")
  );

  const [showCapturesOnly, setShowCapturesOnly] = useState(lastShowCaptures);
  const [showAggregated, setShowAggregated] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    getSessionStorageItem("SelectedIndex")
      ? getSessionStorageItem("SelectedIndex")
      : 0
  );
  const [nextSelectedIndex, setNextSelectedIndex] = useState<number>(
    getSessionStorageItem("SelectedIndex")
      ? getSessionStorageItem("SelectedIndex")
      : 0
  );
  const [statusDetails, setStatusDetails] = useState<{ [key: string]: number }>(
    {}
  );
  const [currentInfo, setCurrentInfo] = useState<Info | undefined>(undefined);
  const [currentRecord, setCurrentRecord] = useState<
    OrderedPhotoRecord | undefined
  >();
  const [sceneKey, setSceneKey] = useState(0);

  let planLinks: PlanLinks | undefined;
  planLinks = usePlanLinks(currentInfo?.plan || "", currentInfo?.date || "");

  const [mapData, setMapData] = useState<ActivityMapData>(
    getSessionStorageItem("ClickedCellData") || {
      Date: "",
      Area: { building: "", floor: "", anchor: "" },
      Activity: [],
    }
  );

  const [nextMapData, setNextMapData] = useState<ActivityMapData>(
    getSessionStorageItem("ClickedCellData") || {
      Date: "",
      Area: { building: "", floor: "", anchor: "" },
      Activity: [],
    }
  );
  const [row, setRow] = useState<{
    Area: ActivityArea;
    Activities: {
      activityName: string;
      status: ActivityStatus;
      allStatuses: ActivityWithAnchor[];
    }[];
  }>(
    getSessionStorageItem("SelectedIndex")
      ? getSessionStorageItem("Row")
      : {
          Area: { building: "", floor: "", anchor: "" },
          Activities: [],
        }
  );

  const [nextRow, setNextRow] = useState<{
    Area: ActivityArea;
    Activities: {
      activityName: string;
      status: ActivityStatus;
      allStatuses: ActivityWithAnchor[];
    }[];
  }>(
    getSessionStorageItem("SelectedIndex")
      ? getSessionStorageItem("Row")
      : {
          Area: { building: "", floor: "", anchor: "" },
          Activities: [],
        }
  );

  const [clickedCell, setClickedCell] = useState<string>(
    getSessionStorageItem("clickedCell") || ""
  );

  const [anchorIndex, setAnchorIndex] = useState<number>(0);
  const [selectedStatus, setSelectedStatus] = useState<
    ActivityStatus | undefined
  >(undefined);
  const [textValue, setTextValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [aggregateMenu, setAggregateMenu] = useState<DisplayMode>();
  const aggregateActivity = nextMapData.Activity.length === 0;

  const getStatusColorClass = (activityStatus: ActivityStatus | string) => {
    switch (activityStatus) {
      case ActivityStatus.DONE:
        return classes.done;
      case ActivityStatus.IN_PROGRESS:
        return classes.inprogress;
      case ActivityStatus.NOT_STARTED:
        return classes.notstarted;
      case ActivityStatus.IRRELEVANT:
        return classes.Irrelevant;
      default:
        return "";
    }
  };

  const handleShowMapClick = () => {
    analyticsEvent(
      "Progress",
      "Show Incompleted Areas",
      loggedUser.username || client || NA
    );
    sessionStorage.setItem("EditingMap", JSON.stringify(false));
    openMapProcess();
  };

  const handleAggregateMenuClose = () => {
    setAggregateMenu(undefined);
  };

  const showAggregatedMap = (activityName: string) => {
    setShowAggregated(false);
    openAggregatedMap(activityName);
    handleAggregateMenuClose();
  };

  const showAggregatedTrend = (activityName: string) => {
    handleAggregateMenuClose();
    nextClickedCell = `${getRowIdFromLocationAndActivity(
      getLocationId(nextRow.Area.building, nextRow.Area.floor),
      activityName
    )}`;
    handleProgressTrendClick();
  };
  const handleSetPlanDateClick = () => {
    setPlanDateFormOpen(true);
  };

  const showAggregatedComments = (activityName: string) => {
    handleAggregateMenuClose();
    nextClickedCell = `${getRowIdFromLocationAndActivity(
      getLocationId(nextRow.Area.building, nextRow.Area.floor),
      activityName
    )}`;
    const building = nextRow.Area.building;
    const floor = nextRow.Area.floor;
    openCommentsByIntersection(building, floor, activityName);
  };

  const handleSetPlanDateClose = () => {
    setPlanDateFormOpen(false);
  };
  const handleProgressTrendClick = () => {
    analyticsEvent(
      "Progress",
      "Date Complete Tour",
      loggedUser.username || client || NA
    );
    setProgressTrendOpen(true);
  };

  const handleProgressTrendClose = () => {
    setProgressTrendOpen(false);
    handleMenuClose();
  };

  const handleProgressPlannedClick = () => {
    analyticsEvent(
      "Progress",
      "Progress Activity Planned Dates Table",
      loggedUser.username || client || NA
    );
    setProgressPlannedOpen(true);
    setAverageMenuPosition({ x: null, y: null });
  };

  const handleProgressPlannedClose = () => {
    setProgressPlannedOpen(false);
  };

  const handleOpenedIssuesClick = () => {
    analyticsEvent(
      "Progress",
      "Progress Activity Menu Opened",
      loggedUser.username || client || NA
    );

    const filteredComments = comments.filter((com) => {
      return com.customIssueTypes?.some((c) => {
        return c === averageClickedCell;
      });
    });

    setFilterdComment(filteredComments);
    setOpenComment(true);
    setAverageMenuPosition({ x: null, y: null });
  };

  const handleCellOpenedIssuesClick = () => {
    analyticsEvent(
      "Progress",
      "Progress Activity Menu Opened",
      loggedUser?.username || client || NA
    );

    const activityName = getCellDataPart(nextClickedCell).activity;
    const building = nextMapData.Area.building;
    const floor = nextMapData.Area.floor;

    openCommentsByIntersection(building, floor, activityName);
    handleMenuClose();
  };

  const openCommentsByIntersection = (
    building: string,
    floor: string,
    activity: string
  ) => {
    const filteredComments = comments.filter((com) => {
      const urlLength = com.dataUrl.length;
      const isForThisLocation =
        com.dataUrl.substring(urlLength - 4, urlLength - 5) === building &&
        com.dataUrl.substring(urlLength, urlLength - 1) === floor;

      const isForThisActivity = com.customIssueTypes?.some(
        (c) => c === activity
      );

      return isForThisLocation && isForThisActivity;
    });

    setFilterdComment(filteredComments);
    setOpenComment(true);
  };

  const handleShowMapForEditingClick = () => {
    analyticsEvent(
      "Progress",
      "Edit Area Status",
      loggedUser.username || client || NA
    );
    if (getSessionStorageItem("Latest") !== progressByDate?.date) {
      showMessage(
        "Updating is only possible when on the latest date's progress. Switch back to the latest date to update.",
        "error"
      );
    } else {
      sessionStorage.setItem("EditingMap", JSON.stringify(true));
      openMapProcess();
      showMessage("You can now click on an Anchor to edit it manually");
    }
  };

  const handleMapClose = useCallback(() => {
    sessionStorage.setItem("ShowProgressOnMap", JSON.stringify(false));
    sessionStorage.setItem("EditingMap", JSON.stringify(false));

    const { indicesOfMarkedAnchor, ...updatedMapData } = mapData;
    setMapData(updatedMapData);
    sessionStorage.setItem("ClickedCellData", JSON.stringify(updatedMapData));

    setShowProgressOnMap(false);
  }, [mapData]);

  const handleExpectedDelaysClick = () => {
    analyticsEvent(
      "Progress",
      "Progress Activity Expected Delays",
      loggedUser.username || client || NA
    );
    setExpectedDelaysOpen(true);
  };

  const handleExpectedDelaysClose = () => {
    setExpectedDelaysOpen(false);
  };

  const handleGanttClick = () => {
    analyticsEvent(
      "Progress",
      "Progress Gantt Chart",
      loggedUser.username || client || NA
    );
    setGanttChartOpen(true);
  };

  const handleGanttClose = () => {
    setGanttChartOpen(false);
  };

  const handleShowComponentClick = () => {
    analyticsEvent(
      "Progress",
      "Progress Component Form Opened",
      loggedUser.username || client || NA
    );
    setShowComponentForm(true);
  };

  const handleShowComponentClose = () => {
    setShowComponentForm(false);
  };

  const handleTourClose = () => {
    sessionStorage.setItem("DisplayTour", JSON.stringify(false));
    setDisplayTour(false);
  };

  const openMapProcess = () => {
    sessionStorage.setItem("ClickedCellData", JSON.stringify(nextMapData));
    setRow(nextRow);
    setSelectedIndex(nextSelectedIndex);
    setClickedCell(nextClickedCell);
    setDisplayTour(false);
    sessionStorage.setItem("DisplayTour", JSON.stringify(false));
    setShowProgressOnMap(true);
    sessionStorage.setItem("ShowProgressOnMap", JSON.stringify(true));
    setLoading(false);
    handleMenuClose();
    setMapData(nextMapData);
  };

  const checkIfIrrelevant = (counts: any) =>
    counts.IRRELEVANT > 0 &&
    counts.DONE + counts.IN_PROGRESS + counts.NOT_STARTED === 0
      ? true
      : false;

  const calculatePercentage = (
    activities: ActivityWithAnchor[],
    area: ActivityArea,
    isPastDate?: boolean
  ): { [key: string]: number } => {
    let progressAreasByFloor: ProgressArea[] | undefined;
    if (isPastDate) {
      progressAreasByFloor = progressForPastDate?.progressAreas?.filter(
        (pa) => pa.building === area.building && pa.floor === area.floor
      );
    } else {
      progressAreasByFloor = progressByDate?.progressAreas?.filter(
        (pa) => pa.building === area.building && pa.floor === area.floor
      );
    }
    const anchorWeights =
      progressAreasByFloor?.map((pabf) => pabf.weight) || [];
    const countByStatus: { [key: string]: number } = {
      done: 0,
      notStarted: 0,
      inProgress: 0,
      irrelevant: 0,
      totalWeight: 0,
    };
    if (anchorWeights && anchorWeights[0] !== null) {
      activities.forEach((activity, index) => {
        const weight = anchorWeights[index] || 0;
        switch (activity.activity.status) {
          case ActivityStatus.DONE:
            countByStatus.done += weight;
            break;
          case ActivityStatus.NOT_STARTED:
            countByStatus.notStarted += weight;
            break;
          case ActivityStatus.IN_PROGRESS:
            countByStatus.inProgress += weight;
            break;
          case ActivityStatus.IRRELEVANT:
            countByStatus.irrelevant += weight;
            break;
          default:
            break;
        }
        countByStatus.totalWeight += weight;
      });
      if (countByStatus.totalWeight === 0) {
        countByStatus.totalWeight = activities.length;
      }
    } else {
      activities.forEach((activity) => {
        const snakeCaseToCamelCase = (str: string) =>
          str
            .toLowerCase()
            .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
        const status = snakeCaseToCamelCase(
          activity.activity.status.toLowerCase()
        );
        countByStatus[status] = (countByStatus[status] || 0) + 1;
      });
      let count = 0;
      activities.forEach((activity) => {
        if (activity.activity.status !== ActivityStatus.IRRELEVANT) {
          count++;
        }
      });
      countByStatus.totalWeight = count;
    }
    return countByStatus;
  };

  const handleActivityMenuItemClick = (index: number) => {
    analyticsEvent(
      "Progress",
      "Switching Progress Activity",
      loggedUser?.username || client || "NA"
    );
    setSelectedIndex(index);
    sessionStorage.setItem("SelectedIndex", JSON.stringify(index));
    setClickedCell(getRowWithActivityId(row, index));
    setMapData({
      Date: mapData.Date || "",
      Area: row.Area,
      Activity: row.Activities[index].allStatuses,
    });
    sessionStorage.setItem("ClickedCellData", JSON.stringify(mapData));
  };
  useEffect(() => {
    if (openEditing && mapData.Activity[anchorIndex]) {
      setSelectedStatus(
        mapData.Activity[anchorIndex].activity.status as ActivityStatus
      );
    }
  }, [openEditing, mapData, anchorIndex]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(event.target.value);
    setErrorMessage("");
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStatus(event.target.value as ActivityStatus);
  };

  const handleMenuOpen = (
    event: any,
    row: any,
    area: ActivityArea,
    details: ActivityWithAnchor[],
    index: number,
    delayPercentage: DelayedProperties,
    indicesOfMarkedAnchor?: number[]
  ) => {
    setCellDelayPercentage(delayPercentage);
    event.preventDefault();
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    setNextMapData({
      Date:
        (findClosestDate &&
          findClosestDate(
            area.building,
            area.floor,
            progressByDate?.date || ""
          )) ||
        "",
      Area: { ...area, anchor: area.anchor },
      Activity: details,
      indicesOfMarkedAnchor,
    });
    let counts: { [key: string]: number } = {};
    if (showProgressInPercentage) {
      const countByStatus = calculatePercentage(details, area);
      const { done, notStarted, inProgress, totalWeight, irrelevant } =
        countByStatus;
      if (totalWeight === 0) {
        counts = {
          IRRELEVANT: 100,
        };
      } else {
        counts = {
          DONE: setPrecisionOfDivision(done, totalWeight, 1),
          IN_PROGRESS: setPrecisionOfDivision(inProgress, totalWeight, 1),
          NOT_STARTED: setPrecisionOfDivision(notStarted, totalWeight, 1),
        };
      }
    } else {
      Object.values(ActivityStatus).forEach((activityStatus) => {
        const count = details.filter(
          (detail) => detail.activity.status === activityStatus
        ).length;
        counts[activityStatus] = count;
        checkIfIrrelevant(counts)
          ? (counts = { IRRELEVANT: counts.IRRELEVANT })
          : (counts = {
              DONE: counts.DONE,
              IN_PROGRESS: counts.IN_PROGRESS,
              NOT_STARTED: counts.NOT_STARTED,
            });
      });
    }
    sessionStorage.setItem("Row", JSON.stringify(row));
    sessionStorage.setItem("SelectedIndex", JSON.stringify(index));
    setNextRow(row);
    setNextSelectedIndex(index);
    setStatusDetails(counts);
  };

  const handleSaveClick = () => {
    if (!textValue) {
      setErrorMessage("Reason is required");
      return;
    }
    const updatedClickedCellData = { ...mapData };
    const updatedActivity = {
      ...updatedClickedCellData.Activity[anchorIndex].activity,
    };
    let previousStatus =
      updatedClickedCellData.Activity[anchorIndex].activity.status;
    updatedActivity.status = selectedStatus as ActivityStatus;
    updatedClickedCellData.Activity[anchorIndex].activity = updatedActivity;
    const area = progressByDate?.progressAreas?.find(
      (pa) => pa.anchor === mapData.Activity[anchorIndex].anchor
    );
    if (area && progressByDate) {
      const areaIndex = progressByDate?.progressAreas?.findIndex(
        (pa) =>
          pa.anchor === area.anchor &&
          pa.building === area.building &&
          pa.floor === area.floor
      );
      const activity: Activity = mapData.Activity[anchorIndex].activity;
      const activityIndex = area.activities?.findIndex(
        (ac) => ac.activityName === activity.activityName
      );
      if (
        updateStatus &&
        activityIndex !== undefined &&
        areaIndex !== undefined &&
        selectedStatus
      ) {
        updateStatus(
          selectedStatus,
          textValue,
          progressByDate,
          activityIndex,
          activity,
          areaIndex,
          previousStatus as ActivityStatus
        );
        handleCloseEditingDialog && handleCloseEditingDialog();
        setSelectedStatus(undefined);
        setTextValue("");
      }
    }
  };

  useEffect(() => {
    const areaMatch = progressByDate?.progressAreas?.find(
      (pa) =>
        pa.building === mapData.Area.building &&
        pa.floor === mapData.Area.floor &&
        pa.anchor === mapData.Activity[anchorIndex]?.anchor
    );
    if (areaMatch) {
      const activityMatch = areaMatch.activities?.find(
        (a) =>
          a.activityName === mapData.Activity[anchorIndex].activity.activityName
      );
      if (activityMatch) {
        const updatedActivity = { ...activityMatch };
        const updatedActivities = [...mapData.Activity];
        updatedActivities[anchorIndex].activity = updatedActivity;
        const updatedClickedCellData = {
          Date: mapData.Date,
          Area: mapData.Area,
          Activity: updatedActivities,
        };
        sessionStorage.setItem(
          "ClickedCellData",
          JSON.stringify(updatedClickedCellData)
        );
        setMapData(updatedClickedCellData);
      }
    }
  }, [progressByDate]);

  const handleAverageMenuOpen = useCallback(
    (event: React.MouseEvent, activity: string) => {
      setAverageClickedCell(activity);
      event.preventDefault();
      setAverageMenuPosition({ x: event.clientX, y: event.clientY });
      analyticsEvent(
        "Progress",
        "Progress Activity Menu Opened",
        loggedUser?.username || client || NA
      );
    },
    [loggedUser, client]
  );

  const onPointClick = useCallback(
    (record: OrderedPhotoRecord, index: number, area?: ActivityArea) => {
      analyticsEvent(
        "Progress",
        "Clicking Map Anchor Point",
        loggedUser.username || client || NA
      );
      if (area) {
        let progressArea = progressByDate?.progressAreas?.filter(
          (progress) =>
            progress.building === area.building && progress.floor === area.floor
        );
        if (progressArea) {
          const currentBuilding: Building | undefined =
            currentProject?.buildings?.find((b) => b.name === area.building);
          if (currentBuilding && progressByDate) {
            const floors = currentBuilding.floors ?? [];
            for (const currentFloor of floors) {
              if (currentFloor.name === area.floor) {
                const areas = currentFloor.areas ?? [];
                for (const currentArea of areas) {
                  const infos = currentArea.infos ?? [];
                  for (const info of infos) {
                    if (
                      findClosestDate &&
                      findClosestDate(
                        currentBuilding.name,
                        currentFloor.name,
                        progressByDate.date || ""
                      ) === info.date
                    ) {
                      if (info.date === "blueprint") {
                        showMessage(
                          "There is no tour yet for this floor",
                          "warning"
                        );
                      } else {
                        setCurrentInfo(info);
                        setCurrentRecord(record);
                        setDisplayTour(true);
                        sessionStorage.setItem(
                          "DisplayTour",
                          JSON.stringify(true)
                        );
                        sessionStorage.setItem(
                          "SceneTourData",
                          JSON.stringify(info)
                        );
                        if (!mobileMode) {
                          sessionStorage.setItem(
                            "AnchorScene",
                            JSON.stringify("")
                          );
                          setSceneKey((prevKey) => prevKey + 1);
                        }
                      }
                      return;
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    [findClosestDate, progressByDate, currentProject, showMessage, mobileMode]
  );

  const onPointClickForEditing = (
    record: OrderedPhotoRecord,
    index: number
  ) => {
    setAnchorIndex(index);
    onPointClickToEdit && onPointClickToEdit();
  };

  useEffect(() => {
    sessionStorage.setItem("clickedCell", JSON.stringify(clickedCell));
  }, [clickedCell]);

  const handleCellClick = (rowArea: ActivityArea, activityName: string) => {
    analyticsEvent(
      "Progress",
      "Clicking Cell",
      loggedUser.username || client || NA
    );
    nextClickedCell = `${getRowIdFromLocationAndActivity(
      getLocationId(rowArea.building, rowArea.floor),
      activityName
    )}`;
    !showProgressOnMap && setClickedCell(nextClickedCell);
  };

  const handleNavigateToTour = useCallback(
    (currentDate: string) => {
      const currentDateHasTour =
        findClosestDate &&
        findClosestDate(
          nextMapData.Area.building,
          nextMapData.Area.floor,
          currentDate
        );
      if (currentDateHasTour) {
        const currentBuilding = currentProject?.buildings?.find(
          (b) => b.name === nextMapData.Area.building
        );
        const currentFloor = currentBuilding?.floors?.find(
          (f) => f.name === nextMapData.Area.floor
        );

        if (currentBuilding && currentFloor) {
          const area = currentFloor.areas?.find((area) =>
            area.infos?.some((info) => info.date === currentDateHasTour)
          );

          if (area) {
            const info = area.infos?.find(
              (info) => info.date === currentDateHasTour
            );
            if (info) {
              setCurrentPlan(info.plan);
              setCurrentDate(currentDateHasTour);
              setCurrentTour(info.tour);
              setCurrentArea(area);
              setCurrentFloor(currentFloor);
              setCurrentBuilding(currentBuilding);

              setSessionKey("Plan", info.plan);
              setSessionKey("Date", currentDateHasTour);
              setSessionKey("Tour", info.tour);
              setSessionKey("Area", JSON.stringify(area));
              setSessionKey("Floor", JSON.stringify(currentFloor));
              setSessionKey("Building", JSON.stringify(currentBuilding));

              history.push("/tour");
            }
          }
        }
      }
    },
    [
      findClosestDate,
      nextMapData.Area,
      currentProject,
      history,
      setCurrentPlan,
      setCurrentDate,
      setCurrentTour,
      setCurrentArea,
      setCurrentFloor,
      setCurrentBuilding,
    ]
  );

  const calculateDonePercentage = useCallback(
    (activities: ActivityAnchorRecord, area: ActivityArea) => {
      if (!activities.allStatuses || activities.allStatuses.length === 0) {
        return Math.round(activities.aggregatedValue || 0);
      }

      const relevantActivities = activities.allStatuses.filter(
        (activity) => activity.activity.status !== ActivityStatus.IRRELEVANT
      );

      if (relevantActivities.length === 0) return 100;

      const doneActivities = relevantActivities.filter(
        (activity) => activity.activity.status === ActivityStatus.DONE
      ).length;

      const percentage = (doneActivities / relevantActivities.length) * 100;
      return Math.round(percentage);
    },
    []
  );

  const calculateAggregatedValue = useCallback(
    (row: any, category: ProgressCategory) => {
      let totalWeightedValue = 0;
      let totalWeight = 0;

      if (category.includes) {
        category.includes.forEach((child) => {
          if (!child.name || child.weight === undefined) return;

          const activity = row.Activities.find(
            (a: any) => a.activityName === child.name
          );
          if (activity) {
            // Check if all anchors are irrelevant for this activity
            const allAnchorsIrrelevant =
              activity.allStatuses &&
              activity.allStatuses.length > 0 &&
              activity.allStatuses.every(
                (status: ActivityWithAnchor) =>
                  status.activity.status === ActivityStatus.IRRELEVANT
              );

            // Skip this activity if all anchors are irrelevant
            if (allAnchorsIrrelevant) {
              return;
            }

            const activityPercentage =
              calculateDonePercentage?.(activity, row.Area) || 0;
            totalWeightedValue += activityPercentage * child.weight;
            totalWeight += child.weight;
          }
        });
      }

      return totalWeight > 0 ? totalWeightedValue / totalWeight : 0;
    },
    [calculateDonePercentage]
  );

  useEffect(() => {
    if (planLinks && currentInfo && currentRecord) {
      const closestScene = findNearestScene(planLinks, currentRecord);
      if (closestScene && !mobileMode) {
        sessionStorage.setItem("AnchorScene", JSON.stringify(closestScene));
        setSceneKey((prevKey) => prevKey + 1);
      } else if (mobileMode && currentInfo) {
        closestScene && setCurrentScene({ sceneId: closestScene });
        setCurrentPlan(currentInfo.plan);
        setCurrentTour(currentInfo.tour);
        setCurrentDate(currentInfo.date);
        setSessionKey("Plan", currentInfo.plan);
        setSessionKey("Tour", currentInfo.tour);
        setSessionKey("Date", currentInfo.date);
        sessionStorage.setItem("ShowProgressOnMap", JSON.stringify(false));
        sessionStorage.setItem("DisplayTour", JSON.stringify(false));
        history.push("./tour");
      }
    }
  }, [
    planLinks,
    currentInfo,
    currentRecord,
    mobileMode,
    history,
    setCurrentDate,
    setCurrentPlan,
    setCurrentScene,
    setCurrentTour,
    findNearestScene,
  ]);

  const toggleShowCaptures = () => {
    analyticsEvent(
      "Progress",
      "Filter Progress Captures",
      loggedUser.username || client || NA
    );
    lastShowCaptures = !showCapturesOnly;
    setShowCapturesOnly(lastShowCaptures);
  };

  useEffect(() => {
    if (!getSessionStorageItem("ShowProgressOnMap")) {
      handleMapClose();
      setShowProgressOnMap(false);
    }
    if (!getSessionStorageItem("DisplayTour")) {
      setDisplayTour(false);
    }
  }, [progressByDate]);

  const filterProgressData = (
    data: {
      Area: ActivityArea;
      Activities: {
        activityName: string;
        status: ActivityStatus;
        allStatuses: ActivityWithAnchor[];
      }[];
    }[],
    date: string
  ) => {
    return data.filter((row: any) => {
      if (showCapturesOnly) {
        const closestDate =
          findClosestDate &&
          findClosestDate(row.Area.building, row.Area.floor, date);
        return closestDate !== "blueprint";
      }
      return true;
    });
  };

  const progressData =
    progressByDate &&
    groupProgressByArea(
      progressByDate,
      calculateActivityProgressByAnchors,
      inFloorMode
    );
  const filteredProgressData =
    progressData &&
    filterProgressData(progressData, progressByDate?.date ?? "");

  const pastProgressData =
    progressForPastDate &&
    groupProgressByArea(
      progressForPastDate,
      calculateActivityProgressByAnchors,
      inFloorMode
    );
  const filteredPastProgressData =
    pastProgressData &&
    filterProgressData(pastProgressData, progressByDate?.date ?? "");

  const aggregateActivities = useCallback(
    (activities: any[], row: any) => {
      if (!categories) return activities;

      // Create a map of activity names to their categories
      const activityToCategory = new Map<string, ProgressCategory>();
      categories.forEach((cat) => {
        if (!cat.includes) return;
        cat.includes.forEach((include) => {
          if (include.name) {
            activityToCategory.set(include.name, cat);
          }
        });
      });

      // Create a set to track which categories have already been processed
      const processedCategories = new Set<string>();

      // Use reduce for a more efficient implementation
      return activities.reduce((acc, activity) => {
        const category = activityToCategory.get(activity.activityName);
        if (!category || !processedCategories.has(category.name)) {
          acc.push(
            category
              ? {
                  activityName: category.name,
                  status: ActivityStatus.IN_PROGRESS,
                  allStatuses: [],
                  aggregatedValue: calculateAggregatedValue(row, category),
                }
              : activity
          );
          if (category) processedCategories.add(category.name);
        }
        return acc;
      }, [] as typeof activities);
    },
    [categories, calculateAggregatedValue]
  );

  const aggregatedProgressData = useMemo(() => {
    if (!showAggregated || !categories || !filteredProgressData) {
      return filteredProgressData;
    }

    return filteredProgressData.map((row: any) => ({
      ...row,
      Activities: aggregateActivities(row.Activities, row),
    }));
  }, [showAggregated, categories, filteredProgressData, aggregateActivities]);

  const aggregatedPastProgressData = useMemo(() => {
    if (!showAggregated || !categories || !filteredPastProgressData) {
      return filteredPastProgressData;
    }

    return filteredPastProgressData.map((row: any) => ({
      ...row,
      Activities: aggregateActivities(row.Activities, row),
    }));
  }, [
    showAggregated,
    categories,
    filteredPastProgressData,
    aggregateActivities,
  ]);

  const getAggregatedProgress = (activity: any) => {
    const parent = categories?.find(
      (category) => category.name === activity.activityName
    );
    if (parent) return parent;
    const children = categories?.find((category) =>
      category.includes?.find((child) => child.name === activity.activityName)
    );
    return children;
  };

  const openAggregatedMap = (aggregatedActivity: string) => {
    const aggregatedRow = {
      ...nextRow,
      Activities:
        filteredProgressData?.find(
          (row) => row.Area.floor === nextRow.Area.floor
        )?.Activities || [],
    };
    setNextRow(aggregatedRow);
    const aggregatedIndex = aggregatedRow.Activities.findIndex(
      (activity) => activity.activityName === aggregatedActivity
    );
    setNextSelectedIndex(aggregatedIndex);
    const updatedMapData = {
      ...nextMapData,
      Activity: aggregatedRow.Activities[aggregatedIndex].allStatuses,
    };
    setNextMapData(updatedMapData);
    nextClickedCell = `${getRowIdFromLocationAndActivity(
      getLocationId(aggregatedRow.Area.building, aggregatedRow.Area.floor),
      aggregatedActivity
    )}`;
    sessionStorage.setItem("ClickedCellData", JSON.stringify(updatedMapData));
    setRow(aggregatedRow);
    setSelectedIndex(aggregatedIndex);
    setClickedCell(nextClickedCell);
    setDisplayTour(false);
    sessionStorage.setItem("DisplayTour", JSON.stringify(false));
    setShowProgressOnMap(true);
    sessionStorage.setItem("ShowProgressOnMap", JSON.stringify(true));
    setLoading(false);
    handleMenuClose();
    setMapData(updatedMapData);
  };

  const calculateActivityStatusPercentage = (
    activityName: string,
    status: ActivityStatus
  ): number => {
    if (!progressByDate) return 0;

    const totalActivities = progressByDate?.progressAreas?.reduce(
      (acc: { total: number; matchingStatus: number }, area) => {
        const activity = area?.activities?.find(
          (act) => act.activityName === activityName
        );
        if (activity) {
          acc.total += 1;
          if (activity.status === status) {
            acc.matchingStatus += 1;
          }
        }
        return acc;
      },
      { total: 0, matchingStatus: 0 }
    );

    if (showProgressInPercentage) {
      return totalActivities?.total === 0 || !totalActivities
        ? 0
        : setPrecisionOfDivision(
            totalActivities.matchingStatus,
            totalActivities.total,
            1
          );
    } else {
      return totalActivities?.matchingStatus || 0;
    }
  };

  const getCategoryIncludes = categories?.find(
    (category) => category.name === getCellDataPart(nextClickedCell).activity
  )?.includes;

  const onAggregateMenuClick = (childName: string, menuType: string) => {
    if (menuType === "map") {
      showAggregatedMap(childName);
    } else if (menuType === "trend") {
      showAggregatedTrend(childName);
    } else {
      showAggregatedComments(childName);
    }
  };

  return (
    <>
      {handleCloseEditingDialog && (
        <DialogLayout
          handleClose={handleCloseEditingDialog}
          title="Update Status"
          open={openEditing}
          showCloseButton
          maxWidth="xs"
        >
          <DialogContent>
            <DialogContentText className={classes.dialogText}>
              Edit the area's status
            </DialogContentText>
            <RadioGroup
              aria-label="status"
              name="status"
              value={selectedStatus}
              onChange={handleStatusChange}
              className={classes.dialogBody}
            >
              <FormControlLabel
                value={ActivityStatus.DONE}
                control={<Radio color="secondary" />}
                label="Done"
              />
              <FormControlLabel
                value={ActivityStatus.IN_PROGRESS}
                control={<Radio color="secondary" />}
                label="In Progress"
              />
              <FormControlLabel
                value={ActivityStatus.NOT_STARTED}
                control={<Radio color="secondary" />}
                label="Not Started"
              />
              <FormControlLabel
                value={ActivityStatus.IRRELEVANT}
                control={<Radio color="secondary" />}
                label="Irrelevant"
              />
            </RadioGroup>
            <TextField
              label="Reason for Editing"
              multiline
              rows={2}
              variant="outlined"
              value={textValue}
              onChange={handleTextChange}
              autoFocus
              size="small"
              type="text"
              fullWidth
              error={!!errorMessage}
            />
            {errorMessage && (
              <div style={{ color: "red", marginTop: "8px" }}>
                {errorMessage}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditingDialog}>Cancel</Button>
            <Button onClick={handleSaveClick} color="primary">
              Save
            </Button>
          </DialogActions>
        </DialogLayout>
      )}
      {showProgressOnMap && !mobileMode && !displayTour && (
        <div
          className={`${classes.progressSelectorMapContainer} ${classes.activitySelectorContainer}`}
        >
          <div className={classes.inlineContainer}>
            <ProgressSelectorLayout
              selectors={[
                {
                  options: row.Activities.map((option) => option.activityName),
                  selectedOption: row.Activities[selectedIndex].activityName,
                  handleOptionSelect: (activityName: string) => {
                    const index = row.Activities.findIndex(
                      (option) => option.activityName === activityName
                    );
                    handleActivityMenuItemClick(index);
                  },
                },
              ]}
              isActivitySelector={true}
              labels={labels}
            />
          </div>
        </div>
      )}
      {contextMenuPosition.x !== null && contextMenuPosition.y !== null && (
        <MenuLayout
          handleClose={handleMenuClose}
          pressedScreen={{
            mouseX: contextMenuPosition.x,
            mouseY: contextMenuPosition.y,
          }}
          title={aggregateActivity ? "Category Details" : "Status Details"}
        >
          {!aggregateActivity ? (
            <div className={classes.statusContainer}>
              {Object.entries(statusDetails).map(
                ([category, count], index, array) => (
                  <Tooltip
                    disableInteractive
                    key={category}
                    title={convertStatusToString(category as ActivityStatus)}
                  >
                    <div className={classes.statusItem}>
                      <div className={classes.number}></div>
                      <div className={getStatusColorClass(category)}>
                        {" "}
                        {showProgressInPercentage ? count + "%" : count}
                      </div>
                      <div className={classes.number}></div>
                      {index < array.length - 1 && (
                        <Divider
                          className={classes.divider}
                          orientation="vertical"
                          variant="middle"
                          flexItem
                        />
                      )}
                    </div>
                  </Tooltip>
                )
              )}
            </div>
          ) : (
            <MenuItem
              onClick={() => {
                handleShowComponentClick();
              }}
            >
              Show Composition
            </MenuItem>
          )}
          <MenuItem
            onClick={
              aggregateActivity
                ? () => setAggregateMenu("map")
                : handleShowMapClick
            }
          >
            Show incomplete areas
          </MenuItem>
          <MenuItem
            className={classes.progressTrend}
            onClick={
              aggregateActivity
                ? () => setAggregateMenu("trend")
                : handleProgressTrendClick
            }
          >
            Progress Trend
            {getDelayLevel(cellDelayPercentage.probability) !== "low" && (
              <RunningWithErrorsSharpIcon
                className={
                  getDelayLevel(cellDelayPercentage.probability) === "high"
                    ? classes.highSeverityIcon
                    : classes.mediumSeverityIcon
                }
              />
            )}
          </MenuItem>
          <MenuItem
            className={classes.progressTrend}
            onClick={
              aggregateActivity
                ? () => setAggregateMenu("comments")
                : handleCellOpenedIssuesClick
            }
          >
            Openned Issues
            <PriorityHighIcon />
          </MenuItem>
          {aggregateActivity || (
            <Tooltip
              disableInteractive
              title={
                isDisabled
                  ? "Only permitted users can update. Please contact support to request access."
                  : ""
              }
              placement="top"
            >
              <span>
                <MenuItem
                  disabled={isDisabled}
                  onClick={
                    isDisabled ? undefined : handleShowMapForEditingClick
                  }
                >
                  Edit Area Status
                </MenuItem>
                {!isDisabled && (
                  <MenuItem onClick={handleSetPlanDateClick}>
                    Set Planned Date
                  </MenuItem>
                )}
              </span>
            </Tooltip>
          )}
        </MenuLayout>
      )}
      {aggregateMenu &&
        contextMenuPosition.x !== null &&
        contextMenuPosition.y !== null && (
          <MenuLayout
            handleClose={handleAggregateMenuClose}
            pressedScreen={{
              mouseX: contextMenuPosition.x + 208,
              mouseY: contextMenuPosition.y + 76,
            }}
          >
            {getCategoryIncludes?.map((child) => (
              <MenuItem
                key={child.name}
                onClick={() => {
                  onAggregateMenuClick(child.name, aggregateMenu);
                }}
              >
                {activityLabel(child.name, labels)}
              </MenuItem>
            ))}
          </MenuLayout>
        )}
      {displayTour || showProgressOnMap ? (
        <div className={classes.splitPaneWrapper}>
          <div
            className={`${classes.mapButtonsWarrper} ${
              mobileMode && classes.mapButtonsMobileMode
            }`}
          >
            {editMode && !mobileMode && (
              <h1 className={classes.editButton}>Edit mode</h1>
            )}
            {isFullScreen ? (
              <Tooltip disableInteractive title="exit full screen">
                <IconButton
                  aria-label="exit full screen"
                  onClick={handleFullScreenClick}
                  size="small"
                >
                  <CloseFullscreenIcon className={classes.MapButtons} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip disableInteractive title="full screen">
                <IconButton
                  aria-label="full screen"
                  onClick={handleFullScreenClick}
                  size="small"
                >
                  <OpenInFullIcon className={classes.MapButtons} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip disableInteractive title="Close">
              <IconButton
                aria-label="close"
                onClick={() => {
                  displayTour ? handleTourClose() : handleMapClose();
                }}
                size="small"
              >
                <CloseIcon className={classes.MapButtons} />
              </IconButton>
            </Tooltip>
          </div>
          <SplitPane
            split="horizontal"
            allowResize={false}
            sizes={panesSizes}
            className={classes.splitPaneStyle}
            onChange={emptyFn}
            sashRender={emptyNullFn}
          >
            <Suspense fallback={null}>
              {loading ? (
                <div></div>
              ) : !displayTour ? (
                <ActivityProgressMap
                  key={clickedCell}
                  clickedCellData={mapData}
                  handleMapClose={handleMapClose}
                  onPointClick={
                    editMode ? onPointClickForEditing : onPointClick
                  }
                  progressByDate={progressByDate}
                />
              ) : (
                getSessionStorageItem("AnchorScene") && (
                  <div
                    className={
                      !mobileMode ? classes.container : classes.mobileContainer
                    }
                  >
                    <SceneLoader
                      handleTourClose={handleTourClose}
                      key={sceneKey}
                    />
                  </div>
                )
              )}
            </Suspense>
            <div className={classes.paneTable}>
              {
                <ProgressTable
                  progressByDate={progressByDate}
                  progressData={
                    !showAggregated
                      ? filteredProgressData
                      : aggregatedProgressData
                  }
                  progressForPastDate={
                    !showAggregated
                      ? filteredPastProgressData
                      : aggregatedPastProgressData
                  }
                  showProgressDiffPercentage={showProgressDiffPercentage}
                  findLinkForArea={findLinkForArea}
                  findClosestDate={findClosestDate}
                  findLatestDate={findLatestDate}
                  showProgressInPercentage={showProgressInPercentage}
                  calculateDonePercentage={calculateDonePercentage}
                  handleMenuOpen={handleMenuOpen}
                  handleCellClick={handleCellClick}
                  clickedCell={clickedCell}
                  isAdmin={false}
                  labels={labels}
                  showCapturesOnly={showCapturesOnly}
                  toggleShowCaptures={toggleShowCaptures}
                  inFloorMode={inFloorMode}
                  nextClickedCell={nextClickedCell}
                  projectLastCapture={projectLastCapture}
                  onAggregatedChange={setShowAggregated}
                  categories={categories}
                  showAggregated={showAggregated}
                  handleAverageMenuOpen={handleAverageMenuOpen}
                  getAggregatedProgress={getAggregatedProgress}
                  openCommentsByIntersection={openCommentsByIntersection}
                  hasMatchingComment={hasMatchingComment}
                  hasMatchingCommentForActivity={hasMatchingCommentForActivity}
                  hasInvisibleAnchors={hasInvisibleAnchors}
                  hasMatchingCommentForCellIntersection={
                    hasMatchingCommentForCellIntersection
                  }
                  openComments={openComments}
                ></ProgressTable>
              }
            </div>
          </SplitPane>
        </div>
      ) : (
        <div className={classes.tableBeforeSplit}>
          {
            <ProgressTable
              progressByDate={progressByDate}
              progressData={
                !showAggregated ? filteredProgressData : aggregatedProgressData
              }
              progressForPastDate={
                !showAggregated
                  ? filteredPastProgressData
                  : aggregatedPastProgressData
              }
              showProgressDiffPercentage={showProgressDiffPercentage}
              findLinkForArea={findLinkForArea}
              findClosestDate={findClosestDate}
              findLatestDate={findLatestDate}
              showProgressInPercentage={showProgressInPercentage}
              calculateDonePercentage={calculateDonePercentage}
              handleMenuOpen={handleMenuOpen}
              handleCellClick={handleCellClick}
              clickedCell={clickedCell}
              isAdmin={false}
              labels={labels}
              showCapturesOnly={showCapturesOnly}
              toggleShowCaptures={toggleShowCaptures}
              inFloorMode={inFloorMode}
              nextClickedCell={nextClickedCell}
              projectLastCapture={projectLastCapture}
              onAggregatedChange={setShowAggregated}
              showAggregated={showAggregated}
              categories={categories}
              handleAverageMenuOpen={handleAverageMenuOpen}
              getAggregatedProgress={getAggregatedProgress}
              openCommentsByIntersection={openCommentsByIntersection}
              hasMatchingComment={hasMatchingComment}
              hasMatchingCommentForActivity={hasMatchingCommentForActivity}
              hasInvisibleAnchors={hasInvisibleAnchors}
              hasMatchingCommentForCellIntersection={
                hasMatchingCommentForCellIntersection
              }
              openComments={openComments}
            ></ProgressTable>
          }
        </div>
      )}

      {averageMenuPosition.x !== null && averageMenuPosition.y !== null && (
        <MenuLayout
          handleClose={handleAverageMenuClose}
          pressedScreen={{
            mouseX: averageMenuPosition.x,
            mouseY: averageMenuPosition.y,
          }}
          title={"Activity Details"}
        >
          <div className={classes.statusContainer}>
            {Object.values(ActivityStatus)
              .filter(
                (status) =>
                  status === ActivityStatus.DONE ||
                  status === ActivityStatus.IN_PROGRESS ||
                  status === ActivityStatus.NOT_STARTED
              )
              .map((status, index, array) => {
                const count = calculateActivityStatusPercentage(
                  averageClickedCell,
                  status
                );
                return (
                  <Tooltip
                    disableInteractive
                    key={status}
                    title={convertStatusToString(status)}
                  >
                    <div className={classes.statusItem}>
                      <div className={classes.number}></div>
                      <div className={getStatusColorClass(status)}>
                        {showProgressInPercentage ? count + "%" : count}
                      </div>
                      <div className={classes.number}></div>
                      {index < array.length - 1 && (
                        <Divider
                          className={classes.divider}
                          orientation="vertical"
                          variant="middle"
                          flexItem
                        />
                      )}
                    </div>
                  </Tooltip>
                );
              })}
          </div>
          <MenuItem onClick={handleProgressPlannedClick}>
            Planned dates
          </MenuItem>
          <MenuItem onClick={handleOpenedIssuesClick}>Opened Issues</MenuItem>
          <MenuItem onClick={handleExpectedDelaysClick}>
            Expected Delays
          </MenuItem>
          <MenuItem onClick={handleGanttClick}>Gantt Chart</MenuItem>
        </MenuLayout>
      )}

      <Suspense fallback={null}>
        {progressTrendOpen && (
          <ProgressUpdatesForm
            open={progressTrendOpen}
            handleClose={handleProgressTrendClose}
            mobileMode={mobileMode}
            cellData={nextClickedCell}
            project={currentProject?.id || ""}
            cellDelayPercentage={cellDelayPercentage}
            labels={labels}
            dod={dod}
            handleNavigateToTour={handleNavigateToTour}
          />
        )}

        {showComponentForm && getCategoryIncludes && (
          <ProgressComponentForm
            aggregated={getCategoryIncludes}
            handleClose={handleShowComponentClose}
            cellData={nextClickedCell}
            project={currentProject?.id || ""}
            open={showComponentForm}
            date={progressByDate?.date || ""}
            mobileMode={mobileMode}
            labels={labels}
          />
        )}

        {planDateFormOpen && (
          <PlanDateForm
            project={currentProject?.id || ""}
            building={(() => {
              const rowData = sessionStorage.getItem("Row");
              const parsedRowData = rowData ? JSON.parse(rowData) : null;
              return parsedRowData?.Area?.building || "";
            })()}
            floor={(() => {
              const rowData = sessionStorage.getItem("Row");
              const parsedRowData = rowData ? JSON.parse(rowData) : null;
              return parsedRowData?.Area?.floor || "";
            })()}
            activity={(() => {
              const rowData = sessionStorage.getItem("Row");
              const parsedRowData = rowData ? JSON.parse(rowData) : null;
              const selectedIndex = parseInt(
                sessionStorage.getItem("SelectedIndex") || "0",
                10
              );
              return parsedRowData?.Activities[selectedIndex]?.activityName;
            })()}
            open={planDateFormOpen}
            handleClose={() => setPlanDateFormOpen(false)}
          ></PlanDateForm>
        )}
        {expectedDelaysOpen && (
          <ProgressDelaysForm
            open={expectedDelaysOpen}
            handleClose={handleExpectedDelaysClose}
            mobileMode={mobileMode}
            activity={averageClickedCell}
            project={currentProject?.id || ""}
            labels={labels}
          />
        )}

        {progressPlannedOpen && (
          <ProgressPlannedForm
            open={progressPlannedOpen}
            handleClose={handleProgressPlannedClose}
            mobileMode={mobileMode}
            activity={averageClickedCell}
            project={currentProject?.id || ""}
            labels={labels}
          />
        )}

        {ganttChartOpen && (
          <ProgressGanttForm
            open={ganttChartOpen}
            handleClose={handleGanttClose}
            mobileMode={mobileMode}
            project={currentProject?.id || ""}
          />
        )}
        {openComment && (
          <CommentsListDialog
            open={openComment}
            commentList={filterdComment}
            handleClose={handleCommentsClose}
            onCommentSelected={onCommentSelected}
          />
        )}
      </Suspense>
    </>
  );
};

export default React.memo(UserProgress);
