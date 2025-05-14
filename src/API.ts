/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type ProjectCopilotResponse = {
  __typename: "ProjectCopilotResponse",
  answer: string,
  imagesAnalysis?:  Array<ImagesAnalysisResponse | null > | null,
};

export type ImagesAnalysisResponse = {
  __typename: "ImagesAnalysisResponse",
  date?: string | null,
  imageKeys?: ImagesIn360View | null,
  anchor?: string | null,
  top?: number | null,
  left?: number | null,
  matchingCriteria?: boolean | null,
  certainty?: number | null,
  explanation?: string | null,
};

export type ImagesIn360View = {
  __typename: "ImagesIn360View",
  floor?: string | null,
  wall1?: string | null,
  wall2?: string | null,
  wall3?: string | null,
  wall4?: string | null,
  ceiling?: string | null,
};

export type CreateProjectInput = {
  id?: string | null,
  name: string,
  description?: string | null,
  buildings?: Array< BuildingInput | null > | null,
  imageURL: string,
  owner?: string | null,
  architect?: string | null,
  contractor?: string | null,
  projectManagement?: string | null,
  activeProject: boolean,
  defaultPlan?: string | null,
};

export type BuildingInput = {
  name: string,
  floors?: Array< FloorInput | null > | null,
};

export type FloorInput = {
  name: string,
  areas?: Array< AreaInput | null > | null,
};

export type AreaInput = {
  name: string,
  infos?: Array< InfoInput | null > | null,
  type?: AreaTypeEnum | null,
  hasMultiplePlans?: boolean | null,
};

export type InfoInput = {
  date: string,
  plan: string,
  tour: string,
  sceneId?: number | null,
  scale?: number | null,
};

export enum AreaTypeEnum {
  APARTMENT = "APARTMENT",
  FLOOR = "FLOOR",
}


export type ModelProjectConditionInput = {
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  imageURL?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  architect?: ModelStringInput | null,
  contractor?: ModelStringInput | null,
  projectManagement?: ModelStringInput | null,
  activeProject?: ModelBooleanInput | null,
  defaultPlan?: ModelStringInput | null,
  and?: Array< ModelProjectConditionInput | null > | null,
  or?: Array< ModelProjectConditionInput | null > | null,
  not?: ModelProjectConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Project = {
  __typename: "Project",
  id: string,
  name: string,
  description?: string | null,
  buildings?:  Array<Building | null > | null,
  imageURL: string,
  owner?: string | null,
  architect?: string | null,
  contractor?: string | null,
  projectManagement?: string | null,
  activeProject: boolean,
  defaultPlan?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type Building = {
  __typename: "Building",
  name: string,
  floors?:  Array<Floor | null > | null,
};

export type Floor = {
  __typename: "Floor",
  name: string,
  areas?:  Array<Area | null > | null,
};

export type Area = {
  __typename: "Area",
  name: string,
  infos?:  Array<Info | null > | null,
  type?: AreaTypeEnum | null,
  hasMultiplePlans?: boolean | null,
};

export type Info = {
  __typename: "Info",
  date: string,
  plan: string,
  tour: string,
  sceneId?: number | null,
  scale?: number | null,
};

export type UpdateProjectInput = {
  id: string,
  name?: string | null,
  description?: string | null,
  buildings?: Array< BuildingInput | null > | null,
  imageURL?: string | null,
  owner?: string | null,
  architect?: string | null,
  contractor?: string | null,
  projectManagement?: string | null,
  activeProject?: boolean | null,
  defaultPlan?: string | null,
};

export type DeleteProjectInput = {
  id: string,
};

export type CreateActivityPlannedDatesInput = {
  id?: string | null,
  projectId: string,
  startDates: string,
  endDates: string,
};

export type ModelActivityPlannedDatesConditionInput = {
  projectId?: ModelStringInput | null,
  startDates?: ModelStringInput | null,
  endDates?: ModelStringInput | null,
  and?: Array< ModelActivityPlannedDatesConditionInput | null > | null,
  or?: Array< ModelActivityPlannedDatesConditionInput | null > | null,
  not?: ModelActivityPlannedDatesConditionInput | null,
};

export type ActivityPlannedDates = {
  __typename: "ActivityPlannedDates",
  id: string,
  projectId: string,
  startDates: string,
  endDates: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateActivityPlannedDatesInput = {
  id: string,
  projectId?: string | null,
  startDates?: string | null,
  endDates?: string | null,
};

export type DeleteActivityPlannedDatesInput = {
  id: string,
};

export type CreateProgressDelayedActivitiesInput = {
  id?: string | null,
  delayedActivities?: Array< DelayedActivityInput | null > | null,
};

export type DelayedActivityInput = {
  location: string,
  probability: number,
  reason?: string | null,
};

export type ModelProgressDelayedActivitiesConditionInput = {
  and?: Array< ModelProgressDelayedActivitiesConditionInput | null > | null,
  or?: Array< ModelProgressDelayedActivitiesConditionInput | null > | null,
  not?: ModelProgressDelayedActivitiesConditionInput | null,
};

export type ProgressDelayedActivities = {
  __typename: "ProgressDelayedActivities",
  id: string,
  delayedActivities?:  Array<DelayedActivity | null > | null,
  createdAt: string,
  updatedAt: string,
};

export type DelayedActivity = {
  __typename: "DelayedActivity",
  location: string,
  probability: number,
  reason?: string | null,
};

export type UpdateProgressDelayedActivitiesInput = {
  id: string,
  delayedActivities?: Array< DelayedActivityInput | null > | null,
};

export type DeleteProgressDelayedActivitiesInput = {
  id: string,
};

export type CreateProgressInput = {
  id?: string | null,
  projectId: string,
  date: string,
  progressAreas?: Array< ProgressAreaInput | null > | null,
  chunkId?: number | null,
  labels?: Array< string | null > | null,
  dod?: number | null,
  draft?: boolean | null,
  categories?: Array< ProgressCategoryInput | null > | null,
};

export type ProgressAreaInput = {
  building: string,
  floor: string,
  anchor: string,
  weight?: number | null,
  label?: string | null,
  invisible?: boolean | null,
  activities?: Array< ActivityInput | null > | null,
};

export type ActivityInput = {
  activityName: string,
  status: ActivityStatus,
  previousStatus?: ActivityStatus | null,
  updater?: string | null,
  updateReason?: string | null,
  dateManuallyUpdated?: string | null,
};

export enum ActivityStatus {
  DONE = "DONE",
  IN_PROGRESS = "IN_PROGRESS",
  NOT_STARTED = "NOT_STARTED",
  IRRELEVANT = "IRRELEVANT",
}


export type ProgressCategoryInput = {
  name: string,
  includes?: Array< CategoryChildrenInput | null > | null,
};

export type CategoryChildrenInput = {
  name: string,
  weight?: number | null,
};

export type ModelProgressConditionInput = {
  projectId?: ModelStringInput | null,
  date?: ModelStringInput | null,
  chunkId?: ModelFloatInput | null,
  labels?: ModelStringInput | null,
  dod?: ModelFloatInput | null,
  draft?: ModelBooleanInput | null,
  and?: Array< ModelProgressConditionInput | null > | null,
  or?: Array< ModelProgressConditionInput | null > | null,
  not?: ModelProgressConditionInput | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Progress = {
  __typename: "Progress",
  id: string,
  projectId: string,
  date: string,
  progressAreas?:  Array<ProgressArea | null > | null,
  chunkId?: number | null,
  labels?: Array< string | null > | null,
  dod?: number | null,
  draft?: boolean | null,
  categories?:  Array<ProgressCategory | null > | null,
  createdAt: string,
  updatedAt: string,
};

export type ProgressArea = {
  __typename: "ProgressArea",
  building: string,
  floor: string,
  anchor: string,
  weight?: number | null,
  label?: string | null,
  invisible?: boolean | null,
  activities?:  Array<Activity | null > | null,
};

export type Activity = {
  __typename: "Activity",
  activityName: string,
  status: ActivityStatus,
  previousStatus?: ActivityStatus | null,
  updater?: string | null,
  updateReason?: string | null,
  dateManuallyUpdated?: string | null,
};

export type ProgressCategory = {
  __typename: "ProgressCategory",
  name: string,
  includes?:  Array<CategoryChildren | null > | null,
};

export type CategoryChildren = {
  __typename: "CategoryChildren",
  name: string,
  weight?: number | null,
};

export type UpdateProgressInput = {
  id: string,
  projectId?: string | null,
  date?: string | null,
  progressAreas?: Array< ProgressAreaInput | null > | null,
  chunkId?: number | null,
  labels?: Array< string | null > | null,
  dod?: number | null,
  draft?: boolean | null,
  categories?: Array< ProgressCategoryInput | null > | null,
};

export type DeleteProgressInput = {
  id: string,
};

export type CreatePlanLinksInput = {
  id?: string | null,
  tourDataUrl: string,
  planUrls?: Array< PlanUrlInput | null > | null,
  linkLocations: Array< LinkDetailsInput | null >,
};

export type PlanUrlInput = {
  url: string,
  name: string,
  id: number,
};

export type LinkDetailsInput = {
  sceneId: string,
  sceneName?: string | null,
  planYaw?: number | null,
  leftLocation: number,
  topLocation: number,
  linkUrl: string,
  isPhotoLink?: boolean | null,
  linkItemType?: ItemTypeEnum | null,
};

export enum ItemTypeEnum {
  IMAGE_360 = "IMAGE_360",
  IMAGE_PLAIN_ZOOMABLE = "IMAGE_PLAIN_ZOOMABLE",
  VIDEO_FRAME_360 = "VIDEO_FRAME_360",
  VIDEO = "VIDEO",
}


export type ModelPlanLinksConditionInput = {
  tourDataUrl?: ModelStringInput | null,
  and?: Array< ModelPlanLinksConditionInput | null > | null,
  or?: Array< ModelPlanLinksConditionInput | null > | null,
  not?: ModelPlanLinksConditionInput | null,
};

export type PlanLinks = {
  __typename: "PlanLinks",
  id: string,
  tourDataUrl: string,
  planUrls?:  Array<PlanUrl | null > | null,
  linkLocations:  Array<LinkDetails | null >,
  createdAt: string,
  updatedAt: string,
};

export type PlanUrl = {
  __typename: "PlanUrl",
  url: string,
  name: string,
  id: number,
};

export type LinkDetails = {
  __typename: "LinkDetails",
  sceneId: string,
  sceneName?: string | null,
  planYaw?: number | null,
  leftLocation: number,
  topLocation: number,
  linkUrl: string,
  isPhotoLink?: boolean | null,
  linkItemType?: ItemTypeEnum | null,
};

export type UpdatePlanLinksInput = {
  id: string,
  tourDataUrl?: string | null,
  planUrls?: Array< PlanUrlInput | null > | null,
  linkLocations?: Array< LinkDetailsInput | null > | null,
};

export type DeletePlanLinksInput = {
  id: string,
};

export type CreateUserProfileInput = {
  id?: string | null,
  username: string,
  email: string,
  phoneNumber?: string | null,
  role?: string | null,
  unsubscribedToEmails?: boolean | null,
  isProgressAdmin?: boolean | null,
  progressEditor?: boolean | null,
  participatesInProjects?: Array< string | null > | null,
};

export type ModelUserProfileConditionInput = {
  username?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  role?: ModelStringInput | null,
  unsubscribedToEmails?: ModelBooleanInput | null,
  isProgressAdmin?: ModelBooleanInput | null,
  progressEditor?: ModelBooleanInput | null,
  participatesInProjects?: ModelStringInput | null,
  and?: Array< ModelUserProfileConditionInput | null > | null,
  or?: Array< ModelUserProfileConditionInput | null > | null,
  not?: ModelUserProfileConditionInput | null,
};

export type UserProfile = {
  __typename: "UserProfile",
  id: string,
  username: string,
  email: string,
  phoneNumber?: string | null,
  role?: string | null,
  unsubscribedToEmails?: boolean | null,
  isProgressAdmin?: boolean | null,
  progressEditor?: boolean | null,
  participatesInProjects?: Array< string | null > | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateUserProfileInput = {
  id: string,
  username?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  role?: string | null,
  unsubscribedToEmails?: boolean | null,
  isProgressAdmin?: boolean | null,
  progressEditor?: boolean | null,
  participatesInProjects?: Array< string | null > | null,
};

export type DeleteUserProfileInput = {
  id: string,
};

export type CreatePhotoTourPointsInput = {
  id?: string | null,
  projectId: string,
  building: string,
  area: string,
  filesPath?: string | null,
  date?: string | null,
  username: string,
  registered?: boolean | null,
  photoRecords?: Array< PhotoRecordInput | null > | null,
};

export type PhotoRecordInput = {
  leftLocation: number,
  topLocation: number,
  fileName: string,
  needsManualRegistration?: boolean | null,
  label?: string | null,
};

export type ModelPhotoTourPointsConditionInput = {
  projectId?: ModelStringInput | null,
  building?: ModelStringInput | null,
  area?: ModelStringInput | null,
  filesPath?: ModelStringInput | null,
  date?: ModelStringInput | null,
  username?: ModelStringInput | null,
  registered?: ModelBooleanInput | null,
  and?: Array< ModelPhotoTourPointsConditionInput | null > | null,
  or?: Array< ModelPhotoTourPointsConditionInput | null > | null,
  not?: ModelPhotoTourPointsConditionInput | null,
};

export type PhotoTourPoints = {
  __typename: "PhotoTourPoints",
  id: string,
  projectId: string,
  building: string,
  area: string,
  filesPath?: string | null,
  date?: string | null,
  username: string,
  registered?: boolean | null,
  photoRecords?:  Array<PhotoRecord | null > | null,
  createdAt: string,
  updatedAt: string,
};

export type PhotoRecord = {
  __typename: "PhotoRecord",
  leftLocation: number,
  topLocation: number,
  fileName: string,
  needsManualRegistration?: boolean | null,
  label?: string | null,
};

export type UpdatePhotoTourPointsInput = {
  id: string,
  projectId?: string | null,
  building?: string | null,
  area?: string | null,
  filesPath?: string | null,
  date?: string | null,
  username?: string | null,
  registered?: boolean | null,
  photoRecords?: Array< PhotoRecordInput | null > | null,
};

export type DeletePhotoTourPointsInput = {
  id: string,
};

export type CreatePlanAnchorsInput = {
  id?: string | null,
  photoRecords?: Array< PhotoRecordInput | null > | null,
};

export type ModelPlanAnchorsConditionInput = {
  and?: Array< ModelPlanAnchorsConditionInput | null > | null,
  or?: Array< ModelPlanAnchorsConditionInput | null > | null,
  not?: ModelPlanAnchorsConditionInput | null,
};

export type PlanAnchors = {
  __typename: "PlanAnchors",
  id: string,
  photoRecords?:  Array<PhotoRecord | null > | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdatePlanAnchorsInput = {
  id: string,
  photoRecords?: Array< PhotoRecordInput | null > | null,
};

export type DeletePlanAnchorsInput = {
  id: string,
};

export type CreateTourTokenInput = {
  id?: string | null,
  token: string,
};

export type ModelTourTokenConditionInput = {
  token?: ModelStringInput | null,
  and?: Array< ModelTourTokenConditionInput | null > | null,
  or?: Array< ModelTourTokenConditionInput | null > | null,
  not?: ModelTourTokenConditionInput | null,
};

export type TourToken = {
  __typename: "TourToken",
  id: string,
  token: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateTourTokenInput = {
  id: string,
  token?: string | null,
};

export type DeleteTourTokenInput = {
  id: string,
};

export type CreateProjectInvitationInput = {
  id?: string | null,
  fromUserName: string,
  inviteAddress: string,
  token: string,
  projectId: string,
};

export type ModelProjectInvitationConditionInput = {
  fromUserName?: ModelStringInput | null,
  inviteAddress?: ModelStringInput | null,
  token?: ModelStringInput | null,
  projectId?: ModelStringInput | null,
  and?: Array< ModelProjectInvitationConditionInput | null > | null,
  or?: Array< ModelProjectInvitationConditionInput | null > | null,
  not?: ModelProjectInvitationConditionInput | null,
};

export type ProjectInvitation = {
  __typename: "ProjectInvitation",
  id: string,
  fromUserName: string,
  inviteAddress: string,
  token: string,
  projectId: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateProjectInvitationInput = {
  id: string,
  fromUserName?: string | null,
  inviteAddress?: string | null,
  token?: string | null,
  projectId?: string | null,
};

export type DeleteProjectInvitationInput = {
  id: string,
};

export type CreatePlanBimMatchingInput = {
  id?: string | null,
  planUrl: string,
  bimUrl: string,
  record: ScanRecordInput,
  viewport: BimViewportInput,
};

export type ScanRecordInput = {
  recordDate: string,
  building: string,
  floor: string,
  planUrl: string,
  leftLocation: number,
  topLocation: number,
  username: string,
};

export type BimViewportInput = {
  name: string,
  eye: Array< number | null >,
  target: Array< number | null >,
  up: Array< number | null >,
  worldUpVector: Array< number | null >,
  pivotPoint: Array< number | null >,
  distanceToOrbit: number,
  aspectRatio: number,
  projection: string,
  isOrthographic: boolean,
  fieldOfView: number,
};

export type ModelPlanBimMatchingConditionInput = {
  planUrl?: ModelStringInput | null,
  bimUrl?: ModelStringInput | null,
  and?: Array< ModelPlanBimMatchingConditionInput | null > | null,
  or?: Array< ModelPlanBimMatchingConditionInput | null > | null,
  not?: ModelPlanBimMatchingConditionInput | null,
};

export type PlanBimMatching = {
  __typename: "PlanBimMatching",
  id: string,
  planUrl: string,
  bimUrl: string,
  record: ScanRecord,
  viewport: BimViewport,
  createdAt: string,
  updatedAt: string,
};

export type ScanRecord = {
  __typename: "ScanRecord",
  recordDate: string,
  building: string,
  floor: string,
  planUrl: string,
  leftLocation: number,
  topLocation: number,
  username: string,
};

export type BimViewport = {
  __typename: "BimViewport",
  name: string,
  eye: Array< number | null >,
  target: Array< number | null >,
  up: Array< number | null >,
  worldUpVector: Array< number | null >,
  pivotPoint: Array< number | null >,
  distanceToOrbit: number,
  aspectRatio: number,
  projection: string,
  isOrthographic: boolean,
  fieldOfView: number,
};

export type UpdatePlanBimMatchingInput = {
  id: string,
  planUrl?: string | null,
  bimUrl?: string | null,
  record?: ScanRecordInput | null,
  viewport?: BimViewportInput | null,
};

export type DeletePlanBimMatchingInput = {
  id: string,
};

export type CreatePlanBimTransformationInput = {
  id?: string | null,
  bimUrl: string,
  transformationMatrix?: Array< Array< number | null > | null > | null,
  bimUp2CastoryUpRotationMatrix?: Array< Array< number | null > | null > | null,
  inverseMatchMatrix?: Array< Array< number | null > | null > | null,
  floorUpVec?: Array< number | null > | null,
  northVec?: Array< number | null > | null,
  eastVec?: Array< number | null > | null,
  viewport?: BimViewportInput | null,
  preventFirstPerson?: boolean | null,
};

export type ModelPlanBimTransformationConditionInput = {
  bimUrl?: ModelStringInput | null,
  transformationMatrix?: ModelFloatInput | null,
  bimUp2CastoryUpRotationMatrix?: ModelFloatInput | null,
  inverseMatchMatrix?: ModelFloatInput | null,
  floorUpVec?: ModelFloatInput | null,
  northVec?: ModelFloatInput | null,
  eastVec?: ModelFloatInput | null,
  preventFirstPerson?: ModelBooleanInput | null,
  and?: Array< ModelPlanBimTransformationConditionInput | null > | null,
  or?: Array< ModelPlanBimTransformationConditionInput | null > | null,
  not?: ModelPlanBimTransformationConditionInput | null,
};

export type PlanBimTransformation = {
  __typename: "PlanBimTransformation",
  id: string,
  bimUrl: string,
  transformationMatrix?: Array< Array< number | null > | null > | null,
  bimUp2CastoryUpRotationMatrix?: Array< Array< number | null > | null > | null,
  inverseMatchMatrix?: Array< Array< number | null > | null > | null,
  floorUpVec?: Array< number | null > | null,
  northVec?: Array< number | null > | null,
  eastVec?: Array< number | null > | null,
  viewport?: BimViewport | null,
  preventFirstPerson?: boolean | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdatePlanBimTransformationInput = {
  id: string,
  bimUrl?: string | null,
  transformationMatrix?: Array< Array< number | null > | null > | null,
  bimUp2CastoryUpRotationMatrix?: Array< Array< number | null > | null > | null,
  inverseMatchMatrix?: Array< Array< number | null > | null > | null,
  floorUpVec?: Array< number | null > | null,
  northVec?: Array< number | null > | null,
  eastVec?: Array< number | null > | null,
  viewport?: BimViewportInput | null,
  preventFirstPerson?: boolean | null,
};

export type DeletePlanBimTransformationInput = {
  id: string,
};

export type CreateCommentInput = {
  id?: string | null,
  dataUrl: string,
  scene: SceneInput,
  title: string,
  role: string,
  mail: string,
  projectId?: string | null,
  description?: string | null,
  writtenBy?: string | null,
  replies?: Array< CommentReplyInput | null > | null,
  resolved?: boolean | null,
  record?: ScanRecordInput | null,
  issueTypes?: Array< IssueTypeEnum | null > | null,
  customIssueTypes?: Array< string | null > | null,
  assignees?: Array< string | null > | null,
  progress?: number | null,
  dueDate?: string | null,
};

export type SceneInput = {
  sceneId?: string | null,
  yaw?: number | null,
  pitch?: number | null,
  fov?: number | null,
};

export type CommentReplyInput = {
  reply: string,
  writtenBy?: string | null,
  date: string,
  role?: string | null,
  mail?: string | null,
  fileName?: string | null,
};

export enum IssueTypeEnum {
  STRUCTURAL = "STRUCTURAL",
  ELECTRICAL = "ELECTRICAL",
  PLASTERING = "PLASTERING",
  PLUMBING = "PLUMBING",
  SAFETY = "SAFETY",
  TILING = "TILING",
  CARPENTRY = "CARPENTRY",
  PAINTING = "PAINTING",
  HVAC = "HVAC",
  FIRE = "FIRE",
  HOUSEKEEPING = "HOUSEKEEPING",
}


export type ModelCommentConditionInput = {
  dataUrl?: ModelStringInput | null,
  title?: ModelStringInput | null,
  role?: ModelStringInput | null,
  mail?: ModelStringInput | null,
  projectId?: ModelStringInput | null,
  description?: ModelStringInput | null,
  writtenBy?: ModelStringInput | null,
  resolved?: ModelBooleanInput | null,
  issueTypes?: ModelIssueTypeEnumListInput | null,
  customIssueTypes?: ModelStringInput | null,
  assignees?: ModelStringInput | null,
  progress?: ModelFloatInput | null,
  dueDate?: ModelStringInput | null,
  and?: Array< ModelCommentConditionInput | null > | null,
  or?: Array< ModelCommentConditionInput | null > | null,
  not?: ModelCommentConditionInput | null,
};

export type ModelIssueTypeEnumListInput = {
  eq?: Array< IssueTypeEnum | null > | null,
  ne?: Array< IssueTypeEnum | null > | null,
  contains?: IssueTypeEnum | null,
  notContains?: IssueTypeEnum | null,
};

export type Comment = {
  __typename: "Comment",
  id: string,
  dataUrl: string,
  scene: Scene,
  title: string,
  role: string,
  mail: string,
  projectId?: string | null,
  description?: string | null,
  writtenBy?: string | null,
  replies?:  Array<CommentReply | null > | null,
  resolved?: boolean | null,
  record?: ScanRecord | null,
  issueTypes?: Array< IssueTypeEnum | null > | null,
  customIssueTypes?: Array< string | null > | null,
  assignees?: Array< string | null > | null,
  progress?: number | null,
  dueDate?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type Scene = {
  __typename: "Scene",
  sceneId?: string | null,
  yaw?: number | null,
  pitch?: number | null,
  fov?: number | null,
};

export type CommentReply = {
  __typename: "CommentReply",
  reply: string,
  writtenBy?: string | null,
  date: string,
  role?: string | null,
  mail?: string | null,
  fileName?: string | null,
};

export type UpdateCommentInput = {
  id: string,
  dataUrl?: string | null,
  scene?: SceneInput | null,
  title?: string | null,
  role?: string | null,
  mail?: string | null,
  projectId?: string | null,
  description?: string | null,
  writtenBy?: string | null,
  replies?: Array< CommentReplyInput | null > | null,
  resolved?: boolean | null,
  record?: ScanRecordInput | null,
  issueTypes?: Array< IssueTypeEnum | null > | null,
  customIssueTypes?: Array< string | null > | null,
  assignees?: Array< string | null > | null,
  progress?: number | null,
  dueDate?: string | null,
};

export type DeleteCommentInput = {
  id: string,
};

export type CreateUserLinkInput = {
  id?: string | null,
  dataUrl: string,
  scene: SceneInput,
  targetYaw?: number | null,
  targetPitch?: number | null,
  linkFrom?: string | null,
  linkTo: string,
  rotation: number,
};

export type ModelUserLinkConditionInput = {
  dataUrl?: ModelStringInput | null,
  targetYaw?: ModelFloatInput | null,
  targetPitch?: ModelFloatInput | null,
  linkFrom?: ModelStringInput | null,
  linkTo?: ModelStringInput | null,
  rotation?: ModelIntInput | null,
  and?: Array< ModelUserLinkConditionInput | null > | null,
  or?: Array< ModelUserLinkConditionInput | null > | null,
  not?: ModelUserLinkConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type UserLink = {
  __typename: "UserLink",
  id: string,
  dataUrl: string,
  scene: Scene,
  targetYaw?: number | null,
  targetPitch?: number | null,
  linkFrom?: string | null,
  linkTo: string,
  rotation: number,
  createdAt: string,
  updatedAt: string,
};

export type UpdateUserLinkInput = {
  id: string,
  dataUrl?: string | null,
  scene?: SceneInput | null,
  targetYaw?: number | null,
  targetPitch?: number | null,
  linkFrom?: string | null,
  linkTo?: string | null,
  rotation?: number | null,
};

export type DeleteUserLinkInput = {
  id: string,
};

export type CreateUserSceneNameInput = {
  id?: string | null,
  dataUrl: string,
  sceneId: string,
  sceneName: string,
};

export type ModelUserSceneNameConditionInput = {
  dataUrl?: ModelStringInput | null,
  sceneId?: ModelStringInput | null,
  sceneName?: ModelStringInput | null,
  and?: Array< ModelUserSceneNameConditionInput | null > | null,
  or?: Array< ModelUserSceneNameConditionInput | null > | null,
  not?: ModelUserSceneNameConditionInput | null,
};

export type UserSceneName = {
  __typename: "UserSceneName",
  id: string,
  dataUrl: string,
  sceneId: string,
  sceneName: string,
  createdAt: string,
  updatedAt: string,
};

export type UpdateUserSceneNameInput = {
  id: string,
  dataUrl?: string | null,
  sceneId?: string | null,
  sceneName?: string | null,
};

export type DeleteUserSceneNameInput = {
  id: string,
};

export type CreateChatMessageInput = {
  id?: string | null,
  username: string,
  text: string,
  project: string,
  isAnswer?: boolean | null,
  analysis?: Array< ImagesAnalysisResponseInput | null > | null,
  createdAt?: string | null,
};

export type ImagesAnalysisResponseInput = {
  date?: string | null,
  imageKeys?: ImagesIn360ViewInput | null,
  anchor?: string | null,
  top?: number | null,
  left?: number | null,
  matchingCriteria?: boolean | null,
  certainty?: number | null,
  explanation?: string | null,
};

export type ImagesIn360ViewInput = {
  floor?: string | null,
  wall1?: string | null,
  wall2?: string | null,
  wall3?: string | null,
  wall4?: string | null,
  ceiling?: string | null,
};

export type ModelChatMessageConditionInput = {
  username?: ModelStringInput | null,
  text?: ModelStringInput | null,
  project?: ModelStringInput | null,
  isAnswer?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelChatMessageConditionInput | null > | null,
  or?: Array< ModelChatMessageConditionInput | null > | null,
  not?: ModelChatMessageConditionInput | null,
};

export type ChatMessage = {
  __typename: "ChatMessage",
  id: string,
  username: string,
  text: string,
  project: string,
  isAnswer?: boolean | null,
  analysis?:  Array<ImagesAnalysisResponse | null > | null,
  createdAt?: string | null,
  updatedAt: string,
};

export type UpdateChatMessageInput = {
  id: string,
  username?: string | null,
  text?: string | null,
  project?: string | null,
  isAnswer?: boolean | null,
  analysis?: Array< ImagesAnalysisResponseInput | null > | null,
  createdAt?: string | null,
};

export type DeleteChatMessageInput = {
  id: string,
};

export type CreatePlanInitialPointInput = {
  id?: string | null,
  matched: boolean,
  scanRecords?: Array< ScanRecordInput | null > | null,
};

export type ModelPlanInitialPointConditionInput = {
  matched?: ModelBooleanInput | null,
  and?: Array< ModelPlanInitialPointConditionInput | null > | null,
  or?: Array< ModelPlanInitialPointConditionInput | null > | null,
  not?: ModelPlanInitialPointConditionInput | null,
};

export type PlanInitialPoint = {
  __typename: "PlanInitialPoint",
  id: string,
  matched: boolean,
  scanRecords?:  Array<ScanRecord | null > | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdatePlanInitialPointInput = {
  id: string,
  matched?: boolean | null,
  scanRecords?: Array< ScanRecordInput | null > | null,
};

export type DeletePlanInitialPointInput = {
  id: string,
};

export type ExtendedUserProfile = {
  __typename: "ExtendedUserProfile",
  userProfile?: UserProfile | null,
  projects?:  Array<Project | null > | null,
};

export type ProgressValue = {
  __typename: "ProgressValue",
  date?: string | null,
  progress?: number | null,
};

export type ActivityPlannedDatesResponse = {
  __typename: "ActivityPlannedDatesResponse",
  activity: string,
  plannedDates:  Array<PlannedDatesRecord | null >,
};

export type PlannedDatesRecord = {
  __typename: "PlannedDatesRecord",
  building: string,
  floor: string,
  startDate: string,
  endDate: string,
};

export type MsProjectSnapshot = {
  __typename: "MsProjectSnapshot",
  id: string,
  tasks?:  Array<TaskData | null > | null,
  projectId?: string | null,
  lastUpdated?: string | null,
};

export type TaskData = {
  __typename: "TaskData",
  duration?: string | null,
  finish?: string | null,
  guid?: string | null,
  name?: string | null,
  predecessor?: string | null,
  start?: string | null,
  successor?: string | null,
  totalSlack?: string | null,
  wbs?: string | null,
};

export type ModelActivityPlannedDatesFilterInput = {
  id?: ModelIDInput | null,
  projectId?: ModelStringInput | null,
  startDates?: ModelStringInput | null,
  endDates?: ModelStringInput | null,
  and?: Array< ModelActivityPlannedDatesFilterInput | null > | null,
  or?: Array< ModelActivityPlannedDatesFilterInput | null > | null,
  not?: ModelActivityPlannedDatesFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelActivityPlannedDatesConnection = {
  __typename: "ModelActivityPlannedDatesConnection",
  items:  Array<ActivityPlannedDates | null >,
  nextToken?: string | null,
};

export type ModelProgressDelayedActivitiesFilterInput = {
  id?: ModelIDInput | null,
  and?: Array< ModelProgressDelayedActivitiesFilterInput | null > | null,
  or?: Array< ModelProgressDelayedActivitiesFilterInput | null > | null,
  not?: ModelProgressDelayedActivitiesFilterInput | null,
};

export type ModelProgressDelayedActivitiesConnection = {
  __typename: "ModelProgressDelayedActivitiesConnection",
  items:  Array<ProgressDelayedActivities | null >,
  nextToken?: string | null,
};

export type ModelProgressFilterInput = {
  id?: ModelIDInput | null,
  projectId?: ModelStringInput | null,
  date?: ModelStringInput | null,
  chunkId?: ModelFloatInput | null,
  labels?: ModelStringInput | null,
  dod?: ModelFloatInput | null,
  draft?: ModelBooleanInput | null,
  and?: Array< ModelProgressFilterInput | null > | null,
  or?: Array< ModelProgressFilterInput | null > | null,
  not?: ModelProgressFilterInput | null,
};

export type ModelProgressConnection = {
  __typename: "ModelProgressConnection",
  items:  Array<Progress | null >,
  nextToken?: string | null,
};

export type ModelUserProfileFilterInput = {
  id?: ModelIDInput | null,
  username?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  role?: ModelStringInput | null,
  unsubscribedToEmails?: ModelBooleanInput | null,
  isProgressAdmin?: ModelBooleanInput | null,
  progressEditor?: ModelBooleanInput | null,
  participatesInProjects?: ModelStringInput | null,
  and?: Array< ModelUserProfileFilterInput | null > | null,
  or?: Array< ModelUserProfileFilterInput | null > | null,
  not?: ModelUserProfileFilterInput | null,
};

export type ModelUserProfileConnection = {
  __typename: "ModelUserProfileConnection",
  items:  Array<UserProfile | null >,
  nextToken?: string | null,
};

export type ModelPhotoTourPointsFilterInput = {
  id?: ModelIDInput | null,
  projectId?: ModelStringInput | null,
  building?: ModelStringInput | null,
  area?: ModelStringInput | null,
  filesPath?: ModelStringInput | null,
  date?: ModelStringInput | null,
  username?: ModelStringInput | null,
  registered?: ModelBooleanInput | null,
  and?: Array< ModelPhotoTourPointsFilterInput | null > | null,
  or?: Array< ModelPhotoTourPointsFilterInput | null > | null,
  not?: ModelPhotoTourPointsFilterInput | null,
};

export type ModelPhotoTourPointsConnection = {
  __typename: "ModelPhotoTourPointsConnection",
  items:  Array<PhotoTourPoints | null >,
  nextToken?: string | null,
};

export type ModelPlanAnchorsFilterInput = {
  id?: ModelIDInput | null,
  and?: Array< ModelPlanAnchorsFilterInput | null > | null,
  or?: Array< ModelPlanAnchorsFilterInput | null > | null,
  not?: ModelPlanAnchorsFilterInput | null,
};

export type ModelPlanAnchorsConnection = {
  __typename: "ModelPlanAnchorsConnection",
  items:  Array<PlanAnchors | null >,
  nextToken?: string | null,
};

export type ModelProjectInvitationFilterInput = {
  id?: ModelIDInput | null,
  fromUserName?: ModelStringInput | null,
  inviteAddress?: ModelStringInput | null,
  token?: ModelStringInput | null,
  projectId?: ModelStringInput | null,
  and?: Array< ModelProjectInvitationFilterInput | null > | null,
  or?: Array< ModelProjectInvitationFilterInput | null > | null,
  not?: ModelProjectInvitationFilterInput | null,
};

export type ModelProjectInvitationConnection = {
  __typename: "ModelProjectInvitationConnection",
  items:  Array<ProjectInvitation | null >,
  nextToken?: string | null,
};

export type ModelPlanBimMatchingFilterInput = {
  id?: ModelIDInput | null,
  planUrl?: ModelStringInput | null,
  bimUrl?: ModelStringInput | null,
  and?: Array< ModelPlanBimMatchingFilterInput | null > | null,
  or?: Array< ModelPlanBimMatchingFilterInput | null > | null,
  not?: ModelPlanBimMatchingFilterInput | null,
};

export type ModelPlanBimMatchingConnection = {
  __typename: "ModelPlanBimMatchingConnection",
  items:  Array<PlanBimMatching | null >,
  nextToken?: string | null,
};

export type ModelPlanBimTransformationFilterInput = {
  id?: ModelIDInput | null,
  bimUrl?: ModelStringInput | null,
  transformationMatrix?: ModelFloatInput | null,
  bimUp2CastoryUpRotationMatrix?: ModelFloatInput | null,
  inverseMatchMatrix?: ModelFloatInput | null,
  floorUpVec?: ModelFloatInput | null,
  northVec?: ModelFloatInput | null,
  eastVec?: ModelFloatInput | null,
  preventFirstPerson?: ModelBooleanInput | null,
  and?: Array< ModelPlanBimTransformationFilterInput | null > | null,
  or?: Array< ModelPlanBimTransformationFilterInput | null > | null,
  not?: ModelPlanBimTransformationFilterInput | null,
};

export type ModelPlanBimTransformationConnection = {
  __typename: "ModelPlanBimTransformationConnection",
  items:  Array<PlanBimTransformation | null >,
  nextToken?: string | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelProjectFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  description?: ModelStringInput | null,
  imageURL?: ModelStringInput | null,
  owner?: ModelStringInput | null,
  architect?: ModelStringInput | null,
  contractor?: ModelStringInput | null,
  projectManagement?: ModelStringInput | null,
  activeProject?: ModelBooleanInput | null,
  defaultPlan?: ModelStringInput | null,
  and?: Array< ModelProjectFilterInput | null > | null,
  or?: Array< ModelProjectFilterInput | null > | null,
  not?: ModelProjectFilterInput | null,
};

export type ModelProjectConnection = {
  __typename: "ModelProjectConnection",
  items:  Array<Project | null >,
  nextToken?: string | null,
};

export type ModelCommentFilterInput = {
  id?: ModelIDInput | null,
  dataUrl?: ModelStringInput | null,
  title?: ModelStringInput | null,
  role?: ModelStringInput | null,
  mail?: ModelStringInput | null,
  projectId?: ModelStringInput | null,
  description?: ModelStringInput | null,
  writtenBy?: ModelStringInput | null,
  resolved?: ModelBooleanInput | null,
  issueTypes?: ModelIssueTypeEnumListInput | null,
  customIssueTypes?: ModelStringInput | null,
  assignees?: ModelStringInput | null,
  progress?: ModelFloatInput | null,
  dueDate?: ModelStringInput | null,
  and?: Array< ModelCommentFilterInput | null > | null,
  or?: Array< ModelCommentFilterInput | null > | null,
  not?: ModelCommentFilterInput | null,
};

export type ModelCommentConnection = {
  __typename: "ModelCommentConnection",
  items:  Array<Comment | null >,
  nextToken?: string | null,
};

export type ModelUserLinkFilterInput = {
  id?: ModelIDInput | null,
  dataUrl?: ModelStringInput | null,
  targetYaw?: ModelFloatInput | null,
  targetPitch?: ModelFloatInput | null,
  linkFrom?: ModelStringInput | null,
  linkTo?: ModelStringInput | null,
  rotation?: ModelIntInput | null,
  and?: Array< ModelUserLinkFilterInput | null > | null,
  or?: Array< ModelUserLinkFilterInput | null > | null,
  not?: ModelUserLinkFilterInput | null,
};

export type ModelUserLinkConnection = {
  __typename: "ModelUserLinkConnection",
  items:  Array<UserLink | null >,
  nextToken?: string | null,
};

export type ModelUserSceneNameFilterInput = {
  id?: ModelIDInput | null,
  dataUrl?: ModelStringInput | null,
  sceneId?: ModelStringInput | null,
  sceneName?: ModelStringInput | null,
  and?: Array< ModelUserSceneNameFilterInput | null > | null,
  or?: Array< ModelUserSceneNameFilterInput | null > | null,
  not?: ModelUserSceneNameFilterInput | null,
};

export type ModelUserSceneNameConnection = {
  __typename: "ModelUserSceneNameConnection",
  items:  Array<UserSceneName | null >,
  nextToken?: string | null,
};

export type ModelPlanLinksFilterInput = {
  id?: ModelIDInput | null,
  tourDataUrl?: ModelStringInput | null,
  and?: Array< ModelPlanLinksFilterInput | null > | null,
  or?: Array< ModelPlanLinksFilterInput | null > | null,
  not?: ModelPlanLinksFilterInput | null,
};

export type ModelPlanLinksConnection = {
  __typename: "ModelPlanLinksConnection",
  items:  Array<PlanLinks | null >,
  nextToken?: string | null,
};

export type ModelChatMessageFilterInput = {
  id?: ModelIDInput | null,
  username?: ModelStringInput | null,
  text?: ModelStringInput | null,
  project?: ModelStringInput | null,
  isAnswer?: ModelBooleanInput | null,
  createdAt?: ModelStringInput | null,
  and?: Array< ModelChatMessageFilterInput | null > | null,
  or?: Array< ModelChatMessageFilterInput | null > | null,
  not?: ModelChatMessageFilterInput | null,
};

export type ModelChatMessageConnection = {
  __typename: "ModelChatMessageConnection",
  items:  Array<ChatMessage | null >,
  nextToken?: string | null,
};

export type ModelStringKeyConditionInput = {
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelPlanInitialPointFilterInput = {
  id?: ModelIDInput | null,
  matched?: ModelBooleanInput | null,
  and?: Array< ModelPlanInitialPointFilterInput | null > | null,
  or?: Array< ModelPlanInitialPointFilterInput | null > | null,
  not?: ModelPlanInitialPointFilterInput | null,
};

export type ModelPlanInitialPointConnection = {
  __typename: "ModelPlanInitialPointConnection",
  items:  Array<PlanInitialPoint | null >,
  nextToken?: string | null,
};

export type ModelTourTokenFilterInput = {
  id?: ModelIDInput | null,
  token?: ModelStringInput | null,
  and?: Array< ModelTourTokenFilterInput | null > | null,
  or?: Array< ModelTourTokenFilterInput | null > | null,
  not?: ModelTourTokenFilterInput | null,
};

export type ModelTourTokenConnection = {
  __typename: "ModelTourTokenConnection",
  items:  Array<TourToken | null >,
  nextToken?: string | null,
};

export type NearestScene = {
  __typename: "NearestScene",
  sceneId: string,
  yaw?: number | null,
};

export type PlanAnchorsResponse = {
  __typename: "PlanAnchorsResponse",
  date: string,
  linkId: number,
};

export type CalculatePlanBimTransformationMutationVariables = {
  planUrl: string,
  registerByNewOnly: boolean,
};

export type CalculatePlanBimTransformationMutation = {
  calculatePlanBimTransformation?: string | null,
};

export type PublishPhotoLinkMutationVariables = {
  photoTourId: string,
};

export type PublishPhotoLinkMutation = {
  publishPhotoLink?: string | null,
};

export type PublishZoomableImageMutationVariables = {
  project: string,
  building: string,
  area: string,
  filePath: string,
  leftLocation: number,
  topLocation: number,
};

export type PublishZoomableImageMutation = {
  publishZoomableImage?: string | null,
};

export type PublishVideoOnPlanMutationVariables = {
  project: string,
  building: string,
  area: string,
  filePath: string,
  leftLocation: number,
  topLocation: number,
  isVideo?: boolean | null,
};

export type PublishVideoOnPlanMutation = {
  publishVideoOnPlan?: string | null,
};

export type UpdatePlanYawMutationVariables = {
  id: string,
  sceneId: string,
  planYaw: number,
};

export type UpdatePlanYawMutation = {
  updatePlanYaw?: string | null,
};

export type UpdatePlannedDateMutationVariables = {
  activity: string,
  project: string,
  building: string,
  floor: string,
  startDate: string,
  endDate?: string | null,
};

export type UpdatePlannedDateMutation = {
  updatePlannedDate?: string | null,
};

export type InviteUserMutationVariables = {
  from: string,
  email: string,
  projectId: string,
  projectName: string,
};

export type InviteUserMutation = {
  inviteUser?: string | null,
};

export type AskQuestionOnProjectMutationVariables = {
  username: string,
  project: string,
  prompt: string,
};

export type AskQuestionOnProjectMutation = {
  askQuestionOnProject?:  {
    __typename: "ProjectCopilotResponse",
    answer: string,
    imagesAnalysis?:  Array< {
      __typename: "ImagesAnalysisResponse",
      date?: string | null,
      imageKeys?:  {
        __typename: "ImagesIn360View",
        floor?: string | null,
        wall1?: string | null,
        wall2?: string | null,
        wall3?: string | null,
        wall4?: string | null,
        ceiling?: string | null,
      } | null,
      anchor?: string | null,
      top?: number | null,
      left?: number | null,
      matchingCriteria?: boolean | null,
      certainty?: number | null,
      explanation?: string | null,
    } | null > | null,
  } | null,
};

export type CreateProjectMutationVariables = {
  input: CreateProjectInput,
  condition?: ModelProjectConditionInput | null,
};

export type CreateProjectMutation = {
  createProject?:  {
    __typename: "Project",
    id: string,
    name: string,
    description?: string | null,
    buildings?:  Array< {
      __typename: "Building",
      name: string,
      floors?:  Array< {
        __typename: "Floor",
        name: string,
        areas?:  Array< {
          __typename: "Area",
          name: string,
          infos?:  Array< {
            __typename: "Info",
            date: string,
            plan: string,
            tour: string,
            sceneId?: number | null,
            scale?: number | null,
          } | null > | null,
          type?: AreaTypeEnum | null,
          hasMultiplePlans?: boolean | null,
        } | null > | null,
      } | null > | null,
    } | null > | null,
    imageURL: string,
    owner?: string | null,
    architect?: string | null,
    contractor?: string | null,
    projectManagement?: string | null,
    activeProject: boolean,
    defaultPlan?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateProjectMutationVariables = {
  input: UpdateProjectInput,
  condition?: ModelProjectConditionInput | null,
};

export type UpdateProjectMutation = {
  updateProject?:  {
    __typename: "Project",
    id: string,
    name: string,
    description?: string | null,
    buildings?:  Array< {
      __typename: "Building",
      name: string,
      floors?:  Array< {
        __typename: "Floor",
        name: string,
        areas?:  Array< {
          __typename: "Area",
          name: string,
          infos?:  Array< {
            __typename: "Info",
            date: string,
            plan: string,
            tour: string,
            sceneId?: number | null,
            scale?: number | null,
          } | null > | null,
          type?: AreaTypeEnum | null,
          hasMultiplePlans?: boolean | null,
        } | null > | null,
      } | null > | null,
    } | null > | null,
    imageURL: string,
    owner?: string | null,
    architect?: string | null,
    contractor?: string | null,
    projectManagement?: string | null,
    activeProject: boolean,
    defaultPlan?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteProjectMutationVariables = {
  input: DeleteProjectInput,
  condition?: ModelProjectConditionInput | null,
};

export type DeleteProjectMutation = {
  deleteProject?:  {
    __typename: "Project",
    id: string,
    name: string,
    description?: string | null,
    buildings?:  Array< {
      __typename: "Building",
      name: string,
      floors?:  Array< {
        __typename: "Floor",
        name: string,
        areas?:  Array< {
          __typename: "Area",
          name: string,
          infos?:  Array< {
            __typename: "Info",
            date: string,
            plan: string,
            tour: string,
            sceneId?: number | null,
            scale?: number | null,
          } | null > | null,
          type?: AreaTypeEnum | null,
          hasMultiplePlans?: boolean | null,
        } | null > | null,
      } | null > | null,
    } | null > | null,
    imageURL: string,
    owner?: string | null,
    architect?: string | null,
    contractor?: string | null,
    projectManagement?: string | null,
    activeProject: boolean,
    defaultPlan?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateActivityPlannedDatesMutationVariables = {
  input: CreateActivityPlannedDatesInput,
  condition?: ModelActivityPlannedDatesConditionInput | null,
};

export type CreateActivityPlannedDatesMutation = {
  createActivityPlannedDates?:  {
    __typename: "ActivityPlannedDates",
    id: string,
    projectId: string,
    startDates: string,
    endDates: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateActivityPlannedDatesMutationVariables = {
  input: UpdateActivityPlannedDatesInput,
  condition?: ModelActivityPlannedDatesConditionInput | null,
};

export type UpdateActivityPlannedDatesMutation = {
  updateActivityPlannedDates?:  {
    __typename: "ActivityPlannedDates",
    id: string,
    projectId: string,
    startDates: string,
    endDates: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteActivityPlannedDatesMutationVariables = {
  input: DeleteActivityPlannedDatesInput,
  condition?: ModelActivityPlannedDatesConditionInput | null,
};

export type DeleteActivityPlannedDatesMutation = {
  deleteActivityPlannedDates?:  {
    __typename: "ActivityPlannedDates",
    id: string,
    projectId: string,
    startDates: string,
    endDates: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateProgressDelayedActivitiesMutationVariables = {
  input: CreateProgressDelayedActivitiesInput,
  condition?: ModelProgressDelayedActivitiesConditionInput | null,
};

export type CreateProgressDelayedActivitiesMutation = {
  createProgressDelayedActivities?:  {
    __typename: "ProgressDelayedActivities",
    id: string,
    delayedActivities?:  Array< {
      __typename: "DelayedActivity",
      location: string,
      probability: number,
      reason?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateProgressDelayedActivitiesMutationVariables = {
  input: UpdateProgressDelayedActivitiesInput,
  condition?: ModelProgressDelayedActivitiesConditionInput | null,
};

export type UpdateProgressDelayedActivitiesMutation = {
  updateProgressDelayedActivities?:  {
    __typename: "ProgressDelayedActivities",
    id: string,
    delayedActivities?:  Array< {
      __typename: "DelayedActivity",
      location: string,
      probability: number,
      reason?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteProgressDelayedActivitiesMutationVariables = {
  input: DeleteProgressDelayedActivitiesInput,
  condition?: ModelProgressDelayedActivitiesConditionInput | null,
};

export type DeleteProgressDelayedActivitiesMutation = {
  deleteProgressDelayedActivities?:  {
    __typename: "ProgressDelayedActivities",
    id: string,
    delayedActivities?:  Array< {
      __typename: "DelayedActivity",
      location: string,
      probability: number,
      reason?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateProgressMutationVariables = {
  input: CreateProgressInput,
  condition?: ModelProgressConditionInput | null,
};

export type CreateProgressMutation = {
  createProgress?:  {
    __typename: "Progress",
    id: string,
    projectId: string,
    date: string,
    progressAreas?:  Array< {
      __typename: "ProgressArea",
      building: string,
      floor: string,
      anchor: string,
      weight?: number | null,
      label?: string | null,
      invisible?: boolean | null,
      activities?:  Array< {
        __typename: "Activity",
        activityName: string,
        status: ActivityStatus,
        previousStatus?: ActivityStatus | null,
        updater?: string | null,
        updateReason?: string | null,
        dateManuallyUpdated?: string | null,
      } | null > | null,
    } | null > | null,
    chunkId?: number | null,
    labels?: Array< string | null > | null,
    dod?: number | null,
    draft?: boolean | null,
    categories?:  Array< {
      __typename: "ProgressCategory",
      name: string,
      includes?:  Array< {
        __typename: "CategoryChildren",
        name: string,
        weight?: number | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateProgressMutationVariables = {
  input: UpdateProgressInput,
  condition?: ModelProgressConditionInput | null,
};

export type UpdateProgressMutation = {
  updateProgress?:  {
    __typename: "Progress",
    id: string,
    projectId: string,
    date: string,
    progressAreas?:  Array< {
      __typename: "ProgressArea",
      building: string,
      floor: string,
      anchor: string,
      weight?: number | null,
      label?: string | null,
      invisible?: boolean | null,
      activities?:  Array< {
        __typename: "Activity",
        activityName: string,
        status: ActivityStatus,
        previousStatus?: ActivityStatus | null,
        updater?: string | null,
        updateReason?: string | null,
        dateManuallyUpdated?: string | null,
      } | null > | null,
    } | null > | null,
    chunkId?: number | null,
    labels?: Array< string | null > | null,
    dod?: number | null,
    draft?: boolean | null,
    categories?:  Array< {
      __typename: "ProgressCategory",
      name: string,
      includes?:  Array< {
        __typename: "CategoryChildren",
        name: string,
        weight?: number | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteProgressMutationVariables = {
  input: DeleteProgressInput,
  condition?: ModelProgressConditionInput | null,
};

export type DeleteProgressMutation = {
  deleteProgress?:  {
    __typename: "Progress",
    id: string,
    projectId: string,
    date: string,
    progressAreas?:  Array< {
      __typename: "ProgressArea",
      building: string,
      floor: string,
      anchor: string,
      weight?: number | null,
      label?: string | null,
      invisible?: boolean | null,
      activities?:  Array< {
        __typename: "Activity",
        activityName: string,
        status: ActivityStatus,
        previousStatus?: ActivityStatus | null,
        updater?: string | null,
        updateReason?: string | null,
        dateManuallyUpdated?: string | null,
      } | null > | null,
    } | null > | null,
    chunkId?: number | null,
    labels?: Array< string | null > | null,
    dod?: number | null,
    draft?: boolean | null,
    categories?:  Array< {
      __typename: "ProgressCategory",
      name: string,
      includes?:  Array< {
        __typename: "CategoryChildren",
        name: string,
        weight?: number | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePlanLinksMutationVariables = {
  input: CreatePlanLinksInput,
  condition?: ModelPlanLinksConditionInput | null,
};

export type CreatePlanLinksMutation = {
  createPlanLinks?:  {
    __typename: "PlanLinks",
    id: string,
    tourDataUrl: string,
    planUrls?:  Array< {
      __typename: "PlanUrl",
      url: string,
      name: string,
      id: number,
    } | null > | null,
    linkLocations:  Array< {
      __typename: "LinkDetails",
      sceneId: string,
      sceneName?: string | null,
      planYaw?: number | null,
      leftLocation: number,
      topLocation: number,
      linkUrl: string,
      isPhotoLink?: boolean | null,
      linkItemType?: ItemTypeEnum | null,
    } | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePlanLinksMutationVariables = {
  input: UpdatePlanLinksInput,
  condition?: ModelPlanLinksConditionInput | null,
};

export type UpdatePlanLinksMutation = {
  updatePlanLinks?:  {
    __typename: "PlanLinks",
    id: string,
    tourDataUrl: string,
    planUrls?:  Array< {
      __typename: "PlanUrl",
      url: string,
      name: string,
      id: number,
    } | null > | null,
    linkLocations:  Array< {
      __typename: "LinkDetails",
      sceneId: string,
      sceneName?: string | null,
      planYaw?: number | null,
      leftLocation: number,
      topLocation: number,
      linkUrl: string,
      isPhotoLink?: boolean | null,
      linkItemType?: ItemTypeEnum | null,
    } | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePlanLinksMutationVariables = {
  input: DeletePlanLinksInput,
  condition?: ModelPlanLinksConditionInput | null,
};

export type DeletePlanLinksMutation = {
  deletePlanLinks?:  {
    __typename: "PlanLinks",
    id: string,
    tourDataUrl: string,
    planUrls?:  Array< {
      __typename: "PlanUrl",
      url: string,
      name: string,
      id: number,
    } | null > | null,
    linkLocations:  Array< {
      __typename: "LinkDetails",
      sceneId: string,
      sceneName?: string | null,
      planYaw?: number | null,
      leftLocation: number,
      topLocation: number,
      linkUrl: string,
      isPhotoLink?: boolean | null,
      linkItemType?: ItemTypeEnum | null,
    } | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserProfileMutationVariables = {
  input: CreateUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type CreateUserProfileMutation = {
  createUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    email: string,
    phoneNumber?: string | null,
    role?: string | null,
    unsubscribedToEmails?: boolean | null,
    isProgressAdmin?: boolean | null,
    progressEditor?: boolean | null,
    participatesInProjects?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserProfileMutationVariables = {
  input: UpdateUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type UpdateUserProfileMutation = {
  updateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    email: string,
    phoneNumber?: string | null,
    role?: string | null,
    unsubscribedToEmails?: boolean | null,
    isProgressAdmin?: boolean | null,
    progressEditor?: boolean | null,
    participatesInProjects?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserProfileMutationVariables = {
  input: DeleteUserProfileInput,
  condition?: ModelUserProfileConditionInput | null,
};

export type DeleteUserProfileMutation = {
  deleteUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    email: string,
    phoneNumber?: string | null,
    role?: string | null,
    unsubscribedToEmails?: boolean | null,
    isProgressAdmin?: boolean | null,
    progressEditor?: boolean | null,
    participatesInProjects?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePhotoTourPointsMutationVariables = {
  input: CreatePhotoTourPointsInput,
  condition?: ModelPhotoTourPointsConditionInput | null,
};

export type CreatePhotoTourPointsMutation = {
  createPhotoTourPoints?:  {
    __typename: "PhotoTourPoints",
    id: string,
    projectId: string,
    building: string,
    area: string,
    filesPath?: string | null,
    date?: string | null,
    username: string,
    registered?: boolean | null,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePhotoTourPointsMutationVariables = {
  input: UpdatePhotoTourPointsInput,
  condition?: ModelPhotoTourPointsConditionInput | null,
};

export type UpdatePhotoTourPointsMutation = {
  updatePhotoTourPoints?:  {
    __typename: "PhotoTourPoints",
    id: string,
    projectId: string,
    building: string,
    area: string,
    filesPath?: string | null,
    date?: string | null,
    username: string,
    registered?: boolean | null,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePhotoTourPointsMutationVariables = {
  input: DeletePhotoTourPointsInput,
  condition?: ModelPhotoTourPointsConditionInput | null,
};

export type DeletePhotoTourPointsMutation = {
  deletePhotoTourPoints?:  {
    __typename: "PhotoTourPoints",
    id: string,
    projectId: string,
    building: string,
    area: string,
    filesPath?: string | null,
    date?: string | null,
    username: string,
    registered?: boolean | null,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePlanAnchorsMutationVariables = {
  input: CreatePlanAnchorsInput,
  condition?: ModelPlanAnchorsConditionInput | null,
};

export type CreatePlanAnchorsMutation = {
  createPlanAnchors?:  {
    __typename: "PlanAnchors",
    id: string,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePlanAnchorsMutationVariables = {
  input: UpdatePlanAnchorsInput,
  condition?: ModelPlanAnchorsConditionInput | null,
};

export type UpdatePlanAnchorsMutation = {
  updatePlanAnchors?:  {
    __typename: "PlanAnchors",
    id: string,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePlanAnchorsMutationVariables = {
  input: DeletePlanAnchorsInput,
  condition?: ModelPlanAnchorsConditionInput | null,
};

export type DeletePlanAnchorsMutation = {
  deletePlanAnchors?:  {
    __typename: "PlanAnchors",
    id: string,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTourTokenMutationVariables = {
  input: CreateTourTokenInput,
  condition?: ModelTourTokenConditionInput | null,
};

export type CreateTourTokenMutation = {
  createTourToken?:  {
    __typename: "TourToken",
    id: string,
    token: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTourTokenMutationVariables = {
  input: UpdateTourTokenInput,
  condition?: ModelTourTokenConditionInput | null,
};

export type UpdateTourTokenMutation = {
  updateTourToken?:  {
    __typename: "TourToken",
    id: string,
    token: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTourTokenMutationVariables = {
  input: DeleteTourTokenInput,
  condition?: ModelTourTokenConditionInput | null,
};

export type DeleteTourTokenMutation = {
  deleteTourToken?:  {
    __typename: "TourToken",
    id: string,
    token: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateProjectInvitationMutationVariables = {
  input: CreateProjectInvitationInput,
  condition?: ModelProjectInvitationConditionInput | null,
};

export type CreateProjectInvitationMutation = {
  createProjectInvitation?:  {
    __typename: "ProjectInvitation",
    id: string,
    fromUserName: string,
    inviteAddress: string,
    token: string,
    projectId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateProjectInvitationMutationVariables = {
  input: UpdateProjectInvitationInput,
  condition?: ModelProjectInvitationConditionInput | null,
};

export type UpdateProjectInvitationMutation = {
  updateProjectInvitation?:  {
    __typename: "ProjectInvitation",
    id: string,
    fromUserName: string,
    inviteAddress: string,
    token: string,
    projectId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteProjectInvitationMutationVariables = {
  input: DeleteProjectInvitationInput,
  condition?: ModelProjectInvitationConditionInput | null,
};

export type DeleteProjectInvitationMutation = {
  deleteProjectInvitation?:  {
    __typename: "ProjectInvitation",
    id: string,
    fromUserName: string,
    inviteAddress: string,
    token: string,
    projectId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePlanBimMatchingMutationVariables = {
  input: CreatePlanBimMatchingInput,
  condition?: ModelPlanBimMatchingConditionInput | null,
};

export type CreatePlanBimMatchingMutation = {
  createPlanBimMatching?:  {
    __typename: "PlanBimMatching",
    id: string,
    planUrl: string,
    bimUrl: string,
    record:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    },
    viewport:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePlanBimMatchingMutationVariables = {
  input: UpdatePlanBimMatchingInput,
  condition?: ModelPlanBimMatchingConditionInput | null,
};

export type UpdatePlanBimMatchingMutation = {
  updatePlanBimMatching?:  {
    __typename: "PlanBimMatching",
    id: string,
    planUrl: string,
    bimUrl: string,
    record:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    },
    viewport:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePlanBimMatchingMutationVariables = {
  input: DeletePlanBimMatchingInput,
  condition?: ModelPlanBimMatchingConditionInput | null,
};

export type DeletePlanBimMatchingMutation = {
  deletePlanBimMatching?:  {
    __typename: "PlanBimMatching",
    id: string,
    planUrl: string,
    bimUrl: string,
    record:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    },
    viewport:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePlanBimTransformationMutationVariables = {
  input: CreatePlanBimTransformationInput,
  condition?: ModelPlanBimTransformationConditionInput | null,
};

export type CreatePlanBimTransformationMutation = {
  createPlanBimTransformation?:  {
    __typename: "PlanBimTransformation",
    id: string,
    bimUrl: string,
    transformationMatrix?: Array< Array< number | null > | null > | null,
    bimUp2CastoryUpRotationMatrix?: Array< Array< number | null > | null > | null,
    inverseMatchMatrix?: Array< Array< number | null > | null > | null,
    floorUpVec?: Array< number | null > | null,
    northVec?: Array< number | null > | null,
    eastVec?: Array< number | null > | null,
    viewport?:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    } | null,
    preventFirstPerson?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePlanBimTransformationMutationVariables = {
  input: UpdatePlanBimTransformationInput,
  condition?: ModelPlanBimTransformationConditionInput | null,
};

export type UpdatePlanBimTransformationMutation = {
  updatePlanBimTransformation?:  {
    __typename: "PlanBimTransformation",
    id: string,
    bimUrl: string,
    transformationMatrix?: Array< Array< number | null > | null > | null,
    bimUp2CastoryUpRotationMatrix?: Array< Array< number | null > | null > | null,
    inverseMatchMatrix?: Array< Array< number | null > | null > | null,
    floorUpVec?: Array< number | null > | null,
    northVec?: Array< number | null > | null,
    eastVec?: Array< number | null > | null,
    viewport?:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    } | null,
    preventFirstPerson?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePlanBimTransformationMutationVariables = {
  input: DeletePlanBimTransformationInput,
  condition?: ModelPlanBimTransformationConditionInput | null,
};

export type DeletePlanBimTransformationMutation = {
  deletePlanBimTransformation?:  {
    __typename: "PlanBimTransformation",
    id: string,
    bimUrl: string,
    transformationMatrix?: Array< Array< number | null > | null > | null,
    bimUp2CastoryUpRotationMatrix?: Array< Array< number | null > | null > | null,
    inverseMatchMatrix?: Array< Array< number | null > | null > | null,
    floorUpVec?: Array< number | null > | null,
    northVec?: Array< number | null > | null,
    eastVec?: Array< number | null > | null,
    viewport?:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    } | null,
    preventFirstPerson?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateCommentMutationVariables = {
  input: CreateCommentInput,
  condition?: ModelCommentConditionInput | null,
};

export type CreateCommentMutation = {
  createComment?:  {
    __typename: "Comment",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    title: string,
    role: string,
    mail: string,
    projectId?: string | null,
    description?: string | null,
    writtenBy?: string | null,
    replies?:  Array< {
      __typename: "CommentReply",
      reply: string,
      writtenBy?: string | null,
      date: string,
      role?: string | null,
      mail?: string | null,
      fileName?: string | null,
    } | null > | null,
    resolved?: boolean | null,
    record?:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null,
    issueTypes?: Array< IssueTypeEnum | null > | null,
    customIssueTypes?: Array< string | null > | null,
    assignees?: Array< string | null > | null,
    progress?: number | null,
    dueDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateCommentMutationVariables = {
  input: UpdateCommentInput,
  condition?: ModelCommentConditionInput | null,
};

export type UpdateCommentMutation = {
  updateComment?:  {
    __typename: "Comment",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    title: string,
    role: string,
    mail: string,
    projectId?: string | null,
    description?: string | null,
    writtenBy?: string | null,
    replies?:  Array< {
      __typename: "CommentReply",
      reply: string,
      writtenBy?: string | null,
      date: string,
      role?: string | null,
      mail?: string | null,
      fileName?: string | null,
    } | null > | null,
    resolved?: boolean | null,
    record?:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null,
    issueTypes?: Array< IssueTypeEnum | null > | null,
    customIssueTypes?: Array< string | null > | null,
    assignees?: Array< string | null > | null,
    progress?: number | null,
    dueDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteCommentMutationVariables = {
  input: DeleteCommentInput,
  condition?: ModelCommentConditionInput | null,
};

export type DeleteCommentMutation = {
  deleteComment?:  {
    __typename: "Comment",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    title: string,
    role: string,
    mail: string,
    projectId?: string | null,
    description?: string | null,
    writtenBy?: string | null,
    replies?:  Array< {
      __typename: "CommentReply",
      reply: string,
      writtenBy?: string | null,
      date: string,
      role?: string | null,
      mail?: string | null,
      fileName?: string | null,
    } | null > | null,
    resolved?: boolean | null,
    record?:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null,
    issueTypes?: Array< IssueTypeEnum | null > | null,
    customIssueTypes?: Array< string | null > | null,
    assignees?: Array< string | null > | null,
    progress?: number | null,
    dueDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserLinkMutationVariables = {
  input: CreateUserLinkInput,
  condition?: ModelUserLinkConditionInput | null,
};

export type CreateUserLinkMutation = {
  createUserLink?:  {
    __typename: "UserLink",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    targetYaw?: number | null,
    targetPitch?: number | null,
    linkFrom?: string | null,
    linkTo: string,
    rotation: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserLinkMutationVariables = {
  input: UpdateUserLinkInput,
  condition?: ModelUserLinkConditionInput | null,
};

export type UpdateUserLinkMutation = {
  updateUserLink?:  {
    __typename: "UserLink",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    targetYaw?: number | null,
    targetPitch?: number | null,
    linkFrom?: string | null,
    linkTo: string,
    rotation: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserLinkMutationVariables = {
  input: DeleteUserLinkInput,
  condition?: ModelUserLinkConditionInput | null,
};

export type DeleteUserLinkMutation = {
  deleteUserLink?:  {
    __typename: "UserLink",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    targetYaw?: number | null,
    targetPitch?: number | null,
    linkFrom?: string | null,
    linkTo: string,
    rotation: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserSceneNameMutationVariables = {
  input: CreateUserSceneNameInput,
  condition?: ModelUserSceneNameConditionInput | null,
};

export type CreateUserSceneNameMutation = {
  createUserSceneName?:  {
    __typename: "UserSceneName",
    id: string,
    dataUrl: string,
    sceneId: string,
    sceneName: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserSceneNameMutationVariables = {
  input: UpdateUserSceneNameInput,
  condition?: ModelUserSceneNameConditionInput | null,
};

export type UpdateUserSceneNameMutation = {
  updateUserSceneName?:  {
    __typename: "UserSceneName",
    id: string,
    dataUrl: string,
    sceneId: string,
    sceneName: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserSceneNameMutationVariables = {
  input: DeleteUserSceneNameInput,
  condition?: ModelUserSceneNameConditionInput | null,
};

export type DeleteUserSceneNameMutation = {
  deleteUserSceneName?:  {
    __typename: "UserSceneName",
    id: string,
    dataUrl: string,
    sceneId: string,
    sceneName: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateChatMessageMutationVariables = {
  input: CreateChatMessageInput,
  condition?: ModelChatMessageConditionInput | null,
};

export type CreateChatMessageMutation = {
  createChatMessage?:  {
    __typename: "ChatMessage",
    id: string,
    username: string,
    text: string,
    project: string,
    isAnswer?: boolean | null,
    analysis?:  Array< {
      __typename: "ImagesAnalysisResponse",
      date?: string | null,
      imageKeys?:  {
        __typename: "ImagesIn360View",
        floor?: string | null,
        wall1?: string | null,
        wall2?: string | null,
        wall3?: string | null,
        wall4?: string | null,
        ceiling?: string | null,
      } | null,
      anchor?: string | null,
      top?: number | null,
      left?: number | null,
      matchingCriteria?: boolean | null,
      certainty?: number | null,
      explanation?: string | null,
    } | null > | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type UpdateChatMessageMutationVariables = {
  input: UpdateChatMessageInput,
  condition?: ModelChatMessageConditionInput | null,
};

export type UpdateChatMessageMutation = {
  updateChatMessage?:  {
    __typename: "ChatMessage",
    id: string,
    username: string,
    text: string,
    project: string,
    isAnswer?: boolean | null,
    analysis?:  Array< {
      __typename: "ImagesAnalysisResponse",
      date?: string | null,
      imageKeys?:  {
        __typename: "ImagesIn360View",
        floor?: string | null,
        wall1?: string | null,
        wall2?: string | null,
        wall3?: string | null,
        wall4?: string | null,
        ceiling?: string | null,
      } | null,
      anchor?: string | null,
      top?: number | null,
      left?: number | null,
      matchingCriteria?: boolean | null,
      certainty?: number | null,
      explanation?: string | null,
    } | null > | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type DeleteChatMessageMutationVariables = {
  input: DeleteChatMessageInput,
  condition?: ModelChatMessageConditionInput | null,
};

export type DeleteChatMessageMutation = {
  deleteChatMessage?:  {
    __typename: "ChatMessage",
    id: string,
    username: string,
    text: string,
    project: string,
    isAnswer?: boolean | null,
    analysis?:  Array< {
      __typename: "ImagesAnalysisResponse",
      date?: string | null,
      imageKeys?:  {
        __typename: "ImagesIn360View",
        floor?: string | null,
        wall1?: string | null,
        wall2?: string | null,
        wall3?: string | null,
        wall4?: string | null,
        ceiling?: string | null,
      } | null,
      anchor?: string | null,
      top?: number | null,
      left?: number | null,
      matchingCriteria?: boolean | null,
      certainty?: number | null,
      explanation?: string | null,
    } | null > | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type CreatePlanInitialPointMutationVariables = {
  input: CreatePlanInitialPointInput,
  condition?: ModelPlanInitialPointConditionInput | null,
};

export type CreatePlanInitialPointMutation = {
  createPlanInitialPoint?:  {
    __typename: "PlanInitialPoint",
    id: string,
    matched: boolean,
    scanRecords?:  Array< {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePlanInitialPointMutationVariables = {
  input: UpdatePlanInitialPointInput,
  condition?: ModelPlanInitialPointConditionInput | null,
};

export type UpdatePlanInitialPointMutation = {
  updatePlanInitialPoint?:  {
    __typename: "PlanInitialPoint",
    id: string,
    matched: boolean,
    scanRecords?:  Array< {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePlanInitialPointMutationVariables = {
  input: DeletePlanInitialPointInput,
  condition?: ModelPlanInitialPointConditionInput | null,
};

export type DeletePlanInitialPointMutation = {
  deletePlanInitialPoint?:  {
    __typename: "PlanInitialPoint",
    id: string,
    matched: boolean,
    scanRecords?:  Array< {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type SendEmailMutationVariables = {
  to: Array< string | null >,
  text: string,
  link: string,
  subject: string,
  templateType: string,
};

export type SendEmailMutation = {
  sendEmail?: string | null,
};

export type SendExponetTaskMutationVariables = {
  taskId: string,
  project: string,
  send?: boolean | null,
  deleted?: boolean | null,
};

export type SendExponetTaskMutation = {
  sendExponetTask?: string | null,
};

export type SyncUserLinksMutationVariables = {
  linkId: string,
};

export type SyncUserLinksMutation = {
  syncUserLinks?: string | null,
};

export type SyncNonLocatedCommentMutationVariables = {
  id: string,
};

export type SyncNonLocatedCommentMutation = {
  syncNonLocatedComment?: string | null,
};

export type GetExtendedProfileQueryVariables = {
  username: string,
};

export type GetExtendedProfileQuery = {
  getExtendedProfile?:  {
    __typename: "ExtendedUserProfile",
    userProfile?:  {
      __typename: "UserProfile",
      id: string,
      username: string,
      email: string,
      phoneNumber?: string | null,
      role?: string | null,
      unsubscribedToEmails?: boolean | null,
      isProgressAdmin?: boolean | null,
      progressEditor?: boolean | null,
      participatesInProjects?: Array< string | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    projects?:  Array< {
      __typename: "Project",
      id: string,
      name: string,
      description?: string | null,
      buildings?:  Array< {
        __typename: "Building",
        name: string,
        floors?:  Array< {
          __typename: "Floor",
          name: string,
          areas?:  Array< {
            __typename: "Area",
            name: string,
            infos?:  Array< {
              __typename: "Info",
              date: string,
              plan: string,
              tour: string,
              sceneId?: number | null,
              scale?: number | null,
            } | null > | null,
            type?: AreaTypeEnum | null,
            hasMultiplePlans?: boolean | null,
          } | null > | null,
        } | null > | null,
      } | null > | null,
      imageURL: string,
      owner?: string | null,
      architect?: string | null,
      contractor?: string | null,
      projectManagement?: string | null,
      activeProject: boolean,
      defaultPlan?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
  } | null,
};

export type DataUsageQueryVariables = {
  project: string,
};

export type DataUsageQuery = {
  dataUsage?: string | null,
};

export type GetActivityProgressQueryVariables = {
  project: string,
  building: string,
  floor: string,
  activity: string,
  label?: string | null,
};

export type GetActivityProgressQuery = {
  getActivityProgress?:  Array< {
    __typename: "ProgressValue",
    date?: string | null,
    progress?: number | null,
  } | null > | null,
};

export type FetchActivityPlannedDatesQueryVariables = {
  activity: string,
  project: string,
  building?: string | null,
  floor?: string | null,
};

export type FetchActivityPlannedDatesQuery = {
  fetchActivityPlannedDates?:  {
    __typename: "ActivityPlannedDatesResponse",
    activity: string,
    plannedDates:  Array< {
      __typename: "PlannedDatesRecord",
      building: string,
      floor: string,
      startDate: string,
      endDate: string,
    } | null >,
  } | null,
};

export type GetProgressActivityNamesQueryVariables = {
  project: string,
};

export type GetProgressActivityNamesQuery = {
  getProgressActivityNames?: Array< string | null > | null,
};

export type GetProgressMsTasksQueryVariables = {
  project: string,
};

export type GetProgressMsTasksQuery = {
  getProgressMsTasks?:  {
    __typename: "MsProjectSnapshot",
    id: string,
    tasks?:  Array< {
      __typename: "TaskData",
      duration?: string | null,
      finish?: string | null,
      guid?: string | null,
      name?: string | null,
      predecessor?: string | null,
      start?: string | null,
      successor?: string | null,
      totalSlack?: string | null,
      wbs?: string | null,
    } | null > | null,
    projectId?: string | null,
    lastUpdated?: string | null,
  } | null,
};

export type ValidateFileInLocationQueryVariables = {
  fileName: string,
  bucketLocation: string,
};

export type ValidateFileInLocationQuery = {
  validateFileInLocation?: boolean | null,
};

export type GetActivityPlannedDatesQueryVariables = {
  id: string,
};

export type GetActivityPlannedDatesQuery = {
  getActivityPlannedDates?:  {
    __typename: "ActivityPlannedDates",
    id: string,
    projectId: string,
    startDates: string,
    endDates: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListActivityPlannedDatessQueryVariables = {
  filter?: ModelActivityPlannedDatesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListActivityPlannedDatessQuery = {
  listActivityPlannedDatess?:  {
    __typename: "ModelActivityPlannedDatesConnection",
    items:  Array< {
      __typename: "ActivityPlannedDates",
      id: string,
      projectId: string,
      startDates: string,
      endDates: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetProgressDelayedActivitiesQueryVariables = {
  id: string,
};

export type GetProgressDelayedActivitiesQuery = {
  getProgressDelayedActivities?:  {
    __typename: "ProgressDelayedActivities",
    id: string,
    delayedActivities?:  Array< {
      __typename: "DelayedActivity",
      location: string,
      probability: number,
      reason?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListProgressDelayedActivitiessQueryVariables = {
  filter?: ModelProgressDelayedActivitiesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProgressDelayedActivitiessQuery = {
  listProgressDelayedActivitiess?:  {
    __typename: "ModelProgressDelayedActivitiesConnection",
    items:  Array< {
      __typename: "ProgressDelayedActivities",
      id: string,
      delayedActivities?:  Array< {
        __typename: "DelayedActivity",
        location: string,
        probability: number,
        reason?: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetProgressQueryVariables = {
  id: string,
};

export type GetProgressQuery = {
  getProgress?:  {
    __typename: "Progress",
    id: string,
    projectId: string,
    date: string,
    progressAreas?:  Array< {
      __typename: "ProgressArea",
      building: string,
      floor: string,
      anchor: string,
      weight?: number | null,
      label?: string | null,
      invisible?: boolean | null,
      activities?:  Array< {
        __typename: "Activity",
        activityName: string,
        status: ActivityStatus,
        previousStatus?: ActivityStatus | null,
        updater?: string | null,
        updateReason?: string | null,
        dateManuallyUpdated?: string | null,
      } | null > | null,
    } | null > | null,
    chunkId?: number | null,
    labels?: Array< string | null > | null,
    dod?: number | null,
    draft?: boolean | null,
    categories?:  Array< {
      __typename: "ProgressCategory",
      name: string,
      includes?:  Array< {
        __typename: "CategoryChildren",
        name: string,
        weight?: number | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListProgresssQueryVariables = {
  filter?: ModelProgressFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProgresssQuery = {
  listProgresss?:  {
    __typename: "ModelProgressConnection",
    items:  Array< {
      __typename: "Progress",
      id: string,
      projectId: string,
      date: string,
      progressAreas?:  Array< {
        __typename: "ProgressArea",
        building: string,
        floor: string,
        anchor: string,
        weight?: number | null,
        label?: string | null,
        invisible?: boolean | null,
        activities?:  Array< {
          __typename: "Activity",
          activityName: string,
          status: ActivityStatus,
          previousStatus?: ActivityStatus | null,
          updater?: string | null,
          updateReason?: string | null,
          dateManuallyUpdated?: string | null,
        } | null > | null,
      } | null > | null,
      chunkId?: number | null,
      labels?: Array< string | null > | null,
      dod?: number | null,
      draft?: boolean | null,
      categories?:  Array< {
        __typename: "ProgressCategory",
        name: string,
        includes?:  Array< {
          __typename: "CategoryChildren",
          name: string,
          weight?: number | null,
        } | null > | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserProfileQueryVariables = {
  id: string,
};

export type GetUserProfileQuery = {
  getUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    email: string,
    phoneNumber?: string | null,
    role?: string | null,
    unsubscribedToEmails?: boolean | null,
    isProgressAdmin?: boolean | null,
    progressEditor?: boolean | null,
    participatesInProjects?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserProfilesQueryVariables = {
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserProfilesQuery = {
  listUserProfiles?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      id: string,
      username: string,
      email: string,
      phoneNumber?: string | null,
      role?: string | null,
      unsubscribedToEmails?: boolean | null,
      isProgressAdmin?: boolean | null,
      progressEditor?: boolean | null,
      participatesInProjects?: Array< string | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPhotoTourPointsQueryVariables = {
  id: string,
};

export type GetPhotoTourPointsQuery = {
  getPhotoTourPoints?:  {
    __typename: "PhotoTourPoints",
    id: string,
    projectId: string,
    building: string,
    area: string,
    filesPath?: string | null,
    date?: string | null,
    username: string,
    registered?: boolean | null,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPhotoTourPointssQueryVariables = {
  filter?: ModelPhotoTourPointsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPhotoTourPointssQuery = {
  listPhotoTourPointss?:  {
    __typename: "ModelPhotoTourPointsConnection",
    items:  Array< {
      __typename: "PhotoTourPoints",
      id: string,
      projectId: string,
      building: string,
      area: string,
      filesPath?: string | null,
      date?: string | null,
      username: string,
      registered?: boolean | null,
      photoRecords?:  Array< {
        __typename: "PhotoRecord",
        leftLocation: number,
        topLocation: number,
        fileName: string,
        needsManualRegistration?: boolean | null,
        label?: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPlanAnchorsQueryVariables = {
  id: string,
};

export type GetPlanAnchorsQuery = {
  getPlanAnchors?:  {
    __typename: "PlanAnchors",
    id: string,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPlanAnchorssQueryVariables = {
  filter?: ModelPlanAnchorsFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPlanAnchorssQuery = {
  listPlanAnchorss?:  {
    __typename: "ModelPlanAnchorsConnection",
    items:  Array< {
      __typename: "PlanAnchors",
      id: string,
      photoRecords?:  Array< {
        __typename: "PhotoRecord",
        leftLocation: number,
        topLocation: number,
        fileName: string,
        needsManualRegistration?: boolean | null,
        label?: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetProjectInvitationQueryVariables = {
  id: string,
};

export type GetProjectInvitationQuery = {
  getProjectInvitation?:  {
    __typename: "ProjectInvitation",
    id: string,
    fromUserName: string,
    inviteAddress: string,
    token: string,
    projectId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListProjectInvitationsQueryVariables = {
  filter?: ModelProjectInvitationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProjectInvitationsQuery = {
  listProjectInvitations?:  {
    __typename: "ModelProjectInvitationConnection",
    items:  Array< {
      __typename: "ProjectInvitation",
      id: string,
      fromUserName: string,
      inviteAddress: string,
      token: string,
      projectId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPlanBimMatchingQueryVariables = {
  id: string,
};

export type GetPlanBimMatchingQuery = {
  getPlanBimMatching?:  {
    __typename: "PlanBimMatching",
    id: string,
    planUrl: string,
    bimUrl: string,
    record:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    },
    viewport:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPlanBimMatchingsQueryVariables = {
  filter?: ModelPlanBimMatchingFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPlanBimMatchingsQuery = {
  listPlanBimMatchings?:  {
    __typename: "ModelPlanBimMatchingConnection",
    items:  Array< {
      __typename: "PlanBimMatching",
      id: string,
      planUrl: string,
      bimUrl: string,
      record:  {
        __typename: "ScanRecord",
        recordDate: string,
        building: string,
        floor: string,
        planUrl: string,
        leftLocation: number,
        topLocation: number,
        username: string,
      },
      viewport:  {
        __typename: "BimViewport",
        name: string,
        eye: Array< number | null >,
        target: Array< number | null >,
        up: Array< number | null >,
        worldUpVector: Array< number | null >,
        pivotPoint: Array< number | null >,
        distanceToOrbit: number,
        aspectRatio: number,
        projection: string,
        isOrthographic: boolean,
        fieldOfView: number,
      },
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPlanBimTransformationQueryVariables = {
  id: string,
};

export type GetPlanBimTransformationQuery = {
  getPlanBimTransformation?:  {
    __typename: "PlanBimTransformation",
    id: string,
    bimUrl: string,
    transformationMatrix?: Array< Array< number | null > | null > | null,
    bimUp2CastoryUpRotationMatrix?: Array< Array< number | null > | null > | null,
    inverseMatchMatrix?: Array< Array< number | null > | null > | null,
    floorUpVec?: Array< number | null > | null,
    northVec?: Array< number | null > | null,
    eastVec?: Array< number | null > | null,
    viewport?:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    } | null,
    preventFirstPerson?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPlanBimTransformationsQueryVariables = {
  filter?: ModelPlanBimTransformationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPlanBimTransformationsQuery = {
  listPlanBimTransformations?:  {
    __typename: "ModelPlanBimTransformationConnection",
    items:  Array< {
      __typename: "PlanBimTransformation",
      id: string,
      bimUrl: string,
      transformationMatrix?: Array< Array< number | null > | null > | null,
      bimUp2CastoryUpRotationMatrix?: Array< Array< number | null > | null > | null,
      inverseMatchMatrix?: Array< Array< number | null > | null > | null,
      floorUpVec?: Array< number | null > | null,
      northVec?: Array< number | null > | null,
      eastVec?: Array< number | null > | null,
      viewport?:  {
        __typename: "BimViewport",
        name: string,
        eye: Array< number | null >,
        target: Array< number | null >,
        up: Array< number | null >,
        worldUpVector: Array< number | null >,
        pivotPoint: Array< number | null >,
        distanceToOrbit: number,
        aspectRatio: number,
        projection: string,
        isOrthographic: boolean,
        fieldOfView: number,
      } | null,
      preventFirstPerson?: boolean | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PlannedDatesByProjectIdQueryVariables = {
  projectId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelActivityPlannedDatesFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PlannedDatesByProjectIdQuery = {
  plannedDatesByProjectId?:  {
    __typename: "ModelActivityPlannedDatesConnection",
    items:  Array< {
      __typename: "ActivityPlannedDates",
      id: string,
      projectId: string,
      startDates: string,
      endDates: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ProgressByProjectIdQueryVariables = {
  projectId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelProgressFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ProgressByProjectIdQuery = {
  progressByProjectId?:  {
    __typename: "ModelProgressConnection",
    items:  Array< {
      __typename: "Progress",
      id: string,
      projectId: string,
      date: string,
      progressAreas?:  Array< {
        __typename: "ProgressArea",
        building: string,
        floor: string,
        anchor: string,
        weight?: number | null,
        label?: string | null,
        invisible?: boolean | null,
        activities?:  Array< {
          __typename: "Activity",
          activityName: string,
          status: ActivityStatus,
          previousStatus?: ActivityStatus | null,
          updater?: string | null,
          updateReason?: string | null,
          dateManuallyUpdated?: string | null,
        } | null > | null,
      } | null > | null,
      chunkId?: number | null,
      labels?: Array< string | null > | null,
      dod?: number | null,
      draft?: boolean | null,
      categories?:  Array< {
        __typename: "ProgressCategory",
        name: string,
        includes?:  Array< {
          __typename: "CategoryChildren",
          name: string,
          weight?: number | null,
        } | null > | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserProfileByNameQueryVariables = {
  username?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserProfileFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserProfileByNameQuery = {
  userProfileByName?:  {
    __typename: "ModelUserProfileConnection",
    items:  Array< {
      __typename: "UserProfile",
      id: string,
      username: string,
      email: string,
      phoneNumber?: string | null,
      role?: string | null,
      unsubscribedToEmails?: boolean | null,
      isProgressAdmin?: boolean | null,
      progressEditor?: boolean | null,
      participatesInProjects?: Array< string | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ProjectInvitationByTokenQueryVariables = {
  token?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelProjectInvitationFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ProjectInvitationByTokenQuery = {
  projectInvitationByToken?:  {
    __typename: "ModelProjectInvitationConnection",
    items:  Array< {
      __typename: "ProjectInvitation",
      id: string,
      fromUserName: string,
      inviteAddress: string,
      token: string,
      projectId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type PlanBimMatchingByPlanUrlQueryVariables = {
  planUrl?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelPlanBimMatchingFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type PlanBimMatchingByPlanUrlQuery = {
  planBimMatchingByPlanUrl?:  {
    __typename: "ModelPlanBimMatchingConnection",
    items:  Array< {
      __typename: "PlanBimMatching",
      id: string,
      planUrl: string,
      bimUrl: string,
      record:  {
        __typename: "ScanRecord",
        recordDate: string,
        building: string,
        floor: string,
        planUrl: string,
        leftLocation: number,
        topLocation: number,
        username: string,
      },
      viewport:  {
        __typename: "BimViewport",
        name: string,
        eye: Array< number | null >,
        target: Array< number | null >,
        up: Array< number | null >,
        worldUpVector: Array< number | null >,
        pivotPoint: Array< number | null >,
        distanceToOrbit: number,
        aspectRatio: number,
        projection: string,
        isOrthographic: boolean,
        fieldOfView: number,
      },
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetProjectQueryVariables = {
  id: string,
};

export type GetProjectQuery = {
  getProject?:  {
    __typename: "Project",
    id: string,
    name: string,
    description?: string | null,
    buildings?:  Array< {
      __typename: "Building",
      name: string,
      floors?:  Array< {
        __typename: "Floor",
        name: string,
        areas?:  Array< {
          __typename: "Area",
          name: string,
          infos?:  Array< {
            __typename: "Info",
            date: string,
            plan: string,
            tour: string,
            sceneId?: number | null,
            scale?: number | null,
          } | null > | null,
          type?: AreaTypeEnum | null,
          hasMultiplePlans?: boolean | null,
        } | null > | null,
      } | null > | null,
    } | null > | null,
    imageURL: string,
    owner?: string | null,
    architect?: string | null,
    contractor?: string | null,
    projectManagement?: string | null,
    activeProject: boolean,
    defaultPlan?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListProjectsQueryVariables = {
  filter?: ModelProjectFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProjectsQuery = {
  listProjects?:  {
    __typename: "ModelProjectConnection",
    items:  Array< {
      __typename: "Project",
      id: string,
      name: string,
      description?: string | null,
      buildings?:  Array< {
        __typename: "Building",
        name: string,
        floors?:  Array< {
          __typename: "Floor",
          name: string,
          areas?:  Array< {
            __typename: "Area",
            name: string,
            infos?:  Array< {
              __typename: "Info",
              date: string,
              plan: string,
              tour: string,
              sceneId?: number | null,
              scale?: number | null,
            } | null > | null,
            type?: AreaTypeEnum | null,
            hasMultiplePlans?: boolean | null,
          } | null > | null,
        } | null > | null,
      } | null > | null,
      imageURL: string,
      owner?: string | null,
      architect?: string | null,
      contractor?: string | null,
      projectManagement?: string | null,
      activeProject: boolean,
      defaultPlan?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetCommentQueryVariables = {
  id: string,
};

export type GetCommentQuery = {
  getComment?:  {
    __typename: "Comment",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    title: string,
    role: string,
    mail: string,
    projectId?: string | null,
    description?: string | null,
    writtenBy?: string | null,
    replies?:  Array< {
      __typename: "CommentReply",
      reply: string,
      writtenBy?: string | null,
      date: string,
      role?: string | null,
      mail?: string | null,
      fileName?: string | null,
    } | null > | null,
    resolved?: boolean | null,
    record?:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null,
    issueTypes?: Array< IssueTypeEnum | null > | null,
    customIssueTypes?: Array< string | null > | null,
    assignees?: Array< string | null > | null,
    progress?: number | null,
    dueDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListCommentsQueryVariables = {
  filter?: ModelCommentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCommentsQuery = {
  listComments?:  {
    __typename: "ModelCommentConnection",
    items:  Array< {
      __typename: "Comment",
      id: string,
      dataUrl: string,
      scene:  {
        __typename: "Scene",
        sceneId?: string | null,
        yaw?: number | null,
        pitch?: number | null,
        fov?: number | null,
      },
      title: string,
      role: string,
      mail: string,
      projectId?: string | null,
      description?: string | null,
      writtenBy?: string | null,
      replies?:  Array< {
        __typename: "CommentReply",
        reply: string,
        writtenBy?: string | null,
        date: string,
        role?: string | null,
        mail?: string | null,
        fileName?: string | null,
      } | null > | null,
      resolved?: boolean | null,
      record?:  {
        __typename: "ScanRecord",
        recordDate: string,
        building: string,
        floor: string,
        planUrl: string,
        leftLocation: number,
        topLocation: number,
        username: string,
      } | null,
      issueTypes?: Array< IssueTypeEnum | null > | null,
      customIssueTypes?: Array< string | null > | null,
      assignees?: Array< string | null > | null,
      progress?: number | null,
      dueDate?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CommentsByDataUrlQueryVariables = {
  dataUrl?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCommentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type CommentsByDataUrlQuery = {
  commentsByDataUrl?:  {
    __typename: "ModelCommentConnection",
    items:  Array< {
      __typename: "Comment",
      id: string,
      dataUrl: string,
      scene:  {
        __typename: "Scene",
        sceneId?: string | null,
        yaw?: number | null,
        pitch?: number | null,
        fov?: number | null,
      },
      title: string,
      role: string,
      mail: string,
      projectId?: string | null,
      description?: string | null,
      writtenBy?: string | null,
      replies?:  Array< {
        __typename: "CommentReply",
        reply: string,
        writtenBy?: string | null,
        date: string,
        role?: string | null,
        mail?: string | null,
        fileName?: string | null,
      } | null > | null,
      resolved?: boolean | null,
      record?:  {
        __typename: "ScanRecord",
        recordDate: string,
        building: string,
        floor: string,
        planUrl: string,
        leftLocation: number,
        topLocation: number,
        username: string,
      } | null,
      issueTypes?: Array< IssueTypeEnum | null > | null,
      customIssueTypes?: Array< string | null > | null,
      assignees?: Array< string | null > | null,
      progress?: number | null,
      dueDate?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type CommentsByProjectIdQueryVariables = {
  projectId?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelCommentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type CommentsByProjectIdQuery = {
  commentsByProjectId?:  {
    __typename: "ModelCommentConnection",
    items:  Array< {
      __typename: "Comment",
      id: string,
      dataUrl: string,
      scene:  {
        __typename: "Scene",
        sceneId?: string | null,
        yaw?: number | null,
        pitch?: number | null,
        fov?: number | null,
      },
      title: string,
      role: string,
      mail: string,
      projectId?: string | null,
      description?: string | null,
      writtenBy?: string | null,
      replies?:  Array< {
        __typename: "CommentReply",
        reply: string,
        writtenBy?: string | null,
        date: string,
        role?: string | null,
        mail?: string | null,
        fileName?: string | null,
      } | null > | null,
      resolved?: boolean | null,
      record?:  {
        __typename: "ScanRecord",
        recordDate: string,
        building: string,
        floor: string,
        planUrl: string,
        leftLocation: number,
        topLocation: number,
        username: string,
      } | null,
      issueTypes?: Array< IssueTypeEnum | null > | null,
      customIssueTypes?: Array< string | null > | null,
      assignees?: Array< string | null > | null,
      progress?: number | null,
      dueDate?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserLinkQueryVariables = {
  id: string,
};

export type GetUserLinkQuery = {
  getUserLink?:  {
    __typename: "UserLink",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    targetYaw?: number | null,
    targetPitch?: number | null,
    linkFrom?: string | null,
    linkTo: string,
    rotation: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserLinksQueryVariables = {
  filter?: ModelUserLinkFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserLinksQuery = {
  listUserLinks?:  {
    __typename: "ModelUserLinkConnection",
    items:  Array< {
      __typename: "UserLink",
      id: string,
      dataUrl: string,
      scene:  {
        __typename: "Scene",
        sceneId?: string | null,
        yaw?: number | null,
        pitch?: number | null,
        fov?: number | null,
      },
      targetYaw?: number | null,
      targetPitch?: number | null,
      linkFrom?: string | null,
      linkTo: string,
      rotation: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserLinksByDataUrlQueryVariables = {
  dataUrl?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserLinkFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserLinksByDataUrlQuery = {
  userLinksByDataUrl?:  {
    __typename: "ModelUserLinkConnection",
    items:  Array< {
      __typename: "UserLink",
      id: string,
      dataUrl: string,
      scene:  {
        __typename: "Scene",
        sceneId?: string | null,
        yaw?: number | null,
        pitch?: number | null,
        fov?: number | null,
      },
      targetYaw?: number | null,
      targetPitch?: number | null,
      linkFrom?: string | null,
      linkTo: string,
      rotation: number,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetUserSceneNameQueryVariables = {
  id: string,
};

export type GetUserSceneNameQuery = {
  getUserSceneName?:  {
    __typename: "UserSceneName",
    id: string,
    dataUrl: string,
    sceneId: string,
    sceneName: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUserSceneNamesQueryVariables = {
  filter?: ModelUserSceneNameFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUserSceneNamesQuery = {
  listUserSceneNames?:  {
    __typename: "ModelUserSceneNameConnection",
    items:  Array< {
      __typename: "UserSceneName",
      id: string,
      dataUrl: string,
      sceneId: string,
      sceneName: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type UserScenesByDataUrlQueryVariables = {
  dataUrl?: string | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelUserSceneNameFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type UserScenesByDataUrlQuery = {
  userScenesByDataUrl?:  {
    __typename: "ModelUserSceneNameConnection",
    items:  Array< {
      __typename: "UserSceneName",
      id: string,
      dataUrl: string,
      sceneId: string,
      sceneName: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPlanLinksQueryVariables = {
  id: string,
};

export type GetPlanLinksQuery = {
  getPlanLinks?:  {
    __typename: "PlanLinks",
    id: string,
    tourDataUrl: string,
    planUrls?:  Array< {
      __typename: "PlanUrl",
      url: string,
      name: string,
      id: number,
    } | null > | null,
    linkLocations:  Array< {
      __typename: "LinkDetails",
      sceneId: string,
      sceneName?: string | null,
      planYaw?: number | null,
      leftLocation: number,
      topLocation: number,
      linkUrl: string,
      isPhotoLink?: boolean | null,
      linkItemType?: ItemTypeEnum | null,
    } | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPlanLinkssQueryVariables = {
  filter?: ModelPlanLinksFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPlanLinkssQuery = {
  listPlanLinkss?:  {
    __typename: "ModelPlanLinksConnection",
    items:  Array< {
      __typename: "PlanLinks",
      id: string,
      tourDataUrl: string,
      planUrls?:  Array< {
        __typename: "PlanUrl",
        url: string,
        name: string,
        id: number,
      } | null > | null,
      linkLocations:  Array< {
        __typename: "LinkDetails",
        sceneId: string,
        sceneName?: string | null,
        planYaw?: number | null,
        leftLocation: number,
        topLocation: number,
        linkUrl: string,
        isPhotoLink?: boolean | null,
        linkItemType?: ItemTypeEnum | null,
      } | null >,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetChatMessageQueryVariables = {
  id: string,
};

export type GetChatMessageQuery = {
  getChatMessage?:  {
    __typename: "ChatMessage",
    id: string,
    username: string,
    text: string,
    project: string,
    isAnswer?: boolean | null,
    analysis?:  Array< {
      __typename: "ImagesAnalysisResponse",
      date?: string | null,
      imageKeys?:  {
        __typename: "ImagesIn360View",
        floor?: string | null,
        wall1?: string | null,
        wall2?: string | null,
        wall3?: string | null,
        wall4?: string | null,
        ceiling?: string | null,
      } | null,
      anchor?: string | null,
      top?: number | null,
      left?: number | null,
      matchingCriteria?: boolean | null,
      certainty?: number | null,
      explanation?: string | null,
    } | null > | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type ListChatMessagesQueryVariables = {
  filter?: ModelChatMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListChatMessagesQuery = {
  listChatMessages?:  {
    __typename: "ModelChatMessageConnection",
    items:  Array< {
      __typename: "ChatMessage",
      id: string,
      username: string,
      text: string,
      project: string,
      isAnswer?: boolean | null,
      analysis?:  Array< {
        __typename: "ImagesAnalysisResponse",
        date?: string | null,
        imageKeys?:  {
          __typename: "ImagesIn360View",
          floor?: string | null,
          wall1?: string | null,
          wall2?: string | null,
          wall3?: string | null,
          wall4?: string | null,
          ceiling?: string | null,
        } | null,
        anchor?: string | null,
        top?: number | null,
        left?: number | null,
        matchingCriteria?: boolean | null,
        certainty?: number | null,
        explanation?: string | null,
      } | null > | null,
      createdAt?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type ChatMessagesByUsernameQueryVariables = {
  username?: string | null,
  createdAt?: ModelStringKeyConditionInput | null,
  sortDirection?: ModelSortDirection | null,
  filter?: ModelChatMessageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ChatMessagesByUsernameQuery = {
  chatMessagesByUsername?:  {
    __typename: "ModelChatMessageConnection",
    items:  Array< {
      __typename: "ChatMessage",
      id: string,
      username: string,
      text: string,
      project: string,
      isAnswer?: boolean | null,
      analysis?:  Array< {
        __typename: "ImagesAnalysisResponse",
        date?: string | null,
        imageKeys?:  {
          __typename: "ImagesIn360View",
          floor?: string | null,
          wall1?: string | null,
          wall2?: string | null,
          wall3?: string | null,
          wall4?: string | null,
          ceiling?: string | null,
        } | null,
        anchor?: string | null,
        top?: number | null,
        left?: number | null,
        matchingCriteria?: boolean | null,
        certainty?: number | null,
        explanation?: string | null,
      } | null > | null,
      createdAt?: string | null,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPlanInitialPointQueryVariables = {
  id: string,
};

export type GetPlanInitialPointQuery = {
  getPlanInitialPoint?:  {
    __typename: "PlanInitialPoint",
    id: string,
    matched: boolean,
    scanRecords?:  Array< {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPlanInitialPointsQueryVariables = {
  filter?: ModelPlanInitialPointFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPlanInitialPointsQuery = {
  listPlanInitialPoints?:  {
    __typename: "ModelPlanInitialPointConnection",
    items:  Array< {
      __typename: "PlanInitialPoint",
      id: string,
      matched: boolean,
      scanRecords?:  Array< {
        __typename: "ScanRecord",
        recordDate: string,
        building: string,
        floor: string,
        planUrl: string,
        leftLocation: number,
        topLocation: number,
        username: string,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTourTokenQueryVariables = {
  id: string,
};

export type GetTourTokenQuery = {
  getTourToken?:  {
    __typename: "TourToken",
    id: string,
    token: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTourTokensQueryVariables = {
  filter?: ModelTourTokenFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTourTokensQuery = {
  listTourTokens?:  {
    __typename: "ModelTourTokenConnection",
    items:  Array< {
      __typename: "TourToken",
      id: string,
      token: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type FetchPlanLinksQueryVariables = {
  planUrl?: string | null,
  date?: string | null,
  planId?: number | null,
};

export type FetchPlanLinksQuery = {
  fetchPlanLinks?:  {
    __typename: "PlanLinks",
    id: string,
    tourDataUrl: string,
    planUrls?:  Array< {
      __typename: "PlanUrl",
      url: string,
      name: string,
      id: number,
    } | null > | null,
    linkLocations:  Array< {
      __typename: "LinkDetails",
      sceneId: string,
      sceneName?: string | null,
      planYaw?: number | null,
      leftLocation: number,
      topLocation: number,
      linkUrl: string,
      isPhotoLink?: boolean | null,
      linkItemType?: ItemTypeEnum | null,
    } | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type NearestSceneQueryVariables = {
  originalTourPlanLinksId?: string | null,
  originalSceneId?: string | null,
  otherTourPlanLinksId?: string | null,
  originalYaw?: number | null,
};

export type NearestSceneQuery = {
  nearestScene?:  {
    __typename: "NearestScene",
    sceneId: string,
    yaw?: number | null,
  } | null,
};

export type PlanLinkByAnchorQueryVariables = {
  planUrl?: string | null,
  anchorId?: number | null,
  maxDate?: string | null,
};

export type PlanLinkByAnchorQuery = {
  planLinkByAnchor?:  {
    __typename: "PlanAnchorsResponse",
    date: string,
    linkId: number,
  } | null,
};

export type LastPlanTourQueryVariables = {
  project: string,
  building: string,
  area: string,
  type: string,
};

export type LastPlanTourQuery = {
  lastPlanTour?:  {
    __typename: "Info",
    date: string,
    plan: string,
    tour: string,
    sceneId?: number | null,
    scale?: number | null,
  } | null,
};

export type OnChatMessageByUsernameSubscriptionVariables = {
  username: string,
};

export type OnChatMessageByUsernameSubscription = {
  onChatMessageByUsername?:  {
    __typename: "ChatMessage",
    id: string,
    username: string,
    text: string,
    project: string,
    isAnswer?: boolean | null,
    analysis?:  Array< {
      __typename: "ImagesAnalysisResponse",
      date?: string | null,
      imageKeys?:  {
        __typename: "ImagesIn360View",
        floor?: string | null,
        wall1?: string | null,
        wall2?: string | null,
        wall3?: string | null,
        wall4?: string | null,
        ceiling?: string | null,
      } | null,
      anchor?: string | null,
      top?: number | null,
      left?: number | null,
      matchingCriteria?: boolean | null,
      certainty?: number | null,
      explanation?: string | null,
    } | null > | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreateActivityPlannedDatesSubscription = {
  onCreateActivityPlannedDates?:  {
    __typename: "ActivityPlannedDates",
    id: string,
    projectId: string,
    startDates: string,
    endDates: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateActivityPlannedDatesSubscription = {
  onUpdateActivityPlannedDates?:  {
    __typename: "ActivityPlannedDates",
    id: string,
    projectId: string,
    startDates: string,
    endDates: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteActivityPlannedDatesSubscription = {
  onDeleteActivityPlannedDates?:  {
    __typename: "ActivityPlannedDates",
    id: string,
    projectId: string,
    startDates: string,
    endDates: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateProgressDelayedActivitiesSubscription = {
  onCreateProgressDelayedActivities?:  {
    __typename: "ProgressDelayedActivities",
    id: string,
    delayedActivities?:  Array< {
      __typename: "DelayedActivity",
      location: string,
      probability: number,
      reason?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateProgressDelayedActivitiesSubscription = {
  onUpdateProgressDelayedActivities?:  {
    __typename: "ProgressDelayedActivities",
    id: string,
    delayedActivities?:  Array< {
      __typename: "DelayedActivity",
      location: string,
      probability: number,
      reason?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteProgressDelayedActivitiesSubscription = {
  onDeleteProgressDelayedActivities?:  {
    __typename: "ProgressDelayedActivities",
    id: string,
    delayedActivities?:  Array< {
      __typename: "DelayedActivity",
      location: string,
      probability: number,
      reason?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateProgressSubscription = {
  onCreateProgress?:  {
    __typename: "Progress",
    id: string,
    projectId: string,
    date: string,
    progressAreas?:  Array< {
      __typename: "ProgressArea",
      building: string,
      floor: string,
      anchor: string,
      weight?: number | null,
      label?: string | null,
      invisible?: boolean | null,
      activities?:  Array< {
        __typename: "Activity",
        activityName: string,
        status: ActivityStatus,
        previousStatus?: ActivityStatus | null,
        updater?: string | null,
        updateReason?: string | null,
        dateManuallyUpdated?: string | null,
      } | null > | null,
    } | null > | null,
    chunkId?: number | null,
    labels?: Array< string | null > | null,
    dod?: number | null,
    draft?: boolean | null,
    categories?:  Array< {
      __typename: "ProgressCategory",
      name: string,
      includes?:  Array< {
        __typename: "CategoryChildren",
        name: string,
        weight?: number | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateProgressSubscription = {
  onUpdateProgress?:  {
    __typename: "Progress",
    id: string,
    projectId: string,
    date: string,
    progressAreas?:  Array< {
      __typename: "ProgressArea",
      building: string,
      floor: string,
      anchor: string,
      weight?: number | null,
      label?: string | null,
      invisible?: boolean | null,
      activities?:  Array< {
        __typename: "Activity",
        activityName: string,
        status: ActivityStatus,
        previousStatus?: ActivityStatus | null,
        updater?: string | null,
        updateReason?: string | null,
        dateManuallyUpdated?: string | null,
      } | null > | null,
    } | null > | null,
    chunkId?: number | null,
    labels?: Array< string | null > | null,
    dod?: number | null,
    draft?: boolean | null,
    categories?:  Array< {
      __typename: "ProgressCategory",
      name: string,
      includes?:  Array< {
        __typename: "CategoryChildren",
        name: string,
        weight?: number | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteProgressSubscription = {
  onDeleteProgress?:  {
    __typename: "Progress",
    id: string,
    projectId: string,
    date: string,
    progressAreas?:  Array< {
      __typename: "ProgressArea",
      building: string,
      floor: string,
      anchor: string,
      weight?: number | null,
      label?: string | null,
      invisible?: boolean | null,
      activities?:  Array< {
        __typename: "Activity",
        activityName: string,
        status: ActivityStatus,
        previousStatus?: ActivityStatus | null,
        updater?: string | null,
        updateReason?: string | null,
        dateManuallyUpdated?: string | null,
      } | null > | null,
    } | null > | null,
    chunkId?: number | null,
    labels?: Array< string | null > | null,
    dod?: number | null,
    draft?: boolean | null,
    categories?:  Array< {
      __typename: "ProgressCategory",
      name: string,
      includes?:  Array< {
        __typename: "CategoryChildren",
        name: string,
        weight?: number | null,
      } | null > | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserProfileSubscription = {
  onCreateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    email: string,
    phoneNumber?: string | null,
    role?: string | null,
    unsubscribedToEmails?: boolean | null,
    isProgressAdmin?: boolean | null,
    progressEditor?: boolean | null,
    participatesInProjects?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserProfileSubscription = {
  onUpdateUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    email: string,
    phoneNumber?: string | null,
    role?: string | null,
    unsubscribedToEmails?: boolean | null,
    isProgressAdmin?: boolean | null,
    progressEditor?: boolean | null,
    participatesInProjects?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserProfileSubscription = {
  onDeleteUserProfile?:  {
    __typename: "UserProfile",
    id: string,
    username: string,
    email: string,
    phoneNumber?: string | null,
    role?: string | null,
    unsubscribedToEmails?: boolean | null,
    isProgressAdmin?: boolean | null,
    progressEditor?: boolean | null,
    participatesInProjects?: Array< string | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePhotoTourPointsSubscription = {
  onCreatePhotoTourPoints?:  {
    __typename: "PhotoTourPoints",
    id: string,
    projectId: string,
    building: string,
    area: string,
    filesPath?: string | null,
    date?: string | null,
    username: string,
    registered?: boolean | null,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePhotoTourPointsSubscription = {
  onUpdatePhotoTourPoints?:  {
    __typename: "PhotoTourPoints",
    id: string,
    projectId: string,
    building: string,
    area: string,
    filesPath?: string | null,
    date?: string | null,
    username: string,
    registered?: boolean | null,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePhotoTourPointsSubscription = {
  onDeletePhotoTourPoints?:  {
    __typename: "PhotoTourPoints",
    id: string,
    projectId: string,
    building: string,
    area: string,
    filesPath?: string | null,
    date?: string | null,
    username: string,
    registered?: boolean | null,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePlanAnchorsSubscription = {
  onCreatePlanAnchors?:  {
    __typename: "PlanAnchors",
    id: string,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePlanAnchorsSubscription = {
  onUpdatePlanAnchors?:  {
    __typename: "PlanAnchors",
    id: string,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePlanAnchorsSubscription = {
  onDeletePlanAnchors?:  {
    __typename: "PlanAnchors",
    id: string,
    photoRecords?:  Array< {
      __typename: "PhotoRecord",
      leftLocation: number,
      topLocation: number,
      fileName: string,
      needsManualRegistration?: boolean | null,
      label?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateProjectInvitationSubscription = {
  onCreateProjectInvitation?:  {
    __typename: "ProjectInvitation",
    id: string,
    fromUserName: string,
    inviteAddress: string,
    token: string,
    projectId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateProjectInvitationSubscription = {
  onUpdateProjectInvitation?:  {
    __typename: "ProjectInvitation",
    id: string,
    fromUserName: string,
    inviteAddress: string,
    token: string,
    projectId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteProjectInvitationSubscription = {
  onDeleteProjectInvitation?:  {
    __typename: "ProjectInvitation",
    id: string,
    fromUserName: string,
    inviteAddress: string,
    token: string,
    projectId: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePlanBimMatchingSubscription = {
  onCreatePlanBimMatching?:  {
    __typename: "PlanBimMatching",
    id: string,
    planUrl: string,
    bimUrl: string,
    record:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    },
    viewport:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePlanBimMatchingSubscription = {
  onUpdatePlanBimMatching?:  {
    __typename: "PlanBimMatching",
    id: string,
    planUrl: string,
    bimUrl: string,
    record:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    },
    viewport:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePlanBimMatchingSubscription = {
  onDeletePlanBimMatching?:  {
    __typename: "PlanBimMatching",
    id: string,
    planUrl: string,
    bimUrl: string,
    record:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    },
    viewport:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    },
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePlanBimTransformationSubscription = {
  onCreatePlanBimTransformation?:  {
    __typename: "PlanBimTransformation",
    id: string,
    bimUrl: string,
    transformationMatrix?: Array< Array< number | null > | null > | null,
    bimUp2CastoryUpRotationMatrix?: Array< Array< number | null > | null > | null,
    inverseMatchMatrix?: Array< Array< number | null > | null > | null,
    floorUpVec?: Array< number | null > | null,
    northVec?: Array< number | null > | null,
    eastVec?: Array< number | null > | null,
    viewport?:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    } | null,
    preventFirstPerson?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePlanBimTransformationSubscription = {
  onUpdatePlanBimTransformation?:  {
    __typename: "PlanBimTransformation",
    id: string,
    bimUrl: string,
    transformationMatrix?: Array< Array< number | null > | null > | null,
    bimUp2CastoryUpRotationMatrix?: Array< Array< number | null > | null > | null,
    inverseMatchMatrix?: Array< Array< number | null > | null > | null,
    floorUpVec?: Array< number | null > | null,
    northVec?: Array< number | null > | null,
    eastVec?: Array< number | null > | null,
    viewport?:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    } | null,
    preventFirstPerson?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePlanBimTransformationSubscription = {
  onDeletePlanBimTransformation?:  {
    __typename: "PlanBimTransformation",
    id: string,
    bimUrl: string,
    transformationMatrix?: Array< Array< number | null > | null > | null,
    bimUp2CastoryUpRotationMatrix?: Array< Array< number | null > | null > | null,
    inverseMatchMatrix?: Array< Array< number | null > | null > | null,
    floorUpVec?: Array< number | null > | null,
    northVec?: Array< number | null > | null,
    eastVec?: Array< number | null > | null,
    viewport?:  {
      __typename: "BimViewport",
      name: string,
      eye: Array< number | null >,
      target: Array< number | null >,
      up: Array< number | null >,
      worldUpVector: Array< number | null >,
      pivotPoint: Array< number | null >,
      distanceToOrbit: number,
      aspectRatio: number,
      projection: string,
      isOrthographic: boolean,
      fieldOfView: number,
    } | null,
    preventFirstPerson?: boolean | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateProjectSubscription = {
  onCreateProject?:  {
    __typename: "Project",
    id: string,
    name: string,
    description?: string | null,
    buildings?:  Array< {
      __typename: "Building",
      name: string,
      floors?:  Array< {
        __typename: "Floor",
        name: string,
        areas?:  Array< {
          __typename: "Area",
          name: string,
          infos?:  Array< {
            __typename: "Info",
            date: string,
            plan: string,
            tour: string,
            sceneId?: number | null,
            scale?: number | null,
          } | null > | null,
          type?: AreaTypeEnum | null,
          hasMultiplePlans?: boolean | null,
        } | null > | null,
      } | null > | null,
    } | null > | null,
    imageURL: string,
    owner?: string | null,
    architect?: string | null,
    contractor?: string | null,
    projectManagement?: string | null,
    activeProject: boolean,
    defaultPlan?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateProjectSubscription = {
  onUpdateProject?:  {
    __typename: "Project",
    id: string,
    name: string,
    description?: string | null,
    buildings?:  Array< {
      __typename: "Building",
      name: string,
      floors?:  Array< {
        __typename: "Floor",
        name: string,
        areas?:  Array< {
          __typename: "Area",
          name: string,
          infos?:  Array< {
            __typename: "Info",
            date: string,
            plan: string,
            tour: string,
            sceneId?: number | null,
            scale?: number | null,
          } | null > | null,
          type?: AreaTypeEnum | null,
          hasMultiplePlans?: boolean | null,
        } | null > | null,
      } | null > | null,
    } | null > | null,
    imageURL: string,
    owner?: string | null,
    architect?: string | null,
    contractor?: string | null,
    projectManagement?: string | null,
    activeProject: boolean,
    defaultPlan?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteProjectSubscription = {
  onDeleteProject?:  {
    __typename: "Project",
    id: string,
    name: string,
    description?: string | null,
    buildings?:  Array< {
      __typename: "Building",
      name: string,
      floors?:  Array< {
        __typename: "Floor",
        name: string,
        areas?:  Array< {
          __typename: "Area",
          name: string,
          infos?:  Array< {
            __typename: "Info",
            date: string,
            plan: string,
            tour: string,
            sceneId?: number | null,
            scale?: number | null,
          } | null > | null,
          type?: AreaTypeEnum | null,
          hasMultiplePlans?: boolean | null,
        } | null > | null,
      } | null > | null,
    } | null > | null,
    imageURL: string,
    owner?: string | null,
    architect?: string | null,
    contractor?: string | null,
    projectManagement?: string | null,
    activeProject: boolean,
    defaultPlan?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateCommentSubscription = {
  onCreateComment?:  {
    __typename: "Comment",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    title: string,
    role: string,
    mail: string,
    projectId?: string | null,
    description?: string | null,
    writtenBy?: string | null,
    replies?:  Array< {
      __typename: "CommentReply",
      reply: string,
      writtenBy?: string | null,
      date: string,
      role?: string | null,
      mail?: string | null,
      fileName?: string | null,
    } | null > | null,
    resolved?: boolean | null,
    record?:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null,
    issueTypes?: Array< IssueTypeEnum | null > | null,
    customIssueTypes?: Array< string | null > | null,
    assignees?: Array< string | null > | null,
    progress?: number | null,
    dueDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateCommentSubscription = {
  onUpdateComment?:  {
    __typename: "Comment",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    title: string,
    role: string,
    mail: string,
    projectId?: string | null,
    description?: string | null,
    writtenBy?: string | null,
    replies?:  Array< {
      __typename: "CommentReply",
      reply: string,
      writtenBy?: string | null,
      date: string,
      role?: string | null,
      mail?: string | null,
      fileName?: string | null,
    } | null > | null,
    resolved?: boolean | null,
    record?:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null,
    issueTypes?: Array< IssueTypeEnum | null > | null,
    customIssueTypes?: Array< string | null > | null,
    assignees?: Array< string | null > | null,
    progress?: number | null,
    dueDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteCommentSubscription = {
  onDeleteComment?:  {
    __typename: "Comment",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    title: string,
    role: string,
    mail: string,
    projectId?: string | null,
    description?: string | null,
    writtenBy?: string | null,
    replies?:  Array< {
      __typename: "CommentReply",
      reply: string,
      writtenBy?: string | null,
      date: string,
      role?: string | null,
      mail?: string | null,
      fileName?: string | null,
    } | null > | null,
    resolved?: boolean | null,
    record?:  {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null,
    issueTypes?: Array< IssueTypeEnum | null > | null,
    customIssueTypes?: Array< string | null > | null,
    assignees?: Array< string | null > | null,
    progress?: number | null,
    dueDate?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserLinkSubscription = {
  onCreateUserLink?:  {
    __typename: "UserLink",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    targetYaw?: number | null,
    targetPitch?: number | null,
    linkFrom?: string | null,
    linkTo: string,
    rotation: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserLinkSubscription = {
  onUpdateUserLink?:  {
    __typename: "UserLink",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    targetYaw?: number | null,
    targetPitch?: number | null,
    linkFrom?: string | null,
    linkTo: string,
    rotation: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserLinkSubscription = {
  onDeleteUserLink?:  {
    __typename: "UserLink",
    id: string,
    dataUrl: string,
    scene:  {
      __typename: "Scene",
      sceneId?: string | null,
      yaw?: number | null,
      pitch?: number | null,
      fov?: number | null,
    },
    targetYaw?: number | null,
    targetPitch?: number | null,
    linkFrom?: string | null,
    linkTo: string,
    rotation: number,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserSceneNameSubscription = {
  onCreateUserSceneName?:  {
    __typename: "UserSceneName",
    id: string,
    dataUrl: string,
    sceneId: string,
    sceneName: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSceneNameSubscription = {
  onUpdateUserSceneName?:  {
    __typename: "UserSceneName",
    id: string,
    dataUrl: string,
    sceneId: string,
    sceneName: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSceneNameSubscription = {
  onDeleteUserSceneName?:  {
    __typename: "UserSceneName",
    id: string,
    dataUrl: string,
    sceneId: string,
    sceneName: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePlanLinksSubscription = {
  onCreatePlanLinks?:  {
    __typename: "PlanLinks",
    id: string,
    tourDataUrl: string,
    planUrls?:  Array< {
      __typename: "PlanUrl",
      url: string,
      name: string,
      id: number,
    } | null > | null,
    linkLocations:  Array< {
      __typename: "LinkDetails",
      sceneId: string,
      sceneName?: string | null,
      planYaw?: number | null,
      leftLocation: number,
      topLocation: number,
      linkUrl: string,
      isPhotoLink?: boolean | null,
      linkItemType?: ItemTypeEnum | null,
    } | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePlanLinksSubscription = {
  onUpdatePlanLinks?:  {
    __typename: "PlanLinks",
    id: string,
    tourDataUrl: string,
    planUrls?:  Array< {
      __typename: "PlanUrl",
      url: string,
      name: string,
      id: number,
    } | null > | null,
    linkLocations:  Array< {
      __typename: "LinkDetails",
      sceneId: string,
      sceneName?: string | null,
      planYaw?: number | null,
      leftLocation: number,
      topLocation: number,
      linkUrl: string,
      isPhotoLink?: boolean | null,
      linkItemType?: ItemTypeEnum | null,
    } | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePlanLinksSubscription = {
  onDeletePlanLinks?:  {
    __typename: "PlanLinks",
    id: string,
    tourDataUrl: string,
    planUrls?:  Array< {
      __typename: "PlanUrl",
      url: string,
      name: string,
      id: number,
    } | null > | null,
    linkLocations:  Array< {
      __typename: "LinkDetails",
      sceneId: string,
      sceneName?: string | null,
      planYaw?: number | null,
      leftLocation: number,
      topLocation: number,
      linkUrl: string,
      isPhotoLink?: boolean | null,
      linkItemType?: ItemTypeEnum | null,
    } | null >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateChatMessageSubscription = {
  onCreateChatMessage?:  {
    __typename: "ChatMessage",
    id: string,
    username: string,
    text: string,
    project: string,
    isAnswer?: boolean | null,
    analysis?:  Array< {
      __typename: "ImagesAnalysisResponse",
      date?: string | null,
      imageKeys?:  {
        __typename: "ImagesIn360View",
        floor?: string | null,
        wall1?: string | null,
        wall2?: string | null,
        wall3?: string | null,
        wall4?: string | null,
        ceiling?: string | null,
      } | null,
      anchor?: string | null,
      top?: number | null,
      left?: number | null,
      matchingCriteria?: boolean | null,
      certainty?: number | null,
      explanation?: string | null,
    } | null > | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type OnUpdateChatMessageSubscription = {
  onUpdateChatMessage?:  {
    __typename: "ChatMessage",
    id: string,
    username: string,
    text: string,
    project: string,
    isAnswer?: boolean | null,
    analysis?:  Array< {
      __typename: "ImagesAnalysisResponse",
      date?: string | null,
      imageKeys?:  {
        __typename: "ImagesIn360View",
        floor?: string | null,
        wall1?: string | null,
        wall2?: string | null,
        wall3?: string | null,
        wall4?: string | null,
        ceiling?: string | null,
      } | null,
      anchor?: string | null,
      top?: number | null,
      left?: number | null,
      matchingCriteria?: boolean | null,
      certainty?: number | null,
      explanation?: string | null,
    } | null > | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type OnDeleteChatMessageSubscription = {
  onDeleteChatMessage?:  {
    __typename: "ChatMessage",
    id: string,
    username: string,
    text: string,
    project: string,
    isAnswer?: boolean | null,
    analysis?:  Array< {
      __typename: "ImagesAnalysisResponse",
      date?: string | null,
      imageKeys?:  {
        __typename: "ImagesIn360View",
        floor?: string | null,
        wall1?: string | null,
        wall2?: string | null,
        wall3?: string | null,
        wall4?: string | null,
        ceiling?: string | null,
      } | null,
      anchor?: string | null,
      top?: number | null,
      left?: number | null,
      matchingCriteria?: boolean | null,
      certainty?: number | null,
      explanation?: string | null,
    } | null > | null,
    createdAt?: string | null,
    updatedAt: string,
  } | null,
};

export type OnCreatePlanInitialPointSubscription = {
  onCreatePlanInitialPoint?:  {
    __typename: "PlanInitialPoint",
    id: string,
    matched: boolean,
    scanRecords?:  Array< {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePlanInitialPointSubscription = {
  onUpdatePlanInitialPoint?:  {
    __typename: "PlanInitialPoint",
    id: string,
    matched: boolean,
    scanRecords?:  Array< {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePlanInitialPointSubscription = {
  onDeletePlanInitialPoint?:  {
    __typename: "PlanInitialPoint",
    id: string,
    matched: boolean,
    scanRecords?:  Array< {
      __typename: "ScanRecord",
      recordDate: string,
      building: string,
      floor: string,
      planUrl: string,
      leftLocation: number,
      topLocation: number,
      username: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTourTokenSubscription = {
  onCreateTourToken?:  {
    __typename: "TourToken",
    id: string,
    token: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTourTokenSubscription = {
  onUpdateTourToken?:  {
    __typename: "TourToken",
    id: string,
    token: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTourTokenSubscription = {
  onDeleteTourToken?:  {
    __typename: "TourToken",
    id: string,
    token: string,
    createdAt: string,
    updatedAt: string,
  } | null,
};
