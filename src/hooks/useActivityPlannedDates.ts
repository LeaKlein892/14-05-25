import { API } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";
import { fetchActivityPlannedDates } from "../graphql/queries";

export function useActivityPlannedDates(
  activity: string,
  project: string,
  building?: string | null,
  floor?: string | null
) {
  const [activityPlannedDates, setActivityPlannedDates] = useState<any[]>([]);

  const variables =
    building && floor
      ? {
          activity: activity,
          project: project,
          building: building,
          floor: floor,
        }
      : {
          activity: activity,
          project: project,
        };
  const fetch = useCallback(async () => {
    (
      API.graphql({
        query: fetchActivityPlannedDates,
        variables: variables,
      }) as Promise<any>
    ).then((res) => {
      if (res?.data?.fetchActivityPlannedDates?.plannedDates[0]?.startDate) {
        setActivityPlannedDates(
          res.data.fetchActivityPlannedDates.plannedDates
        );
      } else {
        setActivityPlannedDates([1]);
      }
    });
  }, [project, activity, building, floor]);

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);

  return activityPlannedDates;
}
