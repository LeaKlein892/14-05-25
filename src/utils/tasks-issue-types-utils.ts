import { IssueTypeEnum } from "../API";
import { capitalize } from "lodash-es";

const issueTypesToArray = (
  typesToConvert: IssueTypeEnum[] | keyof typeof IssueTypeEnum | undefined
) => {
  let types: IssueTypeEnum[] = [];
  if (typesToConvert) {
    types = Array.from(typesToConvert) as IssueTypeEnum[];
  }
  return types;
};

const types = Object.values(IssueTypeEnum).map((x) => {
  return { value: x, label: capitalize(x) };
});

const getTasksIssueTypes = () => {
  return types;
};

const getIssueTypeColorMap = () =>
  new Map<IssueTypeEnum, string>([
    [IssueTypeEnum.ELECTRICAL, "rgba(255,197,86,0.3)"],
    [IssueTypeEnum.PLUMBING, "rgba(85,198,255,0.3)"],
    [IssueTypeEnum.SAFETY, "rgb(245,74,68)"],
    [IssueTypeEnum.HOUSEKEEPING, "rgb(230,253,92)"],
    [IssueTypeEnum.CARPENTRY, "rgba(157,136,211,0.3)"],
    [IssueTypeEnum.PAINTING, "rgba(255,101,127,0.3)"],
    [IssueTypeEnum.PLASTERING, "rgba(142,135,87,0.3)"],
    [IssueTypeEnum.STRUCTURAL, "rgba(53,196,180,0.3)"],
    [IssueTypeEnum.TILING, "rgba(139,127,137,0.3)"],
    [IssueTypeEnum.FIRE, "rgb(231,132,35)"],
    [IssueTypeEnum.HVAC, "rgba(64,219,232)"],
  ]);

const NON_LOCATED = "non-located";

export {
  issueTypesToArray,
  getTasksIssueTypes,
  getIssueTypeColorMap,
  NON_LOCATED,
};
