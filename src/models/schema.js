export const schema = {
    "models": {
        "PlanLinks": {
            "name": "PlanLinks",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tourDataUrl": {
                    "name": "tourDataUrl",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "planUrls": {
                    "name": "planUrls",
                    "isArray": true,
                    "type": {
                        "nonModel": "PlanUrl"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "linkLocations": {
                    "name": "linkLocations",
                    "isArray": true,
                    "type": {
                        "nonModel": "LinkDetails"
                    },
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "PlanLinks",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            },
                            {
                                "allow": "public",
                                "operations": [
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "UserProfile": {
            "name": "UserProfile",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "username": {
                    "name": "username",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "email": {
                    "name": "email",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "phoneNumber": {
                    "name": "phoneNumber",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "role": {
                    "name": "role",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "unsubscribedToEmails": {
                    "name": "unsubscribedToEmails",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "isProgressAdmin": {
                    "name": "isProgressAdmin",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "progressEditor": {
                    "name": "progressEditor",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "participatesInProjects": {
                    "name": "participatesInProjects",
                    "isArray": true,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "UserProfiles",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "usernameIndex",
                        "fields": [
                            "username"
                        ],
                        "queryField": "userProfileByName"
                    }
                }
            ]
        },
        "Project": {
            "name": "Project",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "buildings": {
                    "name": "buildings",
                    "isArray": true,
                    "type": {
                        "nonModel": "Building"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "imageURL": {
                    "name": "imageURL",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "owner": {
                    "name": "owner",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "architect": {
                    "name": "architect",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "contractor": {
                    "name": "contractor",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "projectManagement": {
                    "name": "projectManagement",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "activeProject": {
                    "name": "activeProject",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": true,
                    "attributes": []
                },
                "defaultPlan": {
                    "name": "defaultPlan",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Projects",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            },
                            {
                                "allow": "public",
                                "operations": [
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "ChatMessage": {
            "name": "ChatMessage",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "username": {
                    "name": "username",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "text": {
                    "name": "text",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "project": {
                    "name": "project",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "isAnswer": {
                    "name": "isAnswer",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "analysis": {
                    "name": "analysis",
                    "isArray": true,
                    "type": {
                        "nonModel": "ImagesAnalysisResponse"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "createdAt": {
                    "name": "createdAt",
                    "isArray": false,
                    "type": "AWSDateTime",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "ChatMessages",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "usernameIndex",
                        "fields": [
                            "username",
                            "createdAt"
                        ],
                        "queryField": "chatMessagesByUsername"
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "Comment": {
            "name": "Comment",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "dataUrl": {
                    "name": "dataUrl",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "scene": {
                    "name": "scene",
                    "isArray": false,
                    "type": {
                        "nonModel": "Scene"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "title": {
                    "name": "title",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "role": {
                    "name": "role",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "mail": {
                    "name": "mail",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "projectId": {
                    "name": "projectId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "description": {
                    "name": "description",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "writtenBy": {
                    "name": "writtenBy",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "replies": {
                    "name": "replies",
                    "isArray": true,
                    "type": {
                        "nonModel": "CommentReply"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "resolved": {
                    "name": "resolved",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "record": {
                    "name": "record",
                    "isArray": false,
                    "type": {
                        "nonModel": "ScanRecord"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "issueTypes": {
                    "name": "issueTypes",
                    "isArray": true,
                    "type": {
                        "enum": "IssueTypeEnum"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "customIssueTypes": {
                    "name": "customIssueTypes",
                    "isArray": true,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "assignees": {
                    "name": "assignees",
                    "isArray": true,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "progress": {
                    "name": "progress",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "dueDate": {
                    "name": "dueDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Comments",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "dataUrlIndex",
                        "fields": [
                            "dataUrl"
                        ],
                        "queryField": "commentsByDataUrl"
                    }
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "projectIdIndex",
                        "fields": [
                            "projectId"
                        ],
                        "queryField": "commentsByProjectId"
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "ActivityPlannedDates": {
            "name": "ActivityPlannedDates",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "projectId": {
                    "name": "projectId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "startDates": {
                    "name": "startDates",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": true,
                    "attributes": []
                },
                "endDates": {
                    "name": "endDates",
                    "isArray": false,
                    "type": "AWSJSON",
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "ActivityPlannedDates",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "projectIdIndex",
                        "fields": [
                            "projectId"
                        ],
                        "queryField": "plannedDatesByProjectId"
                    }
                }
            ]
        },
        "ProgressDelayedActivities": {
            "name": "ProgressDelayedActivities",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "delayedActivities": {
                    "name": "delayedActivities",
                    "isArray": true,
                    "type": {
                        "nonModel": "DelayedActivity"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "ProgressDelayedActivities",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "Progress": {
            "name": "Progress",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "projectId": {
                    "name": "projectId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "progressAreas": {
                    "name": "progressAreas",
                    "isArray": true,
                    "type": {
                        "nonModel": "ProgressArea"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "chunkId": {
                    "name": "chunkId",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "labels": {
                    "name": "labels",
                    "isArray": true,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "dod": {
                    "name": "dod",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "draft": {
                    "name": "draft",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "categories": {
                    "name": "categories",
                    "isArray": true,
                    "type": {
                        "nonModel": "ProgressCategory"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "Progresses",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "projectIdIndex",
                        "fields": [
                            "projectId"
                        ],
                        "queryField": "progressByProjectId"
                    }
                }
            ]
        },
        "UserLink": {
            "name": "UserLink",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "dataUrl": {
                    "name": "dataUrl",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "scene": {
                    "name": "scene",
                    "isArray": false,
                    "type": {
                        "nonModel": "Scene"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "targetYaw": {
                    "name": "targetYaw",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "targetPitch": {
                    "name": "targetPitch",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "linkFrom": {
                    "name": "linkFrom",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "linkTo": {
                    "name": "linkTo",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "rotation": {
                    "name": "rotation",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "UserLinks",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "dataUrlIndex",
                        "fields": [
                            "dataUrl"
                        ],
                        "queryField": "userLinksByDataUrl"
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "UserSceneName": {
            "name": "UserSceneName",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "dataUrl": {
                    "name": "dataUrl",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "sceneId": {
                    "name": "sceneId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "sceneName": {
                    "name": "sceneName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "UserSceneNames",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "dataUrlIndex",
                        "fields": [
                            "dataUrl"
                        ],
                        "queryField": "userScenesByDataUrl"
                    }
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "PlanInitialPoint": {
            "name": "PlanInitialPoint",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "matched": {
                    "name": "matched",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": true,
                    "attributes": []
                },
                "scanRecords": {
                    "name": "scanRecords",
                    "isArray": true,
                    "type": {
                        "nonModel": "ScanRecord"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "PlanInitialPoints",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "public",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "PhotoTourPoints": {
            "name": "PhotoTourPoints",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "projectId": {
                    "name": "projectId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "building": {
                    "name": "building",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "area": {
                    "name": "area",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "filesPath": {
                    "name": "filesPath",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "username": {
                    "name": "username",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "registered": {
                    "name": "registered",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "photoRecords": {
                    "name": "photoRecords",
                    "isArray": true,
                    "type": {
                        "nonModel": "PhotoRecord"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "PhotoTourPoints",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "PlanAnchors": {
            "name": "PlanAnchors",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "photoRecords": {
                    "name": "photoRecords",
                    "isArray": true,
                    "type": {
                        "nonModel": "PhotoRecord"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "PlanAnchors",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        },
        "TourToken": {
            "name": "TourToken",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "token": {
                    "name": "token",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "TourTokens",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "auth",
                    "properties": {
                        "rules": [
                            {
                                "allow": "private",
                                "operations": [
                                    "create",
                                    "update",
                                    "delete",
                                    "read"
                                ]
                            },
                            {
                                "allow": "public",
                                "operations": [
                                    "read"
                                ]
                            }
                        ]
                    }
                }
            ]
        },
        "ProjectInvitation": {
            "name": "ProjectInvitation",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "fromUserName": {
                    "name": "fromUserName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "inviteAddress": {
                    "name": "inviteAddress",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "token": {
                    "name": "token",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "projectId": {
                    "name": "projectId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "ProjectInvitations",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "tokenIndex",
                        "fields": [
                            "token"
                        ],
                        "queryField": "projectInvitationByToken"
                    }
                }
            ]
        },
        "PlanBimMatching": {
            "name": "PlanBimMatching",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "planUrl": {
                    "name": "planUrl",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "bimUrl": {
                    "name": "bimUrl",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "record": {
                    "name": "record",
                    "isArray": false,
                    "type": {
                        "nonModel": "ScanRecord"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "viewport": {
                    "name": "viewport",
                    "isArray": false,
                    "type": {
                        "nonModel": "BimViewport"
                    },
                    "isRequired": true,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "PlanBimMatchings",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                },
                {
                    "type": "key",
                    "properties": {
                        "name": "planUrlIndex",
                        "fields": [
                            "planUrl"
                        ],
                        "queryField": "planBimMatchingByPlanUrl"
                    }
                }
            ]
        },
        "PlanBimTransformation": {
            "name": "PlanBimTransformation",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "bimUrl": {
                    "name": "bimUrl",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "transformationMatrix": {
                    "name": "transformationMatrix",
                    "isArray": true,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "bimUp2CastoryUpRotationMatrix": {
                    "name": "bimUp2CastoryUpRotationMatrix",
                    "isArray": true,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "inverseMatchMatrix": {
                    "name": "inverseMatchMatrix",
                    "isArray": true,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "floorUpVec": {
                    "name": "floorUpVec",
                    "isArray": true,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "northVec": {
                    "name": "northVec",
                    "isArray": true,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "eastVec": {
                    "name": "eastVec",
                    "isArray": true,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "viewport": {
                    "name": "viewport",
                    "isArray": false,
                    "type": {
                        "nonModel": "BimViewport"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "preventFirstPerson": {
                    "name": "preventFirstPerson",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                }
            },
            "syncable": true,
            "pluralName": "PlanBimTransformations",
            "attributes": [
                {
                    "type": "model",
                    "properties": {}
                }
            ]
        }
    },
    "enums": {
        "ItemTypeEnum": {
            "name": "ItemTypeEnum",
            "values": [
                "IMAGE_360",
                "IMAGE_PLAIN_ZOOMABLE",
                "VIDEO_FRAME_360",
                "VIDEO"
            ]
        },
        "AreaTypeEnum": {
            "name": "AreaTypeEnum",
            "values": [
                "APARTMENT",
                "FLOOR"
            ]
        },
        "IssueTypeEnum": {
            "name": "IssueTypeEnum",
            "values": [
                "STRUCTURAL",
                "ELECTRICAL",
                "PLASTERING",
                "PLUMBING",
                "SAFETY",
                "TILING",
                "CARPENTRY",
                "PAINTING",
                "HVAC",
                "FIRE",
                "HOUSEKEEPING"
            ]
        },
        "ActivityStatus": {
            "name": "ActivityStatus",
            "values": [
                "DONE",
                "IN_PROGRESS",
                "NOT_STARTED",
                "IRRELEVANT"
            ]
        }
    },
    "nonModels": {
        "PlanUrl": {
            "name": "PlanUrl",
            "fields": {
                "url": {
                    "name": "url",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "LinkDetails": {
            "name": "LinkDetails",
            "fields": {
                "sceneId": {
                    "name": "sceneId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "sceneName": {
                    "name": "sceneName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "planYaw": {
                    "name": "planYaw",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "leftLocation": {
                    "name": "leftLocation",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "topLocation": {
                    "name": "topLocation",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "linkUrl": {
                    "name": "linkUrl",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "isPhotoLink": {
                    "name": "isPhotoLink",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "linkItemType": {
                    "name": "linkItemType",
                    "isArray": false,
                    "type": {
                        "enum": "ItemTypeEnum"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "NearestScene": {
            "name": "NearestScene",
            "fields": {
                "sceneId": {
                    "name": "sceneId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "yaw": {
                    "name": "yaw",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "PlanAnchorsResponse": {
            "name": "PlanAnchorsResponse",
            "fields": {
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "linkId": {
                    "name": "linkId",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "ExtendedUserProfile": {
            "name": "ExtendedUserProfile",
            "fields": {
                "userProfile": {
                    "name": "userProfile",
                    "isArray": false,
                    "type": {
                        "model": "UserProfile"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "projects": {
                    "name": "projects",
                    "isArray": true,
                    "type": {
                        "model": "Project"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "Building": {
            "name": "Building",
            "fields": {
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "floors": {
                    "name": "floors",
                    "isArray": true,
                    "type": {
                        "nonModel": "Floor"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "Floor": {
            "name": "Floor",
            "fields": {
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "areas": {
                    "name": "areas",
                    "isArray": true,
                    "type": {
                        "nonModel": "Area"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "Area": {
            "name": "Area",
            "fields": {
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "infos": {
                    "name": "infos",
                    "isArray": true,
                    "type": {
                        "nonModel": "Info"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "type": {
                    "name": "type",
                    "isArray": false,
                    "type": {
                        "enum": "AreaTypeEnum"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "hasMultiplePlans": {
                    "name": "hasMultiplePlans",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "Info": {
            "name": "Info",
            "fields": {
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "plan": {
                    "name": "plan",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "tour": {
                    "name": "tour",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "sceneId": {
                    "name": "sceneId",
                    "isArray": false,
                    "type": "Int",
                    "isRequired": false,
                    "attributes": []
                },
                "scale": {
                    "name": "scale",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "ProgressValue": {
            "name": "ProgressValue",
            "fields": {
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "progress": {
                    "name": "progress",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "ActivityPlannedDatesResponse": {
            "name": "ActivityPlannedDatesResponse",
            "fields": {
                "activity": {
                    "name": "activity",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "plannedDates": {
                    "name": "plannedDates",
                    "isArray": true,
                    "type": {
                        "nonModel": "PlannedDatesRecord"
                    },
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "PlannedDatesRecord": {
            "name": "PlannedDatesRecord",
            "fields": {
                "building": {
                    "name": "building",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "floor": {
                    "name": "floor",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "startDate": {
                    "name": "startDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "endDate": {
                    "name": "endDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "MsProjectSnapshot": {
            "name": "MsProjectSnapshot",
            "fields": {
                "id": {
                    "name": "id",
                    "isArray": false,
                    "type": "ID",
                    "isRequired": true,
                    "attributes": []
                },
                "tasks": {
                    "name": "tasks",
                    "isArray": true,
                    "type": {
                        "nonModel": "TaskData"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "projectId": {
                    "name": "projectId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "lastUpdated": {
                    "name": "lastUpdated",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "TaskData": {
            "name": "TaskData",
            "fields": {
                "duration": {
                    "name": "duration",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "finish": {
                    "name": "finish",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "guid": {
                    "name": "guid",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "predecessor": {
                    "name": "predecessor",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "start": {
                    "name": "start",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "successor": {
                    "name": "successor",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "totalSlack": {
                    "name": "totalSlack",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "wbs": {
                    "name": "wbs",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "ProjectCopilotResponse": {
            "name": "ProjectCopilotResponse",
            "fields": {
                "answer": {
                    "name": "answer",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "imagesAnalysis": {
                    "name": "imagesAnalysis",
                    "isArray": true,
                    "type": {
                        "nonModel": "ImagesAnalysisResponse"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "ImagesAnalysisResponse": {
            "name": "ImagesAnalysisResponse",
            "fields": {
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "imageKeys": {
                    "name": "imageKeys",
                    "isArray": false,
                    "type": {
                        "nonModel": "ImagesIn360View"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "anchor": {
                    "name": "anchor",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "top": {
                    "name": "top",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "left": {
                    "name": "left",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "matchingCriteria": {
                    "name": "matchingCriteria",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "certainty": {
                    "name": "certainty",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "explanation": {
                    "name": "explanation",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "ImagesIn360View": {
            "name": "ImagesIn360View",
            "fields": {
                "floor": {
                    "name": "floor",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "wall1": {
                    "name": "wall1",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "wall2": {
                    "name": "wall2",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "wall3": {
                    "name": "wall3",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "wall4": {
                    "name": "wall4",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "ceiling": {
                    "name": "ceiling",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "Scene": {
            "name": "Scene",
            "fields": {
                "sceneId": {
                    "name": "sceneId",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "yaw": {
                    "name": "yaw",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "pitch": {
                    "name": "pitch",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "fov": {
                    "name": "fov",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "CommentReply": {
            "name": "CommentReply",
            "fields": {
                "reply": {
                    "name": "reply",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "writtenBy": {
                    "name": "writtenBy",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "date": {
                    "name": "date",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "role": {
                    "name": "role",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "mail": {
                    "name": "mail",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "fileName": {
                    "name": "fileName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "ScanRecord": {
            "name": "ScanRecord",
            "fields": {
                "recordDate": {
                    "name": "recordDate",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "building": {
                    "name": "building",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "floor": {
                    "name": "floor",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "planUrl": {
                    "name": "planUrl",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "leftLocation": {
                    "name": "leftLocation",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "topLocation": {
                    "name": "topLocation",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "username": {
                    "name": "username",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                }
            }
        },
        "DelayedActivity": {
            "name": "DelayedActivity",
            "fields": {
                "location": {
                    "name": "location",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "probability": {
                    "name": "probability",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "reason": {
                    "name": "reason",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "ProgressArea": {
            "name": "ProgressArea",
            "fields": {
                "building": {
                    "name": "building",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "floor": {
                    "name": "floor",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "anchor": {
                    "name": "anchor",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "weight": {
                    "name": "weight",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                },
                "label": {
                    "name": "label",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "invisible": {
                    "name": "invisible",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "activities": {
                    "name": "activities",
                    "isArray": true,
                    "type": {
                        "nonModel": "Activity"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "Activity": {
            "name": "Activity",
            "fields": {
                "activityName": {
                    "name": "activityName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "status": {
                    "name": "status",
                    "isArray": false,
                    "type": {
                        "enum": "ActivityStatus"
                    },
                    "isRequired": true,
                    "attributes": []
                },
                "previousStatus": {
                    "name": "previousStatus",
                    "isArray": false,
                    "type": {
                        "enum": "ActivityStatus"
                    },
                    "isRequired": false,
                    "attributes": []
                },
                "updater": {
                    "name": "updater",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "updateReason": {
                    "name": "updateReason",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                },
                "dateManuallyUpdated": {
                    "name": "dateManuallyUpdated",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "ProgressCategory": {
            "name": "ProgressCategory",
            "fields": {
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "includes": {
                    "name": "includes",
                    "isArray": true,
                    "type": {
                        "nonModel": "CategoryChildren"
                    },
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "CategoryChildren": {
            "name": "CategoryChildren",
            "fields": {
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "weight": {
                    "name": "weight",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "PhotoRecord": {
            "name": "PhotoRecord",
            "fields": {
                "leftLocation": {
                    "name": "leftLocation",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "topLocation": {
                    "name": "topLocation",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "fileName": {
                    "name": "fileName",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "needsManualRegistration": {
                    "name": "needsManualRegistration",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": false,
                    "attributes": []
                },
                "label": {
                    "name": "label",
                    "isArray": false,
                    "type": "String",
                    "isRequired": false,
                    "attributes": []
                }
            }
        },
        "BimViewport": {
            "name": "BimViewport",
            "fields": {
                "name": {
                    "name": "name",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "eye": {
                    "name": "eye",
                    "isArray": true,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "target": {
                    "name": "target",
                    "isArray": true,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "up": {
                    "name": "up",
                    "isArray": true,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "worldUpVector": {
                    "name": "worldUpVector",
                    "isArray": true,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "pivotPoint": {
                    "name": "pivotPoint",
                    "isArray": true,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "distanceToOrbit": {
                    "name": "distanceToOrbit",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "aspectRatio": {
                    "name": "aspectRatio",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                },
                "projection": {
                    "name": "projection",
                    "isArray": false,
                    "type": "String",
                    "isRequired": true,
                    "attributes": []
                },
                "isOrthographic": {
                    "name": "isOrthographic",
                    "isArray": false,
                    "type": "Boolean",
                    "isRequired": true,
                    "attributes": []
                },
                "fieldOfView": {
                    "name": "fieldOfView",
                    "isArray": false,
                    "type": "Float",
                    "isRequired": true,
                    "attributes": []
                }
            }
        }
    },
    "version": "97e7ef62167c48c1ccd8fdaec1ed8602"
};