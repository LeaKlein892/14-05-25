import { useCallback, useContext, useEffect, useState, useRef } from "react";
import { API } from "aws-amplify";
import { progressByProjectId } from "../graphql/queries";
import { Activity, Progress, ProgressArea, ProgressCategory } from "../models";
import { createProgress, updateProgress } from "../graphql/mutations";
import { ProjectInformationContext } from "../context/ProjectInformationContext";
import { ActivityStatus } from "../API";
import { LoggedUserContext } from "../context/LoggedUserContext";
import { emptyArray } from "../utils/render-utils";
import { showMessage } from "../utils/messages-manager";
import { debounce } from "lodash-es";
import {
  getCachedProgress,
  setCacheProgress,
} from "../components/activity-progress/progress-cache";

export interface UseProgress {
  projectProgress?: Progress[];
  updateProjectProgress: (
    newValue: ActivityStatus,
    row: Progress,
    activityIndex: number,
    activity: Activity,
    index: number,
    reason?: string,
    previousStatus?: ActivityStatus
  ) => void;
  updateProgressAreaVisibility: (
    row: Progress,
    progressArea: ProgressArea,
    index: number
  ) => void;
  addNewProgressRecord: (
    projectId: string,
    progressAreas: ProgressArea[]
  ) => Promise<void>;
  labelsActivities?: string[];
  publishDraft: (progress: Progress) => void;
  dod: number | undefined;
  categories?: ProgressCategory[];
  loadingProgress?: boolean;
}

const chunkIdToIdMap = new Map<string, Map<number, string>>();

export function useProgress(projectId: string, isAdmin?: boolean): UseProgress {
  const [projectProgress, setProjectProgress] = useState<
    Progress[] | undefined
  >(undefined);
  const [labelsActivities, setLabelsActivities] = useState<
    string[] | undefined
  >(undefined);
  const { currentProject } = useContext(ProjectInformationContext);
  const { loggedUser } = useContext(LoggedUserContext);
  const [dod, setDod] = useState<number | undefined>(100);
  const [categories, setCategories] = useState<ProgressCategory[] | undefined>(
    emptyArray
  );
  const [loadingProgress, setLoadingProgress] = useState<boolean>(true);

  // Refs to track the last `index` and pending update
  const lastIndexRef = useRef<number | null>(null);
  const pendingUpdateRef = useRef<{ progress: Progress; index: number } | null>(
    null
  );

  // Debounced function to perform the actual API update after a few seconds
  const performUpdate = useCallback(
    debounce(
      async () => {
        if (!pendingUpdateRef.current) return;

        const { progress, index } = pendingUpdateRef.current;
        const chunkId = Math.floor(index / 50);
        const id = chunkIdToIdMap.get(progress.date)?.get(chunkId);
        const progressAreas = progress.progressAreas?.slice(
          chunkId * 50,
          chunkId * 50 + 50
        );

        try {
          const resUpdate: any = await API.graphql({
            query: updateProgress,
            variables: {
              input: {
                id,
                projectId: currentProject?.id,
                date: progress.date,
                progressAreas,
              },
            },
          });
        } catch (error) {
          showMessage(
            "An error occurred while updating the activity status",
            "error",
            10000
          );
          console.error("Error updating progress", error);
        }

        pendingUpdateRef.current = null;
      },
      isAdmin ? 10000 : 1
    ),
    [currentProject]
  );

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const mergeProgressByDate = (Progresses: Progress[]): Progress[] => {
    const groupedProgressMap = Progresses.reduce((map, obj) => {
      const date = obj.date;
      const progressesOfDate = map.get(date) || [];
      progressesOfDate.push(obj);
      map.set(
        date,
        progressesOfDate.sort((a: Progress, b: Progress) =>
          (a.chunkId || a.chunkId === 0) && (b.chunkId || b.chunkId === 0)
            ? a.chunkId - b.chunkId
            : 0
        )
      );
      return map;
    }, new Map<string, Progress[]>());

    groupedProgressMap.forEach((progressArray: Progress[], date) => {
      const nestedMap = new Map<number, string>();
      progressArray.forEach((progress) => {
        nestedMap.set(progress.chunkId || 0, progress.id);
      });
      chunkIdToIdMap.set(date, nestedMap);
    });

    const mergedProgresses = Array.from(groupedProgressMap.values()).map(
      (objects) => {
        const concatenatedProgressAreas = objects.reduce(
          (result, obj: Progress) => result.concat(obj.progressAreas ?? []),
          [] as ProgressArea[]
        );
        const { chunkId, ...newObj } = {
          ...objects[0],
          progressAreas: concatenatedProgressAreas,
        };
        return newObj;
      }
    );

    return mergedProgresses;
  };

  const fetch = useCallback(async () => {
    setLoadingProgress(true);
    const cachedProgress = getCachedProgress(projectId);
    let fetchedProgress: Progress[] = cachedProgress.progress;
    if (projectId && projectId !== "") {
      if (fetchedProgress === emptyArray) {
        let nextToken: string | null | undefined = undefined;
        try {
          do {
            const responseProgress: any = await API.graphql({
              query: progressByProjectId,
              variables: {
                projectId: currentProject?.id,
                limit: 100,
                nextToken,
              },
            });
            fetchedProgress = [
              ...fetchedProgress,
              ...(responseProgress?.data?.progressByProjectId
                ?.items as Progress[]),
            ];
            nextToken = responseProgress?.data?.progressByProjectId?.nextToken;
          } while (nextToken !== null && nextToken !== undefined);
        } catch (error) {
          console.error("Error fetching progress:", error);
        }
        const firstProgress = fetchedProgress.find(
          (progress) => progress.chunkId === 0
        );
        const labels = firstProgress?.labels;
        const dod = firstProgress?.dod;
        const categories = firstProgress?.categories;
        dod && setDod(dod);
        categories && setCategories(categories);
        setLabelsActivities(labels);
        const mergedProgresses = isAdmin
          ? mergeProgressByDate(fetchedProgress)
          : mergeProgressByDate(fetchedProgress).filter(
              (progress) => progress.draft !== true
            );
        setProjectProgress(mergedProgresses);
        setCacheProgress(projectId, mergedProgresses, labels, dod, categories);
      } else {
        setProjectProgress(fetchedProgress);
        setLabelsActivities(cachedProgress.labels);
        setDod(cachedProgress.dod);
        setCategories(cachedProgress.categories);
      }
    }
    setLoadingProgress(false);
  }, [projectId, currentProject, isAdmin]);

  const publishDraft = useCallback(
    async (progress: Progress) => {
      try {
        await API.graphql({
          query: updateProgress,
          variables: {
            input: {
              id: progress.id,
              draft: false,
            },
          },
        });
      } catch (error) {
        showMessage(
          "An error occurred while updating the activity status",
          "error"
        );
      }
    },
    [projectId]
  );

  const updateProjectProgress = useCallback(
    async (
      newValue: ActivityStatus,
      row: Progress,
      activityIndex: number,
      activity: Activity,
      index: number,
      reason?: string,
      previousStatus?: ActivityStatus
    ) => {
      let updatedProgress = { ...row };

      // Update activity status
      if (updatedProgress.progressAreas) {
        const progressAreaToUpdate = updatedProgress.progressAreas[index];
        if (progressAreaToUpdate && progressAreaToUpdate.activities) {
          progressAreaToUpdate.activities[activityIndex] = new Activity({
            activityName: activity.activityName,
            status: newValue,
            previousStatus: previousStatus,
            updateReason: reason,
            updater: previousStatus ? loggedUser.username : undefined,
            dateManuallyUpdated: previousStatus
              ? formatDate(new Date())
              : undefined,
          });
          updatedProgress.progressAreas[index] = progressAreaToUpdate;
        }
      }

      // Optimistically update the UI
      setProjectProgress((prevProgress) => {
        if (!prevProgress) return [updatedProgress];
        const updatedProgressList = prevProgress.map((item) =>
          item.id === row.id ? updatedProgress : item
        );
        return updatedProgressList;
      });

      if (lastIndexRef.current !== index) {
        if (pendingUpdateRef.current) {
          await performUpdate.flush();
        }

        pendingUpdateRef.current = { progress: updatedProgress, index };
        performUpdate();
        lastIndexRef.current = index;
      } else {
        // Store the pending update to be delayed
        pendingUpdateRef.current = { progress: updatedProgress, index };

        performUpdate();
      }
    },
    [loggedUser.username, performUpdate]
  );

  const addNewProgressRecord = useCallback(
    async (projectId: string, progressAreas: ProgressArea[]) => {
      if (loggedUser.isProgressAdmin) {
        const chunkSize = 50;
        const formattedDate = formatDate(new Date());

        // Create a deep copy of progress areas and remove the invisible property
        const cleanedProgressAreas = progressAreas.map((area) => {
          // Create a new object without the invisible property
          const { invisible, ...cleanedArea } = { ...area };
          return cleanedArea;
        });

        // Get a progress record to copy metadata from
        // We can use any record since all should have the metadata fields
        const sourceProgress =
          projectProgress && projectProgress.length > 0
            ? projectProgress[0]
            : undefined;

        for (
          let i = 0;
          i < Math.ceil(cleanedProgressAreas.length / chunkSize);
          i++
        ) {
          const chunkRecord: any = {
            projectId: projectId,
            date: formattedDate,
            progressAreas: cleanedProgressAreas.slice(
              i * chunkSize,
              (i + 1) * chunkSize
            ),
            chunkId: i,
          };

          if (i === 0) {
            chunkRecord.draft = true;

            // Copy labels and categories from the source progress record
            if (sourceProgress) {
              if (sourceProgress.labels) {
                chunkRecord.labels = sourceProgress.labels;
              }
              if (sourceProgress.categories) {
                chunkRecord.categories = sourceProgress.categories;
              }
              if (sourceProgress.dod) {
                chunkRecord.dod = sourceProgress.dod;
              }
            }
          }

          try {
            await API.graphql({
              query: createProgress,
              variables: {
                input: chunkRecord,
              },
            });
          } catch (error) {
            console.error("Error creating new progress record:", error);
          }
        }
      }
    },
    [loggedUser.isProgressAdmin, projectProgress]
  );

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);

  useEffect(() => {
    return () => {
      performUpdate.cancel();
    };
  }, [performUpdate]);

  useEffect(() => {
    return () => {
      chunkIdToIdMap.clear();
    };
  }, [projectId]);

  const updateProgressAreaVisibility = useCallback(
    async (row: Progress, progressArea: ProgressArea, index: number) => {
      // Create a new ProgressArea with the toggled invisible property
      const updatedProgressArea = new ProgressArea({
        ...progressArea,
        invisible: !progressArea.invisible,
      });

      // Create a copy of the row with the updated progress area
      const updatedProgress = { ...row };
      if (updatedProgress.progressAreas) {
        updatedProgress.progressAreas[index] = updatedProgressArea;
      }

      // Update the local state immediately for a responsive UI
      setProjectProgress((prevProgress) => {
        if (!prevProgress) return prevProgress;
        return prevProgress.map((item) =>
          item.id === row.id ? updatedProgress : item
        );
      });

      try {
        // Get the chunk ID for this progress area
        const chunkId = Math.floor(index / 50);
        const id = chunkIdToIdMap.get(row.date)?.get(chunkId);

        // Create a copy of the progress areas for this chunk
        const progressAreas = [
          ...(row.progressAreas?.slice(chunkId * 50, chunkId * 50 + 50) || []),
        ];

        // Update the specific progress area in the chunk
        const indexInChunk = index % 50;
        progressAreas[indexInChunk] = updatedProgressArea;

        // Directly update the database without debouncing
        await API.graphql({
          query: updateProgress,
          variables: {
            input: {
              id,
              projectId: currentProject?.id,
              date: row.date,
              progressAreas,
            },
          },
        });
      } catch (error) {
        // Revert the optimistic update if the API call fails
        setProjectProgress((prevProgress) => {
          if (!prevProgress) return prevProgress;
          return prevProgress.map((item) => (item.id === row.id ? row : item));
        });

        showMessage(
          "An error occurred while updating the progress area visibility",
          "error",
          5000
        );
        console.error("Error updating progress area visibility:", error);
      }
    },
    [currentProject?.id]
  );

  return {
    projectProgress,
    updateProjectProgress,
    updateProgressAreaVisibility,
    addNewProgressRecord,
    labelsActivities,
    publishDraft,
    dod,
    categories,
    loadingProgress,
  };
}
