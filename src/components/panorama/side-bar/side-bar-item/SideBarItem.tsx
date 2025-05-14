import * as React from "react";
import { useContext, useState } from "react";
import { SceneBasicDetails } from "../SideBar";
import { ListItemText } from "@mui/material";
import ListItemButton, {
  listItemButtonClasses,
} from "@mui/material/ListItemButton";
import { ItemEditIcon } from "./ItemEditIcon";
import { API } from "aws-amplify";
import {
  createUserSceneName,
  updateUserSceneName,
} from "../../../../graphql/mutations";
import { ProjectInformationContext } from "../../../../context/ProjectInformationContext";
import { analyticsEvent } from "../../../../utils/analytics";
import { LoggedUserContext } from "../../../../context/LoggedUserContext";
import { TokenStatus } from "../../../../hooks/useTourToken";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import { showMessage } from "../../../../utils/messages-manager";
import { NA } from "../../../../utils/clients";

export interface SideBarItemProps {
  sceneDetails: SceneBasicDetails;
  onClick: () => void;
  tokenStatus?: TokenStatus;
}

export const SideBarItem: React.FC<SideBarItemProps> = ({
  sceneDetails,
  onClick,
  tokenStatus = "NO_TOKEN",
}) => {
  const [showEditIcon, setShowEditIcon] = useState(false);
  const [editOn, setEditOn] = useState(false);
  const { currentTour: dataUrl, client } = useContext(
    ProjectInformationContext
  );
  const { loggedUser } = useContext(LoggedUserContext);
  const userIsLoggedIn = Boolean(loggedUser.id !== "");

  const onMouseOver = () => {
    setShowEditIcon(true);
  };

  const onMouseLeave = () => {
    setShowEditIcon(false);
  };

  const toggleEdit = (editMode: boolean) => {
    setEditOn(editMode);
  };

  const setNewSceneName = async (newName: string) => {
    if (newName === "") {
      return;
    }
    if (
      (tokenStatus === "NO_TOKEN" && userIsLoggedIn) ||
      tokenStatus === "TOKEN_MATCH"
    ) {
      analyticsEvent(
        "Tour",
        "Scene Renamed",
        loggedUser.username || client || NA
        //dataUrl
      );
      try {
        if (sceneDetails.entityId === undefined) {
          await API.graphql({
            query: createUserSceneName,
            variables: {
              input: { sceneId: sceneDetails.id, sceneName: newName, dataUrl },
            },
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
          });
        } else {
          await API.graphql({
            query: updateUserSceneName,
            variables: {
              input: { id: sceneDetails.entityId, sceneName: newName },
            },
            authMode: GRAPHQL_AUTH_MODE.API_KEY,
          });
        }
      } catch (e: any) {
        showMessage("Failed to rename, make sure you are logged in", "error");
      }
    }
  };

  const onItemClick = () => {
    if (!editOn) {
      analyticsEvent(
        "Tour",
        "Scene Changed from sidebar",
        loggedUser.username || client || NA
        //dataUrl
      );
      onClick();
    }
  };

  return (
    <ListItemButton
      onClick={onItemClick}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      <ListItemText primary={sceneDetails.name} />
      <ItemEditIcon
        open={showEditIcon}
        toggleEdit={toggleEdit}
        setNewSceneName={setNewSceneName}
      />
    </ListItemButton>
  );
};
