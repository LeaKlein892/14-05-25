import * as React from "react";
import { useContext } from "react";
import MenuItem from "@mui/material/MenuItem";
import { MenuLayout, MenuLayoutProps } from "../../menu-layout/MenuLayout";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { text } from "../../../utils/translation";

export interface PlanMenuProps extends MenuLayoutProps {
  triggerUploadImage: () => void;
}

export const PlanMenu: React.FC<PlanMenuProps> = ({
  handleClose,
  pressedScreen,
  triggerUploadImage,
}) => {
  const { client } = useContext(ProjectInformationContext);
  const menuTitle = text("options", client);
  const imageItemKey = "upload_media";

  const imageItemFunction = triggerUploadImage;
  const imageItem = text(imageItemKey, client);

  return (
    <MenuLayout
      handleClose={handleClose}
      pressedScreen={pressedScreen}
      title={menuTitle}
    >
      <MenuItem onClick={imageItemFunction}>{imageItem}</MenuItem>
    </MenuLayout>
  );
};
