import { createContext, Dispatch, SetStateAction } from "react";
import { Area, Building, Floor, Project } from "../models";
import { SceneView } from "../components/panorama/types";
import { emptyFn } from "../utils/render-utils";

interface ProjectInformationContextData {
  currentScene?: SceneView;
  setCurrentScene: Dispatch<SetStateAction<SceneView | undefined>>;
  lastYaw: number;
  setLastYaw: Dispatch<SetStateAction<number>>;
  lastPitch: number;
  setLastPitch: Dispatch<SetStateAction<number>>;
  lastTopLocation: number;
  setLastTopLocation: Dispatch<SetStateAction<number>>;
  lastLeftLocation: number;
  setLastLeftLocation: Dispatch<SetStateAction<number>>;
  lastPlanYaw: number;
  setLastPlanYaw: Dispatch<SetStateAction<number>>;
  currentTour: string;
  setCurrentTour: Dispatch<SetStateAction<string>>;
  currentDate: string;
  setCurrentDate: Dispatch<SetStateAction<string>>;
  pastDate: string;
  setPastDate: Dispatch<SetStateAction<string>>;
  client: string | undefined;
  clientComment: string | undefined;
  commentId: string | undefined;
  userId: string | undefined;
  currentArea?: Area;
  setCurrentArea: Dispatch<SetStateAction<Area | undefined>>;
  currentFloor?: Floor;
  setCurrentFloor: Dispatch<SetStateAction<Floor | undefined>>;
  currentBuilding?: Building;
  setCurrentBuilding: Dispatch<SetStateAction<Building | undefined>>;
  currentPlan?: string;
  setCurrentPlan: Dispatch<SetStateAction<string>>;
  currentProject?: Project;
  setCurrentProject: Dispatch<SetStateAction<Project | undefined>>;
  projects?: Project[];
  setProjects: Dispatch<SetStateAction<Project[] | undefined>>;
  anchorId?: string;
  manualBuilding?: string;
  manualFloor?: string;
  inCompareMode?: boolean;
  setInCompareMode: Dispatch<SetStateAction<boolean | undefined>>;
}

export const ProjectInformationContext =
  createContext<ProjectInformationContextData>({
    currentScene: undefined,
    setCurrentScene: emptyFn,
    lastYaw: 0,
    setLastYaw: emptyFn,
    lastPitch: 0,
    setLastPitch: emptyFn,
    currentTour: "",
    setCurrentTour: emptyFn,
    lastTopLocation: 0,
    setLastTopLocation: emptyFn,
    lastLeftLocation: 0,
    setLastLeftLocation: emptyFn,
    lastPlanYaw: 0,
    setLastPlanYaw: emptyFn,
    currentDate: "",
    setCurrentDate: emptyFn,
    pastDate: "",
    setPastDate: emptyFn,
    client: undefined,
    clientComment: undefined,
    commentId: undefined,
    userId: undefined,
    currentArea: undefined,
    setCurrentArea: emptyFn,
    currentFloor: undefined,
    setCurrentFloor: emptyFn,
    currentBuilding: undefined,
    setCurrentBuilding: emptyFn,
    currentPlan: undefined,
    setCurrentPlan: emptyFn,
    currentProject: undefined,
    setCurrentProject: emptyFn,
    projects: undefined,
    setProjects: emptyFn,
    inCompareMode: false,
    setInCompareMode: emptyFn,
    anchorId: undefined,
    manualBuilding: undefined,
    manualFloor: undefined,
  });
