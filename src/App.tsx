import React, { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { ProjectInformationContext } from "./context/ProjectInformationContext";
import { AppModeEnum, ViewContext } from "./context/ViewContext";
import { Navbar } from "./components/navbar/Navbar";
import {
  Area,
  Building,
  Floor,
  Project,
  ScanRecord,
  UserProfile,
} from "./models";
import { TabValue } from "./components/navbar/NavbarLinks";
import { makeStyles } from "@mui/styles";
import { createStyles } from "@mui/styles";
import { SceneView } from "./components/panorama/types";
import {
  analyticsPage,
  initAnalytics,
  withSentryProfiler,
} from "./utils/analytics";
import { withAuthenticator } from "@aws-amplify/ui-react";
import { LoggedUserContext } from "./context/LoggedUserContext";
import { getQueryArgs, getUrlWithoutParam } from "./utils/query-params";
import { getProjectSession } from "./utils/project-session-manager";
import { CenterPageLoader } from "./components/loader/CenterPageLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useIsIOS from "./hooks/useIsIOS";
import {
  sendSelectedProject,
  subscribeToNativeMessages,
  webViewMode,
} from "./utils/webview-messenger";
import {
  deleteStorageKeyValue,
  getStorageKeyValue,
  setStorageKeyTime,
  timeDiffFromToday,
} from "./utils/storage-manager";
import { BackgroundTasksContext } from "./context/BackgroundTasksContext";
import { EXPONET, isExponetUrl } from "./utils/clients";
import { API } from "aws-amplify";
import {
  createPlanInitialPoint,
  updatePlanInitialPoint,
} from "./graphql/mutations";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { getPlanInitialPoint } from "./graphql/queries";
import { initialPointKey } from "./utils/projects-utils";
import { CreatePlanInitialPointInput } from "./API";

const pushRecordsSavedOffline = async (
  scanRecord: ScanRecord,
  initialPoint: string
) => {
  try {
    const lastInitialPoint: any = await API.graphql({
      query: getPlanInitialPoint,
      variables: { id: initialPoint },
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    });
    if (!!lastInitialPoint.data.getPlanInitialPoint) {
      const scanRecordsArray = [
        ...lastInitialPoint.data.getPlanInitialPoint.scanRecords,
      ];
      scanRecordsArray.push(scanRecord);
      await API.graphql({
        query: updatePlanInitialPoint,
        variables: {
          input: {
            id: lastInitialPoint.data.getPlanInitialPoint.id,
            scanRecords: scanRecordsArray,
          },
        },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
    } else {
      const initialPointInput: CreatePlanInitialPointInput = {
        id: initialPoint,
        matched: false,
        scanRecords: [scanRecord],
      };
      await API.graphql({
        query: createPlanInitialPoint,
        variables: { input: initialPointInput },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const ProjectsView = lazy(
  () => import("./components/project/projects-view/ProjectsView")
);
const Tour = lazy(() => import("./components/tour/Tour"));
const PlanWrapper = lazy(
  () => import("./components/plan/plan-wrapper/PlanWrapper")
);
const PlanInAnchor = lazy(
  () => import("./components/plan/plan-in-anchor/PlanInAnchor")
);
const TasksView = lazy(() => import("./components/tasks/tasks-view/TasksView"));
const TaskForm = lazy(() => import("./components/tasks/task-form/TaskForm"));
const InstallPWA = lazy(() => import("./components/install-pwa/InstallPWA"));
const Settings = lazy(() => import("./components/account/settings/Settings"));
const Scans = lazy(() => import("./components/account/scans/Scans"));
const VideosUploader = lazy(
  () => import("./components/videos-uploader/VideosUploader")
);
const ProjectAdmit = lazy(
  () => import("./components/project/project-admit/ProjectAdmit")
);
const BimMatcher = lazy(
  () => import("./components/plan/bim/bim-matcher/BimMatcher")
);

const PlanImagesRegistrator = lazy(
  () =>
    import(
      "./components/registration/plan-images-registrator/PlanImagesRegistrator"
    )
);

const ProjectRegistrations = lazy(
  () =>
    import(
      "./components/registration/project-registrations/ProjectRegistrations"
    )
);

const AnchorsMap = lazy(
  () => import("./components/anchors/anchors-map/AnchorsMap")
);

const pathname = window.location.pathname;
const pathParts = pathname.split("/");
const mainRoute = "/" + pathParts[1];
let appMode =
  pathname === "" || pathname === "/"
    ? AppModeEnum.projectView
    : (mainRoute as AppModeEnum);

const tokenArg = getQueryArgs("token");
const taskArg = getQueryArgs("taskId");
let redirected = false;
let tasksRunning = 0;

const showUploader = timeDiffFromToday("VIDEO_UPLOADED") <= 2;
const inWebViewMode = webViewMode();

const useStyles = makeStyles((theme: any) =>
  createStyles({
    App: {
      height: "100vh",
      width: "100%",
    },
  })
);

const messageStyle = { zIndex: 25000 };

const client = getQueryArgs("client") || (isExponetUrl() ? EXPONET : undefined);
const clientComment = getQueryArgs("clientComment");
const commentId = getQueryArgs("commentId");
const userId = getQueryArgs("userId");
const anchorId: string = getQueryArgs("anchorId");
const manualBuilding = getQueryArgs("building");
const manualFloor = getQueryArgs("floor");

initAnalytics();

function App() {
  let location = useLocation();
  const classes = useStyles();
  const { prompt } = useIsIOS();
  const [openIOS, setOpenIOS] = useState(true);

  const handleCloseIOS = useCallback(() => {
    setOpenIOS(false);
  }, []);

  if (tokenArg && !redirected) {
    redirected = true;
    window.sessionStorage.setItem("token", tokenArg);
    window.location.replace(getUrlWithoutParam("token"));
  }

  useEffect(() => {
    if (inWebViewMode) {
      const selectedProjectId = getStorageKeyValue("SELECTED_PROJECT");
      if (selectedProjectId) {
        sendSelectedProject(selectedProjectId);
      }
    }
    const savedOfflineValue = getStorageKeyValue("SCAN_SAVED_OFFLINE");
    const ProjectNamesavedOfflineValue = getStorageKeyValue(
      "PROJECT_NAME_OF_SCANS_SAVED_OFFLINE"
    );
    if (
      savedOfflineValue !== undefined &&
      savedOfflineValue !== null &&
      ProjectNamesavedOfflineValue !== undefined &&
      ProjectNamesavedOfflineValue !== null
    ) {
      const savedOfflineValueArr = JSON.parse(savedOfflineValue);
      const ProjectNamesavedOfflineValueArr = JSON.parse(
        ProjectNamesavedOfflineValue
      );
      deleteStorageKeyValue("SCAN_SAVED_OFFLINE");
      deleteStorageKeyValue("PROJECT_NAME_OF_SCANS_SAVED_OFFLINE");
      savedOfflineValueArr.forEach((element: ScanRecord, index: number) => {
        const projectName = initialPointKey(
          ProjectNamesavedOfflineValueArr[index]
        );
        pushRecordsSavedOffline(element, projectName);
      });
    }
  }, []);

  useEffect(() => {
    const pathname = location.pathname;
    analyticsPage(pathname);
    setTabValue(pathname as any);
  }, [location]);

  // Project Information Context
  const [currentScene, setCurrentScene] = useState<SceneView | undefined>(
    getProjectSession().selectedScene
  );
  const [lastYaw, setLastYaw] = useState<number>(0);
  const [lastPitch, setLastPitch] = useState<number>(0);
  const [lastTopLocation, setLastTopLocation] = useState<number>(0);
  const [lastLeftLocation, setLastLeftLocation] = useState<number>(0);
  const [lastPlanYaw, setLastPlanYaw] = useState<number>(0);
  const [currentTour, setCurrentTour] = useState(getProjectSession().tour);
  const [currentDate, setCurrentDate] = useState<string>(
    getProjectSession().date
  );
  const [pastDate, setPastDate] = useState<string>("");
  const [currentArea, setCurrentArea] = useState<Area | undefined>(
    getProjectSession().area
  );
  const [currentFloor, setCurrentFloor] = useState<Floor | undefined>(
    getProjectSession().floor
  );
  const [currentBuilding, setCurrentBuilding] = useState<Building | undefined>(
    getProjectSession().building
  );
  const [currentPlan, setCurrentPlan] = useState(getProjectSession().plan);
  const [currentProject, setCurrentProject] = useState<Project | undefined>(
    getProjectSession().project
  );
  const [projects, setProjects] = useState<Project[] | undefined>(undefined);

  // View Context
  const [inCompareMode, setInCompareMode] = useState<boolean | undefined>(
    false
  );
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [uploaderShown, setUploaderShown] = useState(showUploader);
  const [tabValue, setTabValue] = React.useState(TabValue.Projects);
  const [planScale, setPlanScale] = React.useState<number | undefined>(
    undefined
  );

  const openUploader = useCallback((open: boolean) => {
    setUploaderShown(open);
    open
      ? setStorageKeyTime("VIDEO_UPLOADED")
      : deleteStorageKeyValue("VIDEO_UPLOADED");
  }, []);

  //Logged User Context
  const [loggedUser, setLoggedUser] = useState<UserProfile>({
    id: "",
    username: "",
    email: "",
  });

  const [areBackgroundTasksRunning, setAreBackgroundTasksRunning] =
    useState(false);

  const pushTask = useCallback(() => {
    tasksRunning++;
    setAreBackgroundTasksRunning(true);
  }, []);

  const popTask = useCallback(() => {
    tasksRunning > 0 && tasksRunning--;
    if (tasksRunning === 0) {
      setAreBackgroundTasksRunning(false);
      setCurrentTask(undefined);
      setTotalTasks(undefined);
    }
  }, []);

  const [currentTask, setCurrentTask] = useState<number | undefined>(undefined);
  const [totalTasks, setTotalTasks] = useState<number | undefined>(undefined);

  useEffect(() => {
    subscribeToNativeMessages({
      startLoader: pushTask,
      stopLoader: popTask,
      setCurrentTask,
      setTotalTasks,
    });
  }, [pushTask, popTask]);

  const planWrapper = useCallback(
    (props: any) => (
      <PlanWrapper key={`${currentPlan}_${currentDate}`} {...props} />
    ),
    [currentPlan, currentDate]
  );

  const enablePWAPrompt = prompt && openIOS;
  const enableVideoUploading = webViewMode() && uploaderShown;

  return (
    <div className={classes.App}>
      <ViewContext.Provider
        value={{
          appMode,
          navbarOpen,
          setNavbarOpen,
          tabValue,
          setTabValue,
          planScale,
          setPlanScale,
          openUploader,
        }}
      >
        <ProjectInformationContext.Provider
          value={{
            currentScene,
            setCurrentScene,
            lastYaw,
            setLastYaw,
            lastPitch,
            setLastPitch,
            lastTopLocation,
            setLastTopLocation,
            lastLeftLocation,
            setLastLeftLocation,
            lastPlanYaw,
            setLastPlanYaw,
            currentTour,
            setCurrentTour,
            currentDate,
            setCurrentDate,
            pastDate,
            setPastDate,
            client,
            clientComment,
            commentId,
            userId,
            currentArea,
            setCurrentArea,
            currentFloor,
            setCurrentFloor,
            currentBuilding,
            setCurrentBuilding,
            currentPlan,
            setCurrentPlan,
            currentProject,
            setCurrentProject,
            projects,
            setProjects,
            inCompareMode,
            setInCompareMode,
            anchorId,
            manualBuilding,
            manualFloor,
          }}
        >
          <LoggedUserContext.Provider
            value={{
              loggedUser,
              setLoggedUser,
            }}
          >
            <BackgroundTasksContext.Provider
              value={{
                areBackgroundTasksRunning,
                pushTask,
                popTask,
                currentTask,
                setCurrentTask,
                totalTasks,
                setTotalTasks,
              }}
            >
              <Navbar />
              <ToastContainer
                position="bottom-center"
                autoClose={3000}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover
                theme="colored"
                style={messageStyle}
              />
              <Suspense fallback={null}>
                {enablePWAPrompt && (
                  <InstallPWA
                    open={enablePWAPrompt}
                    handleClose={handleCloseIOS}
                  />
                )}
                {enableVideoUploading && (
                  <VideosUploader hide={!enableVideoUploading} />
                )}
              </Suspense>
              <Suspense fallback={<CenterPageLoader loading={true} />}>
                <Switch>
                  <Route exact path="/">
                    <Redirect to="/project" />
                  </Route>
                  <Route path="/tour">
                    <Tour />
                  </Route>
                  <Route path="/plan" render={planWrapper} />
                  <Route path="/location">
                    <PlanInAnchor />
                  </Route>
                  <Route
                    path="/tasks"
                    component={
                      !taskArg ? withAuthenticator(TasksView) : TaskForm
                    }
                  />
                  <Route path="/bim" component={BimMatcher} />
                  <Route
                    path="/registration"
                    component={PlanImagesRegistrator}
                  />
                  <Route
                    path="/project-registrations"
                    component={withAuthenticator(ProjectRegistrations)}
                  />
                  <Route path="/anchors" component={AnchorsMap} />
                  <Route
                    path="/project/admit"
                    component={withAuthenticator(ProjectAdmit)}
                  />
                  <Route
                    path="/project"
                    component={withAuthenticator(ProjectsView)}
                  />
                  <Route
                    path="/settings"
                    component={withAuthenticator(Settings)}
                  />
                  <Route path="/scans" component={withAuthenticator(Scans)} />
                </Switch>
              </Suspense>
            </BackgroundTasksContext.Provider>
          </LoggedUserContext.Provider>
        </ProjectInformationContext.Provider>
      </ViewContext.Provider>
    </div>
  );
}

export default withSentryProfiler(App);
