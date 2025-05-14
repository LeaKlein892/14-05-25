import React, { useEffect } from "react";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import Chip from "@mui/material/Chip";
import { IssueTypeEnum } from "../../../API";
import {
  getIssueTypeColorMap,
  issueTypesToArray,
} from "../../../utils/tasks-issue-types-utils";

const issueTypeColorMap = getIssueTypeColorMap();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "flex-end",
      flexWrap: "wrap",
      listStyle: "none",
      margin: 0,
    },
    chip: {
      marginRight: theme.spacing(0.5),
      marginLeft: theme.spacing(0.5),
      fontSize: 12,
      height: theme.spacing(2.5),
    },
  })
);

export interface CommentLabelsListProps {
  issueTypes: any;
}

export const CommentLabelsList: React.FC<CommentLabelsListProps> = ({
  issueTypes,
}) => {
  const classes = useStyles();

  const [issueTypesList, setIssueTypesList] = React.useState<IssueTypeEnum[]>(
    issueTypesToArray(issueTypes)
  );

  useEffect(() => {
    setIssueTypesList(issueTypesToArray(issueTypes));
  }, [issueTypes]);

  return (
    <ul className={classes.root}>
      {issueTypesList &&
        issueTypesList.map((issueType) => {
          return (
            <li key={issueType}>
              <Chip
                label={issueType.toLowerCase()}
                size={"small"}
                className={classes.chip}
                style={{ backgroundColor: issueTypeColorMap.get(issueType) }}
              />
            </li>
          );
        })}
    </ul>
  );
};
