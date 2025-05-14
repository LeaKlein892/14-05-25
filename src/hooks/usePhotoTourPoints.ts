import { useCallback, useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getPhotoTourPoints } from "../graphql/queries";
import { PhotoRecord, PhotoTourPoints } from "../models";
import { emptyArray } from "../utils/render-utils";
import { updatePhotoTourPoints } from "../graphql/mutations";
import { onUpdatePhotoTourPoints } from "../graphql/subscriptions";

function updatePhotoRecords(
  photoRecords: PhotoRecord[],
  photoIndex: number,
  leftLocation: number,
  topLocation: number
) {
  const updatedPhotoRecords = [...photoRecords];
  const updatedPhotoRecord = {
    ...updatedPhotoRecords[photoIndex],
    leftLocation,
    topLocation,
  };
  updatedPhotoRecords[photoIndex] = updatedPhotoRecord;
  return updatedPhotoRecords;
}

export interface UsePhotoTourPoints {
  photoTourPoints?: PhotoTourPoints;
  updatePhotoLocation: (
    photoIndex: number,
    leftLocation: number,
    topLocation: number
  ) => void;
  markTourPointsAsRegistered: () => void;
}

export function usePhotoTourPoints(photoTourId: string): UsePhotoTourPoints {
  const [photoTourPoints, setPhotoTourPoints] = useState<
    PhotoTourPoints | undefined
  >(undefined);

  const fetch = useCallback(async () => {
    if (photoTourId && photoTourId !== "") {
      const photoTourPointsData: any = await API.graphql(
        graphqlOperation(getPhotoTourPoints, { id: photoTourId })
      );
      const queryData = photoTourPointsData.data.getPhotoTourPoints;
      const photoTourToSet =
        queryData && queryData !== null ? queryData : undefined;
      setPhotoTourPoints(photoTourToSet);
    }
  }, [photoTourId]);

  const updatePhotoLocation = useCallback(
    (photoIndex: number, leftLocation: number, topLocation: number) => {
      if (!!photoTourPoints) {
        const updatedPhotoRecords = updatePhotoRecords(
          photoTourPoints.photoRecords || emptyArray,
          photoIndex,
          leftLocation,
          topLocation
        );
        return API.graphql({
          query: updatePhotoTourPoints,
          variables: {
            input: {
              id: photoTourPoints.id,
              photoRecords: updatedPhotoRecords,
            },
          },
        });
      }
    },
    [photoTourPoints]
  );

  const markTourPointsAsRegistered = useCallback(() => {
    if (!!photoTourPoints) {
      return API.graphql({
        query: updatePhotoTourPoints,
        variables: {
          input: {
            id: photoTourPoints.id,
            registered: true,
          },
        },
      });
    }
  }, [photoTourPoints]);

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);

  useEffect(() => {
    let updatePhotoTourPointsSubscription: any;

    const updatePhotoTourPointsSubscriptionOperation: any = API.graphql({
      query: onUpdatePhotoTourPoints,
      variables: {},
    });

    updatePhotoTourPointsSubscription = updatePhotoTourPointsSubscriptionOperation.subscribe(
      {
        next: (photoTourPointsData: any) => {
          const photoTourPointsReceived: PhotoTourPoints =
            photoTourPointsData.value.data.onUpdatePhotoTourPoints;
          if (photoTourPointsReceived.id === photoTourId) {
            setPhotoTourPoints(photoTourPointsReceived);
          }
        },
      }
    );

    return () => {
      updatePhotoTourPointsSubscription?.unsubscribe();
    };
  }, [photoTourId]);

  return {
    photoTourPoints,
    updatePhotoLocation,
    markTourPointsAsRegistered,
  };
}
