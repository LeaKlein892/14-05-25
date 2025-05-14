import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { Activity, Info, Progress, ProgressArea } from "../../models";
import { useProgress } from "../../hooks/useProgress";
import { useHistory } from "react-router-dom";
import { useStyles } from "./ActivityStyles";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import UserProgress from "./UserProgress";
import { FriendlyError } from "../friendly-error/FriendlyError";
import { Button, useMediaQuery } from "@mui/material";
import { emptyArray } from "../../utils/render-utils";
import { ProgressTable } from "./ProgressTable";
import ProgressSelectorLayout from "./ProgressSelectorLayout";
import {
  compareDatesDescending,
  convertDateFormat,
  convertToValidDateFormat,
} from "../../utils/date-utils";
import { ActivityStatus } from "../../API";
import { ActivityWithAnchor, SwitchStatus } from "./ActivityProgressModels";
import { CenterPageLoader } from "../loader/CenterPageLoader";
import { showMessage } from "../../utils/messages-manager";
import { analyticsEvent } from "../../utils/analytics";
import { NA } from "../../utils/clients";
import { flushSync } from "react-dom";
import { CircularProgress, Typography } from "@mui/material";

const ProgressCreationForm = lazy(() => import("./ProgressCreationForm"));

interface ActivityProgressProps {}

let progressInPercentage = true;
let progressInFloor = true;

let dateAtTheTable: string | undefined;
let lastDateProgressExit: string | undefined;

const createRecordText = "Create new record";
const publishDraftText = "Publish draft";

const viewMode = ["Status", "Percentage"];
const floorMode = ["Floor", "Unit"];

export const ActivityProgress: React.FC<ActivityProgressProps> = () => {
  const classes = useStyles();
  const {
    currentProject,
    setCurrentFloor,
    setCurrentPlan,
    setCurrentDate,
    setCurrentArea,
    setCurrentBuilding,
    client,
  } = useContext(ProjectInformationContext);
  let history = useHistory();
  const mobileMode = useMediaQuery("(max-width: 1224px)", { noSsr: true });
  const { loggedUser } = useContext(LoggedUserContext);
  const defaultDate = "Day 0";
  const isAdmin = loggedUser.isProgressAdmin;
  const {
    updateProjectProgress,
    updateProgressAreaVisibility,
    addNewProgressRecord,
    publishDraft,
    projectProgress,
    labelsActivities,
    dod = 100,
    categories,
    loadingProgress,
  } = useProgress(currentProject?.id || "", isAdmin);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>("");
  const [pastSelectedDate, setPastSelectedDate] = useState<string | undefined>(
    defaultDate
  );
  const [showProgressInPercentage, setShowProgressInPercentage] = useState<
    boolean | null
  >(progressInPercentage);
  const [inFloorMode, setInFloorMode] = useState<boolean>(progressInFloor);
  const [progressForSelectedDate, setProgressForSelectedDate] = useState<
    Progress | null | undefined
  >(null);
  const [progressForPastSelectedDate, setProgressForPastSelectedDate] =
    useState<Progress | null | undefined>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [adminProgressData, setAdminProgressData] = useState<
    Progress | null | undefined
  >(null);
  const [openEditing, setOpenEditing] = useState(false);
  const [adminButtonText, setAdminButtonText] = useState(createRecordText);
  const [projectLastCapture, setProjectLastCapture] = useState("01-01-01");

  const handleChange = (
    newValue: ActivityStatus,
    row: Progress,
    activityIndex: number,
    activity: Activity,
    index: number
  ) => {
    updateProjectProgress(newValue, row, activityIndex, activity, index);
  };

  const handleToggleProgressAreaVisibility = (
    progressArea: ProgressArea,
    row: Progress,
    index: number
  ) => {
    updateProgressAreaVisibility(row, progressArea, index);
  };

  useEffect(() => {
    return () => {
      lastDateProgressExit = undefined;
    };
  }, []);

  useEffect(() => {
    setAdminButtonText(
      adminProgressData?.draft === true ? publishDraftText : createRecordText
    );
  }, [adminProgressData?.draft]);

  useEffect(() => {
    if (progressForSelectedDate) {
      setAdminProgressData(progressForSelectedDate);
    }
  }, [progressForSelectedDate]);

  const findProgressByDate = (progressData: Progress[], date?: string) => {
    if (!progressData || progressData.length === 0) {
      return null;
    }
    let Progress: Progress | undefined;
    if (date) {
      Progress = progressData.find(
        (progressDate) => progressDate.date === date
      );
    } else {
      Progress = progressData[0];
      for (let i = 1; i < progressData.length; i++) {
        if (compareDatesDescending(progressData[i].date, Progress.date) < 0) {
          Progress = progressData[i];
        }
      }
      sessionStorage.setItem("Latest", JSON.stringify(Progress.date));
    }
    return Progress;
  };

  useEffect(() => {
    if (projectProgress && projectProgress.length > 0) {
      setDataLoaded(true);
      const sortedProgress = projectProgress.sort((a, b) =>
        compareDatesDescending(a.date, b.date)
      );
      const progress = findProgressByDate(
        sortedProgress ? sortedProgress : emptyArray
      );
      setProgressForSelectedDate(progress);
      setSelectedDate(lastDateProgressExit ?? progress?.date);
    }
  }, [projectProgress]);

  useEffect(() => {
    lastDateProgressExit =
      selectedDate !== "" ? selectedDate : lastDateProgressExit;
    if (projectProgress && selectedDate) {
      const progress = projectProgress.find(
        (progress) => progress.date === selectedDate
      );
      setProgressForSelectedDate(progress || null);
    }
  }, [selectedDate, projectProgress]);

  useEffect(() => {
    if (projectProgress && pastSelectedDate !== defaultDate) {
      const progress = projectProgress.find(
        (progress) => progress.date === pastSelectedDate
      );
      setProgressForPastSelectedDate(progress || null);
    }
    if (pastSelectedDate === defaultDate) {
      setProgressForPastSelectedDate(null);
    }
  }, [pastSelectedDate, projectProgress]);

  const findClosestDate = (building: string, floor: string, date: string) => {
    let b = currentProject?.buildings?.find((b) => b.name === building);
    let f = b && b.floors?.find((f) => f.name === floor);
    const areas = f?.areas || emptyArray;
    for (const area of areas) {
      const infos: Info[] = area.infos || emptyArray;
      let filteredInfos: Info[] = infos
        .filter((i) => i.date !== "blueprint")
        .sort((a, b) => compareDatesDescending(a.date, b.date));
      if (!filteredInfos || filteredInfos.length === 0) return "blueprint";
      for (const i of filteredInfos) {
        if (compareDatesDescending(i.date, date) >= 0) {
          dateAtTheTable = i.date;
          return dateAtTheTable;
        }
      }
    }
    return "blueprint";
  };

  const findLatestDate = (building: string, floor: string) => {
    let areaBuilding = currentProject?.buildings?.find(
      (b) => b.name === building
    );
    let areaFloor =
      areaBuilding && areaBuilding.floors?.find((f) => f.name === floor);
    const areas = areaFloor?.areas || emptyArray;
    for (const area of areas) {
      const infos: Info[] = area.infos || emptyArray;
      let filteredInfos: Info[] = infos
        .filter((i) => i.date != "blueprint")
        .sort((a, b) => compareDatesDescending(a.date, b.date));
      if (!filteredInfos || filteredInfos.length == 0) {
        return "blueprint";
      } else {
        compareDatesDescending(filteredInfos[0].date, projectLastCapture) < 0 &&
          setProjectLastCapture(filteredInfos[0].date);
        return filteredInfos[0].date;
      }
    }
    return "blueprint";
  };

  const findLinkForArea = (building: string, floor: string) => {
    analyticsEvent(
      "Progress",
      "Navigate To Date From Progress",
      loggedUser.username || client || NA
    );
    let areaBuilding = currentProject?.buildings?.find(
      (b) => b.name === building
    );
    let areaFloor =
      areaBuilding && areaBuilding.floors?.find((f) => f.name === floor);
    const areas = areaFloor?.areas || emptyArray;
    for (const area of areas) {
      const infos: Info[] = area.infos || emptyArray;
      let filteredInfos: Info[] = infos
        .filter((i) => i.date !== "blueprint")
        .sort((a, b) => compareDatesDescending(a.date, b.date));
      let closestDate, closestPlan;
      if (!filteredInfos || filteredInfos.length == 0) {
        showMessage("There is no tour yet for this floor", "warning");
        closestPlan = infos[0].plan;
        closestDate = infos[0].date;
      } else {
        closestDate = filteredInfos[0].date;
        closestPlan = filteredInfos[0].plan;
      }
      if (closestDate !== null) {
        sessionStorage.removeItem("SceneTourData");
        sessionStorage.setItem(
          "ClickedCellData",
          JSON.stringify({
            Date: filteredInfos[0].date,
            Area: {
              building: areaBuilding?.name ?? "",
              floor: areaFloor?.name ?? "",
              anchor: "",
            },
            Activity: emptyArray,
          })
        );
        flushSync(() => {
          setCurrentBuilding(areaBuilding);
          setCurrentFloor(areaFloor);
          setCurrentArea(area);
          setCurrentDate(closestDate);
          setCurrentPlan(closestPlan);
        });
        history.push("/plan");
      }
    }
  };

  const navigateToAnchorLink = (building: string, floor: string) => {
    if (!currentProject?.id) {
      showMessage("Project URL not found", "error");
      return;
    }
    window.open(
      `/anchors?plan=https://${currentProject.id}.s3.eu-central-1.amazonaws.com/plans/${building}/fl${floor}.dzi`,
      "_blank"
    );
  };

  const onPointClickToEdit = () => {
    analyticsEvent(
      "Progress",
      "Clicking Map Anchor Point To Edit",
      loggedUser.username || client || NA
    );
    setOpenEditing(true);
    sessionStorage.setItem("HideTitleBar", JSON.stringify(true));
  };
  const handleCloseEditingDialog = () => {
    setOpenEditing(false);
    sessionStorage.removeItem("HideTitleBar");
  };
  const updateStatus = (
    status: ActivityStatus,
    reason: string,
    row: Progress,
    activityIndex: number,
    activity: Activity,
    index: number,
    previousStatus: ActivityStatus
  ) => {
    updateProjectProgress(
      status,
      row,
      activityIndex,
      activity,
      index,
      reason,
      previousStatus
    );
  };

  function handleViewClick(): void {
    sessionStorage.setItem("projectView", "false");
    history.push("/project");
  }

  const handleDateMenuItemClick = (date: string) => {
    analyticsEvent(
      "Progress",
      "Change Progress Date",
      loggedUser?.username || client || "NA"
    );
    setSelectedDate(date);
    sessionStorage.setItem("ShowProgressOnMap", JSON.stringify(false));
    sessionStorage.setItem("DisplayTour", JSON.stringify(false));
    findProgressByDate(projectProgress || emptyArray, date);
  };

  const handlePastDateMenuItemClick = (date: string) => {
    setPastSelectedDate(date);
    progressInPercentage = true;
    setShowProgressInPercentage(progressInPercentage);
  };

  const handleViewModeMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    if (index === 0) {
      progressInPercentage = false;
      setShowProgressInPercentage(progressInPercentage);
    } else {
      progressInPercentage = true;
      setShowProgressInPercentage(progressInPercentage);
    }
  };

  const handleFloorModeMenuItemClick = (index: number) => {
    const isFloorMode = index === 0;
    setInFloorMode(isFloorMode);
    progressInFloor = isFloorMode;
  };

  const findswitch = (
    targetStatus: ActivityStatus,
    building: string,
    floor: string,
    activityName: string
  ): SwitchStatus[] => {
    if (!projectProgress) {
      return [];
    }

    let statusChanges: SwitchStatus[] = [];
    let currentStatus: ActivityStatus | null = null;
    let currentStartDate: string | null = null;

    for (let i = 0; i < projectProgress.length; i++) {
      let progress = projectProgress[i];
      let filteredAreas = progress?.progressAreas?.filter(
        (pa) => pa.floor === floor && pa.building === building
      );
      let statuses: ActivityWithAnchor[] = [];

      for (const filteredArea of filteredAreas || []) {
        for (const activity of filteredArea?.activities || []) {
          if (activity.activityName === activityName) {
            let currentActivity = { activity: activity };
            statuses.push(currentActivity as ActivityWithAnchor);
          }
        }
      }

      let calculatedStatus = calculateActivityProgressByAnchors(statuses);

      if (currentStatus === null) {
        currentStatus = calculatedStatus;
        currentStartDate = progress.date;
      } else if (calculatedStatus !== currentStatus) {
        if (currentStatus) {
          statusChanges.push({
            from: projectProgress[i - 1].date,
            to: currentStartDate as string,
            status: currentStatus,
          });
        }
        currentStatus = calculatedStatus;
        currentStartDate = progress.date;
      }
    }

    if (currentStatus !== null && currentStartDate !== null) {
      if (currentStatus) {
        statusChanges.push({
          from: projectProgress[projectProgress.length - 1].date,
          to: currentStartDate as string,
          status: currentStatus,
        });
      }
    }

    return statusChanges.filter((change) => change.status === targetStatus);
  };

  const defaultDateSelected = () => {
    setPastSelectedDate(defaultDate);
    setSelectedIndex(1);
    progressInPercentage = true;
    setShowProgressInPercentage(progressInPercentage);
  };

  function calculateActivityProgressByAnchors(
    activities: ActivityWithAnchor[]
  ): ActivityStatus {
    const allIrrelevant = activities.every(
      (activity) => activity.activity.status === ActivityStatus.IRRELEVANT
    );
    const relevantActivities = activities.filter(
      (activity) => activity.activity.status !== ActivityStatus.IRRELEVANT
    );
    const allDone =
      relevantActivities.filter(
        (activity) => activity.activity.status === ActivityStatus.DONE
      ).length >=
      (relevantActivities.length * (dod || 100)) / 100;
    const allNotStarted = relevantActivities.every(
      (activity) => activity.activity.status === ActivityStatus.NOT_STARTED
    );

    if (allDone) {
      return ActivityStatus.DONE;
    } else if (allIrrelevant) {
      return ActivityStatus.IRRELEVANT;
    } else if (allNotStarted) {
      return ActivityStatus.NOT_STARTED;
    } else {
      return ActivityStatus.IN_PROGRESS;
    }
  }
  const handleDuplicateRecord = async (adminProgressData: Progress) => {
    if (adminProgressData.progressAreas) {
      await addNewProgressRecord(
        adminProgressData.projectId,
        adminProgressData.progressAreas
      );
    }
  };

  const handleAdminButton = async (adminProgressData: Progress) => {
    if (adminProgressData.draft === true) {
      publishDraft(adminProgressData);
      setAdminButtonText(createRecordText);
      showMessage("The draft was successfully uploaded. ", "success", 5000);
    } else {
      setAdminButtonText(publishDraftText);
      showMessage(
        "creating draft, please dont refresh the page! The page will automatically reload when the draft is ready.",
        "warning",
        60000
      );
      await handleDuplicateRecord(adminProgressData);
      window.location.reload();
    }
  };

  const calculationOfTheTourTimeForTheEntityTime = () => {
    const isDateInRange = projectProgress?.filter((progress) => {
      const convertedDateString = convertToValidDateFormat(progress.date || "");
      const convertedProgressDate: Date | null = convertedDateString
        ? new Date(convertedDateString)
        : null;
      const convertedSelectedDateString = convertToValidDateFormat(
        selectedDate || ""
      );
      const convertedSelectedDate: Date | null = convertedSelectedDateString
        ? new Date(convertedSelectedDateString)
        : null;
      const convertedDateAtTheTableString = convertToValidDateFormat(
        dateAtTheTable || ""
      );
      const convertedDateAtTheTable: Date | null = convertedDateAtTheTableString
        ? new Date(convertedDateAtTheTableString)
        : null;
      return convertedProgressDate &&
        convertedSelectedDate &&
        convertedDateAtTheTable
        ? convertedProgressDate < convertedSelectedDate &&
            convertedProgressDate >= convertedDateAtTheTable
        : false;
    });
    if (isDateInRange && isDateInRange.length > 0) return true;
    return false;
  };

  return (
    <>
      {loadingProgress ? (
        <div className={classes.activityProgressLoader}>
          <CircularProgress />
          <Typography
            variant="h6"
            className={classes.activityProgressLoaderText}
          >
            Loading, this might take a second...
          </Typography>
        </div>
      ) : (
        <>
          {
            <>
              {dataLoaded ? (
                <>
                  <div
                    className={
                      mobileMode
                        ? classes.progressSelectorContainerMobileMode
                        : classes.progressSelectorContainer
                    }
                  >
                    <div
                      className={
                        mobileMode
                          ? classes.inlineContainerMobileMode
                          : classes.inlineContainer
                      }
                    >
                      {!loggedUser.isProgressAdmin && (
                        <ProgressSelectorLayout
                          selectors={[
                            {
                              options: [
                                ...(projectProgress
                                  ?.filter((progress) => {
                                    const convertedProgressDate =
                                      convertDateFormat(progress.date);
                                    const selectedDateConverted =
                                      convertDateFormat(selectedDate || "");
                                    if (
                                      convertedProgressDate &&
                                      selectedDateConverted
                                    ) {
                                      return (
                                        convertedProgressDate <
                                        selectedDateConverted
                                      );
                                    } else {
                                      return null;
                                    }
                                  })
                                  .map((progress) => progress.date) || []),
                                "DAY 0",
                              ],
                              selectedOption: pastSelectedDate || defaultDate,
                              handleOptionSelect: (option) => {
                                analyticsEvent(
                                  "Progress",
                                  "Change Progress Past Date",
                                  loggedUser?.username || client || "NA"
                                );
                                if (option === "DAY 0") {
                                  defaultDateSelected();
                                } else {
                                  handlePastDateMenuItemClick(option);
                                }
                              },
                              label: "from",
                            },
                          ]}
                        />
                      )}
                      <ProgressSelectorLayout
                        selectors={[
                          {
                            options: projectProgress?.map(
                              (progress) => progress.date
                            ),
                            selectedOption: selectedDate || defaultDate,
                            handleOptionSelect: handleDateMenuItemClick,
                            label:
                              !mobileMode && !loggedUser.isProgressAdmin
                                ? "to"
                                : undefined,
                          },
                        ]}
                      />
                      {!loggedUser.isProgressAdmin && !mobileMode && (
                        <ProgressSelectorLayout
                          selectors={[
                            {
                              options:
                                pastSelectedDate === defaultDate
                                  ? viewMode
                                  : [],
                              selectedOption:
                                pastSelectedDate !== defaultDate
                                  ? viewMode[1]
                                  : viewMode[
                                      showProgressInPercentage
                                        ? 1
                                        : selectedIndex
                                    ],
                              handleOptionSelect: (option: string) => {
                                analyticsEvent(
                                  "Progress",
                                  "Change Progress View Mode",
                                  loggedUser?.username || client || "NA"
                                );
                                const index = viewMode.indexOf(option);
                                handleViewModeMenuItemClick(index);
                              },
                            },
                          ]}
                        />
                      )}
                      {loggedUser.isProgressAdmin && adminProgressData && (
                        <Button
                          className={classes.buttonTopRight}
                          variant="contained"
                          color="primary"
                          onClick={() => handleAdminButton(adminProgressData)}
                        >
                          {adminButtonText}
                        </Button>
                      )}
                    </div>
                  </div>

                  {loggedUser.isProgressAdmin ? (
                    <div className={classes.tableBeforeSplit}>
                      <ProgressTable
                        progressByDate={progressForSelectedDate}
                        adminProgressData={adminProgressData}
                        findLinkForArea={findLinkForArea}
                        navigateToAnchorLink={navigateToAnchorLink}
                        findLatestDate={findLatestDate}
                        findClosestDate={findClosestDate}
                        handleChange={handleChange}
                        toggleProgressAreaVisibility={
                          handleToggleProgressAreaVisibility
                        }
                        isAdmin={true}
                        calculationOfTheTourTimeForTheEntityTime={
                          calculationOfTheTourTimeForTheEntityTime
                        }
                        inFloorMode={inFloorMode}
                      ></ProgressTable>
                    </div>
                  ) : (
                    <UserProgress
                      progressByDate={progressForSelectedDate}
                      findLinkForArea={findLinkForArea}
                      findClosestDate={findClosestDate}
                      findLatestDate={findLatestDate}
                      showProgressInPercentage={showProgressInPercentage}
                      showProgressDiffPercentage={
                        pastSelectedDate !== defaultDate
                      }
                      progressForPastDate={progressForPastSelectedDate}
                      onPointClickToEdit={onPointClickToEdit}
                      openEditing={openEditing}
                      handleCloseEditingDialog={handleCloseEditingDialog}
                      updateStatus={updateStatus}
                      loggedUser={loggedUser}
                      findswitch={(status, building, floor, activityName) =>
                        findswitch(status, building, floor, activityName) || []
                      }
                      labels={labelsActivities}
                      calculateActivityProgressByAnchors={
                        calculateActivityProgressByAnchors
                      }
                      inFloorMode={inFloorMode}
                      projectLastCapture={projectLastCapture}
                      dod={dod}
                      categories={categories}
                    />
                  )}
                </>
              ) : (
                projectProgress &&
                projectProgress.length === 0 && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    {loggedUser.isProgressAdmin && currentProject?.id ? (
                      <>
                        <Suspense
                          fallback={<CenterPageLoader loading={true} />}
                        >
                          <ProgressCreationForm
                            currentProject={currentProject}
                          />
                        </Suspense>
                        <br />
                      </>
                    ) : (
                      <FriendlyError
                        message={"You can also view your project progress!"}
                        link="https://castory-ai.com/"
                        linkText="click here for more information"
                        blank
                      />
                    )}
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.button}
                      onClick={handleViewClick}
                    >
                      Back to Buildings view
                    </Button>
                  </div>
                )
              )}
            </>
          }
        </>
      )}
    </>
  );
};

export default React.memo(ActivityProgress);
