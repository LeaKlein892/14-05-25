import * as React from "react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import GetAppIcon from "@mui/icons-material/GetApp";
import { alpha } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import { Grid, IconButton, InputBase, useMediaQuery, Box } from "@mui/material";
import { Comment } from "../../../models";
import CommentsList from "../../comments/comments-list/CommentsList";
import {
  CommentCompareFunction,
  CommentPressFunction,
} from "../../comments/CommentTypes";
import SearchIcon from "@mui/icons-material/Search";
import { FilterSortButton } from "../../filter-sort-button/FilterSortButton";
import {
  FieldTypeEnum,
  getCompareCommentsFunction,
  SortOrderEnum,
} from "../../../utils/comments-utils";
import CommentDialog from "../../dialogs/comment-dialog/CommentDialog";
import { analyticsEvent } from "../../../utils/analytics";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { TourDetails } from "../../../utils/projects-utils";
import {
  getTasksIssueTypes,
  issueTypesToArray,
} from "../../../utils/tasks-issue-types-utils";
import { emptyFn } from "../../../utils/render-utils";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { exportCommentsToXlsx } from "../../../utils/sheets-operations";
import { FriendlyError } from "../../friendly-error/FriendlyError";
import { API, graphqlOperation } from "aws-amplify";
import { getProgressActivityNames } from "../../../graphql/queries";

const mobileFilterStyle = {
  textAlign: "center",
  borderBottom: "1px solid black",
} as any;

interface CommentsFilter {
  textFilter: string;
  nameFilter: string[];
  issueTypeFilter: (string | "[Not Set]")[];
  resolvedFilter: string[];
  buildingFilter: string[];
  floorFilter: string[];
}

interface CommentsSort {
  sortFunction: CommentCompareFunction;
  primarySortOrder: SortOrderEnum;
  secondarySortOrder?: SortOrderEnum;
  primaryField: string;
  secondaryField: string;
}

export interface FilteredTasksProps {
  commentNotFound: boolean;
  comments: Comment[];
  onTaskClick: CommentPressFunction;
  toursDetails: Map<string, TourDetails>;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    allTasks: {
      paddingTop: theme.spacing(1),
      marginTop: theme.spacing(0),
      margin: theme.spacing(0), //fix grid bug
    },
    filtersLine: {
      position: "relative",
      display: "inline-flex",
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.grey.A200, 0.25),
      [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        marginTop: "-5px",
        marginBottom: theme.spacing(0),
        padding: "6px",
        backgroundColor: "#d3d3d370",
      },
    },
    search: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      margin: theme.spacing(0),
    },
    searchIcon: {
      marginLeft: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
      padding: theme.spacing(0),
    },
    export: {
      padding: 0,
    },
    inputRoot: {
      width: "100%",
    },
    inputInput: {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      marginTop: theme.spacing(0),
      marginBottom: theme.spacing(0.5),
      marginRight: theme.spacing(1),
      "&:hover": {
        backgroundColor: alpha(theme.palette.grey.A200, 0.25),
        borderRadius: theme.shape.borderRadius,
      },
    },
  })
);

const DATE_FILTER_FIELD_NAME = "updatedAt",
  RESOLVED_FILTER_FIELD_NAME = "resolved",
  NAME_FILTER_FIELD_NAME = "writtenBy",
  BUILDING_FILTER_FIELD_NAME = "building",
  FLOOR_FILTER_FIELD_NAME = "floor";

const RESOLVED_OPTION = "Fixed",
  NOT_RESOLVED_OPTION = "Open";

const defaultResolvedOptions = [NOT_RESOLVED_OPTION, RESOLVED_OPTION];
let lastResolvedFilter = defaultResolvedOptions;

let allIssueTypesValues: (string | "[Not Set]")[] = [
  ...getTasksIssueTypes().map((x) => x.value),
  "[Not Set]",
];

const defaultFilter: CommentsFilter = {
  textFilter: "",
  nameFilter: [],
  resolvedFilter: [NOT_RESOLVED_OPTION, RESOLVED_OPTION],
  issueTypeFilter: allIssueTypesValues,
  buildingFilter: [],
  floorFilter: [],
};

const defaultSort: CommentsSort = {
  sortFunction: getCompareCommentsFunction(
    RESOLVED_FILTER_FIELD_NAME,
    SortOrderEnum.asc,
    FieldTypeEnum.boolean,
    DATE_FILTER_FIELD_NAME,
    SortOrderEnum.desc,
    FieldTypeEnum.date
  ),
  primarySortOrder: SortOrderEnum.asc,
  primaryField: RESOLVED_FILTER_FIELD_NAME,
  secondarySortOrder: SortOrderEnum.desc,
  secondaryField: DATE_FILTER_FIELD_NAME,
};

let lastFilter: CommentsFilter = defaultFilter;
let lastSort: CommentsSort = defaultSort;
let lastProjectName = "";

export const FilteredTasks: React.FC<FilteredTasksProps> = ({
  commentNotFound = false,
  comments,
  onTaskClick,
  toursDetails,
}) => {
  const classes = useStyles();

  const exportClass = useMemo(() => {
    return { root: classes.export };
  }, [classes]);

  const searchClass = useMemo(() => {
    return {
      root: classes.inputRoot,
      input: classes.inputInput,
    };
  }, [classes]);

  const { currentProject } = useContext(ProjectInformationContext);
  const projectName = currentProject?.id || "";

  const { loggedUser } = useContext(LoggedUserContext);
  const [commentsList, setCommentsList] = useState<Comment[]>(comments);
  const [filteredComments, setFilteredComments] = useState<Comment[]>(comments);

  // Definition for comment form
  const [openCommentForm, setOpenCommentForm] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState<Comment>();

  const [checkedResolved, setCheckedResolved] = useState<string[] | undefined>(
    lastResolvedFilter
  );

  const [checkedBuildings, setCheckedBuildings] = useState<
    string[] | undefined
  >(lastFilter.buildingFilter);

  const [checkedFloors, setCheckedFloors] = useState<string[] | undefined>(
    lastFilter.floorFilter
  );

  const [checkedNames, setCheckedNames] = useState<string[] | undefined>(
    lastFilter.nameFilter
  );

  const [checkedTypes, setCheckedTypes] = useState<string[] | undefined>(
    lastFilter.issueTypeFilter
  );
  const [categoryTypes, setCategoryTypes] = useState<string[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      const currentProjectName = currentProject ? currentProject.id : "";
      if (currentProjectName) {
        const projectOptions = await fetchProjectOptions(currentProjectName);
        setCategoryTypes(projectOptions);
      } else {
        setCategoryTypes([]);
      }
    };
    loadOptions();
  }, []);

  useEffect(() => {
    const allIssueTypes =
      categoryTypes.length === 0
        ? [...allIssueTypesValues]
        : [...categoryTypes];
    allIssueTypesValues = allIssueTypes;
    lastFilter.issueTypeFilter = allIssueTypes;
    setCheckedTypes(allIssueTypes);
    filterAndSort(commentsList);
  }, [categoryTypes, commentsList]);

  const mobileMode = useMediaQuery("(max-width: 1224px)", { noSsr: true });

  const fetchProjectOptions = async (currentProjectName: string) => {
    try {
      const response: any = await API.graphql(
        graphqlOperation(getProgressActivityNames, {
          project: currentProjectName,
        })
      );
      const progressActivityNames = response?.data?.getProgressActivityNames;
      return progressActivityNames;
    } catch (error) {
      console.error("Error fetching progress activity names:", error);
    }
  };

  const filterAndSort = (commentsToFilterAndSort: Comment[]) => {
    setFilteredComments(
      commentsToFilterAndSort
        .filter(
          (comment) =>
            (comment.resolved &&
              lastResolvedFilter.includes(RESOLVED_OPTION)) ||
            (!comment.resolved &&
              lastResolvedFilter.includes(NOT_RESOLVED_OPTION))
        )
        .filter((comment) => {
          if (!comment.issueTypes || comment.issueTypes.length === 0) {
            if (
              comment.customIssueTypes &&
              comment.customIssueTypes.length > 0
            ) {
              return comment.customIssueTypes.some((cit) =>
                lastFilter.issueTypeFilter.includes(cit)
              );
            } else {
              return lastFilter.issueTypeFilter.includes("[Not Set]");
            }
          } else {
            return issueTypesToArray(comment.issueTypes).some((cit) =>
              lastFilter.issueTypeFilter.includes(cit)
            );
          }
        })
        .filter(
          (comment) =>
            comment.title
              .toLowerCase()
              .includes(lastFilter.textFilter.toLowerCase()) ||
            comment.description
              ?.toLowerCase()
              .includes(lastFilter.textFilter.toLowerCase())
        )
        .filter((comment) =>
          lastFilter.nameFilter.some((name) => name === comment.writtenBy)
        )
        .filter((comment) =>
          lastFilter.buildingFilter.some((building) => {
            return (
              building === toursDetails.get(comment.dataUrl)?.building.name ||
              building === comment.record?.building
            );
          })
        )
        .filter((comment) =>
          lastFilter.floorFilter.some((floor) => {
            return (
              floor === toursDetails.get(comment.dataUrl)?.floor.name ||
              floor === comment.record?.floor
            );
          })
        )
        .sort(lastSort.sortFunction)
    );
  };

  const sortFilteredComments = (
    secondLevelFieldName: string,
    secondLevelSortOrder: SortOrderEnum,
    secondLevelFieldType: FieldTypeEnum,
    secondLevelIsTourDetailsField: boolean = false
  ) => {
    const newCompareFunction = getCompareCommentsFunction(
      RESOLVED_FILTER_FIELD_NAME,
      SortOrderEnum.asc,
      FieldTypeEnum.boolean,
      secondLevelFieldName,
      secondLevelSortOrder,
      secondLevelFieldType,
      secondLevelIsTourDetailsField,
      secondLevelIsTourDetailsField ? toursDetails : undefined
    );
    lastSort.sortFunction = newCompareFunction;
    lastSort.secondarySortOrder = secondLevelSortOrder;
    lastSort.secondaryField = secondLevelFieldName;
    filterAndSort(commentsList);
  };

  const [isPending, startTransition] = React.useTransition();

  const handleSearchInputChange = (event: any) => {
    const textFilter = event.target.value;
    startTransition(() => {
      if (lastFilter.textFilter === "" && textFilter !== "") {
        analyticsEvent("Tasks", "Tasks Searched", loggedUser.username);
      }
      lastFilter.textFilter = textFilter;
      filterAndSort(commentsList);
    });
  };

  const handleBuildingFilterChange = (filterBy: string[]) => {
    lastFilter.buildingFilter = filterBy;
    setCheckedBuildings(lastFilter.buildingFilter);
    analyticsEvent("Tasks", "Tasks Filtered by Building", loggedUser.username);
    filterAndSort(commentsList);
  };

  const handleFloorFilterChange = (filterBy: string[]) => {
    lastFilter.floorFilter = filterBy;
    setCheckedFloors(lastFilter.floorFilter);
    analyticsEvent("Tasks", "Tasks Filtered by Floor", loggedUser.username);
    filterAndSort(commentsList);
  };

  const handleResolvedFilterChange = (filterBy: string[]) => {
    analyticsEvent("Tasks", "Tasks Filtered by Resolved", loggedUser.username);
    lastResolvedFilter = filterBy;
    setCheckedResolved(lastResolvedFilter);
    filterAndSort(commentsList);
  };

  const handleNameFilterChange = (filterBy: string[]) => {
    lastFilter.nameFilter = filterBy;
    setCheckedNames(lastFilter.nameFilter);
    analyticsEvent("Tasks", "Tasks Filtered by Name", loggedUser.username);
    filterAndSort(commentsList);
  };

  const handleIssueTypeFilterChange = (filterBy: string[]) => {
    lastFilter.issueTypeFilter = filterBy as any;
    setCheckedTypes(lastFilter.issueTypeFilter);
    analyticsEvent("Tasks", "Tasks Filtered by IssueType", loggedUser.username);
    filterAndSort(commentsList);
  };

  const allNamesValues = useMemo<string[]>(() => {
    return Array.from(
      new Set<string>(
        comments.map((c) => {
          return c.writtenBy || "";
        })
      )
    );
  }, [comments]);

  const allBuildingsValues = useMemo<string[]>(() => {
    return Array.from(
      new Set<string>(
        comments
          .map((c) => {
            return (
              toursDetails.get(c.dataUrl)?.building.name ||
              c.record?.building ||
              ""
            );
          })
          .filter((v) => v.length !== 0)
      )
    );
  }, [comments, toursDetails]);

  const allFloorsValues = useMemo<string[]>(() => {
    return Array.from(
      new Set<string>(
        comments
          .map((c) => {
            return (
              toursDetails.get(c.dataUrl)?.floor.name || c.record?.floor || ""
            );
          })
          .filter((v) => v.length !== 0)
      )
    );
  }, [comments, toursDetails]);

  const compareSecondarySort = (fieldName: string) => {
    return lastSort.secondaryField === fieldName
      ? lastSort.secondarySortOrder === SortOrderEnum.asc
        ? "asc"
        : "desc"
      : undefined;
  };

  const handleEditComment = useCallback((comment?: Comment) => {
    setCommentToEdit(comment);
    setOpenCommentForm(true);
  }, []);

  const handleCloseComment = () => {
    setOpenCommentForm(false);
  };
  useEffect(() => {
    allIssueTypesValues = [
      ...getTasksIssueTypes().map((x) => x.value),
      "[Not Set]",
    ];
  }, []);

  useEffect(() => {
    if (
      filteredComments.length === commentsList.length &&
      (projectName !== lastProjectName || lastProjectName === "")
    ) {
      lastFilter.nameFilter = allNamesValues;
      setCheckedNames(allNamesValues);

      lastFilter.issueTypeFilter = allIssueTypesValues;
      setCheckedTypes(allIssueTypesValues);

      lastFilter.buildingFilter = allBuildingsValues;
      setCheckedBuildings(allBuildingsValues);

      lastFilter.floorFilter = allFloorsValues;
      setCheckedFloors(allFloorsValues);

      lastResolvedFilter = defaultResolvedOptions;
      setCheckedResolved(defaultResolvedOptions);
    }
    setCommentsList([...comments]);
    filterAndSort(comments);
    if (
      allNamesValues &&
      allNamesValues.length > 0 &&
      allBuildingsValues &&
      allBuildingsValues.length > 0 &&
      allFloorsValues &&
      allFloorsValues.length > 0
    )
      lastProjectName = projectName;
  }, [comments, allNamesValues, allBuildingsValues, allFloorsValues]); // DO NOT INCLUDE filteredComments.length AND commentsList.length

  useEffect(() => {
    lastFilter.textFilter = "";
    lastSort = { ...defaultSort };
  }, [projectName]);

  const commentsWithTourDetails = useMemo(() => {
    const newMap = new Map<Comment, TourDetails | undefined>();
    filteredComments.map((c) => newMap.set(c, toursDetails.get(c.dataUrl)));
    return newMap;
  }, [filteredComments, toursDetails]);

  const onExportXlsx = () => {
    analyticsEvent("Tasks", "Tasks Exported As Xlsx", loggedUser.username);
    exportCommentsToXlsx(filteredComments);
  };

  useEffect(() => {
    if (openCommentForm) {
      const commentToUpdate = comments.find((c) => c.id === commentToEdit?.id);
      if (commentToUpdate) {
        setCommentToEdit(commentToUpdate);
      }
    }
  }, [comments, commentToEdit, openCommentForm]);

  return (
    <Grid container spacing={2} xs={12} className={classes.allTasks}>
      <Grid item xs={12} className={classes.filtersLine}>
        <div className={classes.search}>
          <SearchIcon className={classes.searchIcon} />
          <InputBase
            placeholder="Search"
            classes={searchClass}
            onChange={(event) => {
              event.persist();
              handleSearchInputChange(event);
            }}
          />
        </div>
        {!mobileMode && (
          <>
            <FilterSortButton
              title="Resolved"
              noSearchMode
              noSortMode
              onSort={() => {
                sortFilteredComments(
                  RESOLVED_FILTER_FIELD_NAME,
                  SortOrderEnum.asc,
                  FieldTypeEnum.boolean
                );
              }}
              onSortDesc={() => {
                sortFilteredComments(
                  RESOLVED_FILTER_FIELD_NAME,
                  SortOrderEnum.desc,
                  FieldTypeEnum.boolean
                );
              }}
              activeSort={compareSecondarySort(RESOLVED_FILTER_FIELD_NAME)}
              initialChecked={checkedResolved}
              filterOptions={[NOT_RESOLVED_OPTION, RESOLVED_OPTION]}
              onFilter={handleResolvedFilterChange}
            />
            <FilterSortButton
              title="Building"
              onSort={() =>
                sortFilteredComments(
                  BUILDING_FILTER_FIELD_NAME,
                  SortOrderEnum.asc,
                  FieldTypeEnum.string,
                  true
                )
              }
              onSortDesc={() =>
                sortFilteredComments(
                  BUILDING_FILTER_FIELD_NAME,
                  SortOrderEnum.desc,
                  FieldTypeEnum.string,
                  true
                )
              }
              activeSort={compareSecondarySort(BUILDING_FILTER_FIELD_NAME)}
              initialChecked={checkedBuildings}
              filterOptions={allBuildingsValues}
              onFilter={handleBuildingFilterChange}
            />
            <FilterSortButton
              title="Floor"
              onSort={() =>
                sortFilteredComments(
                  FLOOR_FILTER_FIELD_NAME,
                  SortOrderEnum.asc,
                  FieldTypeEnum.string,
                  true
                )
              }
              onSortDesc={() =>
                sortFilteredComments(
                  FLOOR_FILTER_FIELD_NAME,
                  SortOrderEnum.desc,
                  FieldTypeEnum.string,
                  true
                )
              }
              activeSort={compareSecondarySort(FLOOR_FILTER_FIELD_NAME)}
              initialChecked={checkedFloors}
              filterOptions={allFloorsValues}
              onFilter={handleFloorFilterChange}
            />
            <FilterSortButton
              title="Name"
              onSort={() =>
                sortFilteredComments(
                  NAME_FILTER_FIELD_NAME,
                  SortOrderEnum.asc,
                  FieldTypeEnum.string
                )
              }
              onSortDesc={() =>
                sortFilteredComments(
                  NAME_FILTER_FIELD_NAME,
                  SortOrderEnum.desc,
                  FieldTypeEnum.string
                )
              }
              activeSort={compareSecondarySort(NAME_FILTER_FIELD_NAME)}
              initialChecked={checkedNames}
              filterOptions={allNamesValues}
              onFilter={handleNameFilterChange}
            />
            <FilterSortButton
              title="Type"
              filterOptions={allIssueTypesValues}
              noSortMode
              onSort={emptyFn}
              onSortDesc={emptyFn}
              initialChecked={checkedTypes}
              onFilter={handleIssueTypeFilterChange}
            />
            <IconButton
              classes={exportClass}
              onClick={onExportXlsx}
              size="large"
            >
              <GetAppIcon />
            </IconButton>
          </>
        )}
      </Grid>
      {mobileMode && (
        <Grid item xs={12} style={mobileFilterStyle}>
          <FilterSortButton
            title="Resolved"
            noSearchMode
            noSortMode
            variant="outlined"
            mobileFilter
            onSort={() => {
              sortFilteredComments(
                RESOLVED_FILTER_FIELD_NAME,
                SortOrderEnum.asc,
                FieldTypeEnum.boolean
              );
            }}
            onSortDesc={() => {
              sortFilteredComments(
                RESOLVED_FILTER_FIELD_NAME,
                SortOrderEnum.desc,
                FieldTypeEnum.boolean
              );
            }}
            activeSort={compareSecondarySort(RESOLVED_FILTER_FIELD_NAME)}
            initialChecked={checkedResolved}
            filterOptions={[NOT_RESOLVED_OPTION, RESOLVED_OPTION]}
            onFilter={handleResolvedFilterChange}
          />
          <FilterSortButton
            title="Building"
            variant="outlined"
            mobileFilter
            onSort={() =>
              sortFilteredComments(
                BUILDING_FILTER_FIELD_NAME,
                SortOrderEnum.asc,
                FieldTypeEnum.string,
                true
              )
            }
            onSortDesc={() =>
              sortFilteredComments(
                BUILDING_FILTER_FIELD_NAME,
                SortOrderEnum.desc,
                FieldTypeEnum.string,
                true
              )
            }
            activeSort={compareSecondarySort(BUILDING_FILTER_FIELD_NAME)}
            initialChecked={checkedBuildings}
            filterOptions={allBuildingsValues}
            onFilter={handleBuildingFilterChange}
          />
          <FilterSortButton
            title="Floor"
            variant="outlined"
            mobileFilter
            onSort={() =>
              sortFilteredComments(
                FLOOR_FILTER_FIELD_NAME,
                SortOrderEnum.asc,
                FieldTypeEnum.string,
                true
              )
            }
            onSortDesc={() =>
              sortFilteredComments(
                FLOOR_FILTER_FIELD_NAME,
                SortOrderEnum.desc,
                FieldTypeEnum.string,
                true
              )
            }
            activeSort={compareSecondarySort(FLOOR_FILTER_FIELD_NAME)}
            initialChecked={checkedFloors}
            filterOptions={allFloorsValues}
            onFilter={handleFloorFilterChange}
          />
        </Grid>
      )}
      {commentNotFound === true ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="0vh"
          width="100%"
        >
          <FriendlyError message="No Tasks Found" />
        </Box>
      ) : (
        <Grid item xs={12}>
          <CommentsList
            commentList={commentsWithTourDetails}
            onCommentSelected={onTaskClick}
            triggerEditComment={handleEditComment}
            handleClose={emptyFn}
          />
          <CommentDialog
            open={openCommentForm}
            handleClose={handleCloseComment}
            scene={{
              sceneId:
                commentToEdit?.scene.sceneId !== undefined
                  ? commentToEdit?.scene.sceneId
                  : "",
              yaw: 0,
              pitch: 0,
              fov: 0,
            }}
            lastSelectedComment={commentToEdit}
            mode="EDIT"
          />
        </Grid>
      )}
    </Grid>
  );
};
