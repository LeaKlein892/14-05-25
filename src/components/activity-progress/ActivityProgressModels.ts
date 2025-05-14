import { Activity } from "../../models";
import { ActivityStatus } from "../../API";

export type ActivityArea = {
  building: string;
  floor: string;
  label?: string;
  anchor: string;
};

export declare class ActivityWithAnchor {
  activity: Activity;
  anchor: string;
  invisible?: boolean;
}

export declare class SwitchStatus {
  from: string;
  to: string;
  status: string;
}

export type ActivityAnchorRecord = {
  activityName: string;
  status: ActivityStatus;
  allStatuses: ActivityWithAnchor[];
  aggregatedValue?: number;
};

export type ActivityMapData = {
  Date: string;
  Area: ActivityArea;
  Activity: ActivityWithAnchor[];
  indicesOfMarkedAnchor?: number[];
};
