import * as React from "react";
import { useContext } from "react";
import MenuItem from "@mui/material/MenuItem";
import { MenuLayout, MenuLayoutProps } from "../../menu-layout/MenuLayout";
import { GREENBOOK } from "../../../utils/clients";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { text } from "../../../utils/translation";

export interface PanoMenuProps extends MenuLayoutProps {
  triggerCommentForm: () => void;
}

export const PanoMenu: React.FC<PanoMenuProps> = ({
  handleClose,
  pressedScreen,
  triggerCommentForm,
}) => {
  const { client } = useContext(ProjectInformationContext);
  const commentText = text("comment", client);
  const menuTitle = text("options", client);
  return (
    <MenuLayout
      handleClose={handleClose}
      pressedScreen={pressedScreen}
      title={menuTitle}
    >
      {client !== GREENBOOK ? (
        <MenuItem onClick={triggerCommentForm}>{commentText}</MenuItem>
      ) : (
        <div />
      )}
    </MenuLayout>
  );
};
