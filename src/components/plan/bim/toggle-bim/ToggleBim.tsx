import * as React from "react";
import { Tooltip } from "@mui/material";
import { TooltippedButton } from "../../../tooltipped-button/TooltippedButton";
import { emptyFn } from "../../../../utils/render-utils";

export interface ToggleBimProps {
  toggleBimMode: () => void;
  disabled?: boolean;
  hide?: boolean;
}

export const ToggleBim: React.FC<ToggleBimProps> = ({
  toggleBimMode,
  disabled = false,
  hide = false,
}) => {
  return !hide ? (
    <Tooltip
      disableInteractive
      title="Show BIM model"
      placement="bottom"
      enterDelay={400}
      enterNextDelay={400}
    >
      <TooltippedButton
        disabled={disabled}
        variant="outlined"
        onClick={disabled ? emptyFn : toggleBimMode}
      >
        3D
      </TooltippedButton>
    </Tooltip>
  ) : (
    <div />
  );
};
