import * as React from "react";
import { useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { List, useMediaQuery } from "@mui/material";
import CommentListItem from "./CommentListItem";
import { Comment } from "../../../models";
import { CommentPressFunction } from "../CommentTypes";
import { TourDetails } from "../../../utils/projects-utils";
import { FixedSizeList } from "react-window";
import theme from "../../../ui/theme";
import { isNil } from "lodash-es";
import { emptyFn } from "../../../utils/render-utils";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { CSSProperties } from "react";

function getItemSize(
  smallDesktopMode: boolean,
  tabletMode: boolean,
  mobileMode: boolean
) {
  if (mobileMode) {
    return 370;
  }
  if (tabletMode) {
    return 235;
  }
  if (smallDesktopMode) {
    return 190;
  }
  return 130;
}

let lastListScrollIndex = 0;
let lastProjectName = "";

export interface CommentsListProps {
  commentList: Map<Comment, TourDetails | undefined>;
  onCommentSelected?: CommentPressFunction;
  triggerEditComment?: (comment?: Comment) => void;
  handleClose: () => void;
}

const CommentsList: React.FC<CommentsListProps> = ({
  commentList = new Map<Comment, TourDetails>(),
  onCommentSelected = emptyFn,
  triggerEditComment = (comment?: Comment) => {},
  handleClose,
}) => {
  const smallDesktopMode = useMediaQuery(theme.breakpoints.down("xl"), {
    noSsr: true,
  });
  const tabletMode = useMediaQuery(theme.breakpoints.down("xl"), {
    noSsr: true,
  });
  const mobileMode = useMediaQuery(theme.breakpoints.down("lg"), {
    noSsr: true,
  });
  const listRef = useRef(null);

  const { currentProject } = useContext(ProjectInformationContext);
  const projectName = currentProject?.id || "";

  const itemSize = getItemSize(smallDesktopMode, tabletMode, mobileMode);

  const comments = useMemo(() => {
    return Array.from(commentList.keys());
  }, [commentList]);

  const CommentItem = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      return (
        <div style={style} key={index}>
          <CommentListItem
            comment={comments[index]}
            tourDetails={commentList.get(comments[index])}
            onClickComment={onCommentSelected}
            triggerEditComment={triggerEditComment}
            afterCommentSelected={handleClose} // TODO: remove this somehow ?
          />
        </div>
      );
    },
    [commentList, comments, handleClose, onCommentSelected, triggerEditComment]
  );

  useEffect(() => {
    if (projectName !== "" && projectName !== lastProjectName) {
      lastListScrollIndex = 0;
      lastProjectName = projectName;
    }
  }, [projectName]);

  useEffect(() => {
    const list: any = listRef.current;
    if (!isNil(list)) {
      const listOffset =
        lastListScrollIndex !== 0 ? itemSize * (0.5 + lastListScrollIndex) : 0;
      list.scrollTo(listOffset);
    }
  }, [itemSize]);

  return (
    <List>
      <FixedSizeList
        ref={listRef}
        itemSize={itemSize}
        height={1100}
        itemCount={comments.length}
        onItemsRendered={({ visibleStartIndex }) => {
          lastListScrollIndex = visibleStartIndex;
        }}
        width={"100%"}
      >
        {CommentItem}
      </FixedSizeList>
    </List>
  );
};

export default React.memo(CommentsList);
