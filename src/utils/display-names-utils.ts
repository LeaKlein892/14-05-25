import { Area, Building, Floor, Project } from "../models";
import { capitalize } from "lodash-es";
import { AreaTypeEnum } from "../API";
import { getFloorName, getProjectDetailsFromDataUrl } from "./projects-utils";

const getAreaTypeString = (
  areaType?: AreaTypeEnum | keyof typeof AreaTypeEnum | undefined
) => {
  return areaType ? capitalize(areaType) + " " : "";
};

const getTourDisplayName = (
  defaultDisplayName: string,
  date: string,
  project?: Project,
  building?: Building,
  floor?: Floor,
  area?: Area,
  addDateToDefault = true
) => {
  let t = "";
  let isDefault = false;
  if (project) {
    t += project.name;
  }
  if (building) {
    t += building.name
      ? t === ""
        ? `Building ${building.name}`
        : ` | Building ${building.name}`
      : t === ""
      ? `Building ${building}`
      : ` | Building ${building}`;
  }
  if (floor) {
    t += floor.name
      ? !area || area?.type !== "FLOOR"
        ? t === ""
          ? `Floor ${floor.name}`
          : ` | Floor ${floor.name}`
        : ""
      : !area || area?.type !== "FLOOR"
      ? t === ""
        ? `Floor ${floor}`
        : ` | Floor ${floor}`
      : "";
  }
  if (area) {
    t +=
      t === ""
        ? `${getAreaTypeString(area.type)}${area.name}`
        : ` | ${getAreaTypeString(area.type)}${area.name}`;
  }
  if (!project && !area && !floor && !building) {
    t = defaultDisplayName;
    isDefault = true;
  }
  if (date !== "" && (!isDefault || addDateToDefault)) {
    t += ` | ${date}`;
  }
  return t;
};

const getLocationDisplayName = (
  building?: Building,
  floor?: Floor,
  area?: Area
) => {
  let t = "";
  if (building) {
    t += `Building ${building.name}`;
  }
  if (floor) {
    if (!area || area?.type !== "FLOOR") {
      t +=
        t === "" ? `Floor ${floor.name}` : ` \u00A0|\u00A0 Floor ${floor.name}`;
    }
  }
  if (area) {
    t +=
      t === ""
        ? `${getAreaTypeString(area.type)}${area.name}`
        : ` \u00A0|\u00A0 ${getAreaTypeString(area.type)}${area.name}`;
  }
  return t;
};

const getLocationDisplayNameFromDataUrl = (dataUrl: string) => {
  const { building, floor } = getProjectDetailsFromDataUrl(dataUrl);
  return `Building ${building} \u00A0|\u00A0 Floor ${getFloorName(floor)}`;
};

const getShortPlanTitle = (title: string) => {
  if (!title) return "";
  const parts = title.split("|");
  if (parts.length < 4) return title;
  const building = parts[1]?.trim() || "";
  const floor = parts[2]?.trim() || "";
  const date = parts[3]?.trim() || "";
  return `  ${building} > ${floor} > ${date}`;
};

export {
  getTourDisplayName,
  getLocationDisplayName,
  getShortPlanTitle,
  getLocationDisplayNameFromDataUrl,
};
