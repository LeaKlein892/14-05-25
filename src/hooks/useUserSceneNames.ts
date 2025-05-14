import { useCallback, useEffect, useState } from "react";
import { API } from "aws-amplify";
import {
  onCreateUserSceneName,
  onUpdateUserSceneName,
} from "../graphql/subscriptions";
import { UserSceneName } from "../models";
import { userScenesByDataUrl } from "../graphql/queries";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { emptyArray } from "../utils/render-utils";

export function useUserSceneNames(dataUrl: string, skipLoading = true) {
  const [userSceneNames, setUserSceneNames] = useState<UserSceneName[]>(
    emptyArray
  );

  const fetch = useCallback(async () => {
    if (!skipLoading) {
      if (dataUrl && dataUrl !== "") {
        const userSceneData: any = await API.graphql({
          query: userScenesByDataUrl,
          variables: { dataUrl },
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        const userScenes: UserSceneName[] =
          userSceneData.data.userScenesByDataUrl.items;
        setUserSceneNames(userScenes);
      }
    }
  }, [dataUrl, setUserSceneNames, skipLoading]);

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);

  useEffect(() => {
    let createSubscription: any;
    let updateSubscription: any;
    if (!skipLoading) {
      const createSubscriptionOperation: any = API.graphql({
        query: onCreateUserSceneName,
        variables: {},
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
      const updateSubscriptionOperation: any = API.graphql({
        query: onUpdateUserSceneName,
        variables: {},
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });

      const updateUserSceneNames = (sceneName: UserSceneName) => {
        if (sceneName.dataUrl === dataUrl) {
          let userScenesCopy = userSceneNames.slice();
          const index = userScenesCopy.findIndex(
            (s) => s.sceneId === sceneName.sceneId
          );
          if (index !== -1) {
            (userScenesCopy[index] as any).sceneName = sceneName.sceneName;
          } else {
            userScenesCopy = userScenesCopy.concat(sceneName);
          }
          setUserSceneNames(userScenesCopy);
        }
      };

      createSubscription = createSubscriptionOperation.subscribe({
        next: (sceneData: any) => {
          const sceneName: UserSceneName =
            sceneData.value.data.onCreateUserSceneName;
          updateUserSceneNames(sceneName);
        },
      });
      updateSubscription = updateSubscriptionOperation.subscribe({
        next: (sceneData: any) => {
          const sceneName: UserSceneName =
            sceneData.value.data.onUpdateUserSceneName;
          updateUserSceneNames(sceneName);
        },
      });
    }

    return () => {
      if (createSubscription) {
        createSubscription.unsubscribe();
      }
      if (updateSubscription) {
        updateSubscription.unsubscribe();
      }
    };
  }, [dataUrl, userSceneNames, setUserSceneNames, skipLoading]);

  return userSceneNames;
}
