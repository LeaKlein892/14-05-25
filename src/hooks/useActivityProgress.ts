import { API } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";
import { getActivityProgress } from "../graphql/queries";

export async function fetchActivityProgress(
  project: string,
  building: string,
  floor: string,
  activity: string
): Promise<any[]> {
  try {
    const res = (await API.graphql({
      query: getActivityProgress,
      variables: { project, building, floor, activity },
    })) as any;

    if (res.data && res.data.getActivityProgress) {
      return res.data.getActivityProgress.map((item: { progress: number }) => ({
        ...item,
        progress: parseFloat(item.progress.toFixed(1)),
      }));
    } else {
      return [1];
    }
  } catch (error) {
    console.error("Error fetching activity progress:", error);
    return [];
  }
}

export function useActivityProgress(
  project: string,
  building: string,
  floor: string,
  activity: string
) {
  const [activityProgress, setActivityProgress] = useState<any[]>([]);

  const fetch = useCallback(async () => {
    const progress = await fetchActivityProgress(
      project,
      building,
      floor,
      activity
    );
    setActivityProgress(progress);
  }, [project, building, floor, activity]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return activityProgress;
}
