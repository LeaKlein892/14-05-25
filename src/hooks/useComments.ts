import { useState, useEffect, useCallback } from "react";
import { API } from "aws-amplify";
import {
  onCreateComment,
  onDeleteComment,
  onUpdateComment,
} from "../graphql/subscriptions";
import { Comment } from "../models";
import { commentsByDataUrl } from "../graphql/queries";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { emptyArray } from "../utils/render-utils";

export function useComments(dataUrl: string) {
  const [comments, setComments] = useState<Comment[]>(emptyArray);

  const fetch = useCallback(async () => {
    let fetchedComments: Comment[] = emptyArray;
    if (dataUrl && dataUrl !== "") {
      let nextToken: string | null | undefined = undefined;
      do {
        const commentsData: any = await API.graphql({
          query: commentsByDataUrl,
          variables: { dataUrl, limit: 100, nextToken },
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        fetchedComments = [
          ...fetchedComments,
          ...(commentsData.data.commentsByDataUrl.items as Comment[]),
        ];
        nextToken = commentsData.data.commentsByDataUrl.nextToken;
      } while (nextToken !== null && nextToken !== undefined);

      setComments([...fetchedComments]);
    }
  }, [dataUrl, setComments]);

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);

  useEffect(() => {
    console.log("comments now in commentProgress from progress");
    let createCommentSubscription: any;
    let updateCommentSubscription: any;
    let deleteCommentSubscription: any;

    const createCommentSubscriptionOperation: any = API.graphql({
      query: onCreateComment,
      variables: {},
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    });
    const updateCommentSubscriptionOperation: any = API.graphql({
      query: onUpdateComment,
      variables: {},
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    });
    const deleteCommentSubscriptionOperation: any = API.graphql({
      query: onDeleteComment,
      variables: {},
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    });

    createCommentSubscription = createCommentSubscriptionOperation.subscribe({
      next: (commentData: any) => {
        const comment: Comment = commentData.value.data.onCreateComment;
        if (comment.dataUrl === dataUrl) {
          console.log("dataUrl in if create", dataUrl);
          setComments([...comments, comment]);
        }
      },
    });
    updateCommentSubscription = updateCommentSubscriptionOperation.subscribe({
      next: (commentData: any) => {
        const comment: Comment = commentData.value.data.onUpdateComment;
        if (comment.dataUrl === dataUrl) {
          const newComments = comments.filter((c: Comment) => {
            return c.id !== comment.id;
          });
          setComments([...newComments, comment]);
        }
      },
    });
    deleteCommentSubscription = deleteCommentSubscriptionOperation.subscribe({
      next: (commentData: any) => {
        const comment: Comment = commentData.value.data.onDeleteComment;
        console.log("dataUrl delete ", dataUrl);
        if (comment.dataUrl === dataUrl) {
          console.log("dataUrl in delete if", dataUrl);
          const filteredComments = comments.filter((c) => c.id !== comment.id);
          setComments([...filteredComments]);
        }
      },
    });

    return () => {
      if (createCommentSubscription) {
        createCommentSubscription.unsubscribe();
      }
      if (updateCommentSubscription) {
        updateCommentSubscription.unsubscribe();
      }
      if (deleteCommentSubscription) {
        deleteCommentSubscription.unsubscribe();
      }
    };
  }, [comments, dataUrl, setComments]);

  return comments;
}
