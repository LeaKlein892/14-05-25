import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { Grid } from "@mui/material";
import { createStyles } from "@mui/styles";
import { Comment } from "../../../models";
import { FriendlyError } from "../../friendly-error/FriendlyError";
import { API } from "aws-amplify";
import { commentsByProjectId } from "../../../graphql/queries";
import {
  onCreateComment,
  onDeleteComment,
  onUpdateComment,
} from "../../../graphql/subscriptions";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { GRAPHQL_AUTH_MODE, GraphQLResult } from "@aws-amplify/api-graphql";
import {
  CommentsByProjectIdQuery,
  CreateCommentInput,
  UpdateCommentInput,
} from "../../../API";
import {
  getAllToursAndPlansMap,
  TourDetails,
} from "../../../utils/projects-utils";
import { AppModeEnum, ViewContext } from "../../../context/ViewContext";
import { FilteredTasks } from "../filtered-tasks/FilteredTasks";
import { useHistory } from "react-router-dom";
import { analyticsError, analyticsEvent } from "../../../utils/analytics";
import { TitleBar } from "../../title-bar/TitleBar";
import { LoggedUserContext } from "../../../context/LoggedUserContext";

const useStyles = makeStyles((theme) =>
  createStyles({
    tasksView: {
      marginTop: "64px",
    },
  })
);

let toursDetailsMap = new Map<string, TourDetails>();
let lastTitleOpened = true;

const TasksView: React.FC = () => {
  const classes = useStyles();
  const { appMode } = useContext(ViewContext);
  const {
    currentProject,
    setCurrentPlan,
    setCurrentTour,
    setCurrentDate,
    setCurrentArea,
    setCurrentFloor,
    setCurrentBuilding,
    setCurrentScene,
  } = useContext(ProjectInformationContext);
  const history = useHistory();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentNotFound, setCommentNotFound] = useState(false);

  const { loggedUser } = useContext(LoggedUserContext);
  const [titleOpened, setTitleOpened] = useState(lastTitleOpened);

  const onToggleTitle = useCallback(() => {
    analyticsEvent("Tasks", "Tasks TitleBar Switched", loggedUser.username);
    lastTitleOpened = !titleOpened;
    setTitleOpened(lastTitleOpened);
  }, [loggedUser.username, titleOpened]);

  const shouldChooseProject =
    appMode === AppModeEnum.projectView && !currentProject;

  const handleTaskClick = useCallback(
    (
      sceneId?: string,
      yaw?: number,
      pitch?: number,
      fov?: number,
      tourDataUrl?: string
    ) => {
      if (tourDataUrl) {
        const tourDetails = toursDetailsMap.get(tourDataUrl);
        setCurrentTour(tourDataUrl);
        if (sceneId) {
          setCurrentScene({
            sceneId: sceneId.toString(),
            yaw: yaw,
            pitch: pitch,
            fov: fov,
          });
        }
        if (tourDetails) {
          setCurrentPlan(tourDetails.info.plan);
          setCurrentDate(tourDetails.info.date);
          setCurrentArea(tourDetails.area);
          setCurrentFloor(tourDetails.floor);
          setCurrentBuilding(tourDetails.building);
        } else {
          console.log("ERROR! Tour doesn't have details");
        }
        history.push("/tour");
      }
    },
    [
      history,
      setCurrentArea,
      setCurrentBuilding,
      setCurrentDate,
      setCurrentFloor,
      setCurrentPlan,
      setCurrentScene,
      setCurrentTour,
    ]
  );

  const getCommentsData = async () => {
    let fetchedComments: Comment[] = [];
    try {
      let nextToken: string | null | undefined = undefined;
      do {
        const commentsData = (await API.graphql({
          query: commentsByProjectId,
          variables: {
            projectId: currentProject?.id,
            limit: 100,
            nextToken,
          },
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        })) as GraphQLResult<CommentsByProjectIdQuery>;

        fetchedComments = [
          ...fetchedComments,
          ...(commentsData.data?.commentsByProjectId?.items as Comment[]),
        ];
        nextToken = commentsData.data?.commentsByProjectId?.nextToken;
      } while (nextToken !== null && nextToken !== undefined);
    } catch (e: any) {
      analyticsError("Task view error: " + JSON.stringify(e));
      console.log("Task view error:: ", e);
    }
    return fetchedComments;
  };

  useEffect(() => {
    if (!shouldChooseProject) {
      if (currentProject) {
        toursDetailsMap = getAllToursAndPlansMap(currentProject);
      }

      getCommentsData().then((commentsData) => {
        commentsData && commentsData.length > 0
          ? setComments(commentsData)
          : setCommentNotFound(true);
      });
    }
  }, [currentProject, shouldChooseProject]);

  useEffect(() => {
    let createSubscription: any;
    let updateSubscription: any;
    let deleteSubscription: any;

    const createSubscriptionOperation: any = API.graphql({
      query: onCreateComment,
      variables: {},
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    });
    const updateSubscriptionOperation: any = API.graphql({
      query: onUpdateComment,
      variables: {},
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    });
    const deleteSubscriptionOperation: any = API.graphql({
      query: onDeleteComment,
      variables: {},
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    });
    createSubscription = createSubscriptionOperation.subscribe({
      next: (commentData: any) => {
        const comment: CreateCommentInput =
          commentData.value.data.onCreateComment;
        setComments([...comments, comment as Comment]);
      },
    });
    updateSubscription = updateSubscriptionOperation.subscribe({
      next: (commentData: any) => {
        const comment: UpdateCommentInput =
          commentData.value.data.onUpdateComment;
        const unchangedComments = comments.filter((c: Comment) => {
          return c.id !== comment.id;
        });
        setComments([...unchangedComments, comment as Comment]);
      },
    });
    deleteSubscription = deleteSubscriptionOperation.subscribe({
      next: (commentData: any) => {
        const comment: UpdateCommentInput =
          commentData.value.data.onDeleteComment;
        const unchangedComments = comments.filter((c: Comment) => {
          return c.id !== comment.id;
        });
        setComments([...unchangedComments]);
      },
    });

    return () => {
      if (createSubscription) {
        createSubscription.unsubscribe();
      }
      if (updateSubscription) {
        updateSubscription.unsubscribe();
      }
      if (deleteSubscription) {
        deleteSubscription.unsubscribe();
      }
    };
  }, [comments]);

  return (
    <React.Fragment>
      {!shouldChooseProject ? (
        <Grid container className={classes.tasksView}>
          <Grid item xs={12}>
            <FilteredTasks
              commentNotFound={commentNotFound}
              comments={comments}
              onTaskClick={handleTaskClick}
              toursDetails={toursDetailsMap}
            />
            {currentProject && (
              <TitleBar
                title={`Tasks | ${currentProject?.name}`}
                onToggle={onToggleTitle}
                open={titleOpened}
              />
            )}
          </Grid>
        </Grid>
      ) : (
        <FriendlyError
          link="/project"
          message="No project selected!"
          linkText="Select Project"
        />
      )}
    </React.Fragment>
  );
};

export default React.memo(TasksView);
