import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { Comment } from "../../../models";
import { analyticsEvent } from "../../../utils/analytics";
import { PanoScene } from "../../../typings/panoramas";
import { commentHasLocation } from "../../../utils/comments-utils";
import { CommentHotspotButton } from "./comment-hotspot-button/CommentHotspotButton";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { createRoot } from "react-dom/client";

export interface CommentsHotspotsLayerProps {
  commentsList: Comment[];
  onHotspotClick: (comment: Comment) => void;
  scenes: React.RefObject<PanoScene[]>;
  sceneIdToSceneIndexMap: Map<string, number>;
}

interface CommentInfoElements {
  hotspot: any;
  onClear: () => void;
}

const commentIdToInfoHotspotElements = new Map<string, CommentInfoElements>();

export const CommentsHotspotsLayer: React.FC<CommentsHotspotsLayerProps> = ({
  commentsList,
  onHotspotClick,
  scenes,
  sceneIdToSceneIndexMap,
}) => {
  const [comments, setComments] = useState<Comment[]>(commentsList);
  const { loggedUser } = useContext(LoggedUserContext);

  const handleHotspotClick = useCallback(
    (comment: Comment) => {
      analyticsEvent(
        "Tasks",
        "Comment Hotspot Clicked",
        loggedUser.username
        // comment.dataUrl
      );
      onHotspotClick(comment);
    },
    [onHotspotClick, loggedUser.username]
  );

  const createInfoHotspotElement = useCallback(
    (comment: Comment) => {
      const commentHotspotElement = (
        <CommentHotspotButton
          comment={comment}
          onHotspotClick={handleHotspotClick}
        />
      );

      const wrapper = document.createElement("div");
      wrapper.setAttribute("id", "commentsHotspotsWrapper");

      const root = createRoot(wrapper!);
      root.render(commentHotspotElement);

      return wrapper;
    },
    [handleHotspotClick]
  );

  const addInfoHotspotToScene = useCallback(
    (comment: Comment) => {
      if (!commentHasLocation(comment)) {
        return;
      }

      const element = createInfoHotspotElement(comment);

      const currentLocationHotspot = commentIdToInfoHotspotElements.get(
        comment.id
      )?.hotspot;

      const sceneId = comment.scene.sceneId;

      const pSceneIndex =
        sceneId !== undefined ? sceneIdToSceneIndexMap.get(sceneId) : undefined;
      const pScene =
        pSceneIndex !== undefined
          ? scenes.current[pSceneIndex]?.scene
          : undefined;

      if (pScene) {
        const createdHotspot = pScene
          .hotspotContainer()
          .createHotspot(element, {
            yaw: comment.scene.yaw,
            pitch: comment.scene.pitch,
          });

        commentIdToInfoHotspotElements.set(comment.id, {
          hotspot: createdHotspot,
          onClear: () => {
            if (
              createdHotspot &&
              pScene.hotspotContainer() &&
              pScene.hotspotContainer().hasHotspot(createdHotspot)
            ) {
              pScene.hotspotContainer().destroyHotspot(createdHotspot);
            }
          },
        });

        if (
          currentLocationHotspot &&
          pScene.hotspotContainer() &&
          pScene.hotspotContainer().hasHotspot(currentLocationHotspot)
        ) {
          pScene.hotspotContainer().destroyHotspot(currentLocationHotspot);
        }
      }
    },
    [createInfoHotspotElement, scenes, sceneIdToSceneIndexMap]
  );

  const clearHotspots = () => {
    commentIdToInfoHotspotElements.forEach((v, k) => {
      v.onClear();
    });
    commentIdToInfoHotspotElements.clear();
  };

  useEffect(() => {
    setComments([...commentsList]);
  }, [commentsList]);

  useEffect(() => {
    if (scenes.current && scenes.current.length !== 0) {
      clearHotspots();
      comments.forEach((c) => {
        addInfoHotspotToScene(c);
      });
    }
  }, [comments, addInfoHotspotToScene, scenes]);

  useEffect(() => {
    const con: any =
      document.getElementsByClassName("pano-container")[0].lastChild;
    con.style["overflow"] = "hidden";
  }, []);

  return <></>;
};
