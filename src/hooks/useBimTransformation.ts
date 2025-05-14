import { useCallback, useEffect, useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getPlanBimTransformation } from "../graphql/queries";
import { PlanBimTransformation } from "../models";

export function useBimTransformation(planUrl: string) {
  const [planBimTransformation, setPlanBimTransformation] = useState<
    PlanBimTransformation | undefined
  >(undefined);

  const fetch = useCallback(async () => {
    if (planUrl && planUrl.length !== 0) {
      const bimTransformationData: any = await API.graphql(
        graphqlOperation(getPlanBimTransformation, { id: planUrl })
      );
      const transformationToSet =
        bimTransformationData.data.getPlanBimTransformation &&
        bimTransformationData.data.getPlanBimTransformation !== null
          ? bimTransformationData.data.getPlanBimTransformation
          : undefined;
      setPlanBimTransformation(transformationToSet);
    }
  }, [planUrl]);

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);

  return planBimTransformation;
}
