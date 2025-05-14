import { API } from "aws-amplify";
import { useCallback, useEffect, useState } from "react";
import { getProgressMsTasks } from "../graphql/queries";

export interface MsProjectSnapshot {
  id: string;
  tasks: Array<{
    duration: string;
    finish: string;
    guid: string;
    name: string;
    predecessor: string;
    start: string;
    successor: string;
    totalSlack: string;
    wbs: string;
  }>;
  projectId: string;
  lastUpdated: string;
}

export function useMsProjectSnapshot(project: string) {
  const [msProjectSnapshot, setMsProjectSnapshot] =
    useState<MsProjectSnapshot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    if (!project) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await (API.graphql({
        query: getProgressMsTasks,
        variables: { project },
      }) as Promise<any>);

      const snapshot = response?.data?.getProgressMsTasks;
      if (snapshot) {
        setMsProjectSnapshot(snapshot);
      } else {
        setMsProjectSnapshot(null);
      }
    } catch (err) {
      console.error("Error fetching MS Project snapshot:", err);
      setError(err as Error);
      setMsProjectSnapshot(null);
    } finally {
      setLoading(false);
    }
  }, [project]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    msProjectSnapshot,
    loading,
    error,
  };
}
