import { useCallback, useEffect, useState } from "react";
import { API } from "aws-amplify";
import { getComment } from "../graphql/queries";
import { Comment } from "../models";
import { EMPTY_COMMENT } from "../utils/comments-utils";
import { getQueryArgs } from "../utils/query-params";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";

const taskArg = getQueryArgs("taskId");

export function useTask(taskId: string) {
  const [task, setTask] = useState<Comment | undefined>(undefined);

  const fetch = useCallback(async () => {
    if (taskArg) {
      const taskData: any = await API.graphql({
        query: getComment,
        variables: { id: taskArg },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
      const taskToSet =
        taskData.data.getComment && taskData.data.getComment !== null
          ? taskData.data.getComment
          : EMPTY_COMMENT;
      setTask(taskToSet);
    }
  }, []);

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);

  return task;
}
