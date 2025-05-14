import { useCallback, useEffect, useState } from "react";
import { API } from "aws-amplify";
import { listPhotoTourPointss } from "../graphql/queries";
import { PhotoTourPoints } from "../models";
import { emptyArray } from "../utils/render-utils";

export function useProjectRegistrations(projectId: string): PhotoTourPoints[] {
  const [photoTourPoints, setPhotoTourPoints] = useState<PhotoTourPoints[]>(
    emptyArray
  );

  const fetch = useCallback(async () => {
    let fetchedPhotoTourPoints: PhotoTourPoints[] = emptyArray;
    if (projectId && projectId !== "") {
      let nextToken: string | null | undefined = undefined;
      do {
        const photoTourPointsData: any = await API.graphql({
          query: listPhotoTourPointss,
          variables: {
            filter: { projectId: { eq: projectId } },
            limit: 100,
            nextToken,
          },
        });
        fetchedPhotoTourPoints = [
          ...fetchedPhotoTourPoints,
          ...(photoTourPointsData.data.listPhotoTourPointss
            .items as PhotoTourPoints[]),
        ];
        nextToken = photoTourPointsData.data.listPhotoTourPointss.nextToken;
      } while (nextToken !== null && nextToken !== undefined);
      setPhotoTourPoints([...fetchedPhotoTourPoints]);
    }
  }, [projectId]);

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);
  return photoTourPoints;
}
