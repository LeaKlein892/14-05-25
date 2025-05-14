import { ActivityArea, ActivityWithAnchor } from "./ActivityProgressModels";
import { emptyArray } from "../../utils/render-utils";
import {
  Progress,
  ProgressArea,
  ProgressCategory,
  TaskData,
} from "../../models";
import { ActivityStatus } from "../../API";
import { parseDayMonthShortYear } from "../../utils/date-utils";

export interface ProjectCacheProgress {
  progress: Progress[];
  labels?: string[];
  dod?: number;
  categories?: ProgressCategory[];
}

export interface DelayedProperties {
  probability: number;
  reason: string;
}

const getRowWithActivityId = (row: any, indexOfActivity = 0) =>
  getRowIdFromLocationAndActivity(
    getRowLocationId(row),
    row.Activities[indexOfActivity]?.activityName ?? ""
  );

const getRowIdFromLocationAndActivity = (
  locationId: string,
  activityId: string
) => `${locationId}#${activityId}`;

const getRowLocationId = (row: any) =>
  `${getLocationId(row.Area.building, row.Area.floor)}`;

const getLocationId = (building: string, floor: string) =>
  `${building}#${floor}`;

const setPrecisionOfDivision = (
  dividing: number,
  divided: number,
  precision: number
) => Math.round((dividing / divided) * 100);

const getIndexesOfDifferentStatuses = (
  donePercentage: ActivityWithAnchor[],
  donePercentageForPastDate: ActivityWithAnchor[]
): number[] => {
  if (!donePercentage?.length || !donePercentageForPastDate?.length)
    return emptyArray;

  return donePercentage.reduce((indexes, current, i) => {
    if (
      current?.activity?.status !==
      donePercentageForPastDate[i]?.activity?.status
    ) {
      indexes.push(i);
    }
    return indexes;
  }, [] as number[]);
};

const groupProgressByArea = (
  latestProgress: Progress,
  calculateActivityProgressByAnchors: (
    activities: ActivityWithAnchor[]
  ) => ActivityStatus,
  inFloorMode: boolean = true
) => {
  const progressAreaField = inFloorMode ? "floor" : "label";
  const userProgress = latestProgress.progressAreas?.reduce(
    (acc, progressArea) => {
      const key: { building: string; floor: string } = {
        building: progressArea.building,
        floor: progressArea[progressAreaField] ?? progressArea.floor,
      };
      acc[JSON.stringify(key)] = acc[JSON.stringify(key)] || [];
      acc[JSON.stringify(key)].push(progressArea);
      return acc;
    },
    {} as { [key: string]: ProgressArea[] }
  );
  const userProgressActivities = Object.entries(userProgress || {}).reduce(
    (acc, [buildingAndFloorString, progressAreas]) => {
      const buildingAndFloor: ActivityArea = JSON.parse(buildingAndFloorString);
      const keyObject: ActivityArea = {
        building: buildingAndFloor.building,
        floor: buildingAndFloor.floor,
        label: buildingAndFloor.label,
        anchor: buildingAndFloor.anchor,
      };
      const key = JSON.stringify(keyObject);
      acc[key] = progressAreas.reduce((activityAcc, progressArea) => {
        progressArea.activities?.forEach((activity) => {
          const activityWithAnchor: ActivityWithAnchor = {
            activity: activity,
            anchor: progressArea.anchor,
          };
          activityAcc[activity.activityName] =
            activityAcc[activity.activityName] || [];
          activityAcc[activity.activityName].push(activityWithAnchor);
        });
        return activityAcc;
      }, {} as { [activityName: string]: ActivityWithAnchor[] });
      return acc;
    },
    {} as { [key: string]: { [activityName: string]: ActivityWithAnchor[] } }
  );

  const data = Object.entries(userProgressActivities).map(
    ([buildingAndFloorKey, activities]) => {
      const buildingAndFloor: ActivityArea = JSON.parse(buildingAndFloorKey);
      const rowActivities = Object.entries(activities).map(
        ([activityName, activityDetails]) => ({
          activityName,
          status: calculateActivityProgressByAnchors(activityDetails),
          allStatuses: activityDetails,
        })
      );
      return { Area: buildingAndFloor, Activities: rowActivities };
    }
  );

  return data;
};

const normalizeCellIdentifier = (str: string) => {
  let result = str.substring(1);
  result = result.replace(/#fl/g, "#");
  return result;
};

const normalizeActivityName = (activity: string) =>
  activity.toLowerCase().replace(/\s/g, "");

export type ProgressDelaySeverity = "high" | "medium" | "low";
export type DisplayMode = "map" | "trend" | "comments" | undefined;

const getDelayLevel = (delay: number): ProgressDelaySeverity =>
  delay > 40 ? "high" : delay > 20 ? "medium" : "low";

const delayProbabilityMessage = (delay: number): string => {
  const severity = getDelayLevel(delay);
  return `${
    severity.charAt(0).toUpperCase() + severity.slice(1)
  } delay risk (${delay}%)`;
};

const getSumOfDelayMessage = (number1: number, number2: number): string => {
  let message = "";
  if (number1 > 0) {
    message += `${number1} High delay risk `;
  }
  if (number2 > 0) {
    message += `${number2} Medium delay risk `;
  }
  return message;
};

const activityLabel = (activity: string, labels: string[] | undefined) => {
  const index = labels?.findIndex((name: any) => name == activity) ?? -1;
  return labels && index !== -1 ? labels?.[index + 1] : activity;
};

const getCellDataPart = (
  cellData: string
): { building: string; floor: string; activity: string } => {
  const [building = "", floor = "", activity = ""] = cellData.split("#");

  return {
    building,
    floor,
    activity,
  };
};

interface TaskLink {
  id: string;
  source: string;
  target: string;
  type: number; // 0: FS, 1: SS, 2: FF, 3: SF
  lag?: number;
}

// Parse relationship strings like "16FS-50d" or "19SS"
const parseRelationship = (
  rel: string
): { taskIndex: number; type: number; lag: number } => {
  const match = rel.match(/^(\d+)((?:FS|SS|FF|SF)?(?:-?\d+d)?)/);
  if (!match) {
    return { taskIndex: parseInt(rel), type: 0, lag: 0 };
  }

  const taskIndex = parseInt(match[1]);
  const details = match[2];

  let type = 0; // Default to Finish-to-Start
  let lag = 0;

  if (details) {
    // Parse relationship type
    if (details.includes("SS")) type = 1;
    else if (details.includes("FF")) type = 2;
    else if (details.includes("SF")) type = 3;

    // Parse lag value
    const lagMatch = details.match(/-?(\d+)d/);
    if (lagMatch) {
      lag = parseInt(lagMatch[0]);
    }
  }

  return { taskIndex, type, lag };
};

// Helper function to create task mappings
const createTaskMappings = (tasks: TaskData[]) => {
  const taskIdToGuid = new Map<string, string>();
  const guidToTaskId = new Map<string, string>();

  // Create mappings based on MS Project row numbers
  // Skip the first task (index 0) as it doesn't appear in MS Project
  let msProjectRowCounter = 1; // Start from row 1 in MS Project

  tasks.forEach((task, index) => {
    if (task?.guid) {
      const taskGuid = task.guid.replace(/[{}]/g, "");

      // Skip the first task (index 0)
      if (index > 0) {
        const taskId = String(msProjectRowCounter);
        taskIdToGuid.set(taskId, taskGuid);
        guidToTaskId.set(taskGuid, taskId);
        msProjectRowCounter++;
      }
    }
  });

  return { taskIdToGuid, guidToTaskId };
};

export const transformTasksForGantt = (tasks: TaskData[]) => {
  // Create mappings for task identification
  const { taskIdToGuid, guidToTaskId } = createTaskMappings(tasks);

  // Process tasks - skip the first task (index 0)
  const data = tasks
    .filter((_, index) => index > 0) // Skip the first task
    .map((task) => ({
      id: task.guid ? task.guid.replace(/[{}]/g, "") : "",
      text: task.name || "",
      start_date: parseDayMonthShortYear(task.start || ""),
      duration: parseInt((task.duration || "0").replace(/[^\d]/g, "")),
      progress: 0,
      parent:
        task.wbs && task.wbs.includes(".")
          ? tasks
              .find(
                (t) =>
                  t.wbs === task.wbs?.substring(0, task.wbs.lastIndexOf("."))
              )
              ?.guid?.replace(/[{}]/g, "") || 0
          : 0,
      totalSlack: parseInt(task.totalSlack || "0") || 0,
    }));

  // Process links
  const links: TaskLink[] = [];
  const processedLinks = new Set<string>(); // To prevent duplicate links

  tasks.forEach((task) => {
    if (!task.guid) return; // Skip tasks without a GUID

    const taskGuid = task.guid.replace(/[{}]/g, "");

    // Process predecessors
    if (task.predecessor) {
      const predecessors = task.predecessor.split(",");
      predecessors.forEach((pred: string) => {
        const { taskIndex, type, lag } = parseRelationship(pred.trim());
        const sourceGuid = taskIdToGuid.get(String(taskIndex));

        if (sourceGuid && sourceGuid !== taskGuid) {
          // Prevent self-links
          const linkId = `${sourceGuid}_${taskGuid}`;
          // Only add if we haven't processed this link yet
          if (!processedLinks.has(linkId)) {
            links.push({
              id: linkId,
              source: sourceGuid,
              target: taskGuid,
              type,
              ...(lag && { lag }),
            });
            processedLinks.add(linkId);
          }
        }
      });
    }

    // Process successors
    if (task.successor) {
      const successors = task.successor.split(",");
      successors.forEach((succ: string) => {
        const { taskIndex, type, lag } = parseRelationship(succ.trim());
        const targetGuid = taskIdToGuid.get(String(taskIndex));

        if (targetGuid && targetGuid !== taskGuid) {
          // Prevent self-links
          const linkId = `${taskGuid}_${targetGuid}`;
          // Only add if we haven't processed this link yet
          if (!processedLinks.has(linkId)) {
            links.push({
              id: linkId,
              source: taskGuid,
              target: targetGuid,
              type,
              ...(lag && { lag }),
            });
            processedLinks.add(linkId);
          }
        }
      });
    }
  });

  return { data, links };
};

export {
  setPrecisionOfDivision,
  getRowLocationId,
  getRowIdFromLocationAndActivity,
  getLocationId,
  getRowWithActivityId,
  getIndexesOfDifferentStatuses,
  groupProgressByArea,
  normalizeCellIdentifier,
  getDelayLevel,
  delayProbabilityMessage,
  getSumOfDelayMessage,
  activityLabel,
  normalizeActivityName,
  getCellDataPart,
};
