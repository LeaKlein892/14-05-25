import { Progress, ProgressCategory } from "../../models";
import { emptyArray } from "../../utils/render-utils";
import { ProjectCacheProgress } from "./progress-operations";

const defaultDod = 100;
let lastProject = "";
let lastProjectProgress: Progress[] = emptyArray;
let lastProjectLabels: string[] | undefined;
let lastProjectDod: number | undefined = defaultDod;
let lastProjectCategories: ProgressCategory[] | undefined;

function getCachedProgress(project: string): ProjectCacheProgress {
  if (project === lastProject) {
    return {
      progress: lastProjectProgress,
      labels: lastProjectLabels,
      dod: lastProjectDod,
      categories: lastProjectCategories,
    };
  }
  return { progress: emptyArray, labels: [], dod: defaultDod, categories: [] };
}

function setCacheProgress(
  project: string,
  progress: Progress[],
  labels?: string[],
  dod?: number,
  categories?: ProgressCategory[]
) {
  lastProject = project;
  lastProjectProgress = progress;
  lastProjectLabels = labels;
  lastProjectDod = dod || defaultDod;
  lastProjectCategories = categories;
}

function clearCacheProgress() {
  lastProject = "";
  lastProjectProgress = emptyArray;
  lastProjectLabels = undefined;
  lastProjectDod = defaultDod;
  lastProjectCategories = undefined;
}

export { getCachedProgress, setCacheProgress, clearCacheProgress };
