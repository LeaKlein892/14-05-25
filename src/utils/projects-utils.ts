import {
  ActivityStatus,
  Area,
  Building,
  Floor,
  Info,
  PlanLinks,
  Project,
} from "../models";
import dayjs from "dayjs";
import { API } from "aws-amplify";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { getProject } from "../graphql/queries";
import { setProjectSession } from "./project-session-manager";
import { SelectedScene } from "../components/panorama/types";
import { dateAsYMD } from "./date-utils";
import { emptyArray } from "./render-utils";

import customParseFormat from "dayjs/plugin/customParseFormat";
import { ClassNameMap } from "@mui/styles/withStyles";
import { OrderedPhotoRecord } from "../components/plan/plan-annotations/PlanAnnotationsTypes";
dayjs.extend(customParseFormat);

const dateFormat = "DD-MM-YY";

export interface TourDetails {
  building: Building;
  floor: Floor;
  area: Area;
  info: Info;
}
const getDefaults = (project: Project) => {
  let result: TourDetails = {
    info: new Info({
      plan: "",
      tour: "",
      sceneId: 0,
      date: "",
    }),
    area: new Area({
      name: "",
    }),
    building: new Building({
      name: "",
    }),
    floor: new Floor({
      name: "",
    }),
  };

  let abort = false;

  project.buildings?.some((building) => {
    building.floors?.some((floor) => {
      floor.areas?.some((area) => {
        area.infos?.some((info) => {
          if (info.plan && info.plan !== "") {
            if (
              result.info.date === "" ||
              compareInfosByDate(result.info, info) === 1
            ) {
              result = { info, building, floor, area };
            }
          }
        });
        abort = true;
        return abort;
      });
      return abort;
    });
    return abort;
  });

  return result;
};

const initialPointKey = (project: string = "") => project + "_" + dateAsYMD();

const compareDates = (
  infoDate: dayjs.Dayjs,
  otherInfoDate: dayjs.Dayjs,
  putBlueprintFirst: boolean = true
) => {
  if ((!infoDate.isValid() || !otherInfoDate.isValid()) && !putBlueprintFirst) {
    return infoDate.isValid() ? -1 : 1;
  }
  if (infoDate.isBefore(otherInfoDate)) {
    return 1;
  }
  if (infoDate.isAfter(otherInfoDate)) {
    return -1;
  }
  return 0;
};

const getPhotoDirName = (planUrl?: string, projectId?: string) => {
  if (!planUrl || !projectId) {
    return "";
  }
  const { building, floor } = getProjectDetailsFromPlanUrl(planUrl);
  const dirDate = dateAsYMD();
  if (building && floor) {
    return projectId + "/" + building + "/" + floor + "/" + dirDate;
  } else {
    return "";
  }
};

const compareDatesStrings = (
  date: string,
  otherDate: string,
  putBlueprintFirst?: boolean
) => {
  const infoDate = dayjs(date, dateFormat);
  const otherInfoDate = dayjs(otherDate, dateFormat);
  return compareDates(infoDate, otherInfoDate, putBlueprintFirst);
};

const compareInfosByDate = (
  info: Info,
  otherInfo: Info,
  putBlueprintFirst?: boolean
) => {
  const dateStr = info.date;
  const otherDateStr = otherInfo.date;
  return compareDatesStrings(dateStr, otherDateStr, putBlueprintFirst);
};

const compareByNumericName = (
  object: Floor | Area,
  otherObject: Floor | Area
) => {
  const nName: number = parseInt(object.name);
  const nOtherName: number = parseInt(otherObject.name);
  const sName: string = object.name.toLowerCase();
  const sOtherName: string = otherObject.name.toLowerCase();

  if (!isNaN(nName) && !isNaN(nOtherName)) {
    return nName - nOtherName;
  } else if (!isNaN(nName)) {
    return -1;
  } else if (!isNaN(nOtherName)) {
    return 1;
  }
  // alphabetical order for NaNs
  else if (sName > sOtherName) {
    return 1;
  } else if (sName < sOtherName) {
    return -1;
  }
  return 0;
};

function getAreaOfPlan(project: Project, plan: string): Area | undefined {
  if (!project.buildings) return undefined;

  for (const building of project.buildings) {
    if (!building.floors) continue;

    for (const floor of building.floors) {
      if (!floor.areas) continue;

      for (const area of floor.areas) {
        const foundInfo = area?.infos?.find((info) => info.plan === plan);
        if (foundInfo) {
          return area;
        }
      }
    }
  }

  return undefined;
}

interface ProjectDetails {
  building?: string;
  floor?: string;
}

const projectNameFromUrl = (url: string) => {
  const afterHttpsPrefix = url.split("https://");
  if (afterHttpsPrefix.length > 1) {
    const projectName = afterHttpsPrefix[1].split(".");
    return projectName[0];
  }
  return "";
};

const getProjectDetailsFromPlanUrl = (planUrl: string): ProjectDetails => {
  const splitDots = planUrl.split(".");
  if (splitDots.length >= 2) {
    const buildingAndPlanPart = splitDots[splitDots.length - 2];
    const splitRelevantPart = buildingAndPlanPart.split("/");
    if (splitRelevantPart.length >= 2) {
      const building = splitRelevantPart[splitRelevantPart.length - 2];
      const floor = splitRelevantPart[splitRelevantPart.length - 1];
      return { building, floor };
    }
  }
  return { building: undefined, floor: undefined };
};

const getProjectDetailsFromDataUrl = (dataUrl: string): ProjectDetails => {
  const splitByTour = dataUrl.split("tour");
  if (splitByTour.length === 2) {
    const buildingAndPlanPart = splitByTour[1];
    const splitRelevantPart = buildingAndPlanPart.split("/");
    if (splitRelevantPart.length >= 2) {
      const building = splitRelevantPart[splitRelevantPart.length - 2];
      const floor = splitRelevantPart[splitRelevantPart.length - 1];
      return { building, floor };
    }
  }
  return { building: undefined, floor: undefined };
};

const getFloorName = (floor?: string): string => {
  if (floor) {
    if (floor.startsWith("fl")) {
      return floor.substring(2);
    }
    return floor;
  }
  return "";
};

const getAllToursAndPlansMap = (project: Project) => {
  let results = new Map<string, TourDetails>();

  project.buildings?.forEach((building) => {
    building.floors?.forEach((floor) => {
      floor.areas?.forEach((area) => {
        area.infos?.forEach((info) => {
          if (info.tour && info.tour !== "") {
            results.set(info.tour, {
              info: info,
              area: area,
              floor: floor,
              building: building,
            });
          }
        });
      });
    });
  });

  return results;
};

const stringContainsAnyDates = (
  dates: string[],
  stringToSearchOver: string
) => {
  return dates.some((date) => stringToSearchOver.includes(date));
};

const doesBuildingContainAnyDate = (
  building: Building,
  dates: string[] | undefined
) => {
  if (dates) {
    const buildingString = JSON.stringify(building);
    return stringContainsAnyDates(dates, buildingString);
  }
  return true;
};

const doesFloorContainAnyDate = (floor: Floor, dates: string[] | undefined) => {
  if (dates) {
    const floorString = JSON.stringify(floor);
    return stringContainsAnyDates(dates, floorString);
  }
  return true;
};

const fetchProjectFromName = async (
  projectName: string
): Promise<Project | undefined> => {
  const data: any = await API.graphql({
    query: getProject,
    variables: { id: projectName },
    authMode: GRAPHQL_AUTH_MODE.API_KEY,
  });
  const project = data.data.getProject;
  return !!project ? project : undefined;
};
const getSessionStorageItem = (key: string) => {
  const item = sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
};

const initProjectRecord = async (
  projectsList: string[] | undefined = emptyArray,
  recordString: string,
  selectedScene?: SelectedScene
) => {
  const projectName = projectNameFromUrl(recordString);
  if (!projectsList.includes(projectName)) return;
  const redirectSuffix = !!selectedScene ? "Tour" : "Plan";
  const project = await fetchProjectFromName(projectName);
  project?.buildings?.forEach((building) => {
    building.floors?.forEach((floor) => {
      floor.areas?.forEach((area) => {
        area.infos?.forEach((info) => {
          if (info.tour && info.tour === recordString) {
            setProjectSession({
              tour: info.tour,
              plan: info.plan,
              date: info.date,
              selectedScene: !!selectedScene
                ? selectedScene
                : {
                    sceneId: "1_0_0",
                    yaw: 0,
                    pitch: 0,
                    fov: 0,
                  },
              area,
              project,
              floor,
              building,
            });
            window.location.replace(`/?load${redirectSuffix}=1`);
            return;
          }
        });
      });
    });
  });
};
function getArea(
  currentArea: Area | undefined,
  floorToSet: string | undefined
) {
  return currentArea?.type === "FLOOR"
    ? "fl" + floorToSet
    : currentArea?.name || "";
}

function getBuilding(
  currentBuilding: Building | undefined,
  building: string | undefined
) {
  return (currentBuilding?.name ? currentBuilding?.name : building) || "";
}

const planExistsForFloor = (f: Floor) => {
  const areas = f?.areas ?? [];
  for (const currentArea of areas) {
    const infos = currentArea?.infos ?? [];
    for (const currentInfo of infos) {
      if (currentInfo.date !== "blueprint") {
        return true;
      }
    }
  }
  return false;
};

const planExistsForBuilding = (b: Building) => {
  const currentBuilding = b;
  const floors = currentBuilding?.floors ?? [];
  for (const currentFloor of floors) {
    const areas = currentFloor?.areas ?? [];
    for (const currentArea of areas) {
      const infos = currentArea?.infos ?? [];
      for (const currentInfo of infos) {
        if (currentInfo.date !== "blueprint") {
          return true;
        }
      }
    }
  }
  return false;
};

function getFilePath(plan: string, project: string) {
  return `public/images/${getPhotoDirName(plan, project)}/`;
}

const is3DTour = (currentTour: string) =>
  currentTour.startsWith("https://ion.");

function getClassForStatus(
  activityStatus: ActivityStatus,
  classes: ClassNameMap<
    "completed" | "notStarted" | "inProgress" | "irrelevant"
  >
): keyof typeof classes {
  switch (activityStatus) {
    case ActivityStatus.DONE:
      return "completed";
    case ActivityStatus.NOT_STARTED:
      return "notStarted";
    case ActivityStatus.IN_PROGRESS:
      return "inProgress";
    case ActivityStatus.IRRELEVANT:
      return "irrelevant";
    default:
      return "irrelevant";
  }
}

function convertStatusToString(activityStatus: ActivityStatus) {
  switch (activityStatus) {
    case ActivityStatus.DONE:
      return "Done";
    case ActivityStatus.NOT_STARTED:
      return "Not Started";
    case ActivityStatus.IN_PROGRESS:
      return " In Progress";
    case ActivityStatus.IRRELEVANT:
      return "Irrelevant";
  }
}

const findNearestScene = (
  planLinks: PlanLinks,
  currentRecord: OrderedPhotoRecord
) => {
  let minDistance, minSceneId;
  for (const location of planLinks?.linkLocations.filter(
    (loc) => loc.linkItemType !== "IMAGE_PLAIN_ZOOMABLE"
  )) {
    if (currentRecord?.leftLocation && currentRecord?.topLocation) {
      const horizontalDistance =
        location.leftLocation - currentRecord?.leftLocation;
      const verticalDistance =
        location.topLocation - currentRecord?.topLocation;
      const distance = Math.hypot(horizontalDistance, verticalDistance);
      if (!minDistance || distance < minDistance) {
        minDistance = distance;
        minSceneId = location.sceneId;
      }
    }
  }
  return minSceneId;
};

export {
  getDefaults,
  initialPointKey,
  compareInfosByDate,
  compareDatesStrings,
  compareByNumericName,
  getAllToursAndPlansMap,
  doesBuildingContainAnyDate,
  doesFloorContainAnyDate,
  initProjectRecord,
  getPhotoDirName,
  getFloorName,
  getProjectDetailsFromPlanUrl,
  getProjectDetailsFromDataUrl,
  projectNameFromUrl,
  getAreaOfPlan,
  fetchProjectFromName,
  is3DTour,
  getArea,
  getBuilding,
  getFilePath,
  planExistsForFloor,
  planExistsForBuilding,
  getClassForStatus,
  convertStatusToString,
  getSessionStorageItem,
  findNearestScene,
};
