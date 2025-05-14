import * as React from "react";
import {
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getQueryArgs } from "../../../utils/query-params";
import { CenterPageLoader } from "../../loader/CenterPageLoader";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { AppModeEnum, ViewContext } from "../../../context/ViewContext";
import { FriendlyError } from "../../friendly-error/FriendlyError";
import { Comment } from "../../../models";
import PlanViewer from "../plan-viewer/PlanViewer";
import { usePlanLinks } from "../../../hooks/usePlanLinks";
import { useComments } from "../../../hooks/useComments";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import {
  fetchProjectFromName,
  getAreaOfPlan,
  getSessionStorageItem,
  initProjectRecord,
  projectNameFromUrl,
} from "../../../utils/projects-utils";
import { analyticsEvent } from "../../../utils/analytics";
import { useBimTransformation } from "../../../hooks/useBimTransformation";
import { emptyArray } from "../../../utils/render-utils";
import { isReseller } from "../../../utils/clients";

const BimModel = lazy(() => import("../bim/bim-model/BimModel"));

let scale = parseFloat(getQueryArgs("scale", 1));
let planArg = getQueryArgs("pdf");
let planDate = getQueryArgs("date");

const sceneIdToNumberOfComments: Map<string, number> = new Map<
  string,
  number
>();
const sceneIdToDefaultComment: Map<string, Comment> = new Map<
  string,
  Comment
>();

const createIdMapsFromComments = (comments: Comment[]) => {
  const idMap: Map<string, number> = new Map();
  comments
    .filter((c) => !c.resolved)
    .forEach((comment) => {
      updateCommentsMap(comment, idMap, true);
    });
  return idMap;
};

const updateCommentsMap = (
  comment: Comment,
  currentMap: Map<string, number>,
  increase: boolean
) => {
  const sceneId =
    comment && comment.scene && comment.scene.sceneId
      ? comment.scene.sceneId.toString()
      : undefined;
  if (sceneId) {
    const currentNumber = currentMap.get(sceneId) || 0;
    if (currentNumber === 0) {
      sceneIdToDefaultComment.set(sceneId, comment);
    }
    const valueToAdd = increase ? 1 : -1;
    currentMap.set(sceneId, currentNumber + valueToAdd);
  }
  return new Map(currentMap);
};

export interface PlanWrapperProps {
  embeddedMode?: boolean;
  switchSceneById?: (
    id?: string,
    yaw?: number,
    pitch?: number,
    fov?: number
  ) => void;
}

const PlanWrapper: React.FC<PlanWrapperProps> = ({
  embeddedMode = false,
  switchSceneById,
}) => {
  const {
    currentPlan,
    setCurrentPlan,
    currentDate,
    currentProject,
    currentTour,
    setCurrentTour,
    currentArea,
    setCurrentArea,
    setCurrentProject,
    setCurrentDate,
    client,
  } = useContext(ProjectInformationContext);
  const { appMode, planScale } = useContext(ViewContext);
  const {
    loggedUser: { participatesInProjects = emptyArray, username },
  } = useContext(LoggedUserContext);

  const [showingBim, setShowingBim] = useState(false);

  const [idToNumberOfComments, setIdToNumberOfComments] = useState<
    Map<string, number>
  >(sceneIdToNumberOfComments);

  const [idToDefaultComment, setIdToDefaultComment] = useState<
    Map<string, Comment>
  >(sceneIdToDefaultComment);

  if (planScale) {
    scale = planScale;
  }

  let comments = useComments(currentTour);

  useEffect(() => {
    setIdToNumberOfComments(createIdMapsFromComments(comments as Comment[]));
    setIdToDefaultComment(sceneIdToDefaultComment);
  }, [comments]);
  const sceneTourData = getSessionStorageItem("SceneTourData");
  const planToLoad = sceneTourData
    ? sceneTourData.plan
    : currentPlan
    ? currentPlan
    : planArg;
  const dateToLoad = sceneTourData
    ? sceneTourData.date
    : currentDate
    ? currentDate
    : planDate;
  if (!currentDate) {
    setCurrentDate(planDate);
  }

  const hasMultiplePlans = currentArea?.hasMultiplePlans || false;
  let planLinks = usePlanLinks(planToLoad, dateToLoad, 0, hasMultiplePlans);
  let planBimTransformation = useBimTransformation(planToLoad);

  useEffect(() => {
    if (planLinks && planLinks !== null && !sceneTourData) {
      setCurrentTour(planLinks.tourDataUrl);
    }
  }, [planLinks, setCurrentTour]);

  useEffect(() => {
    if (
      appMode === AppModeEnum.planView &&
      participatesInProjects &&
      participatesInProjects.length > 0 &&
      !!planLinks
    ) {
      initProjectRecord(
        participatesInProjects,
        planLinks.tourDataUrl,
        undefined
      );
    }
  }, [participatesInProjects, planLinks, appMode]);

  useEffect(() => {
    if (
      (!participatesInProjects || participatesInProjects.length === 0) &&
      isReseller(client)
    ) {
      const projectName = projectNameFromUrl(planToLoad);
      fetchProjectFromName(projectName)
        .then((project) => {
          if (project) {
            const area = getAreaOfPlan(project, planToLoad);
            if (area) {
              setCurrentArea(area);
              setCurrentPlan(planToLoad);
              setCurrentProject(project);
            }
          }
        })
        .catch((e: any) => {
          console.log("Failed to fetch project: ", e);
        });
    }
  }, [
    appMode,
    planToLoad,
    client,
    participatesInProjects,
    setCurrentPlan,
    setCurrentArea,
    setCurrentProject,
  ]);

  const shouldChooseProject =
    (!planToLoad || planToLoad === "") &&
    appMode === AppModeEnum.projectView &&
    !currentProject;

  if (!shouldChooseProject) {
    document.title = currentProject?.name || "Castory Web App";
  }

  const toggleBimMode = useCallback(() => {
    analyticsEvent(
      "Plan",
      showingBim
        ? "Bim Model Set Open From Plan - Off"
        : "Bim Model Set Open From Plan - On",
      username
    );
    setShowingBim(!showingBim);
  }, [username, showingBim]);

  return (
    <React.Fragment>
      {!shouldChooseProject ? (
        <Suspense fallback={<CenterPageLoader loading={true} />}>
          {!showingBim || !planBimTransformation ? (
            <PlanViewer
              plan={planToLoad}
              scale={scale}
              planLinks={planLinks}
              embeddedMode={embeddedMode}
              sceneIdToNumberOfComments={idToNumberOfComments}
              sceneIdToDefaultComment={idToDefaultComment}
              toggleBimMode={toggleBimMode}
              hasBim={!!planBimTransformation}
              switchSceneById={switchSceneById}
            />
          ) : (
            <BimModel
              planBimTransformation={planBimTransformation}
              onClose={toggleBimMode}
              forceFirstPerson
            />
          )}
        </Suspense>
      ) : (
        <FriendlyError
          link="/project"
          message="No project selected!"
          linkText="Select Project"
        />
      )}
    </React.Fragment>
  );
};

export default React.memo(PlanWrapper);
