import { useState, useEffect, useCallback } from "react";
import { API } from "aws-amplify";
import { Comment } from "../models";
import { commentsByProjectId } from "../graphql/queries";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { emptyArray } from "../utils/render-utils";
import {
  onCreateComment,
  onDeleteComment,
  onUpdateComment,
} from "../graphql/subscriptions";

export function useCommentsByProjectId(
  projectId: string,
  filterResolved: boolean = false
) {
  const [comments, setComments] = useState<Comment[]>(emptyArray);

  const fetch = useCallback(async () => {
    let fetchedComments: Comment[] = emptyArray;
    if (projectId && projectId !== "") {
      let nextToken: string | null | undefined = undefined;
      do {
        const commentsData: any = await API.graphql({
          query: commentsByProjectId,
          variables: { projectId, limit: 100, nextToken },
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        fetchedComments = [
          ...fetchedComments,
          ...(commentsData.data.commentsByProjectId.items as Comment[]),
        ];
        nextToken = commentsData.data.commentsByProjectId.nextToken;
      } while (nextToken !== null && nextToken !== undefined);

      if (filterResolved) {
        fetchedComments = fetchedComments.filter(
          (comment) => !comment.resolved
        );
      }
      setComments([...fetchedComments]);
    }
  }, [projectId, filterResolved, setComments]);

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);

  // useEffect(() => {
  //   console.log("comments now in commentProgress", comments);
  //   let createCommentSubscription: any;
  //   const createCommentSubscriptionOperation: any = API.graphql({
  //     query: onCreateComment,
  //     variables: {},
  //     authMode: GRAPHQL_AUTH_MODE.API_KEY,
  //   });
  //   createCommentSubscription = createCommentSubscriptionOperation.subscribe({
  //     next: (commentData: any) => {
  //       const comment: Comment = commentData.value.data.onCreateComment;
  //       // // if (comment.dataUrl === dataUrl) {
  //       //   setComments([...comments, comment]);
  //       // // }
  //       if (comment.projectId === projectId) {
  //         setComments((prevComments) => [...prevComments, comment]); // שימוש בגרסה הפונקציונלית
  //       }
  //     },
  //   });
  //   return () => {
  //     if (createCommentSubscription) {
  //       createCommentSubscription.unsubscribe();
  //     }
  //   };
  // }, [comments, setComments]);

  return comments;
}
