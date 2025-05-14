import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";

export enum ItemTypeEnum {
  IMAGE_360 = "IMAGE_360",
  IMAGE_PLAIN_ZOOMABLE = "IMAGE_PLAIN_ZOOMABLE",
  VIDEO_FRAME_360 = "VIDEO_FRAME_360",
  VIDEO = "VIDEO"
}

export enum AreaTypeEnum {
  APARTMENT = "APARTMENT",
  FLOOR = "FLOOR"
}

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
  HOUSEKEEPING = "HOUSEKEEPING"
}

export enum ActivityStatus {
  DONE = "DONE",
  IN_PROGRESS = "IN_PROGRESS",
  NOT_STARTED = "NOT_STARTED",
  IRRELEVANT = "IRRELEVANT"
}

export declare class PlanUrl {
  readonly url: string;
  readonly name: string;
  readonly id: number;
  constructor(init: ModelInit<PlanUrl>);
}

export declare class LinkDetails {
  readonly sceneId: string;
  readonly sceneName?: string;
  readonly planYaw?: number;
  readonly leftLocation: number;
  readonly topLocation: number;
  readonly linkUrl: string;
  readonly isPhotoLink?: boolean;
  readonly linkItemType?: ItemTypeEnum | keyof typeof ItemTypeEnum;
  constructor(init: ModelInit<LinkDetails>);
}

export declare class NearestScene {
  readonly sceneId: string;
  readonly yaw?: number;
  constructor(init: ModelInit<NearestScene>);
}

export declare class PlanAnchorsResponse {
  readonly date: string;
  readonly linkId: number;
  constructor(init: ModelInit<PlanAnchorsResponse>);
}

export declare class ExtendedUserProfile {
  readonly userProfile?: UserProfile;
  readonly projects?: Project[];
  constructor(init: ModelInit<ExtendedUserProfile>);
}

export declare class Building {
  readonly name: string;
  readonly floors?: Floor[];
  constructor(init: ModelInit<Building>);
}

export declare class Floor {
  readonly name: string;
  readonly areas?: Area[];
  constructor(init: ModelInit<Floor>);
}

export declare class Area {
  readonly name: string;
  readonly infos?: Info[];
  readonly type?: AreaTypeEnum | keyof typeof AreaTypeEnum;
  readonly hasMultiplePlans?: boolean;
  constructor(init: ModelInit<Area>);
}

export declare class Info {
  readonly date: string;
  readonly plan: string;
  readonly tour: string;
  readonly sceneId?: number;
  readonly scale?: number;
  constructor(init: ModelInit<Info>);
}

export declare class ProgressValue {
  readonly date?: string;
  readonly progress?: number;
  constructor(init: ModelInit<ProgressValue>);
}

export declare class ActivityPlannedDatesResponse {
  readonly activity: string;
  readonly plannedDates: PlannedDatesRecord[];
  constructor(init: ModelInit<ActivityPlannedDatesResponse>);
}

export declare class PlannedDatesRecord {
  readonly building: string;
  readonly floor: string;
  readonly startDate: string;
  readonly endDate: string;
  constructor(init: ModelInit<PlannedDatesRecord>);
}

export declare class MsProjectSnapshot {
  readonly id: string;
  readonly tasks?: TaskData[];
  readonly projectId?: string;
  readonly lastUpdated?: string;
  constructor(init: ModelInit<MsProjectSnapshot>);
}

export declare class TaskData {
  readonly duration?: string;
  readonly finish?: string;
  readonly guid?: string;
  readonly name?: string;
  readonly predecessor?: string;
  readonly start?: string;
  readonly successor?: string;
  readonly totalSlack?: string;
  readonly wbs?: string;
  constructor(init: ModelInit<TaskData>);
}

export declare class ProjectCopilotResponse {
  readonly answer: string;
  readonly imagesAnalysis?: ImagesAnalysisResponse[];
  constructor(init: ModelInit<ProjectCopilotResponse>);
}

export declare class ImagesAnalysisResponse {
  readonly date?: string;
  readonly imageKeys?: ImagesIn360View;
  readonly anchor?: string;
  readonly top?: number;
  readonly left?: number;
  readonly matchingCriteria?: boolean;
  readonly certainty?: number;
  readonly explanation?: string;
  constructor(init: ModelInit<ImagesAnalysisResponse>);
}

export declare class ImagesIn360View {
  readonly floor?: string;
  readonly wall1?: string;
  readonly wall2?: string;
  readonly wall3?: string;
  readonly wall4?: string;
  readonly ceiling?: string;
  constructor(init: ModelInit<ImagesIn360View>);
}

export declare class Scene {
  readonly sceneId?: string;
  readonly yaw?: number;
  readonly pitch?: number;
  readonly fov?: number;
  constructor(init: ModelInit<Scene>);
}

export declare class CommentReply {
  readonly reply: string;
  readonly writtenBy?: string;
  readonly date: string;
  readonly role?: string;
  readonly mail?: string;
  readonly fileName?: string;
  constructor(init: ModelInit<CommentReply>);
}

export declare class ScanRecord {
  readonly recordDate: string;
  readonly building: string;
  readonly floor: string;
  readonly planUrl: string;
  readonly leftLocation: number;
  readonly topLocation: number;
  readonly username: string;
  constructor(init: ModelInit<ScanRecord>);
}

export declare class DelayedActivity {
  readonly location: string;
  readonly probability: number;
  readonly reason?: string;
  constructor(init: ModelInit<DelayedActivity>);
}

export declare class ProgressArea {
  readonly building: string;
  readonly floor: string;
  readonly anchor: string;
  readonly weight?: number;
  readonly label?: string;
  readonly invisible?: boolean;
  readonly activities?: Activity[];
  constructor(init: ModelInit<ProgressArea>);
}

export declare class Activity {
  readonly activityName: string;
  readonly status: ActivityStatus | keyof typeof ActivityStatus;
  readonly previousStatus?: ActivityStatus | keyof typeof ActivityStatus;
  readonly updater?: string;
  readonly updateReason?: string;
  readonly dateManuallyUpdated?: string;
  constructor(init: ModelInit<Activity>);
}

export declare class ProgressCategory {
  readonly name: string;
  readonly includes?: CategoryChildren[];
  constructor(init: ModelInit<ProgressCategory>);
}

export declare class CategoryChildren {
  readonly name: string;
  readonly weight?: number;
  constructor(init: ModelInit<CategoryChildren>);
}

export declare class PhotoRecord {
  readonly leftLocation: number;
  readonly topLocation: number;
  readonly fileName: string;
  readonly needsManualRegistration?: boolean;
  readonly label?: string;
  constructor(init: ModelInit<PhotoRecord>);
}

export declare class BimViewport {
  readonly name: string;
  readonly eye: number[];
  readonly target: number[];
  readonly up: number[];
  readonly worldUpVector: number[];
  readonly pivotPoint: number[];
  readonly distanceToOrbit: number;
  readonly aspectRatio: number;
  readonly projection: string;
  readonly isOrthographic: boolean;
  readonly fieldOfView: number;
  constructor(init: ModelInit<BimViewport>);
}

export declare class PlanLinks {
  readonly id: string;
  readonly tourDataUrl: string;
  readonly planUrls?: PlanUrl[];
  readonly linkLocations: LinkDetails[];
  constructor(init: ModelInit<PlanLinks>);
  static copyOf(source: PlanLinks, mutator: (draft: MutableModel<PlanLinks>) => MutableModel<PlanLinks> | void): PlanLinks;
}

export declare class UserProfile {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly phoneNumber?: string;
  readonly role?: string;
  readonly unsubscribedToEmails?: boolean;
  readonly isProgressAdmin?: boolean;
  readonly progressEditor?: boolean;
  readonly participatesInProjects?: string[];
  constructor(init: ModelInit<UserProfile>);
  static copyOf(source: UserProfile, mutator: (draft: MutableModel<UserProfile>) => MutableModel<UserProfile> | void): UserProfile;
}

export declare class Project {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly buildings?: Building[];
  readonly imageURL: string;
  readonly owner?: string;
  readonly architect?: string;
  readonly contractor?: string;
  readonly projectManagement?: string;
  readonly activeProject: boolean;
  readonly defaultPlan?: string;
  constructor(init: ModelInit<Project>);
  static copyOf(source: Project, mutator: (draft: MutableModel<Project>) => MutableModel<Project> | void): Project;
}

export declare class ChatMessage {
  readonly id: string;
  readonly username: string;
  readonly text: string;
  readonly project: string;
  readonly isAnswer?: boolean;
  readonly analysis?: ImagesAnalysisResponse[];
  readonly createdAt?: string;
  constructor(init: ModelInit<ChatMessage>);
  static copyOf(source: ChatMessage, mutator: (draft: MutableModel<ChatMessage>) => MutableModel<ChatMessage> | void): ChatMessage;
}

export declare class Comment {
  readonly id: string;
  readonly dataUrl: string;
  readonly scene: Scene;
  readonly title: string;
  readonly role: string;
  readonly mail: string;
  readonly projectId?: string;
  readonly description?: string;
  readonly writtenBy?: string;
  readonly replies?: CommentReply[];
  readonly resolved?: boolean;
  readonly record?: ScanRecord;
  readonly issueTypes?: IssueTypeEnum[] | keyof typeof IssueTypeEnum;
  readonly customIssueTypes?: string[];
  readonly assignees?: string[];
  readonly progress?: number;
  readonly dueDate?: string;
  constructor(init: ModelInit<Comment>);
  static copyOf(source: Comment, mutator: (draft: MutableModel<Comment>) => MutableModel<Comment> | void): Comment;
}

export declare class ActivityPlannedDates {
  readonly id: string;
  readonly projectId: string;
  readonly startDates: string;
  readonly endDates: string;
  constructor(init: ModelInit<ActivityPlannedDates>);
  static copyOf(source: ActivityPlannedDates, mutator: (draft: MutableModel<ActivityPlannedDates>) => MutableModel<ActivityPlannedDates> | void): ActivityPlannedDates;
}

export declare class ProgressDelayedActivities {
  readonly id: string;
  readonly delayedActivities?: DelayedActivity[];
  constructor(init: ModelInit<ProgressDelayedActivities>);
  static copyOf(source: ProgressDelayedActivities, mutator: (draft: MutableModel<ProgressDelayedActivities>) => MutableModel<ProgressDelayedActivities> | void): ProgressDelayedActivities;
}

export declare class Progress {
  readonly id: string;
  readonly projectId: string;
  readonly date: string;
  readonly progressAreas?: ProgressArea[];
  readonly chunkId?: number;
  readonly labels?: string[];
  readonly dod?: number;
  readonly draft?: boolean;
  readonly categories?: ProgressCategory[];
  constructor(init: ModelInit<Progress>);
  static copyOf(source: Progress, mutator: (draft: MutableModel<Progress>) => MutableModel<Progress> | void): Progress;
}

export declare class UserLink {
  readonly id: string;
  readonly dataUrl: string;
  readonly scene: Scene;
  readonly targetYaw?: number;
  readonly targetPitch?: number;
  readonly linkFrom?: string;
  readonly linkTo: string;
  readonly rotation: number;
  constructor(init: ModelInit<UserLink>);
  static copyOf(source: UserLink, mutator: (draft: MutableModel<UserLink>) => MutableModel<UserLink> | void): UserLink;
}

export declare class UserSceneName {
  readonly id: string;
  readonly dataUrl: string;
  readonly sceneId: string;
  readonly sceneName: string;
  constructor(init: ModelInit<UserSceneName>);
  static copyOf(source: UserSceneName, mutator: (draft: MutableModel<UserSceneName>) => MutableModel<UserSceneName> | void): UserSceneName;
}

export declare class PlanInitialPoint {
  readonly id: string;
  readonly matched: boolean;
  readonly scanRecords?: ScanRecord[];
  constructor(init: ModelInit<PlanInitialPoint>);
  static copyOf(source: PlanInitialPoint, mutator: (draft: MutableModel<PlanInitialPoint>) => MutableModel<PlanInitialPoint> | void): PlanInitialPoint;
}

export declare class PhotoTourPoints {
  readonly id: string;
  readonly projectId: string;
  readonly building: string;
  readonly area: string;
  readonly filesPath?: string;
  readonly date?: string;
  readonly username: string;
  readonly registered?: boolean;
  readonly photoRecords?: PhotoRecord[];
  constructor(init: ModelInit<PhotoTourPoints>);
  static copyOf(source: PhotoTourPoints, mutator: (draft: MutableModel<PhotoTourPoints>) => MutableModel<PhotoTourPoints> | void): PhotoTourPoints;
}

export declare class PlanAnchors {
  readonly id: string;
  readonly photoRecords?: PhotoRecord[];
  constructor(init: ModelInit<PlanAnchors>);
  static copyOf(source: PlanAnchors, mutator: (draft: MutableModel<PlanAnchors>) => MutableModel<PlanAnchors> | void): PlanAnchors;
}

export declare class TourToken {
  readonly id: string;
  readonly token: string;
  constructor(init: ModelInit<TourToken>);
  static copyOf(source: TourToken, mutator: (draft: MutableModel<TourToken>) => MutableModel<TourToken> | void): TourToken;
}

export declare class ProjectInvitation {
  readonly id: string;
  readonly fromUserName: string;
  readonly inviteAddress: string;
  readonly token: string;
  readonly projectId: string;
  constructor(init: ModelInit<ProjectInvitation>);
  static copyOf(source: ProjectInvitation, mutator: (draft: MutableModel<ProjectInvitation>) => MutableModel<ProjectInvitation> | void): ProjectInvitation;
}

export declare class PlanBimMatching {
  readonly id: string;
  readonly planUrl: string;
  readonly bimUrl: string;
  readonly record: ScanRecord;
  readonly viewport: BimViewport;
  constructor(init: ModelInit<PlanBimMatching>);
  static copyOf(source: PlanBimMatching, mutator: (draft: MutableModel<PlanBimMatching>) => MutableModel<PlanBimMatching> | void): PlanBimMatching;
}

export declare class PlanBimTransformation {
  readonly id: string;
  readonly bimUrl: string;
  readonly transformationMatrix?: number[];
  readonly bimUp2CastoryUpRotationMatrix?: number[];
  readonly inverseMatchMatrix?: number[];
  readonly floorUpVec?: number[];
  readonly northVec?: number[];
  readonly eastVec?: number[];
  readonly viewport?: BimViewport;
  readonly preventFirstPerson?: boolean;
  constructor(init: ModelInit<PlanBimTransformation>);
  static copyOf(source: PlanBimTransformation, mutator: (draft: MutableModel<PlanBimTransformation>) => MutableModel<PlanBimTransformation> | void): PlanBimTransformation;
}