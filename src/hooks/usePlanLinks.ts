import { useCallback, useEffect, useState } from "react";
import { API } from "aws-amplify";
import { PlanLinks } from "../models";
import { fetchPlanLinks, getPlanLinks } from "../graphql/queries";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";

let mainPlanUrl: string = "";

const getPlanId = (date: string, plan: string) => date + "_" + plan;

export function usePlanLinks(
  planUrl: string,
  date: string,
  planId: number = 0,
  hasMultiplePlans = false
) {
  const [planLinks, setPlanLinks] = useState<PlanLinks | undefined>(undefined);

  const fetch = useCallback(async () => {
    if (planId === 0) {
      mainPlanUrl = planUrl;
    }
    if (!hasMultiplePlans) {
      const userLinksData: any = await API.graphql({
        query: getPlanLinks,
        variables: {
          id: getPlanId(date, mainPlanUrl),
        },
        authMode: GRAPHQL_AUTH_MODE.API_KEY,
      });
      const fetchedPlanLinks: PlanLinks = userLinksData.data.getPlanLinks;
      if (fetchedPlanLinks && fetchedPlanLinks !== null) {
        setPlanLinks({
          ...fetchedPlanLinks,
          planUrls: [{ url: mainPlanUrl, name: "ARCHITECTURAL", id: 0 }],
        });
      }
    } else {
      if (mainPlanUrl && mainPlanUrl !== "" && date && date !== "") {
        const userLinksData: any = await API.graphql({
          query: fetchPlanLinks,
          variables: {
            planUrl: mainPlanUrl,
            date,
            planId,
          },
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
        const fetchedPlanLinks: PlanLinks = userLinksData.data.fetchPlanLinks;
        if (
          fetchedPlanLinks &&
          fetchedPlanLinks !== null &&
          fetchedPlanLinks.planUrls &&
          fetchedPlanLinks.planUrls.length > 1
        ) {
          setPlanLinks(fetchedPlanLinks);
        }
      }
    }
  }, [planUrl, setPlanLinks, date, planId, hasMultiplePlans]);

  useEffect(() => {
    fetch().then(() => {});
  }, [fetch]);

  return planLinks;
}
