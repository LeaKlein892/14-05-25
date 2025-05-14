import { useCallback, useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getPlanAnchors } from "../graphql/queries";
import { PhotoRecord, PlanAnchors } from "../models";
import { emptyArray } from "../utils/render-utils";
import { updatePlanAnchors } from "../graphql/mutations";
import { onUpdatePlanAnchors } from "../graphql/subscriptions";

function updatePhotoRecords(
  photoRecords: PhotoRecord[],
  photoIndex: number,
  leftLocation: number,
  topLocation: number,
  label = ""
) {
  if (photoIndex === -1) {
    const newPhotoRecord: PhotoRecord = Object.assign(
      {
        leftLocation,
        topLocation,
        fileName: `file${photoRecords.length}.png`,
      },
      label !== "" ? { label } : {}
    );
    return [...photoRecords, newPhotoRecord];
  } else {
    const updatedPhotoRecords = photoRecords.map((record, index) => {
      if (index === photoIndex) {
        return Object.assign(
          {
            ...record,
            leftLocation,
            topLocation,
          },
          label !== "" ? { label } : {}
        );
      }
      return record;
    });
    return updatedPhotoRecords;
  }
}

export interface UsePlanAnchors {
  planAnchors?: PlanAnchors;
  changePlanAnchors: (
    index: number,
    leftLocation: number,
    topLocation: number,
    label?: string
  ) => void;
}

export function usePlanAnchors(planUrl: string): UsePlanAnchors {
  const [planAnchors, setPlanAnchors] = useState<PlanAnchors | undefined>(
    undefined
  );

  const fetch = useCallback(async () => {
    if (planUrl && planUrl !== "") {
      const planAnchorsData: any = await API.graphql(
        graphqlOperation(getPlanAnchors, { id: planUrl })
      );
      const queryData = planAnchorsData.data.getPlanAnchors;
      const planAnchorsToSet =
        queryData && queryData !== null ? queryData : undefined;
      setPlanAnchors(planAnchorsToSet);
    }
  }, [planUrl]);
  const changePlanAnchors = useCallback(
    (index: number, leftLocation: number, topLocation: number, label = "") => {
      if (!!planAnchors) {
        const updatedPhotoRecords = updatePhotoRecords(
          planAnchors.photoRecords || emptyArray,
          index,
          leftLocation,
          topLocation,
          label
        );
        return API.graphql({
          query: updatePlanAnchors,
          variables: {
            input: {
              id: planAnchors.id,
              photoRecords: updatedPhotoRecords,
            },
          },
        });
      }
    },
    [planAnchors]
  );

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);

  useEffect(() => {
    let updatePlanAnchorsSubscription: any;

    const updatePlanAnchorsSubscriptionOperation: any = API.graphql({
      query: onUpdatePlanAnchors,
      variables: {},
    });

    updatePlanAnchorsSubscription =
      updatePlanAnchorsSubscriptionOperation.subscribe({
        next: (planAnchorsData: any) => {
          const planAnchorsReceived: PlanAnchors =
            planAnchorsData.value.data.onUpdatePlanAnchors;
          if (planAnchorsReceived.id === planUrl) {
            setPlanAnchors(planAnchorsReceived);
          }
        },
      });

    return () => {
      updatePlanAnchorsSubscription?.unsubscribe();
    };
  }, [planUrl]);

  return {
    planAnchors,
    changePlanAnchors,
  };
}
