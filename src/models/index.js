// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const ItemTypeEnum = {
  "IMAGE_360": "IMAGE_360",
  "IMAGE_PLAIN_ZOOMABLE": "IMAGE_PLAIN_ZOOMABLE",
  "VIDEO_FRAME_360": "VIDEO_FRAME_360",
  "VIDEO": "VIDEO"
};

const AreaTypeEnum = {
  "APARTMENT": "APARTMENT",
  "FLOOR": "FLOOR"
};

const IssueTypeEnum = {
  "STRUCTURAL": "STRUCTURAL",
  "ELECTRICAL": "ELECTRICAL",
  "PLASTERING": "PLASTERING",
  "PLUMBING": "PLUMBING",
  "SAFETY": "SAFETY",
  "TILING": "TILING",
  "CARPENTRY": "CARPENTRY",
  "PAINTING": "PAINTING",
  "HVAC": "HVAC",
  "FIRE": "FIRE",
  "HOUSEKEEPING": "HOUSEKEEPING"
};

const ActivityStatus = {
  "DONE": "DONE",
  "IN_PROGRESS": "IN_PROGRESS",
  "NOT_STARTED": "NOT_STARTED",
  "IRRELEVANT": "IRRELEVANT"
};

const { PlanLinks, UserProfile, Project, ChatMessage, Comment, ActivityPlannedDates, ProgressDelayedActivities, Progress, UserLink, UserSceneName, PlanInitialPoint, PhotoTourPoints, PlanAnchors, TourToken, ProjectInvitation, PlanBimMatching, PlanBimTransformation, PlanUrl, LinkDetails, NearestScene, PlanAnchorsResponse, ExtendedUserProfile, Building, Floor, Area, Info, ProgressValue, ActivityPlannedDatesResponse, PlannedDatesRecord, MsProjectSnapshot, TaskData, ProjectCopilotResponse, ImagesAnalysisResponse, ImagesIn360View, Scene, CommentReply, ScanRecord, DelayedActivity, ProgressArea, Activity, ProgressCategory, CategoryChildren, PhotoRecord, BimViewport } = initSchema(schema);

export {
  PlanLinks,
  UserProfile,
  Project,
  ChatMessage,
  Comment,
  ActivityPlannedDates,
  ProgressDelayedActivities,
  Progress,
  UserLink,
  UserSceneName,
  PlanInitialPoint,
  PhotoTourPoints,
  PlanAnchors,
  TourToken,
  ProjectInvitation,
  PlanBimMatching,
  PlanBimTransformation,
  ItemTypeEnum,
  AreaTypeEnum,
  IssueTypeEnum,
  ActivityStatus,
  PlanUrl,
  LinkDetails,
  NearestScene,
  PlanAnchorsResponse,
  ExtendedUserProfile,
  Building,
  Floor,
  Area,
  Info,
  ProgressValue,
  ActivityPlannedDatesResponse,
  PlannedDatesRecord,
  MsProjectSnapshot,
  TaskData,
  ProjectCopilotResponse,
  ImagesAnalysisResponse,
  ImagesIn360View,
  Scene,
  CommentReply,
  ScanRecord,
  DelayedActivity,
  ProgressArea,
  Activity,
  ProgressCategory,
  CategoryChildren,
  PhotoRecord,
  BimViewport
};