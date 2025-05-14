import { PhotoRecord } from "../../../models";

export interface PlanAnnotationsProps {
  idToCommentsNumber: Map<string, number>;
  scale: number;
  onSceneClick: (url: string) => void;
  onZoomImageClick: (linkUrl: string, index: number) => void;
  onVideoClick: (linkUrl: string, index: number) => void;
  isIconAnnotations?: boolean;
  hidden?: boolean;
}

export interface OrderedPhotoRecord extends PhotoRecord {
  index: number;
}

export interface StaticPlanAnnotationDef {
  locationsArray: OrderedPhotoRecord[];
  selectedIndex: number;
  initialPoint: OSDLocation;
  photoTourId: string;
  diffedAnchors?: number[];
}

export interface OSDLocation {
  leftLocation: number;
  topLocation: number;
}
