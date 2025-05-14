import * as React from "react";
import { getQueryArgs } from "../../../utils/query-params";
import { useContext, useEffect } from "react";
import { API } from "aws-amplify";
import { planLinkByAnchor } from "../../../graphql/queries";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import {
  getBuilding,
  getFloorName,
  getProjectDetailsFromPlanUrl,
} from "../../../utils/projects-utils";

let planUrl = getQueryArgs("pdf") || "";
const leftLocation = getQueryArgs("anchorLeftLocation");
const topLocation = getQueryArgs("anchorTopLocation");
leftLocation &&
  sessionStorage.setItem("anchorLeftLocation", JSON.stringify(leftLocation));
topLocation &&
  sessionStorage.setItem("anchorTopLocation", JSON.stringify(topLocation));

const defaultResponse = {
  date: "blueprint",
  linkId: -1,
};

export interface PlanInAnchorProps {}

const PlanInAnchor: React.FC<PlanInAnchorProps> = () => {
  const { client } = useContext(ProjectInformationContext);
  const anchorId = getQueryArgs("anchorId");
  anchorId && sessionStorage.setItem("anchorId", JSON.stringify(anchorId));
  useEffect(() => {
    const planLinkRes = API.graphql({
      query: planLinkByAnchor,
      variables: {
        planUrl,
        anchorId,
      },
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    }) as Promise<any>;
    planLinkRes.then((res) => {
      const { date, linkId } = res.data.planLinkByAnchor || defaultResponse;
      if (res.data.planLinkByAnchor) {
        let { building, floor } = getProjectDetailsFromPlanUrl(planUrl);
        floor = getFloorName(floor);
        building = getBuilding(undefined, building);
        window.location.href = `https://castory-app.com/plan?pdf=${planUrl}&scale=1&date=${date}&linkId=${linkId}&client=${
          client ?? "jm"
        }&anchorId=${anchorId}&building=${building}&floor=${floor}`;
      }
    });
  }, []);

  return <div></div>;
};

export default React.memo(PlanInAnchor);
