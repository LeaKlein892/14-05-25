import { PlanLinks, ScanRecord } from "../models";
import { NON_LOCATED } from "./tasks-issue-types-utils";

const EMPTY_PLAN_LINK = {
  id: "1",
  tourDataUrl: NON_LOCATED,
  linkLocations: [],
};

const planLinkFromScanRecord = (record?: ScanRecord): PlanLinks => {
  return {
    id: "1",
    tourDataUrl: NON_LOCATED,
    linkLocations: record
      ? [
          {
            sceneId: "Location in plan",
            linkUrl: "1",
            leftLocation: record.leftLocation,
            topLocation: record.topLocation,
          },
        ]
      : [],
  };
};

const planLinkFromLocations = (
  topLocation: number,
  leftLocation: number
): PlanLinks => {
  return {
    id: "1",
    tourDataUrl: NON_LOCATED,
    linkLocations: [
      {
        sceneId: "Location in plan",
        linkUrl: "1",
        leftLocation,
        topLocation,
      },
    ],
  };
};

export { planLinkFromScanRecord, planLinkFromLocations, EMPTY_PLAN_LINK };
