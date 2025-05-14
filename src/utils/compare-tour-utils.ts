import { Area } from "../models";
import { SceneView } from "../components/panorama/types";
import { compareInfosByDate } from "./projects-utils";

const getComparableToursFromArea = (area: Area) =>
  area.infos?.sort(compareInfosByDate);

const isBimMode = (scene?: SceneView) => scene?.sceneId === COMPARE_3D;

const COMPARE_3D = "3D Model";

export { getComparableToursFromArea, isBimMode, COMPARE_3D };
