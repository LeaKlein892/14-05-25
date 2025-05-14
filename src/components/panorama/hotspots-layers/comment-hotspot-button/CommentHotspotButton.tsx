import * as React from "react";
import "./CommentHotspotButton.css";
import { Comment } from "../../../../models";
import { getCommentIcon } from "../../../../utils/comments-utils";

export interface CommentHotspotButtonProps {
  onHotspotClick: (comment: Comment) => void;
  comment: Comment;
}

export const CommentHotspotButton: React.FC<CommentHotspotButtonProps> = ({
  onHotspotClick,
  comment,
}) => {
  return (
    <div className={"hotspot info-hotspot"}>
      <div
        className={`info-hotspot-header ${
          comment.resolved
            ? "info-hotspot-header-resolved"
            : "info-hotspot-header-open"
        }`}
        onClick={() => onHotspotClick(comment)}
      >
        <div className={"info-hotspot-icon-wrapper"}>
          <img
            alt={""}
            src={getCommentIcon(comment)}
            className={"info-hotspot-icon"}
          />
        </div>
        <div className={"info-hotspot-title-wrapper"}>
          <div className={"info-hotspot-title"}>{comment.description}</div>
        </div>
        <div className={"info-hotspot-close-wrapper"}>
          <img
            alt={""}
            src={"img/close.png"}
            className={"info-hotspot-close-icon"}
          />
        </div>
      </div>
      <div className={"info-hotspot-text"}>{comment.description}</div>
    </div>
  );
};
