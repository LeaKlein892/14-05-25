import * as React from "react";
import { MenuItem, Select, SelectChangeEvent, makeStyles } from "@mui/material";

export interface Props {
  value?: string;
  disabled?: boolean;
  onChange?: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
}

export const RoleSelect: React.FC<Props> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <Select
      variant="standard"
      labelId="role-select-label"
      id="role-select"
      value={value}
      disabled={disabled}
      onChange={onChange}
    >
      <MenuItem value={"Owner"}>Owner</MenuItem>
      <MenuItem value={"Contractor"}>Contractor</MenuItem>
      <MenuItem value={"Project Manager"}>Project Manager</MenuItem>
      <MenuItem value={"Subcontractor"}>Subcontractor</MenuItem>
      <MenuItem value={"Architect"}>Architect</MenuItem>
      <MenuItem value={"Other"}>Other</MenuItem>
    </Select>
  );
};
