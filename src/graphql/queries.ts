/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getExtendedProfile = /* GraphQL */ `
  query GetExtendedProfile($username: String!) {
    getExtendedProfile(username: $username) {
      userProfile {
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
      projects {
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
  }
`;
export const dataUsage = /* GraphQL */ `
  query DataUsage($project: String!) {
    dataUsage(project: $project)
  }
`;
export const getActivityProgress = /* GraphQL */ `
  query GetActivityProgress(
    $project: String!
    $building: String!
    $floor: String!
    $activity: String!
    $label: String
  ) {
    getActivityProgress(
      project: $project
      building: $building
      floor: $floor
      activity: $activity
      label: $label
    ) {
      date
      progress
    }
  }
`;
export const fetchActivityPlannedDates = /* GraphQL */ `
  query FetchActivityPlannedDates(
    $activity: String!
    $project: String!
    $building: String
    $floor: String
  ) {
    fetchActivityPlannedDates(
      activity: $activity
      project: $project
      building: $building
      floor: $floor
    ) {
      activity
      plannedDates {
        building
        floor
        startDate
        endDate
      }
    }
  }
`;
export const getProgressActivityNames = /* GraphQL */ `
  query GetProgressActivityNames($project: String!) {
    getProgressActivityNames(project: $project)
  }
`;
export const getProgressMsTasks = /* GraphQL */ `
  query GetProgressMsTasks($project: String!) {
    getProgressMsTasks(project: $project) {
      id
      tasks {
        duration
        finish
        guid
        name
        predecessor
        start
        successor
        totalSlack
        wbs
      }
      projectId
      lastUpdated
    }
  }
`;
export const validateFileInLocation = /* GraphQL */ `
  query ValidateFileInLocation($fileName: String!, $bucketLocation: String!) {
    validateFileInLocation(fileName: $fileName, bucketLocation: $bucketLocation)
  }
`;
export const getActivityPlannedDates = /* GraphQL */ `
  query GetActivityPlannedDates($id: ID!) {
    getActivityPlannedDates(id: $id) {
      id
      projectId
      startDates
      endDates
      createdAt
      updatedAt
    }
  }
`;
export const listActivityPlannedDatess = /* GraphQL */ `
  query ListActivityPlannedDatess(
    $filter: ModelActivityPlannedDatesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listActivityPlannedDatess(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        projectId
        startDates
        endDates
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProgressDelayedActivities = /* GraphQL */ `
  query GetProgressDelayedActivities($id: ID!) {
    getProgressDelayedActivities(id: $id) {
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
export const listProgressDelayedActivitiess = /* GraphQL */ `
  query ListProgressDelayedActivitiess(
    $filter: ModelProgressDelayedActivitiesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProgressDelayedActivitiess(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        delayedActivities {
          location
          probability
          reason
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProgress = /* GraphQL */ `
  query GetProgress($id: ID!) {
    getProgress(id: $id) {
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
export const listProgresss = /* GraphQL */ `
  query ListProgresss(
    $filter: ModelProgressFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProgresss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getUserProfile = /* GraphQL */ `
  query GetUserProfile($id: ID!) {
    getUserProfile(id: $id) {
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
export const listUserProfiles = /* GraphQL */ `
  query ListUserProfiles(
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserProfiles(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getPhotoTourPoints = /* GraphQL */ `
  query GetPhotoTourPoints($id: ID!) {
    getPhotoTourPoints(id: $id) {
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
export const listPhotoTourPointss = /* GraphQL */ `
  query ListPhotoTourPointss(
    $filter: ModelPhotoTourPointsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPhotoTourPointss(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getPlanAnchors = /* GraphQL */ `
  query GetPlanAnchors($id: ID!) {
    getPlanAnchors(id: $id) {
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
export const listPlanAnchorss = /* GraphQL */ `
  query ListPlanAnchorss(
    $filter: ModelPlanAnchorsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlanAnchorss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getProjectInvitation = /* GraphQL */ `
  query GetProjectInvitation($id: ID!) {
    getProjectInvitation(id: $id) {
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
export const listProjectInvitations = /* GraphQL */ `
  query ListProjectInvitations(
    $filter: ModelProjectInvitationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProjectInvitations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        fromUserName
        inviteAddress
        token
        projectId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPlanBimMatching = /* GraphQL */ `
  query GetPlanBimMatching($id: ID!) {
    getPlanBimMatching(id: $id) {
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
export const listPlanBimMatchings = /* GraphQL */ `
  query ListPlanBimMatchings(
    $filter: ModelPlanBimMatchingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlanBimMatchings(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getPlanBimTransformation = /* GraphQL */ `
  query GetPlanBimTransformation($id: ID!) {
    getPlanBimTransformation(id: $id) {
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
export const listPlanBimTransformations = /* GraphQL */ `
  query ListPlanBimTransformations(
    $filter: ModelPlanBimTransformationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlanBimTransformations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const plannedDatesByProjectId = /* GraphQL */ `
  query PlannedDatesByProjectId(
    $projectId: String
    $sortDirection: ModelSortDirection
    $filter: ModelActivityPlannedDatesFilterInput
    $limit: Int
    $nextToken: String
  ) {
    plannedDatesByProjectId(
      projectId: $projectId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        projectId
        startDates
        endDates
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const progressByProjectId = /* GraphQL */ `
  query ProgressByProjectId(
    $projectId: String
    $sortDirection: ModelSortDirection
    $filter: ModelProgressFilterInput
    $limit: Int
    $nextToken: String
  ) {
    progressByProjectId(
      projectId: $projectId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const userProfileByName = /* GraphQL */ `
  query UserProfileByName(
    $username: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserProfileFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userProfileByName(
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const projectInvitationByToken = /* GraphQL */ `
  query ProjectInvitationByToken(
    $token: String
    $sortDirection: ModelSortDirection
    $filter: ModelProjectInvitationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    projectInvitationByToken(
      token: $token
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        fromUserName
        inviteAddress
        token
        projectId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const planBimMatchingByPlanUrl = /* GraphQL */ `
  query PlanBimMatchingByPlanUrl(
    $planUrl: String
    $sortDirection: ModelSortDirection
    $filter: ModelPlanBimMatchingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    planBimMatchingByPlanUrl(
      planUrl: $planUrl
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getProject = /* GraphQL */ `
  query GetProject($id: ID!) {
    getProject(id: $id) {
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
export const listProjects = /* GraphQL */ `
  query ListProjects(
    $filter: ModelProjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
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
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const commentsByDataUrl = /* GraphQL */ `
  query CommentsByDataUrl(
    $dataUrl: String
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsByDataUrl(
      dataUrl: $dataUrl
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const commentsByProjectId = /* GraphQL */ `
  query CommentsByProjectId(
    $projectId: String
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsByProjectId(
      projectId: $projectId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getUserLink = /* GraphQL */ `
  query GetUserLink($id: ID!) {
    getUserLink(id: $id) {
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
export const listUserLinks = /* GraphQL */ `
  query ListUserLinks(
    $filter: ModelUserLinkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserLinks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const userLinksByDataUrl = /* GraphQL */ `
  query UserLinksByDataUrl(
    $dataUrl: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserLinkFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userLinksByDataUrl(
      dataUrl: $dataUrl
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getUserSceneName = /* GraphQL */ `
  query GetUserSceneName($id: ID!) {
    getUserSceneName(id: $id) {
      id
      dataUrl
      sceneId
      sceneName
      createdAt
      updatedAt
    }
  }
`;
export const listUserSceneNames = /* GraphQL */ `
  query ListUserSceneNames(
    $filter: ModelUserSceneNameFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUserSceneNames(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        dataUrl
        sceneId
        sceneName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const userScenesByDataUrl = /* GraphQL */ `
  query UserScenesByDataUrl(
    $dataUrl: String
    $sortDirection: ModelSortDirection
    $filter: ModelUserSceneNameFilterInput
    $limit: Int
    $nextToken: String
  ) {
    userScenesByDataUrl(
      dataUrl: $dataUrl
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        dataUrl
        sceneId
        sceneName
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPlanLinks = /* GraphQL */ `
  query GetPlanLinks($id: ID!) {
    getPlanLinks(id: $id) {
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
export const listPlanLinkss = /* GraphQL */ `
  query ListPlanLinkss(
    $filter: ModelPlanLinksFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlanLinkss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getChatMessage = /* GraphQL */ `
  query GetChatMessage($id: ID!) {
    getChatMessage(id: $id) {
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
export const listChatMessages = /* GraphQL */ `
  query ListChatMessages(
    $filter: ModelChatMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const chatMessagesByUsername = /* GraphQL */ `
  query ChatMessagesByUsername(
    $username: String
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelChatMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    chatMessagesByUsername(
      username: $username
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getPlanInitialPoint = /* GraphQL */ `
  query GetPlanInitialPoint($id: ID!) {
    getPlanInitialPoint(id: $id) {
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
export const listPlanInitialPoints = /* GraphQL */ `
  query ListPlanInitialPoints(
    $filter: ModelPlanInitialPointFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlanInitialPoints(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const getTourToken = /* GraphQL */ `
  query GetTourToken($id: ID!) {
    getTourToken(id: $id) {
      id
      token
      createdAt
      updatedAt
    }
  }
`;
export const listTourTokens = /* GraphQL */ `
  query ListTourTokens(
    $filter: ModelTourTokenFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTourTokens(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        token
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const fetchPlanLinks = /* GraphQL */ `
  query FetchPlanLinks($planUrl: String, $date: String, $planId: Int) {
    fetchPlanLinks(planUrl: $planUrl, date: $date, planId: $planId) {
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
export const nearestScene = /* GraphQL */ `
  query NearestScene(
    $originalTourPlanLinksId: String
    $originalSceneId: String
    $otherTourPlanLinksId: String
    $originalYaw: Float
  ) {
    nearestScene(
      originalTourPlanLinksId: $originalTourPlanLinksId
      originalSceneId: $originalSceneId
      otherTourPlanLinksId: $otherTourPlanLinksId
      originalYaw: $originalYaw
    ) {
      sceneId
      yaw
    }
  }
`;
export const planLinkByAnchor = /* GraphQL */ `
  query PlanLinkByAnchor($planUrl: String, $anchorId: Float, $maxDate: String) {
    planLinkByAnchor(
      planUrl: $planUrl
      anchorId: $anchorId
      maxDate: $maxDate
    ) {
      date
      linkId
    }
  }
`;
export const lastPlanTour = /* GraphQL */ `
  query LastPlanTour(
    $project: String!
    $building: String!
    $area: String!
    $type: String!
  ) {
    lastPlanTour(
      project: $project
      building: $building
      area: $area
      type: $type
    ) {
      date
      plan
      tour
      sceneId
      scale
    }
  }
`;
