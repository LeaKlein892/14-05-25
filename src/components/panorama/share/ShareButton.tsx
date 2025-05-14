import * as React from "react";
import { IconButton, Tooltip } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import { emptyObj } from "../../../utils/render-utils";

export interface ShareButtonProps {
  onShare: () => void;
  disabled?: boolean;
  hide?: boolean;
  styling?: any;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  onShare,
  disabled = false,
  hide = false,
  styling = emptyObj,
}) => {
  return !hide ? (
    <Tooltip
      disableInteractive
      title={"Share task"}
      placement={"left"}
      enterDelay={400}
      enterNextDelay={400}
    >
      <IconButton className={styling} color="primary" size="large">
        <ShareIcon onClick={onShare} />
      </IconButton>
    </Tooltip>
  ) : (
    <span />
  );
};
