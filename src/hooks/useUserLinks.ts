import { useCallback, useEffect, useState } from "react";
import { API } from "aws-amplify";
import {
  onCreateUserLink,
  onDeleteUserLink,
  onUpdateUserLink,
} from "../graphql/subscriptions";
import { UserLink } from "../models";
import { userLinksByDataUrl } from "../graphql/queries";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { emptyArray } from "../utils/render-utils";

export function useUserLinks(dataUrl: string, skipLoading = true) {
  const [userLinks, setUserLinks] = useState<UserLink[]>(emptyArray);

  const fetch = useCallback(async () => {
    if (!skipLoading) {
      if (dataUrl && dataUrl !== "") {
        const userLinksData: any = await API.graphql({
          query: userLinksByDataUrl,
          variables: { dataUrl },
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        const fetchedUserLinks: UserLink[] =
          userLinksData.data.userLinksByDataUrl.items;
        setUserLinks([...fetchedUserLinks]);
      }
    }
  }, [dataUrl, setUserLinks, skipLoading]);

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);

  useEffect(() => {
    let createLinkSubscription: any;
    let updateLinkSubscription: any;
    let deleteLinkSubscription: any;

    if (!skipLoading) {
      const createLinkSubscriptionOperation: any = API.graphql({
        query: onCreateUserLink,
        variables: {},
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
      const updateLinkSubscriptionOperation: any = API.graphql({
        query: onUpdateUserLink,
        variables: {},
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
      const deleteLinkSubscriptionOperation: any = API.graphql({
        query: onDeleteUserLink,
        variables: {},
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });

      createLinkSubscription = createLinkSubscriptionOperation.subscribe({
        next: (linkData: any) => {
          const link: UserLink = linkData.value.data.onCreateUserLink;
          if (link.dataUrl === dataUrl) {
            setUserLinks([...userLinks, link]);
          }
        },
      });
      updateLinkSubscription = updateLinkSubscriptionOperation.subscribe({
        next: (linkData: any) => {
          const link: UserLink = linkData.value.data.onUpdateUserLink;
          if (link.dataUrl === dataUrl) {
            const newLinks = userLinks.filter((ul: UserLink) => {
              return ul.id !== link.id;
            });
            setUserLinks([...newLinks, link]);
          }
        },
      });
      deleteLinkSubscription = deleteLinkSubscriptionOperation.subscribe({
        next: (linkData: any) => {
          const link: UserLink = linkData.value.data.onDeleteUserLink;
          if (link.dataUrl === dataUrl) {
            const filteredLinks = userLinks.filter((ul) => ul.id !== link.id);
            setUserLinks([...filteredLinks]);
          }
        },
      });
    }

    return () => {
      if (createLinkSubscription) {
        createLinkSubscription.unsubscribe();
      }
      if (updateLinkSubscription) {
        updateLinkSubscription.unsubscribe();
      }
      if (deleteLinkSubscription) {
        deleteLinkSubscription.unsubscribe();
      }
    };
  }, [dataUrl, userLinks, setUserLinks, skipLoading]);

  return userLinks;
}
