import { useCallback, useEffect, useState } from "react";
import { API } from "aws-amplify";
import { PlanInitialPoint } from "../models";
import { listPlanInitialPoints } from "../graphql/queries";
import { emptyArray } from "../utils/render-utils";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";

function sortByDate(array: PlanInitialPoint[]): PlanInitialPoint[] {
  return array.sort((a, b) => {
    const dateA = parseDateString(a.id.split("_")[1]);
    const dateB = parseDateString(b.id.split("_")[1]);

    if (dateA && dateB) {
      return dateB.getTime() - dateA.getTime();
    }

    return 0;
  });
}

function parseDateString(dateString: string): Date | null {
  const dateFormatRegexArray = [
    /^(\d{4})(\d{2})(\d{2})$/,
    /^(\d{2})-(\d{2})-(\d{2})$/,
  ];
  for (const dateFormatRegex of dateFormatRegexArray) {
    const match = dateString.match(dateFormatRegex);

    if (match) {
      const [, year, month, day] = match;
      const parsedYear =
        dateFormatRegex === dateFormatRegexArray[0]
          ? parseInt(year, 10)
          : parseInt(year, 10) + 2000;
      const parsedMonth = parseInt(month, 10) - 1;
      const parsedDay = parseInt(day, 10);

      return new Date(parsedYear, parsedMonth, parsedDay);
    }
  }

  return null;
}

export function usePlanInitialPoints(username: string) {
  const [planInitialPoints, setPlanInitialPoints] =
    useState<PlanInitialPoint[]>(emptyArray);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    let fetchedPlanInitialPoints: PlanInitialPoint[] = emptyArray;
    if (username && username !== "") {
      try {
        let nextToken: string | null | undefined = undefined;
        do {
          const initialPointsData: any = await API.graphql({
            query: listPlanInitialPoints,
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
            variables: {
              limit: 100,
              nextToken,
            },
          });
          fetchedPlanInitialPoints = [
            ...fetchedPlanInitialPoints,
            ...(initialPointsData.data.listPlanInitialPoints
              .items as PlanInitialPoint[]),
          ];
          nextToken = initialPointsData.data.listPlanInitialPoints.nextToken;
        } while (nextToken !== null && nextToken !== undefined);

        const filteredPlanInitialPoints = fetchedPlanInitialPoints.filter(
          (item) => item.scanRecords?.some((i) => i.username === username)
        );
        const sortedPlanInitialPoints = sortByDate(filteredPlanInitialPoints);
        setPlanInitialPoints(sortedPlanInitialPoints);
      } catch (err) {
        setError(err as Error);
      }
    }
    setLoading(false);
  }, [username]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { planInitialPoints, loading, error };
}
