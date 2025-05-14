/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onChatMessageByUsername = /* GraphQL */ `
  subscription OnChatMessageByUsername($username: String!) {
    onChatMessageByUsername(username: $username) {
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
export const onCreateActivityPlannedDates = /* GraphQL */ `
  subscription OnCreateActivityPlannedDates {
    onCreateActivityPlannedDates {
      id
      projectId
      startDates
      endDates
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateActivityPlannedDates = /* GraphQL */ `
  subscription OnUpdateActivityPlannedDates {
    onUpdateActivityPlannedDates {
      id
      projectId
      startDates
      endDates
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteActivityPlannedDates = /* GraphQL */ `
  subscription OnDeleteActivityPlannedDates {
    onDeleteActivityPlannedDates {
      id
      projectId
      startDates
      endDates
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProgressDelayedActivities = /* GraphQL */ `
  subscription OnCreateProgressDelayedActivities {
    onCreateProgressDelayedActivities {
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
export const onUpdateProgressDelayedActivities = /* GraphQL */ `
  subscription OnUpdateProgressDelayedActivities {
    onUpdateProgressDelayedActivities {
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
export const onDeleteProgressDelayedActivities = /* GraphQL */ `
  subscription OnDeleteProgressDelayedActivities {
    onDeleteProgressDelayedActivities {
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
export const onCreateProgress = /* GraphQL */ `
  subscription OnCreateProgress {
    onCreateProgress {
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
export const onUpdateProgress = /* GraphQL */ `
  subscription OnUpdateProgress {
    onUpdateProgress {
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
export const onDeleteProgress = /* GraphQL */ `
  subscription OnDeleteProgress {
    onDeleteProgress {
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
export const onCreateUserProfile = /* GraphQL */ `
  subscription OnCreateUserProfile {
    onCreateUserProfile {
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
export const onUpdateUserProfile = /* GraphQL */ `
  subscription OnUpdateUserProfile {
    onUpdateUserProfile {
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
export const onDeleteUserProfile = /* GraphQL */ `
  subscription OnDeleteUserProfile {
    onDeleteUserProfile {
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
export const onCreatePhotoTourPoints = /* GraphQL */ `
  subscription OnCreatePhotoTourPoints {
    onCreatePhotoTourPoints {
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
export const onUpdatePhotoTourPoints = /* GraphQL */ `
  subscription OnUpdatePhotoTourPoints {
    onUpdatePhotoTourPoints {
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
export const onDeletePhotoTourPoints = /* GraphQL */ `
  subscription OnDeletePhotoTourPoints {
    onDeletePhotoTourPoints {
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
export const onCreatePlanAnchors = /* GraphQL */ `
  subscription OnCreatePlanAnchors {
    onCreatePlanAnchors {
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
export const onUpdatePlanAnchors = /* GraphQL */ `
  subscription OnUpdatePlanAnchors {
    onUpdatePlanAnchors {
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
export const onDeletePlanAnchors = /* GraphQL */ `
  subscription OnDeletePlanAnchors {
    onDeletePlanAnchors {
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
export const onCreateProjectInvitation = /* GraphQL */ `
  subscription OnCreateProjectInvitation {
    onCreateProjectInvitation {
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
export const onUpdateProjectInvitation = /* GraphQL */ `
  subscription OnUpdateProjectInvitation {
    onUpdateProjectInvitation {
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
export const onDeleteProjectInvitation = /* GraphQL */ `
  subscription OnDeleteProjectInvitation {
    onDeleteProjectInvitation {
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
export const onCreatePlanBimMatching = /* GraphQL */ `
  subscription OnCreatePlanBimMatching {
    onCreatePlanBimMatching {
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
export const onUpdatePlanBimMatching = /* GraphQL */ `
  subscription OnUpdatePlanBimMatching {
    onUpdatePlanBimMatching {
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
export const onDeletePlanBimMatching = /* GraphQL */ `
  subscription OnDeletePlanBimMatching {
    onDeletePlanBimMatching {
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
export const onCreatePlanBimTransformation = /* GraphQL */ `
  subscription OnCreatePlanBimTransformation {
    onCreatePlanBimTransformation {
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
export const onUpdatePlanBimTransformation = /* GraphQL */ `
  subscription OnUpdatePlanBimTransformation {
    onUpdatePlanBimTransformation {
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
export const onDeletePlanBimTransformation = /* GraphQL */ `
  subscription OnDeletePlanBimTransformation {
    onDeletePlanBimTransformation {
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
export const onCreateProject = /* GraphQL */ `
  subscription OnCreateProject {
    onCreateProject {
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
export const onUpdateProject = /* GraphQL */ `
  subscription OnUpdateProject {
    onUpdateProject {
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
export const onDeleteProject = /* GraphQL */ `
  subscription OnDeleteProject {
    onDeleteProject {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
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
export const onCreateUserLink = /* GraphQL */ `
  subscription OnCreateUserLink {
    onCreateUserLink {
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
export const onUpdateUserLink = /* GraphQL */ `
  subscription OnUpdateUserLink {
    onUpdateUserLink {
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
export const onDeleteUserLink = /* GraphQL */ `
  subscription OnDeleteUserLink {
    onDeleteUserLink {
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
export const onCreateUserSceneName = /* GraphQL */ `
  subscription OnCreateUserSceneName {
    onCreateUserSceneName {
      id
      dataUrl
      sceneId
      sceneName
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUserSceneName = /* GraphQL */ `
  subscription OnUpdateUserSceneName {
    onUpdateUserSceneName {
      id
      dataUrl
      sceneId
      sceneName
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUserSceneName = /* GraphQL */ `
  subscription OnDeleteUserSceneName {
    onDeleteUserSceneName {
      id
      dataUrl
      sceneId
      sceneName
      createdAt
      updatedAt
    }
  }
`;
export const onCreatePlanLinks = /* GraphQL */ `
  subscription OnCreatePlanLinks {
    onCreatePlanLinks {
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
export const onUpdatePlanLinks = /* GraphQL */ `
  subscription OnUpdatePlanLinks {
    onUpdatePlanLinks {
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
export const onDeletePlanLinks = /* GraphQL */ `
  subscription OnDeletePlanLinks {
    onDeletePlanLinks {
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
export const onCreateChatMessage = /* GraphQL */ `
  subscription OnCreateChatMessage {
    onCreateChatMessage {
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
export const onUpdateChatMessage = /* GraphQL */ `
  subscription OnUpdateChatMessage {
    onUpdateChatMessage {
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
export const onDeleteChatMessage = /* GraphQL */ `
  subscription OnDeleteChatMessage {
    onDeleteChatMessage {
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
export const onCreatePlanInitialPoint = /* GraphQL */ `
  subscription OnCreatePlanInitialPoint {
    onCreatePlanInitialPoint {
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
export const onUpdatePlanInitialPoint = /* GraphQL */ `
  subscription OnUpdatePlanInitialPoint {
    onUpdatePlanInitialPoint {
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
export const onDeletePlanInitialPoint = /* GraphQL */ `
  subscription OnDeletePlanInitialPoint {
    onDeletePlanInitialPoint {
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
export const onCreateTourToken = /* GraphQL */ `
  subscription OnCreateTourToken {
    onCreateTourToken {
      id
      token
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateTourToken = /* GraphQL */ `
  subscription OnUpdateTourToken {
    onUpdateTourToken {
      id
      token
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteTourToken = /* GraphQL */ `
  subscription OnDeleteTourToken {
    onDeleteTourToken {
      id
      token
      createdAt
      updatedAt
    }
  }
`;
