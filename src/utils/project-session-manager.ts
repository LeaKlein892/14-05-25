import { SelectedScene } from "../components/panorama/types";
import { Area, Building, Floor, Project } from "../models";

export interface ProjectSession {
  tour: string;
  plan: string;
  date: string;
  selectedScene?: SelectedScene;
  area?: Area;
  project?: Project;
  building?: Building;
  floor?: Floor;
}

type SessionKey =
  | "Tour"
  | "Plan"
  | "Date"
  | "Scene"
  | "Area"
  | "Project"
  | "Building"
  | "Floor";

const getSessionKey = (key: SessionKey, defaultValue = ""): string => {
  return !!sessionStorage.getItem(key)
    ? (sessionStorage.getItem(key) as string)
    : defaultValue;
};

const setSessionKey = (key: SessionKey, value: string): void => {
  sessionStorage.setItem(key, value);
};

const getProjectSession = (): ProjectSession => {
  const sceneSessionKey = getSessionKey("Scene", undefined);
  const areaSessionKey = getSessionKey("Area", undefined);
  const projectSessionKey = getSessionKey("Project", undefined);
  const buildingSessionKey = getSessionKey("Building", undefined);
  const floorSessionKey = getSessionKey("Floor", undefined);
  return {
    tour: getSessionKey("Tour"),
    plan: getSessionKey("Plan"),
    date: getSessionKey("Date"),
    selectedScene: sceneSessionKey ? JSON.parse(sceneSessionKey) : undefined,
    area: areaSessionKey ? JSON.parse(areaSessionKey) : undefined,
    project: projectSessionKey ? JSON.parse(projectSessionKey) : undefined,
    building: buildingSessionKey ? JSON.parse(buildingSessionKey) : undefined,
    floor: floorSessionKey ? JSON.parse(floorSessionKey) : undefined,
  };
};

const setProjectSession = (projectSession: ProjectSession): void => {
  setSessionKey("Tour", projectSession.tour);
  setSessionKey("Plan", projectSession.plan);
  setSessionKey("Date", projectSession.date);
  setSessionKey("Scene", JSON.stringify(projectSession.selectedScene));
  setSessionKey("Area", JSON.stringify(projectSession.area));
  setSessionKey("Project", JSON.stringify(projectSession.project));
  setSessionKey("Building", JSON.stringify(projectSession.building));
  setSessionKey("Floor", JSON.stringify(projectSession.floor));
};

const clearProjectSession = () => {
  sessionStorage.clear();
};

export {
  getProjectSession,
  setProjectSession,
  clearProjectSession,
  setSessionKey,
};
