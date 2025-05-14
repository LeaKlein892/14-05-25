import {
  IconButton,
  Tooltip,
  useMediaQuery,
  Button,
  LinearProgress,
  Grid,
  Box,
  Switch,
} from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import React, {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { createStyles, withStyles } from "@mui/styles";
import { ActivityStatus } from "../../API";
import {
  Activity,
  Info,
  PlanLinks,
  Progress,
  ProgressArea,
  ProgressCategory,
} from "../../models";
import theme from "../../ui/theme";
import {
  convertStatusToString,
  findNearestScene,
  getClassForStatus,
} from "../../utils/projects-utils";
import {
  ActivityAnchorRecord,
  ActivityArea,
  ActivityWithAnchor,
} from "./ActivityProgressModels";
import { useStyles } from "./ActivityStyles";
import { usePlanAnchors } from "../../hooks/usePlanAnchors";
import {
  OrderedPhotoRecord,
  StaticPlanAnnotationDef,
} from "../plan/plan-annotations/PlanAnnotationsTypes";
import { FixedSizeList } from "react-window";
import { emptyArray, emptyFn } from "../../utils/render-utils";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { usePlanLinks } from "../../hooks/usePlanLinks";
import useChannel, { TourTableChannelProps } from "../../hooks/useChannels";
import {
  deleteStorageKeyValue,
  getStorageKeyValue,
  setStorageKeyValue,
} from "../../utils/storage-manager";
import {
  exportProgressTableToXlsx,
  ExportsProgressData,
} from "../../utils/sheets-operations";
import { FileDownload } from "@mui/icons-material";
import RunningWithErrorsSharpIcon from "@mui/icons-material/RunningWithErrorsSharp";
import { useProgressDelayedActivities } from "../../hooks/useProgressDelayedActivities";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  getDelayLevel,
  delayProbabilityMessage,
  getIndexesOfDifferentStatuses,
  getRowIdFromLocationAndActivity,
  getRowLocationId,
  getRowWithActivityId,
  getSumOfDelayMessage,
  activityLabel,
  normalizeActivityName,
  getCellDataPart,
  DelayedProperties,
} from "./progress-operations";
import { FilterSortButton } from "../filter-sort-button/FilterSortButton";
import { analyticsEvent } from "../../utils/analytics";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { NA } from "../../utils/clients";
import * as XLSX from "xlsx-js-style";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MapIcon from "@mui/icons-material/Map";

let prevSelectedRow: string | null;
let lastIndex = -1;
let previousBuildingChecked: string[] | undefined;
let previousFloorChecked: string[] | undefined;
let previousProjectId: string | undefined;
const defaultDelayedProperties: DelayedProperties = {
  probability: 0,
  reason: "",
};

const StyledTableCell = withStyles(() =>
  createStyles({
    head: {
      backgroundColor: "white",
      padding: "0px 0px",
      color: "black",
      fontSize: "19px",
      fontFamily: "Mukta, sans-serif",
      textAlign: "center",
      minWidth: "140px",
      maxWidth: "140px",
      borderBottom: "0px",
      wordBreak: "break-word",
      whiteSpace: "normal",
    },
    body: {
      fontSize: "19px",
      textAlign: "center",
      borderStyle: "solid",
      borderColor: "white",
      borderWidth: "1px",
      padding: "0px 0px 0px 0px",
      fontFamily: "Mukta, sans-serif",
      minWidth: "140px",
      maxWidth: "140px",
      wordBreak: "break-word",
      whiteSpace: "normal",
      height: "55px",
    },
  })
)(TableCell);

const setStyleForExport = () => {
  const colors = {
    redFill: {
      fill: { fgColor: { rgb: "FF0000" }, patternType: "solid" },
      font: { color: { rgb: "FFFFFF" } },
    },
    greenFill: {
      fill: { fgColor: { rgb: "006400" }, patternType: "solid" },
      font: { color: { rgb: "FFFFFF" } },
    },
    orangeFill: {
      fill: { fgColor: { rgb: "FFA500" }, patternType: "solid" },
      font: { color: { rgb: "000000" } },
    },
  };
  const CenterAlign = {
    alignment: { horizontal: "center", vertical: "center" },
  };
  return { colors, CenterAlign };
};

const setCellStyles = (workSheet: XLSX.WorkSheet, data: any[]) => {
  const styles: any = setStyleForExport();
  XLSX.utils.sheet_add_aoa(workSheet, [Object.keys(data[0])], {
    origin: "A1",
  });
  Object.keys(data[0]).forEach((_, colIndex) => {
    let cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
    workSheet[cellAddress].s = { ...styles.CenterAlign };
  });
  data.forEach((entry, rowIndex) => {
    Object.entries(entry).forEach(([key, value], colIndex) => {
      let cellAddress = XLSX.utils.encode_cell({
        r: rowIndex + 1,
        c: colIndex,
      });
      if (!workSheet[cellAddress]) {
        workSheet[cellAddress] = { v: value };
      }
      if (key === "Date" || key === "Area") {
        workSheet[cellAddress].s = { ...styles.CenterAlign };
      } else {
        if (value === "0%") {
          workSheet[cellAddress].s = {
            ...styles.colors.redFill,
            ...styles.CenterAlign,
          };
        } else if (value === "100%") {
          workSheet[cellAddress].s = {
            ...styles.colors.greenFill,
            ...styles.CenterAlign,
          };
        } else {
          workSheet[cellAddress].s = {
            ...styles.colors.orangeFill,
            ...styles.CenterAlign,
          };
        }
      }
    });
  });
};

export interface ProgressTableProps {
  progressByDate: Progress | null | undefined;
  progressData?:
    | {
        Area: ActivityArea;
        Activities: ActivityAnchorRecord[];
      }[]
    | null
    | undefined;
  showAggregated?: boolean;
  categories?: ProgressCategory[];
  findLinkForArea?: (building: string, floor: string) => void;
  navigateToAnchorLink?: (building: string, floor: string) => void;
  findLatestDate?: (building: string, floor: string) => string;
  findClosestDate?: (
    building: string,
    floor: string,
    date: string
  ) => string | undefined;
  showProgressInPercentage?: boolean | null;
  showProgressDiffPercentage?: boolean | null;
  progressForPastDate?:
    | {
        Area: ActivityArea;
        Activities: ActivityAnchorRecord[];
      }[]
    | null
    | undefined;
  calculateDonePercentage?: (
    activities: ActivityAnchorRecord,
    area: ActivityArea,
    isPastDate?: boolean
  ) => number;
  handleMenuOpen?: (
    event: any,
    row: any,
    area: ActivityArea,
    details: ActivityWithAnchor[],
    index: number,
    delayPercentage: DelayedProperties,
    indicesOfMarkedAnchor?: number[]
  ) => void;
  handleCellClick?: (rowArea: ActivityArea, activityName: string) => void;
  clickedCell?: string;
  adminProgressData?: Progress | null;
  handleChange?: (
    newValue: ActivityStatus,
    row: Progress,
    activityIndex: number,
    activity: Activity,
    index: number
  ) => void;
  toggleProgressAreaVisibility?: (
    progressArea: ProgressArea,
    row: Progress,
    index: number
  ) => void;
  isAdmin: boolean;
  labels?: string[];
  inFloorMode: boolean;
  calculationOfTheTourTimeForTheEntityTime?: () => boolean;
  toggleShowCaptures?: () => void;
  showCapturesOnly?: boolean;
  nextClickedCell?: string;
  projectLastCapture?: string;
  handleAverageMenuOpen?: (event: any, activity: string) => void;
  onAggregatedChange?: (aggregated: boolean) => void;
  getAggregatedProgress?: (
    activity: ActivityAnchorRecord
  ) => ProgressCategory | undefined;
  openCommentsByIntersection?: (
    building: string,
    floor: string,
    activity: string
  ) => void;
  hasMatchingComment?: (building: string, floor: string) => boolean;
  hasInvisibleAnchors?: (building: string, floor: string) => boolean;
  hasMatchingCommentForActivity?: (category: string) => boolean;
  hasMatchingCommentForCellIntersection?: (
    building: string,
    floor: string,
    activity: string
  ) => boolean;
  openComments?: (building: string, floor: string) => void;
}

export const ProgressTable: React.FC<ProgressTableProps> = ({
  progressByDate,
  progressData,
  findLinkForArea,
  navigateToAnchorLink,
  findLatestDate,
  findClosestDate,
  showProgressInPercentage,
  showProgressDiffPercentage,
  progressForPastDate,
  calculateDonePercentage,
  handleMenuOpen,
  handleCellClick,
  clickedCell,
  adminProgressData,
  handleChange,
  toggleProgressAreaVisibility: onToggleProgressAreaVisibility,
  isAdmin = false,
  calculationOfTheTourTimeForTheEntityTime,
  labels,
  toggleShowCaptures = emptyFn,
  showCapturesOnly = true,
  inFloorMode = true,
  nextClickedCell: nextClickedcell,
  projectLastCapture,
  handleAverageMenuOpen,
  categories,
  showAggregated = false,
  onAggregatedChange,
  getAggregatedProgress,
  openCommentsByIntersection = () => {},
  hasMatchingComment = () => false,
  hasInvisibleAnchors = () => false,
  hasMatchingCommentForActivity = () => false,
  hasMatchingCommentForCellIntersection = () => false,
  openComments = () => {},
}) => {
  const classes = useStyles();
  const mobileMode = useMediaQuery("(max-width: 1224px)", { noSsr: true });
  const { currentProject, client, setCurrentBuilding, setCurrentFloor } =
    useContext(ProjectInformationContext);
  const { loggedUser } = useContext(LoggedUserContext);
  const [currentAnchor, setCurrentAnchor] = useState("");
  const progressDelayedCells = useProgressDelayedActivities(
    currentProject?.id || ""
  );

  // State declarations
  const [filteredProgressData, setFilteredProgressData] = useState<
    | {
        Area: ActivityArea;
        Activities: ActivityAnchorRecord[];
      }[]
    | null
    | undefined
  >(progressData);

  const [filteredprogressForPastDate, setFilteredprogressForPastDate] =
    useState<
      | {
          Area: ActivityArea;
          Activities: ActivityAnchorRecord[];
        }[]
      | null
      | undefined
    >(progressForPastDate);

  const { planAnchors } = usePlanAnchors(currentAnchor);
  const photoRecords = planAnchors?.photoRecords || emptyArray;

  const [buldingFilter, setBuldingFilter] = useState<string[] | undefined>(
    previousBuildingChecked
  );
  const [floorFilter, setFloorFilter] = useState<string[] | undefined>(
    previousFloorChecked
  );
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [currentProgressArea, setCurrentProgressArea] =
    useState<ProgressArea>();
  const [isOnlyRowClick, setIsOnlyRowClick] = useState(true);

  const [currentAnchorId, setCurrentAnchorId] = useState(0);
  const [currentInfo, setCurrentInfo] = useState<Info | undefined>(undefined);

  useEffect(() => {
    if (isAdmin && progressByDate?.date) {
      const savedSelectedRow = getStorageKeyValue("LAST_SELECTED_ROW");
      savedSelectedRow
        ? setSelectedRow(savedSelectedRow)
        : deleteStorageKeyValue("LAST_SELECTED_ROW");
    }
  }, [progressByDate, isAdmin]);

  const handleRowClick = (progressArea: ProgressArea) => {
    if (isAdmin && progressByDate?.date) {
      const newSelectedRow = `${progressArea?.building}-${progressArea?.floor}-${progressArea?.anchor}-${progressByDate.date}`;
      if (selectedRow !== newSelectedRow) {
        prevSelectedRow = selectedRow;
        setSelectedRow(newSelectedRow);
        setStorageKeyValue("LAST_SELECTED_ROW", newSelectedRow);
        setCurrentProgressArea(progressArea);
      }
    }
  };

  let planLinks: PlanLinks | undefined;
  planLinks = usePlanLinks(currentInfo?.plan || "", currentInfo?.date || "");
  const [initialRecord, setInitalRecord] = useState<
    OrderedPhotoRecord | undefined
  >();

  const broadcast = useChannel<TourTableChannelProps>({
    channelName: "tour-table-channel",
    messageHandler: (message: MessageEvent) => {},
  });

  const findCurrentInfo = (
    building: string,
    floor: string,
    record: OrderedPhotoRecord
  ) => {
    let b = currentProject?.buildings?.find((b) => b.name === building);
    let f = b && b.floors?.find((f) => f.name === floor);
    const areas = f?.areas || emptyArray;
    for (const area of areas) {
      const infos = area.infos ?? [];
      for (const info of infos) {
        if (
          findClosestDate &&
          b &&
          f &&
          findClosestDate(b.name, f.name, progressByDate?.date ?? "") ===
            info.date &&
          info.date !== "blueprint"
        ) {
          setCurrentInfo(info);
          setInitalRecord(record);
          return;
        }
      }
    }
  };

  const handleAnchorClick = (anchor: string, isOnlyRow: boolean) => {
    setIsOnlyRowClick(isOnlyRow);
    const baseUrl = "https://castory-app.com/location?pdf=";
    const anchorIdIndex = anchor.indexOf("&anchorId=");
    if (anchorIdIndex !== -1) {
      const anchorId = getAnchorIdFromUrl(anchor);
      if (anchorId) {
        setCurrentAnchorId(parseInt(anchorId));
      }
      const cleanUrl = anchor.substring(baseUrl.length, anchorIdIndex);
      setCurrentAnchor(cleanUrl);
    } else {
      setCurrentAnchor(anchor);
    }
  };

  const broadcastAnchor = (leftLocation?: number, topLocation?: number) => {
    const record: OrderedPhotoRecord = {
      fileName: currentAnchor,
      index: currentAnchorId,
      leftLocation:
        leftLocation ||
        staticPlanAnnotationDef.locationsArray[currentAnchorId].leftLocation,
      topLocation:
        topLocation ||
        staticPlanAnnotationDef.locationsArray[currentAnchorId].topLocation,
    };
    currentProgressArea?.building &&
      currentProgressArea?.floor &&
      findCurrentInfo(
        currentProgressArea?.building,
        currentProgressArea?.floor,
        record
      );
  };

  useEffect(() => {
    if (planLinks && currentInfo && initialRecord) {
      const closestScene =
        planLinks && initialRecord
          ? findNearestScene(planLinks, initialRecord)
          : "";
      const currAnchor: TourTableChannelProps = {
        anchor: currentAnchor,
        anchorId: currentAnchorId,
        leftLocation: initialRecord.leftLocation,
        topLocation: initialRecord.topLocation,
        building: currentProgressArea?.building ?? undefined,
        floor: currentProgressArea?.floor ?? undefined,
        scene: closestScene,
      };
      broadcast(currAnchor);
      setCurrentInfo(undefined);
      setInitalRecord(undefined);
    }
  }, [planLinks, findNearestScene, currentInfo]);

  useEffect(() => {
    if (currentInfo == undefined) setCurrentAnchor("");
  }, [currentInfo]);

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

  useEffect(() => {
    if (currentAnchor) {
      if (!isOnlyRowClick) {
        const newUrl = addParametersToURL(
          currentAnchor,
          staticPlanAnnotationDef.locationsArray[currentAnchorId].leftLocation,
          staticPlanAnnotationDef.locationsArray[currentAnchorId].topLocation
        );
        setIsOnlyRowClick(true);
        sessionStorage.setItem(
          "currentBuilding",
          JSON.stringify(currentProgressArea?.building)
        );
        sessionStorage.setItem(
          "currentFloor",
          JSON.stringify(currentProgressArea?.floor)
        );
        window.open(newUrl, "_blank");
        prevSelectedRow = selectedRow;
      }
      if (selectedRow !== prevSelectedRow) {
        broadcastAnchor(
          staticPlanAnnotationDef.locationsArray[currentAnchorId].leftLocation,
          staticPlanAnnotationDef.locationsArray[currentAnchorId].topLocation
        );
      } else setCurrentAnchor("");
    }
  }, [staticPlanAnnotationDef]);

  const addParametersToURL = (
    url: string,
    leftLocation: number,
    topLocation: number
  ): string => {
    return `location?pdf=${url}&anchorId=${currentAnchorId}&anchorLeftLocation=${leftLocation}&anchorTopLocation=${topLocation}`;
  };

  const getAnchorIdFromUrl = (url: string): string | null => {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    return urlParams.get("anchorId");
  };

  const getUpdatedTitle = (activity: Activity) => {
    return `
      Updated from status: ${convertStatusToString(
        activity.previousStatus as ActivityStatus
      )}<br/>
      To status: ${convertStatusToString(
        activity.status as ActivityStatus
      )}<br/>
      Reason: ${activity.updateReason}<br/>
      By user: ${activity.updater}<br/>
      Date of Update: ${activity.dateManuallyUpdated}
    `;
  };

  const newCapture = {
    ...(calculationOfTheTourTimeForTheEntityTime &&
    calculationOfTheTourTimeForTheEntityTime()
      ? {
          backgroundColor: "gray",
        }
      : {}),
  };

  // Helper functions
  const getStatusFromPercentage = (percentage: number): ActivityStatus => {
    if (percentage === 100) return ActivityStatus.DONE;
    if (percentage === 0) return ActivityStatus.NOT_STARTED;
    return ActivityStatus.IN_PROGRESS;
  };

  const getActivityStatus = (activityIndex: number): ActivityStatus => {
    if (!filteredProgressData || filteredProgressData.length === 0) {
      return ActivityStatus.IN_PROGRESS;
    }

    const activity = filteredProgressData[0].Activities[activityIndex];

    // If we have an aggregated value, determine status based on percentage ranges
    if (activity.aggregatedValue !== undefined) {
      return getStatusFromPercentage(activity.aggregatedValue);
    }

    // Otherwise use the original status logic
    const firstStatus = activity.status;
    const allSameStatus = filteredProgressData.every(
      (row) => row.Activities[activityIndex].status === firstStatus
    );

    return allSameStatus ? firstStatus : ActivityStatus.IN_PROGRESS;
  };

  const averagePerActivity = useCallback(
    (index: number) => {
      if (!filteredProgressData || filteredProgressData.length === 0) return 0;

      const validRows = filteredProgressData.filter(
        (row) => row.Activities[index] !== undefined
      );

      if (validRows.length === 0) return 0;

      const totalDonePercentage = validRows.reduce((sum, row) => {
        const activity = row.Activities[index];

        if (activity.aggregatedValue !== undefined) {
          return sum + activity.aggregatedValue;
        }

        const relevantActivities = activity.allStatuses.filter(
          (status) => status.activity.status !== ActivityStatus.IRRELEVANT
        );

        if (relevantActivities.length === 0) return sum + 100;

        const doneActivities = relevantActivities.filter(
          (status) => status.activity.status === ActivityStatus.DONE
        ).length;

        const percentage = (doneActivities / relevantActivities.length) * 100;
        return sum + Math.round(percentage); // Round each percentage before summing
      }, 0);

      return Math.round(totalDonePercentage / validRows.length);
    },
    [filteredProgressData]
  );

  const handleBuildingFilterChange = (filterBy: string[]) => {
    analyticsEvent(
      "Progress",
      "Filter Progress By Building",
      loggedUser?.username || client || NA
    );
    previousBuildingChecked = filterBy;
    setBuldingFilter(previousBuildingChecked);
  };

  const handleFloorFilterChange = (filterBy: string[]) => {
    analyticsEvent(
      "Progress",
      "Filter Progress By Floor",
      loggedUser?.username || client || NA
    );
    previousFloorChecked = filterBy;
    setFloorFilter(previousFloorChecked);
  };

  const exportCSV = () => {
    if (isAdmin && progressByDate?.progressAreas) {
      const exportsProgressAreas = transformData(progressByDate.progressAreas);
      exportProgressTableToXlsx(exportsProgressAreas, setCellStyles);
    } else if (filteredProgressData) {
      analyticsEvent(
        "Progress",
        "Export Progress",
        loggedUser?.username || client || NA
      );
      const exportsProgressData = transformData(filteredProgressData);
      addAverageRowToExports(exportsProgressData);
      exportProgressTableToXlsx(
        exportsProgressData,
        setCellStyles,
        progressByDate?.date,
        currentProject?.name
      );
    }
  };

  const filterProgressByBuildingAndFloor = (
    data:
      | {
          Area: ActivityArea;
          Activities: ActivityAnchorRecord[];
        }[]
      | null
      | undefined
  ) => {
    return data?.filter((row) => {
      const buildingMatch =
        !buldingFilter?.length || buldingFilter.includes(row.Area.building);
      const floorMatch =
        !floorFilter?.length || floorFilter.includes(row.Area.floor);
      return buildingMatch && floorMatch;
    });
  };

  const setFilteredProgress = () => {
    setFilteredProgressData(filterProgressByBuildingAndFloor(progressData));
    setFilteredprogressForPastDate(
      filterProgressByBuildingAndFloor(progressForPastDate)
    );
  };

  useEffect(() => {
    setFilteredProgress();
  }, [buldingFilter, floorFilter, progressData, progressForPastDate]);

  if (previousProjectId !== currentProject?.id) {
    previousBuildingChecked = undefined;
    previousFloorChecked = undefined;
    setBuldingFilter(previousBuildingChecked);
    setFloorFilter(previousFloorChecked);
  }
  previousProjectId = currentProject?.id;

  const activityDelayStats = useMemo(() => {
    if (!progressDelayedCells || progressDelayedCells.size === 0) return [];

    const activityStats: {
      [key: string]: { highSeverityCount: number; mediumSeverityCount: number };
    } = {};

    progressDelayedCells.forEach((delay, cellId) => {
      const activityName = getCellDataPart(cellId).activity;
      if (!activityStats[activityName]) {
        activityStats[activityName] = {
          highSeverityCount: 0,
          mediumSeverityCount: 0,
        };
      }
      if (getDelayLevel(delay.probability) === "high") {
        activityStats[activityName].highSeverityCount++;
      } else if (getDelayLevel(delay.probability) === "medium") {
        activityStats[activityName].mediumSeverityCount++;
      }
    });

    return Object.keys(activityStats).map((activityName) => ({
      activityName,
      highSeverityCount: activityStats[activityName].highSeverityCount,
      mediumSeverityCount: activityStats[activityName].mediumSeverityCount,
    }));
  }, [progressDelayedCells]);

  const getSeverityCount = (activityName: string) => {
    const activityStat = activityDelayStats?.find(
      (stat) => stat.activityName === activityName
    );
    const highSeverityCount = activityStat?.highSeverityCount || 0;
    const mediumSeverityCount = activityStat?.mediumSeverityCount || 0;
    return {
      high: highSeverityCount,
      medium: mediumSeverityCount,
    };
  };

  const getProbabilityNumber = (cell: string) => {
    return (
      progressDelayedCells.get(normalizeActivityName(cell)) ??
      defaultDelayedProperties
    );
  };

  const totalColumns =
    isAdmin &&
    adminProgressData &&
    adminProgressData.progressAreas &&
    adminProgressData.progressAreas[0].activities &&
    adminProgressData.progressAreas[0]?.activities.length + 3;

  const adminTableHeight = totalColumns && totalColumns > 20 ? 250 : 600;

  const transformData = (data: any[]): ExportsProgressData[] => {
    return data.reduce((acc: ExportsProgressData[], item) => {
      const date =
        findClosestDate &&
        findClosestDate(
          item.Area?.building || item.building,
          item.Area?.floor || item.floor,
          progressByDate?.date ?? ""
        );
      const areaStatuses: ExportsProgressData = {
        Date: date || "",
        Area: `Building ${item.Area?.building || item.building} Floor ${
          item.Area?.floor || item.floor
        }`,
      };
      if ("anchor" in item) {
        areaStatuses.Anchor = `Tour Anchor ${item.anchor}`;
      }
      const activities = item.Activities || item.activities || [];
      if (showProgressInPercentage)
        activities.forEach((activity: any) => {
          areaStatuses[activityLabel(activity.activityName, labels)] =
            calculateDonePercentage
              ? calculateDonePercentage(activity, item.Area, false) + "%"
              : "";
        });
      else
        activities.forEach((activity: any) => {
          areaStatuses[activityLabel(activity.activityName, labels)] =
            activity.status;
        });
      acc.push(areaStatuses);
      return acc;
    }, []);
  };

  const addAverageRowToExports = (
    exportsProgressData: ExportsProgressData[]
  ) => {
    if (!filteredProgressData || filteredProgressData.length === 0) return;
    const averageRow: ExportsProgressData = {
      Date: projectLastCapture || "",
      Area: "Entire Project average",
    };
    filteredProgressData[0].Activities.forEach((activity, index) => {
      averageRow[
        activityLabel(activity.activityName, labels)
      ] = `${averagePerActivity(index)}%`;
    });
    exportsProgressData.splice(0, 0, averageRow);
  };

  const areaText = inFloorMode ? "Floor" : "Unit";

  const handleToggleProgressAreaVisibility = (progressArea: ProgressArea) => {
    if (onToggleProgressAreaVisibility && adminProgressData) {
      const index =
        adminProgressData.progressAreas?.findIndex(
          (pa) =>
            pa.anchor === progressArea.anchor &&
            pa.building === progressArea.building &&
            pa.floor === progressArea.floor
        ) ?? -1;

      if (index !== -1) {
        onToggleProgressAreaVisibility(progressArea, adminProgressData, index);
      }
    }
  };

  const Rows = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      const progressArea = adminProgressData?.progressAreas?.[index];
      if (!isAdmin || !progressArea) return null;

      const dateToShow =
        findLatestDate &&
        findLatestDate(progressArea.building, progressArea.floor);
      return (
        <TableRow
          style={{
            ...style,
            borderColor:
              selectedRow ===
              `${progressArea.building}-${progressArea.floor}-${progressArea.anchor}-${progressByDate?.date}`
                ? theme.palette.primary.main
                : "white",
            borderWidth: "2px",
            borderStyle: "solid",
            display: "flex",
          }}
          key={`${progressArea.anchor}`}
          onClick={() => {
            handleRowClick(progressArea);
          }}
        >
          <StyledTableCell
            className={classes.stickyArea}
            style={{
              minWidth: !mobileMode ? "440px" : "300px",
              maxWidth: !mobileMode ? "440px" : "300px",
            }}
          >
            <div style={newCapture}>
              <StyledTableCell
                className={classes.date}
                style={{
                  ...(mobileMode ? { display: "none" } : {}),
                }}
                onClick={() => {
                  sessionStorage.removeItem("ClickedCellData");
                  handleAnchorClick(progressArea.anchor, true);
                }}
              >
                {dateToShow}
                <Tooltip
                  title={
                    progressArea.invisible
                      ? "Anchor Invisible"
                      : "Anchor Visible"
                  }
                >
                  <Switch
                    checked={progressArea.invisible === true}
                    onChange={() =>
                      handleToggleProgressAreaVisibility(progressArea)
                    }
                    color="warning"
                    size="small"
                  />
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell
                className={classes.link}
                onClick={() =>
                  findLinkForArea &&
                  findLinkForArea(progressArea.building, progressArea.floor)
                }
              >
                {`Building ${progressArea.building} ${areaText} ${progressArea.floor}`}
                {mobileMode && (
                  <span className={classes.spanDate}>{dateToShow || ""}</span>
                )}
              </StyledTableCell>
              <StyledTableCell
                className={classes.link}
                onClick={() => handleAnchorClick(progressArea.anchor, false)}
              >
                {`Tour Anchor ${getAnchorIdFromUrl(progressArea.anchor)}`}
              </StyledTableCell>
            </div>
          </StyledTableCell>

          {progressArea.activities?.map((activity, Activityindex) => (
            <Tooltip
              disableInteractive
              key={`${adminProgressData?.id}-${progressArea.floor}-${activity.activityName}`}
              title={
                activity.previousStatus ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: getUpdatedTitle(activity),
                    }}
                  />
                ) : (
                  ""
                )
              }
              placement="top"
            >
              <StyledTableCell
                className={
                  classes[getClassForStatus(activity.status as any, classes)]
                }
                onClick={() => handleAnchorClick(progressArea.anchor, true)}
              >
                <select
                  value={activity.status}
                  onChange={(e) => {
                    handleChange &&
                      handleChange(
                        e.target.value as any,
                        adminProgressData!,
                        Activityindex,
                        activity,
                        index
                      );
                  }}
                  onClick={(event) => {
                    handleRowClick(progressArea);
                    if (index === lastIndex) event.stopPropagation();
                    lastIndex = index;
                  }}
                  style={{
                    width: "100%",
                    height: "100%",
                    padding: 0,
                    margin: 0,
                    border: "none",
                    backgroundColor: "transparent",
                    color: "inherit",
                    cursor: "pointer",
                    textAlign: "center",
                    fontSize: "19px",
                  }}
                >
                  {Object.values(ActivityStatus).map((activityStatus) => (
                    <option
                      key={activityStatus}
                      value={activityStatus}
                      style={{
                        backgroundColor:
                          classes[getClassForStatus(activityStatus, classes)],
                      }}
                    >
                      {activity.previousStatus
                        ? `${convertStatusToString(activityStatus)} (M)`
                        : convertStatusToString(activityStatus)}
                    </option>
                  ))}
                </select>
              </StyledTableCell>
            </Tooltip>
          ))}
        </TableRow>
      );
    },
    [
      classes,
      isAdmin,
      selectedRow,
      adminProgressData,
      calculationOfTheTourTimeForTheEntityTime,
      findLatestDate,
      findLinkForArea,
      navigateToAnchorLink,
      handleChange,
      progressByDate,
      mobileMode,
      areaText,
      handleAnchorClick,
      handleRowClick,
      newCapture,
    ]
  );

  return (
    <>
      <div className={classes.rightButtonContainer}>
        {!isAdmin && !mobileMode && (
          <>
            {categories && categories.length > 0 && (
              <Tooltip title="Toggle Aggregated View">
                <Switch
                  checked={showAggregated}
                  onChange={(e) => onAggregatedChange?.(e.target.checked)}
                  color="primary"
                  size="small"
                />
              </Tooltip>
            )}
            <FilterSortButton
              title={"building"}
              noSortMode
              onSort={emptyFn}
              onSortDesc={emptyFn}
              onFilter={handleBuildingFilterChange}
              filterOptions={Array.from(
                new Set(
                  progressData?.map((row) => row.Area.building) || emptyArray
                )
              )}
              initialChecked={buldingFilter}
              variant="outlined"
              color="secondary"
              sortFn={(value, otherValue) =>
                value.localeCompare(otherValue, undefined, { numeric: true })
              }
            />
            <FilterSortButton
              title={"floor"}
              noSortMode
              onSort={emptyFn}
              onSortDesc={emptyFn}
              onFilter={handleFloorFilterChange}
              filterOptions={Array.from(
                new Set(
                  progressData?.map((row) => row.Area.floor) || emptyArray
                )
              )}
              initialChecked={floorFilter}
              variant="outlined"
              color="secondary"
              sortFn={(value, otherValue) =>
                value.localeCompare(otherValue, undefined, { numeric: true })
              }
            />
            <IconButton
              onClick={exportCSV}
              size="small"
              className={classes.rightButtons}
            >
              <Tooltip
                disableInteractive
                title={"export to csv"}
                placement={"right"}
                enterDelay={400}
                enterNextDelay={400}
              >
                <FileDownload className={"white-icon"} />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={toggleShowCaptures}
              size="small"
              className={classes.rightButtons}
            >
              <Tooltip
                disableInteractive
                title={
                  showCapturesOnly
                    ? "Show All Floors"
                    : "Show Floors With Captures"
                }
                placement={"right"}
                enterDelay={400}
                enterNextDelay={400}
              >
                {showCapturesOnly ? (
                  <FilterListOffIcon className={"white-icon"} />
                ) : (
                  <FilterListIcon className={"white-icon"} />
                )}
              </Tooltip>
            </IconButton>
          </>
        )}
      </div>
      {isAdmin && (
        <>
          <Button
            className={classes.infoButton}
            color="primary"
            onClick={() =>
              currentProgressArea &&
              handleAnchorClick(currentProgressArea.anchor, false)
            }
            style={newCapture}
          >
            {currentProgressArea ? (
              <>
                Building: {currentProgressArea.building} , floor:{" "}
                {findClosestDate
                  ? findClosestDate(
                      currentProgressArea.building ?? "",
                      currentProgressArea.floor ?? "",
                      progressByDate?.date ?? ""
                    )
                  : ""}
                ,
                <span style={{ color: "black" }}>
                  anchor: {getAnchorIdFromUrl(currentProgressArea.anchor)}
                </span>
              </>
            ) : (
              "Please select a row"
            )}
          </Button>
          <Button
            className={classes.anchorMapButton}
            title="Open Anchor Map"
            disabled={!currentProgressArea}
            onClick={() => {
              if (currentProgressArea && navigateToAnchorLink) {
                navigateToAnchorLink(
                  currentProgressArea.building,
                  currentProgressArea.floor
                );
              }
            }}
          >
            <MapIcon />
          </Button>
        </>
      )}
      <TableContainer
        style={{
          boxShadow: "none",
          overflowX: "initial",
          marginTop: "0px",
        }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead
            style={{
              position: isAdmin ? "sticky" : undefined,
              display: isAdmin ? "grid" : undefined,
            }}
          >
            <TableRow>
              <StyledTableCell
                className={`${!isAdmin ? classes.stickyArea : ""} ${
                  classes.dateAreaHeader
                }`}
                style={{
                  minWidth:
                    !isAdmin && !mobileMode
                      ? "300px"
                      : mobileMode && !isAdmin
                      ? "150px"
                      : mobileMode
                      ? "300px"
                      : "440px",
                  maxWidth:
                    !isAdmin && !mobileMode
                      ? "300px"
                      : mobileMode && !isAdmin
                      ? "150px"
                      : mobileMode
                      ? "300px"
                      : "440px",
                }}
              >
                <StyledTableCell style={mobileMode ? { display: "none" } : {}}>
                  Last Capture
                </StyledTableCell>
                <StyledTableCell>Area</StyledTableCell>
                {isAdmin && <StyledTableCell>Anchor</StyledTableCell>}
              </StyledTableCell>
              {isAdmin &&
                adminProgressData &&
                adminProgressData.progressAreas &&
                adminProgressData.progressAreas[0].activities &&
                adminProgressData.progressAreas[0]?.activities.map(
                  (activity) => (
                    <StyledTableCell key={activity.activityName}>
                      {activity.activityName}
                    </StyledTableCell>
                  )
                )}
              {!isAdmin &&
                getAggregatedProgress &&
                progressData &&
                progressData[0]?.Activities.map((activity) => {
                  const aggregated = getAggregatedProgress(activity);
                  return (
                    <StyledTableCell
                      key={activity.activityName}
                      className={classes.tableHeader}
                    >
                      {aggregated ? (
                        aggregated?.name === activity.activityName ? (
                          <div className={classes.aggregatedContainer}>
                            <h1 className={classes.aggregatedText}>
                              {activityLabel(activity.activityName, labels)}
                            </h1>
                            <button
                              className={classes.aggregatedButton}
                              onClick={() => onAggregatedChange?.(false)}
                            >
                              <AddIcon />
                            </button>
                          </div>
                        ) : (
                          <>
                            <h1 className={classes.aggregatedParent}>
                              ({aggregated?.name})
                            </h1>
                            <div className={classes.aggregatedContainer}>
                              <h1 className={classes.aggregatedText}>
                                {activityLabel(activity.activityName, labels)}
                              </h1>
                              <button
                                className={classes.aggregatedButton}
                                onClick={() => onAggregatedChange?.(true)}
                              >
                                <RemoveIcon />
                              </button>
                            </div>
                          </>
                        )
                      ) : (
                        activityLabel(activity.activityName, labels)
                      )}
                    </StyledTableCell>
                  );
                })}
            </TableRow>
          </TableHead>
          <TableBody>
            {!isAdmin && (
              <TableRow>
                <StyledTableCell className={classes.stickyArea}>
                  <StyledTableCell
                    className={`${classes.date} ${classes.averageRow}`}
                  >
                    {projectLastCapture}
                    {mobileMode && (
                      <span className={classes.spanDate}>Entire Project</span>
                    )}
                  </StyledTableCell>
                  {!mobileMode && (
                    <StyledTableCell
                      className={`${classes.averageHeader} ${classes.averageRow}`}
                    >
                      Entire Project
                    </StyledTableCell>
                  )}
                </StyledTableCell>
                {filteredProgressData &&
                  filteredProgressData[0]?.Activities.map((activity, i) => {
                    const severityCount = getSeverityCount(
                      normalizeActivityName(activity.activityName)
                    );
                    return (
                      <StyledTableCell
                        key={activity.activityName}
                        onClick={(event: any) => {
                          handleAverageMenuOpen &&
                            handleAverageMenuOpen(event, activity.activityName);
                        }}
                        className={`${
                          classes[
                            getClassForStatus(
                              activity.aggregatedValue !== undefined
                                ? getStatusFromPercentage(averagePerActivity(i))
                                : getActivityStatus(i),
                              classes
                            )
                          ]
                        } ${classes.averageRow}`}
                      >
                        <Grid container direction="column">
                          <Grid item xs={9} container direction="row">
                            <Grid item xs={10}>
                              <Box className={classes.box}>
                                {showProgressInPercentage
                                  ? `${averagePerActivity(i)}%`
                                  : convertStatusToString(getActivityStatus(i))}
                              </Box>
                            </Grid>
                            <Grid item xs={2}>
                              <Box className={classes.delayBox}>
                                {hasMatchingCommentForActivity(
                                  activity.activityName
                                ) && (
                                  <Tooltip title="Click to see options for this activity">
                                    <PriorityHighIcon
                                      fontSize="small"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        handleAverageMenuOpen &&
                                          handleAverageMenuOpen(
                                            event,
                                            activity.activityName
                                          );
                                      }}
                                    />
                                  </Tooltip>
                                )}
                                {(severityCount.medium > 0 ||
                                  severityCount.high > 0) && (
                                  <Tooltip
                                    title={getSumOfDelayMessage(
                                      severityCount.high,
                                      severityCount.medium
                                    )}
                                  >
                                    <RunningWithErrorsSharpIcon
                                      fontSize="small"
                                      className={
                                        severityCount.high > 0
                                          ? classes.highSeverityIcon
                                          : classes.mediumSeverityIcon
                                      }
                                    />
                                  </Tooltip>
                                )}
                              </Box>
                            </Grid>
                          </Grid>
                          <Grid item xs={3}>
                            <Box className={classes.linearProgressBox}>
                              <LinearProgress
                                className={classes.linearProgress}
                                variant="determinate"
                                value={averagePerActivity(i)}
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </StyledTableCell>
                    );
                  })}
              </TableRow>
            )}
            {isAdmin ? (
              <FixedSizeList
                height={adminTableHeight}
                itemCount={adminProgressData?.progressAreas?.length || 0}
                itemSize={60}
                width={totalColumns ? totalColumns * 142 : 0}
              >
                {Rows}
              </FixedSizeList>
            ) : (
              filteredProgressData &&
              filteredProgressData.map((row, i) => {
                const dateToShow =
                  findLatestDate &&
                  findLatestDate(row.Area.building, row.Area.floor);
                return (
                  <TableRow key={getRowWithActivityId(row, i)}>
                    <StyledTableCell className={classes.stickyArea}>
                      <StyledTableCell
                        className={classes.date}
                        style={{
                          ...(mobileMode ? { display: "none" } : {}),
                        }}
                      >
                        {dateToShow}
                        {hasMatchingComment(
                          row.Area.building,
                          row.Area.floor
                        ) ? (
                          <Tooltip
                            style={{
                              position: "absolute",
                              marginLeft: "15px",
                            }}
                            onClick={() =>
                              openComments(row.Area.building, row.Area.floor)
                            }
                            title={"Click to see opened issues on this floor"}
                          >
                            <PriorityHighIcon fontSize="small" />
                          </Tooltip>
                        ) : (
                          ""
                        )}
                        {hasInvisibleAnchors &&
                        hasInvisibleAnchors(
                          row.Area.building,
                          row.Area.floor
                        ) ? (
                          <Tooltip
                            style={{
                              position: "absolute",
                            }}
                            title={"This floor has invisible areas"}
                          >
                            <QuestionMarkIcon
                              style={{
                                fontSize: "0.8rem",
                                marginLeft: "7px",
                                marginRight: "7px",
                              }}
                            />
                          </Tooltip>
                        ) : (
                          ""
                        )}
                      </StyledTableCell>
                      <StyledTableCell
                        className={classes.link}
                        onClick={() => {
                          findLinkForArea &&
                            findLinkForArea(row.Area.building, row.Area.floor);
                          sessionStorage.removeItem("ClickedCellData");
                        }}
                      >
                        {`Building ${row.Area.building} ${areaText} ${row.Area.floor}`}
                        {mobileMode && (
                          <span className={classes.spanDate}>{dateToShow}</span>
                        )}
                      </StyledTableCell>
                    </StyledTableCell>
                    {row.Activities.map((activity, index) => {
                      const donePercentage =
                        calculateDonePercentage &&
                        calculateDonePercentage(activity, row.Area, false);
                      let donePercentageForPastDate;

                      // Find the matching activity in the past data by name instead of by index
                      const pastActivity = filteredprogressForPastDate?.[
                        i
                      ]?.Activities.find(
                        (a) => a.activityName === activity.activityName
                      );

                      const pastStatuses =
                        pastActivity?.allStatuses || emptyArray;

                      if (
                        filteredprogressForPastDate &&
                        calculateDonePercentage &&
                        pastActivity
                      ) {
                        donePercentageForPastDate = calculateDonePercentage(
                          pastActivity,
                          filteredprogressForPastDate[i]?.Area,
                          true
                        );
                      }

                      const differentAnchors = getIndexesOfDifferentStatuses(
                        activity.allStatuses,
                        pastStatuses
                      );

                      const delayPercentage = getProbabilityNumber(
                        getRowIdFromLocationAndActivity(
                          getRowLocationId(row),
                          activity.activityName
                        )
                      );
                      const delayLevel = getDelayLevel(
                        delayPercentage.probability
                      );

                      return (
                        <React.Fragment key={activity.activityName}>
                          <StyledTableCell
                            onClick={(event: any) => {
                              // Changed event type to any
                              handleMenuOpen &&
                                handleMenuOpen(
                                  event,
                                  row,
                                  row.Area,
                                  activity.allStatuses,
                                  index,
                                  delayPercentage,
                                  differentAnchors
                                );
                              handleCellClick &&
                                handleCellClick(
                                  row.Area,
                                  activity.activityName
                                );
                            }}
                            key={activity.activityName}
                            style={{
                              ...(clickedCell ===
                                `${getRowIdFromLocationAndActivity(
                                  getRowLocationId(row),
                                  activity.activityName
                                )}` && {
                                borderColor: theme.palette.primary.main,
                                borderWidth: "3px",
                                borderStyle: "solid",
                              }),
                              ...(showProgressDiffPercentage && {
                                ...(donePercentage === donePercentageForPastDate
                                  ? { filter: "brightness(0.6)" }
                                  : {}),
                                ...(showProgressInPercentage &&
                                donePercentage !== undefined &&
                                donePercentageForPastDate !== undefined
                                  ? {
                                      "data-diff": `${
                                        Math.round(
                                          (donePercentage -
                                            donePercentageForPastDate) *
                                            10
                                        ) / 10
                                      }%`,
                                    }
                                  : {}),
                              }),
                            }}
                            className={`${
                              classes[
                                getClassForStatus(
                                  activity.aggregatedValue !== undefined
                                    ? getStatusFromPercentage(
                                        activity.aggregatedValue
                                      )
                                    : (activity.status as ActivityStatus),
                                  classes
                                )
                              ]
                            } ${
                              nextClickedcell ===
                              `${getRowIdFromLocationAndActivity(
                                getRowLocationId(row),
                                activity.activityName
                              )}`
                                ? classes.nextClickedCell
                                : ""
                            }`}
                          >
                            <Grid
                              item
                              container
                              direction="row"
                              className={classes.grid}
                            >
                              <Grid item xs={10} alignSelf={"center"}>
                                <Box className={classes.box}>
                                  {showProgressInPercentage
                                    ? showProgressDiffPercentage &&
                                      donePercentage !== undefined &&
                                      donePercentageForPastDate !== undefined
                                      ? `${Math.round(
                                          donePercentage -
                                            donePercentageForPastDate
                                        )}%`
                                      : `${donePercentage}%`
                                    : activity.aggregatedValue !== undefined
                                    ? activity.aggregatedValue === 100
                                      ? "Done"
                                      : activity.aggregatedValue === 0
                                      ? "Not Started"
                                      : "In Progress"
                                    : convertStatusToString(activity.status)}
                                </Box>
                              </Grid>
                              <Grid item xs={2}>
                                <Box className={classes.delayBox}>
                                  {hasMatchingCommentForCellIntersection(
                                    row.Area.building,
                                    row.Area.floor,
                                    activity.activityName
                                  ) && (
                                    <Tooltip title="This activity has opened issues for this location">
                                      <PriorityHighIcon
                                        fontSize="small"
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          openCommentsByIntersection(
                                            row.Area.building,
                                            row.Area.floor,
                                            activity.activityName
                                          );
                                        }}
                                      />
                                    </Tooltip>
                                  )}
                                  {delayPercentage.probability > 0 &&
                                    (delayLevel === "high" ? (
                                      <Tooltip
                                        title={delayProbabilityMessage(
                                          delayPercentage.probability
                                        )}
                                      >
                                        <RunningWithErrorsSharpIcon
                                          fontSize="small"
                                          className={classes.highSeverityIcon}
                                        />
                                      </Tooltip>
                                    ) : (
                                      <Tooltip
                                        title={delayProbabilityMessage(
                                          delayPercentage.probability
                                        )}
                                      >
                                        <RunningWithErrorsSharpIcon
                                          fontSize="small"
                                          className={classes.mediumSeverityIcon}
                                        />
                                      </Tooltip>
                                    ))}
                                </Box>
                              </Grid>
                            </Grid>
                          </StyledTableCell>
                        </React.Fragment>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ProgressTable;
