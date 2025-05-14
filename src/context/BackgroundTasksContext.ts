import { createContext, Dispatch, SetStateAction } from "react";
import { emptyFn } from "../utils/render-utils";

interface BackgroundTasksContextData {
  areBackgroundTasksRunning: boolean;
  pushTask: () => void;
  popTask: () => void;
  currentTask?: number;
  setCurrentTask: Dispatch<SetStateAction<number | undefined>>;
  totalTasks?: number;
  setTotalTasks: Dispatch<SetStateAction<number | undefined>>;
}

const BackgroundTasksContext = createContext<BackgroundTasksContextData>({
  areBackgroundTasksRunning: false,
  pushTask: emptyFn,
  popTask: emptyFn,
  currentTask: undefined,
  setCurrentTask: emptyFn,
  totalTasks: undefined,
  setTotalTasks: emptyFn,
});

export { BackgroundTasksContext };
