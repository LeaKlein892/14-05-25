import * as React from "react";
import Select, { components } from "react-select";
import {
  getIssueTypeColorMap,
  getTasksIssueTypes,
  issueTypesToArray,
} from "../../../utils/tasks-issue-types-utils";
import { capitalize } from "lodash-es";
import { IssueTypeEnum } from "../../../API";
import theme from "../../../ui/theme";
import { InputLabel } from "@mui/material";
import { API, Storage, graphqlOperation } from "aws-amplify";
import { getProgressActivityNames } from "../../../graphql/queries";
import { Project } from "../../../models";
import { useEffect, useState } from "react";

type IssueTypeOption = { value: IssueTypeEnum; label: string };
const options = getTasksIssueTypes();

const issueTypeColorMap = getIssueTypeColorMap();
const customStyles = {
  control: (provided: any, state: any) => ({
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    minHeight: "38px",
    outline: "0 !important",
    borderBottom: state.isFocused
      ? "2px solid " + theme.palette.primary.main
      : "1px solid rgba(0, 0, 0, 0.42)",
    "&:hover": {
      borderWidth: "2px",
      borderColor: state.isFocused ? theme.palette.primary.main : "rgb(0,0,0)",
    },
  }),
  placeholder: (provided: any, state: any) => ({
    ...provided,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.grey.A200,
  }),
  valueContainer: (provided: any, state: any) => ({
    ...provided,
    fontFamily: theme.typography.fontFamily,
    paddingRight: 0,
    paddingLeft: 0,
  }),
  multiValue: (provided: any, state: any) => {
    return {
      ...provided,
      backgroundColor:
        issueTypeColorMap.get(state.data.value as IssueTypeEnum) ||
        theme.palette.grey.A200,
    };
  },
  menuList: (provided: any, state: any) => ({
    ...provided,
    maxHeight: "15vh",
  }),
};

const ControlComponent = (props: any) => {
  let focusLabelStyle = {
    color: theme.palette.primary.main,
  };

  return (
    <div>
      {
        <InputLabel
          shrink
          style={props.isFocused ? focusLabelStyle : {}}
          disabled={props.isDisabled}
        >
          Issue Types
        </InputLabel>
      }
      <components.Control {...props} />
    </div>
  );
};

export interface IssueTypeSelectProps {
  disabled: boolean;
  defaultValue: any;
  onIssueTypesSelectionChanged: (values: IssueTypeEnum[]) => void;
  currentProject: Project | undefined;
}

export const IssueTypeSelect: React.FC<IssueTypeSelectProps> = ({
  disabled,
  defaultValue,
  onIssueTypesSelectionChanged,
  currentProject,
}) => {
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);

  useEffect(() => {
    const loadOptions = async () => {
      const currentProjectName = currentProject ? currentProject.id : "";
      if (currentProjectName) {
        const projectOptions = await fetchProjectOptions(currentProjectName);
        setCategoryOptions(projectOptions);
      } else {
        setCategoryOptions([]);
      }
    };
    loadOptions();
  }, []);

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
  const defaultIssueTypes: IssueTypeOption[] = issueTypesToArray(
    defaultValue
  ).map((it) => {
    return { value: it, label: capitalize(it) };
  });

  const handleIssueTypesChanged = (value: any) => {
    onIssueTypesSelectionChanged(
      ((value as IssueTypeOption[]) || []).map((ito) => {
        return ito.value;
      })
    );
  };

  return (
    <Select<any, true>
      isDisabled={disabled}
      closeMenuOnSelect={true}
      defaultValue={defaultIssueTypes}
      isMulti
      isSearchable
      options={
        categoryOptions.length > 0
          ? categoryOptions.map((option) => ({ value: option, label: option }))
          : options
      }
      onChange={handleIssueTypesChanged}
      placeholder={"add issue types"}
      styles={customStyles}
      components={{ Control: ControlComponent }}
    />
  );
};
