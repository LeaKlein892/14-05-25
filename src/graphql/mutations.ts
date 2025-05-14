/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const calculatePlanBimTransformation = /* GraphQL */ `
  mutation CalculatePlanBimTransformation(
    $planUrl: String!
    $registerByNewOnly: Boolean!
  ) {
    calculatePlanBimTransformation(
      planUrl: $planUrl
      registerByNewOnly: $registerByNewOnly
    )
  }
`;
export const publishPhotoLink = /* GraphQL */ `
  mutation PublishPhotoLink($photoTourId: String!) {
    publishPhotoLink(photoTourId: $photoTourId)
  }
`;
export const publishZoomableImage = /* GraphQL */ `
  mutation PublishZoomableImage(
    $project: String!
    $building: String!
    $area: String!
    $filePath: String!
    $leftLocation: Float!
    $topLocation: Float!
  ) {
    publishZoomableImage(
      project: $project
      building: $building
      area: $area
      filePath: $filePath
      leftLocation: $leftLocation
      topLocation: $topLocation
    )
  }
`;
export const publishVideoOnPlan = /* GraphQL */ `
  mutation PublishVideoOnPlan(
    $project: String!
    $building: String!
    $area: String!
    $filePath: String!
    $leftLocation: Float!
    $topLocation: Float!
    $isVideo: Boolean
  ) {
    publishVideoOnPlan(
      project: $project
      building: $building
      area: $area
      filePath: $filePath
      leftLocation: $leftLocation
      topLocation: $topLocation
      isVideo: $isVideo
    )
  }
`;
export const updatePlanYaw = /* GraphQL */ `
  mutation UpdatePlanYaw($id: String!, $sceneId: String!, $planYaw: Float!) {
    updatePlanYaw(id: $id, sceneId: $sceneId, planYaw: $planYaw)
  }
`;
export const updatePlannedDate = /* GraphQL */ `
  mutation UpdatePlannedDate(
    $activity: String!
    $project: String!
    $building: String!
    $floor: String!
    $startDate: String!
    $endDate: String
  ) {
    updatePlannedDate(
      activity: $activity
      project: $project
      building: $building
      floor: $floor
      startDate: $startDate
      endDate: $endDate
    )
  }
`;
export const inviteUser = /* GraphQL */ `
  mutation InviteUser(
    $from: String!
    $email: String!
    $projectId: String!
    $projectName: String!
  ) {
    inviteUser(
      from: $from
      email: $email
      projectId: $projectId
      projectName: $projectName
    )
  }
`;
export const askQuestionOnProject = /* GraphQL */ `
  mutation AskQuestionOnProject(
    $username: String!
    $project: String!
    $prompt: String!
  ) {
    askQuestionOnProject(
      username: $username
      project: $project
      prompt: $prompt
    ) {
      answer
      imagesAnalysis {
        date
        imageKeys {
          floor
          wall1
          wall2
          wall3
          wall4
          ceiling
        }
        anchor
        top
        left
        matchingCriteria
        certainty
        explanation
      }
    }
  }
`;
export const createProject = /* GraphQL */ `
  mutation CreateProject(
    $input: CreateProjectInput!
    $condition: ModelProjectConditionInput
  ) {
    createProject(input: $input, condition: $condition) {
      id
      name
      description
      buildings {
        name
        floors {
          name
          areas {
            name
            infos {
              date
              plan
              tour
              sceneId
              scale
            }
            type
            hasMultiplePlans
          }
        }
      }
      imageURL
      owner
      architect
      contractor
      projectManagement
      activeProject
      defaultPlan
      createdAt
      updatedAt
    }
  }
`;
export const updateProject = /* GraphQL */ `
  mutation UpdateProject(
    $input: UpdateProjectInput!
    $condition: ModelProjectConditionInput
  ) {
    updateProject(input: $input, condition: $condition) {
      id
      name
      description
      buildings {
        name
        floors {
          name
          areas {
            name
            infos {
              date
              plan
              tour
              sceneId
              scale
            }
            type
            hasMultiplePlans
          }
        }
      }
      imageURL
      owner
      architect
      contractor
      projectManagement
      activeProject
      defaultPlan
      createdAt
      updatedAt
    }
  }
`;
export const deleteProject = /* GraphQL */ `
  mutation DeleteProject(
    $input: DeleteProjectInput!
    $condition: ModelProjectConditionInput
  ) {
    deleteProject(input: $input, condition: $condition) {
      id
      name
      description
      buildings {
        name
        floors {
          name
          areas {
            name
            infos {
              date
              plan
              tour
              sceneId
              scale
            }
            type
            hasMultiplePlans
          }
        }
      }
      imageURL
      owner
      architect
      contractor
      projectManagement
      activeProject
      defaultPlan
      createdAt
      updatedAt
    }
  }
`;
export const createActivityPlannedDates = /* GraphQL */ `
  mutation CreateActivityPlannedDates(
    $input: CreateActivityPlannedDatesInput!
    $condition: ModelActivityPlannedDatesConditionInput
  ) {
    createActivityPlannedDates(input: $input, condition: $condition) {
      id
      projectId
      startDates
      endDates
      createdAt
      updatedAt
    }
  }
`;
export const updateActivityPlannedDates = /* GraphQL */ `
  mutation UpdateActivityPlannedDates(
    $input: UpdateActivityPlannedDatesInput!
    $condition: ModelActivityPlannedDatesConditionInput
  ) {
    updateActivityPlannedDates(input: $input, condition: $condition) {
      id
      projectId
      startDates
      endDates
      createdAt
      updatedAt
    }
  }
`;
export const deleteActivityPlannedDates = /* GraphQL */ `
  mutation DeleteActivityPlannedDates(
    $input: DeleteActivityPlannedDatesInput!
    $condition: ModelActivityPlannedDatesConditionInput
  ) {
    deleteActivityPlannedDates(input: $input, condition: $condition) {
      id
      projectId
      startDates
      endDates
      createdAt
      updatedAt
    }
  }
`;
export const createProgressDelayedActivities = /* GraphQL */ `
  mutation CreateProgressDelayedActivities(
    $input: CreateProgressDelayedActivitiesInput!
    $condition: ModelProgressDelayedActivitiesConditionInput
  ) {
    createProgressDelayedActivities(input: $input, condition: $condition) {
      id
      delayedActivities {
        location
        probability
        reason
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateProgressDelayedActivities = /* GraphQL */ `
  mutation UpdateProgressDelayedActivities(
    $input: UpdateProgressDelayedActivitiesInput!
    $condition: ModelProgressDelayedActivitiesConditionInput
  ) {
    updateProgressDelayedActivities(input: $input, condition: $condition) {
      id
      delayedActivities {
        location
        probability
        reason
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteProgressDelayedActivities = /* GraphQL */ `
  mutation DeleteProgressDelayedActivities(
    $input: DeleteProgressDelayedActivitiesInput!
    $condition: ModelProgressDelayedActivitiesConditionInput
  ) {
    deleteProgressDelayedActivities(input: $input, condition: $condition) {
      id
      delayedActivities {
        location
        probability
        reason
      }
      createdAt
      updatedAt
    }
  }
`;
export const createProgress = /* GraphQL */ `
  mutation CreateProgress(
    $input: CreateProgressInput!
    $condition: ModelProgressConditionInput
  ) {
    createProgress(input: $input, condition: $condition) {
      id
      projectId
      date
      progressAreas {
        building
        floor
        anchor
        weight
        label
        invisible
        activities {
          activityName
          status
          previousStatus
          updater
          updateReason
          dateManuallyUpdated
        }
      }
      chunkId
      labels
      dod
      draft
      categories {
        name
        includes {
          name
          weight
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateProgress = /* GraphQL */ `
  mutation UpdateProgress(
    $input: UpdateProgressInput!
    $condition: ModelProgressConditionInput
  ) {
    updateProgress(input: $input, condition: $condition) {
      id
      projectId
      date
      progressAreas {
        building
        floor
        anchor
        weight
        label
        invisible
        activities {
          activityName
          status
          previousStatus
          updater
          updateReason
          dateManuallyUpdated
        }
      }
      chunkId
      labels
      dod
      draft
      categories {
        name
        includes {
          name
          weight
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteProgress = /* GraphQL */ `
  mutation DeleteProgress(
    $input: DeleteProgressInput!
    $condition: ModelProgressConditionInput
  ) {
    deleteProgress(input: $input, condition: $condition) {
      id
      projectId
      date
      progressAreas {
        building
        floor
        anchor
        weight
        label
        invisible
        activities {
          activityName
          status
          previousStatus
          updater
          updateReason
          dateManuallyUpdated
        }
      }
      chunkId
      labels
      dod
      draft
      categories {
        name
        includes {
          name
          weight
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const createPlanLinks = /* GraphQL */ `
  mutation CreatePlanLinks(
    $input: CreatePlanLinksInput!
    $condition: ModelPlanLinksConditionInput
  ) {
    createPlanLinks(input: $input, condition: $condition) {
      id
      tourDataUrl
      planUrls {
        url
        name
        id
      }
      linkLocations {
        sceneId
        sceneName
        planYaw
        leftLocation
        topLocation
        linkUrl
        isPhotoLink
        linkItemType
      }
      createdAt
      updatedAt
    }
  }
`;
export const updatePlanLinks = /* GraphQL */ `
  mutation UpdatePlanLinks(
    $input: UpdatePlanLinksInput!
    $condition: ModelPlanLinksConditionInput
  ) {
    updatePlanLinks(input: $input, condition: $condition) {
      id
      tourDataUrl
      planUrls {
        url
        name
        id
      }
      linkLocations {
        sceneId
        sceneName
        planYaw
        leftLocation
        topLocation
        linkUrl
        isPhotoLink
        linkItemType
      }
      createdAt
      updatedAt
    }
  }
`;
export const deletePlanLinks = /* GraphQL */ `
  mutation DeletePlanLinks(
    $input: DeletePlanLinksInput!
    $condition: ModelPlanLinksConditionInput
  ) {
    deletePlanLinks(input: $input, condition: $condition) {
      id
      tourDataUrl
      planUrls {
        url
        name
        id
      }
      linkLocations {
        sceneId
        sceneName
        planYaw
        leftLocation
        topLocation
        linkUrl
        isPhotoLink
        linkItemType
      }
      createdAt
      updatedAt
    }
  }
`;
export const createUserProfile = /* GraphQL */ `
  mutation CreateUserProfile(
    $input: CreateUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    createUserProfile(input: $input, condition: $condition) {
      id
      username
      email
      phoneNumber
      role
      unsubscribedToEmails
      isProgressAdmin
      progressEditor
      participatesInProjects
      createdAt
      updatedAt
    }
  }
`;
export const updateUserProfile = /* GraphQL */ `
  mutation UpdateUserProfile(
    $input: UpdateUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    updateUserProfile(input: $input, condition: $condition) {
      id
      username
      email
      phoneNumber
      role
      unsubscribedToEmails
      isProgressAdmin
      progressEditor
      participatesInProjects
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserProfile = /* GraphQL */ `
  mutation DeleteUserProfile(
    $input: DeleteUserProfileInput!
    $condition: ModelUserProfileConditionInput
  ) {
    deleteUserProfile(input: $input, condition: $condition) {
      id
      username
      email
      phoneNumber
      role
      unsubscribedToEmails
      isProgressAdmin
      progressEditor
      participatesInProjects
      createdAt
      updatedAt
    }
  }
`;
export const createPhotoTourPoints = /* GraphQL */ `
  mutation CreatePhotoTourPoints(
    $input: CreatePhotoTourPointsInput!
    $condition: ModelPhotoTourPointsConditionInput
  ) {
    createPhotoTourPoints(input: $input, condition: $condition) {
      id
      projectId
      building
      area
      filesPath
      date
      username
      registered
      photoRecords {
        leftLocation
        topLocation
        fileName
        needsManualRegistration
        label
      }
      createdAt
      updatedAt
    }
  }
`;
export const updatePhotoTourPoints = /* GraphQL */ `
  mutation UpdatePhotoTourPoints(
    $input: UpdatePhotoTourPointsInput!
    $condition: ModelPhotoTourPointsConditionInput
  ) {
    updatePhotoTourPoints(input: $input, condition: $condition) {
      id
      projectId
      building
      area
      filesPath
      date
      username
      registered
      photoRecords {
        leftLocation
        topLocation
        fileName
        needsManualRegistration
        label
      }
      createdAt
      updatedAt
    }
  }
`;
export const deletePhotoTourPoints = /* GraphQL */ `
  mutation DeletePhotoTourPoints(
    $input: DeletePhotoTourPointsInput!
    $condition: ModelPhotoTourPointsConditionInput
  ) {
    deletePhotoTourPoints(input: $input, condition: $condition) {
      id
      projectId
      building
      area
      filesPath
      date
      username
      registered
      photoRecords {
        leftLocation
        topLocation
        fileName
        needsManualRegistration
        label
      }
      createdAt
      updatedAt
    }
  }
`;
export const createPlanAnchors = /* GraphQL */ `
  mutation CreatePlanAnchors(
    $input: CreatePlanAnchorsInput!
    $condition: ModelPlanAnchorsConditionInput
  ) {
    createPlanAnchors(input: $input, condition: $condition) {
      id
      photoRecords {
        leftLocation
        topLocation
        fileName
        needsManualRegistration
        label
      }
      createdAt
      updatedAt
    }
  }
`;
export const updatePlanAnchors = /* GraphQL */ `
  mutation UpdatePlanAnchors(
    $input: UpdatePlanAnchorsInput!
    $condition: ModelPlanAnchorsConditionInput
  ) {
    updatePlanAnchors(input: $input, condition: $condition) {
      id
      photoRecords {
        leftLocation
        topLocation
        fileName
        needsManualRegistration
        label
      }
      createdAt
      updatedAt
    }
  }
`;
export const deletePlanAnchors = /* GraphQL */ `
  mutation DeletePlanAnchors(
    $input: DeletePlanAnchorsInput!
    $condition: ModelPlanAnchorsConditionInput
  ) {
    deletePlanAnchors(input: $input, condition: $condition) {
      id
      photoRecords {
        leftLocation
        topLocation
        fileName
        needsManualRegistration
        label
      }
      createdAt
      updatedAt
    }
  }
`;
export const createTourToken = /* GraphQL */ `
  mutation CreateTourToken(
    $input: CreateTourTokenInput!
    $condition: ModelTourTokenConditionInput
  ) {
    createTourToken(input: $input, condition: $condition) {
      id
      token
      createdAt
      updatedAt
    }
  }
`;
export const updateTourToken = /* GraphQL */ `
  mutation UpdateTourToken(
    $input: UpdateTourTokenInput!
    $condition: ModelTourTokenConditionInput
  ) {
    updateTourToken(input: $input, condition: $condition) {
      id
      token
      createdAt
      updatedAt
    }
  }
`;
export const deleteTourToken = /* GraphQL */ `
  mutation DeleteTourToken(
    $input: DeleteTourTokenInput!
    $condition: ModelTourTokenConditionInput
  ) {
    deleteTourToken(input: $input, condition: $condition) {
      id
      token
      createdAt
      updatedAt
    }
  }
`;
export const createProjectInvitation = /* GraphQL */ `
  mutation CreateProjectInvitation(
    $input: CreateProjectInvitationInput!
    $condition: ModelProjectInvitationConditionInput
  ) {
    createProjectInvitation(input: $input, condition: $condition) {
      id
      fromUserName
      inviteAddress
      token
      projectId
      createdAt
      updatedAt
    }
  }
`;
export const updateProjectInvitation = /* GraphQL */ `
  mutation UpdateProjectInvitation(
    $input: UpdateProjectInvitationInput!
    $condition: ModelProjectInvitationConditionInput
  ) {
    updateProjectInvitation(input: $input, condition: $condition) {
      id
      fromUserName
      inviteAddress
      token
      projectId
      createdAt
      updatedAt
    }
  }
`;
export const deleteProjectInvitation = /* GraphQL */ `
  mutation DeleteProjectInvitation(
    $input: DeleteProjectInvitationInput!
    $condition: ModelProjectInvitationConditionInput
  ) {
    deleteProjectInvitation(input: $input, condition: $condition) {
      id
      fromUserName
      inviteAddress
      token
      projectId
      createdAt
      updatedAt
    }
  }
`;
export const createPlanBimMatching = /* GraphQL */ `
  mutation CreatePlanBimMatching(
    $input: CreatePlanBimMatchingInput!
    $condition: ModelPlanBimMatchingConditionInput
  ) {
    createPlanBimMatching(input: $input, condition: $condition) {
      id
      planUrl
      bimUrl
      record {
        recordDate
        building
        floor
        planUrl
        leftLocation
        topLocation
        username
      }
      viewport {
        name
        eye
        target
        up
        worldUpVector
        pivotPoint
        distanceToOrbit
        aspectRatio
        projection
        isOrthographic
        fieldOfView
      }
      createdAt
      updatedAt
    }
  }
`;
export const updatePlanBimMatching = /* GraphQL */ `
  mutation UpdatePlanBimMatching(
    $input: UpdatePlanBimMatchingInput!
    $condition: ModelPlanBimMatchingConditionInput
  ) {
    updatePlanBimMatching(input: $input, condition: $condition) {
      id
      planUrl
      bimUrl
      record {
        recordDate
        building
        floor
        planUrl
        leftLocation
        topLocation
        username
      }
      viewport {
        name
        eye
        target
        up
        worldUpVector
        pivotPoint
        distanceToOrbit
        aspectRatio
        projection
        isOrthographic
        fieldOfView
      }
      createdAt
      updatedAt
    }
  }
`;
export const deletePlanBimMatching = /* GraphQL */ `
  mutation DeletePlanBimMatching(
    $input: DeletePlanBimMatchingInput!
    $condition: ModelPlanBimMatchingConditionInput
  ) {
    deletePlanBimMatching(input: $input, condition: $condition) {
      id
      planUrl
      bimUrl
      record {
        recordDate
        building
        floor
        planUrl
        leftLocation
        topLocation
        username
      }
      viewport {
        name
        eye
        target
        up
        worldUpVector
        pivotPoint
        distanceToOrbit
        aspectRatio
        projection
        isOrthographic
        fieldOfView
      }
      createdAt
      updatedAt
    }
  }
`;
export const createPlanBimTransformation = /* GraphQL */ `
  mutation CreatePlanBimTransformation(
    $input: CreatePlanBimTransformationInput!
    $condition: ModelPlanBimTransformationConditionInput
  ) {
    createPlanBimTransformation(input: $input, condition: $condition) {
      id
      bimUrl
      transformationMatrix
      bimUp2CastoryUpRotationMatrix
      inverseMatchMatrix
      floorUpVec
      northVec
      eastVec
      viewport {
        name
        eye
        target
        up
        worldUpVector
        pivotPoint
        distanceToOrbit
        aspectRatio
        projection
        isOrthographic
        fieldOfView
      }
      preventFirstPerson
      createdAt
      updatedAt
    }
  }
`;
export const updatePlanBimTransformation = /* GraphQL */ `
  mutation UpdatePlanBimTransformation(
    $input: UpdatePlanBimTransformationInput!
    $condition: ModelPlanBimTransformationConditionInput
  ) {
    updatePlanBimTransformation(input: $input, condition: $condition) {
      id
      bimUrl
      transformationMatrix
      bimUp2CastoryUpRotationMatrix
      inverseMatchMatrix
      floorUpVec
      northVec
      eastVec
      viewport {
        name
        eye
        target
        up
        worldUpVector
        pivotPoint
        distanceToOrbit
        aspectRatio
        projection
        isOrthographic
        fieldOfView
      }
      preventFirstPerson
      createdAt
      updatedAt
    }
  }
`;
export const deletePlanBimTransformation = /* GraphQL */ `
  mutation DeletePlanBimTransformation(
    $input: DeletePlanBimTransformationInput!
    $condition: ModelPlanBimTransformationConditionInput
  ) {
    deletePlanBimTransformation(input: $input, condition: $condition) {
      id
      bimUrl
      transformationMatrix
      bimUp2CastoryUpRotationMatrix
      inverseMatchMatrix
      floorUpVec
      northVec
      eastVec
      viewport {
        name
        eye
        target
        up
        worldUpVector
        pivotPoint
        distanceToOrbit
        aspectRatio
        projection
        isOrthographic
        fieldOfView
      }
      preventFirstPerson
      createdAt
      updatedAt
    }
  }
`;
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
      id
      dataUrl
      scene {
        sceneId
        yaw
        pitch
        fov
      }
      title
      role
      mail
      projectId
      description
      writtenBy
      replies {
        reply
        writtenBy
        date
        role
        mail
        fileName
      }
      resolved
      record {
        recordDate
        building
        floor
        planUrl
        leftLocation
        topLocation
        username
      }
      issueTypes
      customIssueTypes
      assignees
      progress
      dueDate
      createdAt
      updatedAt
    }
  }
`;
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
      id
      dataUrl
      scene {
        sceneId
        yaw
        pitch
        fov
      }
      title
      role
      mail
      projectId
      description
      writtenBy
      replies {
        reply
        writtenBy
        date
        role
        mail
        fileName
      }
      resolved
      record {
        recordDate
        building
        floor
        planUrl
        leftLocation
        topLocation
        username
      }
      issueTypes
      customIssueTypes
      assignees
      progress
      dueDate
      createdAt
      updatedAt
    }
  }
`;
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
      id
      dataUrl
      scene {
        sceneId
        yaw
        pitch
        fov
      }
      title
      role
      mail
      projectId
      description
      writtenBy
      replies {
        reply
        writtenBy
        date
        role
        mail
        fileName
      }
      resolved
      record {
        recordDate
        building
        floor
        planUrl
        leftLocation
        topLocation
        username
      }
      issueTypes
      customIssueTypes
      assignees
      progress
      dueDate
      createdAt
      updatedAt
    }
  }
`;
export const createUserLink = /* GraphQL */ `
  mutation CreateUserLink(
    $input: CreateUserLinkInput!
    $condition: ModelUserLinkConditionInput
  ) {
    createUserLink(input: $input, condition: $condition) {
      id
      dataUrl
      scene {
        sceneId
        yaw
        pitch
        fov
      }
      targetYaw
      targetPitch
      linkFrom
      linkTo
      rotation
      createdAt
      updatedAt
    }
  }
`;
export const updateUserLink = /* GraphQL */ `
  mutation UpdateUserLink(
    $input: UpdateUserLinkInput!
    $condition: ModelUserLinkConditionInput
  ) {
    updateUserLink(input: $input, condition: $condition) {
      id
      dataUrl
      scene {
        sceneId
        yaw
        pitch
        fov
      }
      targetYaw
      targetPitch
      linkFrom
      linkTo
      rotation
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserLink = /* GraphQL */ `
  mutation DeleteUserLink(
    $input: DeleteUserLinkInput!
    $condition: ModelUserLinkConditionInput
  ) {
    deleteUserLink(input: $input, condition: $condition) {
      id
      dataUrl
      scene {
        sceneId
        yaw
        pitch
        fov
      }
      targetYaw
      targetPitch
      linkFrom
      linkTo
      rotation
      createdAt
      updatedAt
    }
  }
`;
export const createUserSceneName = /* GraphQL */ `
  mutation CreateUserSceneName(
    $input: CreateUserSceneNameInput!
    $condition: ModelUserSceneNameConditionInput
  ) {
    createUserSceneName(input: $input, condition: $condition) {
      id
      dataUrl
      sceneId
      sceneName
      createdAt
      updatedAt
    }
  }
`;
export const updateUserSceneName = /* GraphQL */ `
  mutation UpdateUserSceneName(
    $input: UpdateUserSceneNameInput!
    $condition: ModelUserSceneNameConditionInput
  ) {
    updateUserSceneName(input: $input, condition: $condition) {
      id
      dataUrl
      sceneId
      sceneName
      createdAt
      updatedAt
    }
  }
`;
export const deleteUserSceneName = /* GraphQL */ `
  mutation DeleteUserSceneName(
    $input: DeleteUserSceneNameInput!
    $condition: ModelUserSceneNameConditionInput
  ) {
    deleteUserSceneName(input: $input, condition: $condition) {
      id
      dataUrl
      sceneId
      sceneName
      createdAt
      updatedAt
    }
  }
`;
export const createChatMessage = /* GraphQL */ `
  mutation CreateChatMessage(
    $input: CreateChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    createChatMessage(input: $input, condition: $condition) {
      id
      username
      text
      project
      isAnswer
      analysis {
        date
        imageKeys {
          floor
          wall1
          wall2
          wall3
          wall4
          ceiling
        }
        anchor
        top
        left
        matchingCriteria
        certainty
        explanation
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateChatMessage = /* GraphQL */ `
  mutation UpdateChatMessage(
    $input: UpdateChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    updateChatMessage(input: $input, condition: $condition) {
      id
      username
      text
      project
      isAnswer
      analysis {
        date
        imageKeys {
          floor
          wall1
          wall2
          wall3
          wall4
          ceiling
        }
        anchor
        top
        left
        matchingCriteria
        certainty
        explanation
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteChatMessage = /* GraphQL */ `
  mutation DeleteChatMessage(
    $input: DeleteChatMessageInput!
    $condition: ModelChatMessageConditionInput
  ) {
    deleteChatMessage(input: $input, condition: $condition) {
      id
      username
      text
      project
      isAnswer
      analysis {
        date
        imageKeys {
          floor
          wall1
          wall2
          wall3
          wall4
          ceiling
        }
        anchor
        top
        left
        matchingCriteria
        certainty
        explanation
      }
      createdAt
      updatedAt
    }
  }
`;
export const createPlanInitialPoint = /* GraphQL */ `
  mutation CreatePlanInitialPoint(
    $input: CreatePlanInitialPointInput!
    $condition: ModelPlanInitialPointConditionInput
  ) {
    createPlanInitialPoint(input: $input, condition: $condition) {
      id
      matched
      scanRecords {
        recordDate
        building
        floor
        planUrl
        leftLocation
        topLocation
        username
      }
      createdAt
      updatedAt
    }
  }
`;
export const updatePlanInitialPoint = /* GraphQL */ `
  mutation UpdatePlanInitialPoint(
    $input: UpdatePlanInitialPointInput!
    $condition: ModelPlanInitialPointConditionInput
  ) {
    updatePlanInitialPoint(input: $input, condition: $condition) {
      id
      matched
      scanRecords {
        recordDate
        building
        floor
        planUrl
        leftLocation
        topLocation
        username
      }
      createdAt
      updatedAt
    }
  }
`;
export const deletePlanInitialPoint = /* GraphQL */ `
  mutation DeletePlanInitialPoint(
    $input: DeletePlanInitialPointInput!
    $condition: ModelPlanInitialPointConditionInput
  ) {
    deletePlanInitialPoint(input: $input, condition: $condition) {
      id
      matched
      scanRecords {
        recordDate
        building
        floor
        planUrl
        leftLocation
        topLocation
        username
      }
      createdAt
      updatedAt
    }
  }
`;
export const sendEmail = /* GraphQL */ `
  mutation SendEmail(
    $to: [String]!
    $text: String!
    $link: String!
    $subject: String!
    $templateType: String!
  ) {
    sendEmail(
      to: $to
      text: $text
      link: $link
      subject: $subject
      templateType: $templateType
    )
  }
`;
export const sendExponetTask = /* GraphQL */ `
  mutation SendExponetTask(
    $taskId: String!
    $project: String!
    $send: Boolean
    $deleted: Boolean
  ) {
    sendExponetTask(
      taskId: $taskId
      project: $project
      send: $send
      deleted: $deleted
    )
  }
`;
export const syncUserLinks = /* GraphQL */ `
  mutation SyncUserLinks($linkId: String!) {
    syncUserLinks(linkId: $linkId)
  }
`;
export const syncNonLocatedComment = /* GraphQL */ `
  mutation SyncNonLocatedComment($id: String!) {
    syncNonLocatedComment(id: $id)
  }
`;
