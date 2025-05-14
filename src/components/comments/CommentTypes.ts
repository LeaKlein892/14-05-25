import { Comment } from "../../models";

export type CommentPressFunction = (
  sceneId?: string,
  yaw?: number,
  pitch?: number,
  fov?: number,
  tourDataUrl?: string
) => void;

export type CommentCompareFunction = (
  comment: Comment,
  otherComment: Comment
) => number;
