import { API } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";
import { getProgressDelayedActivities } from "../graphql/queries";
import {
  DelayedProperties,
  normalizeCellIdentifier,
} from "../components/activity-progress/progress-operations";

export function useProgressDelayedActivities(projectid: string) {
  const [progressDelayedActivities, setProgressDelayedActivities] = useState<
    Map<string, DelayedProperties>
  >(new Map());

  const transformLocationString = useCallback((activities: any[]) => {
    const locationProbabilityMap = new Map<string, DelayedProperties>();
    activities.forEach((delay) => {
      const transformedLocation = normalizeCellIdentifier(delay.location);
      locationProbabilityMap.set(transformedLocation, {
        probability: delay.probability,
        reason: delay.reason,
      });
    });
    return locationProbabilityMap;
  }, []);

  const fetch = useCallback(async () => {
    (
      API.graphql({
        query: getProgressDelayedActivities,
        variables: {
          id: projectid,
        },
      }) as Promise<any>
    ).then((res) => {
      let activityDelay = res.data.getProgressDelayedActivities;
      if (res.data && activityDelay) {
        setProgressDelayedActivities(
          transformLocationString(activityDelay.delayedActivities)
        );
      }
    });
  }, [projectid, transformLocationString]);

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);

  return progressDelayedActivities;
}
