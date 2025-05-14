import { Comment } from "../models";
import dayjs from "dayjs";
import { TourDetails } from "./projects-utils";
import { getFullTourUrl } from "./pano-utils";
import { APP_TASKS, APP_TOUR } from "./site-routes";
import { PUBLIC_BUCKET } from "./aws-utils";

const commentHasLocation = (comment: Comment) => {
  return comment.scene.sceneId !== undefined && comment.scene.sceneId !== null;
};

export enum SortOrderEnum {
  asc = 1,
  desc = -1,
}

export enum FieldTypeEnum {
  string = 1,
  boolean = 2,
  date = 3,
}

const convertValueByFiledType = (fieldType: FieldTypeEnum, value?: any) => {
  let convertedValue = undefined;
  if (fieldType === FieldTypeEnum.string) {
    convertedValue = value?.toString().toLowerCase() || "";
  } else if (fieldType === FieldTypeEnum.boolean) {
    convertedValue = value || false;
  } else if (fieldType === FieldTypeEnum.date) {
    if (value) {
      convertedValue = dayjs(value);
    }
  }
  return convertedValue;
};

const getCompareCommentsFunction = (
  field: string,
  sortOrder: SortOrderEnum,
  fieldType: FieldTypeEnum,
  secondLevelField?: string,
  secondLevelSortOrder?: SortOrderEnum,
  secondLevelFieldType?: FieldTypeEnum,
  secondLevelIsTourDetailsField: boolean = false,
  tourDetailsArray?: Map<string, TourDetails>
) => {
  const fieldKey = field as keyof Comment;
  let secondLevelFieldKey:
    | keyof Comment
    | keyof TourDetails
    | undefined = undefined;
  if (
    secondLevelField &&
    secondLevelSortOrder &&
    secondLevelFieldType &&
    secondLevelField !== field
  ) {
    secondLevelFieldKey = secondLevelField as keyof Comment;
  }

  const compareFunction = (comment: Comment, otherComment: Comment) => {
    const commentValue = convertValueByFiledType(fieldType, comment[fieldKey]);
    const otherCommentValue = convertValueByFiledType(
      fieldType,
      otherComment[fieldKey]
    );
    if (commentValue < otherCommentValue) {
      return -1 * sortOrder;
    }
    if (commentValue > otherCommentValue) {
      return 1 * sortOrder;
    }
    if (secondLevelFieldKey && secondLevelSortOrder && secondLevelFieldType) {
      const commentTourDetails = secondLevelIsTourDetailsField
        ? tourDetailsArray?.get(comment.dataUrl)
        : undefined;
      const otherCommentTourDetails = secondLevelIsTourDetailsField
        ? tourDetailsArray?.get(otherComment.dataUrl)
        : undefined;
      // second level sort
      const commentSecondLevelValue = convertValueByFiledType(
        secondLevelFieldType,
        secondLevelIsTourDetailsField && commentTourDetails
          ? commentTourDetails[secondLevelFieldKey as "building" | "floor"].name
          : comment[secondLevelFieldKey as keyof Comment]
      );
      const otherCommentSecondLevelValue = convertValueByFiledType(
        secondLevelFieldType,
        secondLevelIsTourDetailsField && otherCommentTourDetails
          ? otherCommentTourDetails[secondLevelFieldKey as "building" | "floor"]
              .name
          : otherComment[secondLevelFieldKey as keyof Comment]
      );
      if (commentSecondLevelValue < otherCommentSecondLevelValue) {
        return -1 * secondLevelSortOrder;
      }
      if (commentSecondLevelValue > otherCommentSecondLevelValue) {
        return 1 * secondLevelSortOrder;
      }
    }
    return 0;
  };
  return compareFunction;
};

const getCommentIcon = (comment: Comment) => {
  if (comment && comment.issueTypes) {
    const mainIssueType = comment.issueTypes[0];
    switch (mainIssueType) {
      case "ELECTRICAL":
        return "img/bolt.png";
      case "SAFETY":
        return "img/safety.png";
      case "PLUMBING":
        return "img/plumbing.png";
      case "CARPENTRY":
        return "img/carpentry.png";
      case "PAINTING":
        return "img/painting.png";
      case "HVAC":
        return "img/hvac.png";
      case "FIRE":
        return "img/fire.png";
      default:
        return "img/info.png";
    }
  }
  return "img/info.png";
};

const commentImageStorageLocation = (filename: string, fullPath = false) => {
  const prefix = fullPath ? `${PUBLIC_BUCKET}public/` : "";
  return prefix + "images/tasks/" + filename;
};

const getShareUrlFromComment = (lastSelectedComment: Comment | undefined) => {
  if (lastSelectedComment) {
    if (commentHasLocation(lastSelectedComment)) {
      const sceneFrame = {
        pitch: lastSelectedComment?.scene.pitch || 0,
        yaw: lastSelectedComment?.scene.yaw || 0,
        fov: lastSelectedComment?.scene.fov || 0,
      };
      return getFullTourUrl(
        sceneFrame,
        lastSelectedComment?.dataUrl,
        lastSelectedComment.scene.sceneId || "",
        APP_TOUR
      );
    } else {
      const id = lastSelectedComment?.id;
      return `${APP_TASKS}?taskId=${id}`;
    }
  } else {
    return "";
  }
};

const EMPTY_COMMENT: Comment = {
  id: "",
  dataUrl: "",
  scene: {
    sceneId: "",
    yaw: 0,
    pitch: 0,
    fov: 0,
  },
  title: "",
  role: "",
  mail: "",
};

export {
  commentHasLocation,
  getCompareCommentsFunction,
  getCommentIcon,
  commentImageStorageLocation,
  getShareUrlFromComment,
  EMPTY_COMMENT,
};
