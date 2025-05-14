import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserLink, UserSceneName } from "../../../models";
import { analyticsEvent } from "../../../utils/analytics";
import { LinkHotspot, PanoScene, Scene } from "../../../typings/panoramas";
import { LinkHotspotButton } from "./link-hotspot-button/LinkHotspotButton";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { NA } from "../../../utils/clients";
import { createRoot } from "react-dom/client";

export interface DataLink {
  hotspot: LinkHotspot;
  sceneId: string;
}

export interface LinksHotspotsLayerProps {
  linksList: UserLink[];
  dataLinksList: DataLink[];
  userSceneNames: UserSceneName[];
  onHotspotClick: (
    id: string,
    yaw?: number,
    pitch?: number,
    fov?: number
  ) => void;
  onContextMenuClick: (link?: LinkHotspot) => void;
  scenes: React.RefObject<PanoScene[]>;
  sceneIdToSceneIndexMap: Map<string, number>;
}

interface LinkElements {
  hotspot: any;
  onClear: () => void;
}

const userLinkIdToLinkHotspotsElement = new Map<string, LinkElements>();
const dataLinkIdToLinkHotspotsElement = new Map<string, LinkElements>();

const LinksHotspotsLayer: React.FC<LinksHotspotsLayerProps> = ({
  linksList,
  dataLinksList,
  userSceneNames,
  onHotspotClick,
  onContextMenuClick,
  scenes,
  sceneIdToSceneIndexMap,
}) => {
  const [userLinks, setUserLinks] = useState<UserLink[]>(linksList);
  const [dataLinks, setDataLinks] = useState<DataLink[]>(dataLinksList);
  const { loggedUser } = useContext(LoggedUserContext);
  const { client } = useContext(ProjectInformationContext);

  const handleHotspotClick = useCallback(
    (hotspot: LinkHotspot) => {
      analyticsEvent(
        "Tour",
        "Link Hotspot Clicked",
        loggedUser.username || client || NA
      );
      hotspot.linker
        ? window.open(hotspot.linker.target, "_self")
        : onHotspotClick(
            hotspot.target,
            hotspot.targetYaw,
            hotspot.targetPitch,
            hotspot.targetFov
          );
    },
    [onHotspotClick, loggedUser.username, client]
  );

  const handleContextMenu = useCallback(
    (hotspot: LinkHotspot) => {
      if (hotspot.id) {
        onContextMenuClick(hotspot);
      }
    },
    [onContextMenuClick]
  );

  const findSceneDataById = useCallback(
    (id: string) => {
      for (let i = 0; i < scenes.current.length; i++) {
        if (scenes.current[i].data.id === id) {
          return scenes.current[i].data;
        }
      }
      return undefined;
    },
    [scenes]
  );

  const createLinkHotspotElement = useCallback(
    (hotspot: LinkHotspot) => {
      const getSceneNameById = (id: string): string => {
        const data: Scene | undefined = findSceneDataById(id);
        const userSceneForId = userSceneNames.filter(
          (userScene) => userScene.sceneId === id
        );
        const dataLinkName = data ? data.name : "";
        const sceneName =
          userSceneForId && userSceneForId.length > 0
            ? userSceneForId[0].sceneName
            : dataLinkName;
        return sceneName;
      };

      const tooltipName = getSceneNameById(hotspot.target);

      const linkHotspotElement = (
        <LinkHotspotButton
          onHotspotClick={handleHotspotClick}
          onContextMenuClick={handleContextMenu}
          tooltipName={tooltipName}
          hotspot={hotspot}
        />
      );

      const wrapper = document.createElement("div");
      wrapper.setAttribute("id", "linksHotspotsWrapper");

      const root = createRoot(wrapper!);
      root.render(linkHotspotElement);

      return wrapper;
    },
    [findSceneDataById, handleContextMenu, handleHotspotClick, userSceneNames]
    // handleHotspotClick --> 2 extra renders
  );

  const addLinkHotspotToScene = useCallback(
    (
      sceneId: string,
      hotspot: LinkHotspot,
      linkType: "USER_LINK" | "DATA_LINK"
    ) => {
      const element = createLinkHotspotElement(hotspot);

      const pSceneIndex = sceneIdToSceneIndexMap.get(sceneId);
      const pScene =
        pSceneIndex !== undefined
          ? scenes.current[pSceneIndex]?.scene
          : undefined;

      if (pScene) {
        const createdHotspot = pScene
          .hotspotContainer()
          .createHotspot(element, { yaw: hotspot.yaw, pitch: hotspot.pitch });

        if (linkType === "USER_LINK") {
          userLinkIdToLinkHotspotsElement.set(hotspot.id, {
            hotspot: createdHotspot,
            // comment: comment,
            onClear: () => {
              if (
                createdHotspot &&
                pScene.hotspotContainer() &&
                pScene.hotspotContainer().hasHotspot(createdHotspot)
              ) {
                pScene.hotspotContainer().destroyHotspot(createdHotspot);
              }
            },
          });
        } else {
          dataLinkIdToLinkHotspotsElement.set(hotspot.id, {
            hotspot: createdHotspot,
            onClear: () => {
              if (
                createdHotspot &&
                pScene.hotspotContainer() &&
                pScene.hotspotContainer().hasHotspot(createdHotspot)
              ) {
                pScene.hotspotContainer().destroyHotspot(createdHotspot);
              }
            },
          });
        }
      }
    },
    [sceneIdToSceneIndexMap]
    // createLinkHotspotElement --> 2 extra renders
  );

  const addUserLinkHotspotToScene = useCallback(
    (userLink: UserLink) => {
      const sceneId = userLink.scene.sceneId;
      const id = userLink.id || "";
      const hotspot: LinkHotspot = {
        id,
        target: userLink.linkTo,
        rotation: userLink.rotation || 0,
        yaw: userLink.scene.yaw || 0,
        pitch: userLink.scene.pitch || 0,
        targetYaw: userLink.targetYaw,
        targetPitch: userLink.targetPitch,
      };
      addLinkHotspotToScene(sceneId || "", hotspot, "USER_LINK");
    },
    [addLinkHotspotToScene]
  );

  const clearUserHotspots = () => {
    userLinkIdToLinkHotspotsElement.forEach((v, k) => {
      v.onClear();
    });
    userLinkIdToLinkHotspotsElement.clear();
  };

  const clearDataHotspots = () => {
    dataLinkIdToLinkHotspotsElement.forEach((v, k) => {
      v.onClear();
    });
    dataLinkIdToLinkHotspotsElement.clear();
  };

  useEffect(() => {
    setUserLinks([...linksList]);
  }, [linksList]);

  useEffect(() => {
    setDataLinks([...dataLinksList]);
  }, [dataLinksList]);

  useEffect(() => {
    if (scenes.current && scenes.current.length !== 0) {
      clearUserHotspots();
      userLinks.forEach((ul) => {
        addUserLinkHotspotToScene(ul);
      });
    }
  }, [userLinks, addUserLinkHotspotToScene, scenes]);
  // addUserLinkHotspotToScene --> 2 extra renders (addLinkHotspotToScene is one of is deps so it make sense)

  useEffect(() => {
    if (scenes.current && scenes.current.length !== 0) {
      clearDataHotspots();
      dataLinks.forEach((dl) => {
        addLinkHotspotToScene(dl.sceneId, dl.hotspot, "DATA_LINK");
      });
    }
  }, [dataLinks, scenes, addLinkHotspotToScene]);
  // dataLinks --> 2 extra renders (maybe caused by pano render?)
  // addLinkHotspotToScene --> 2 extra renders ----> (2 because its dev env)

  return <></>;
};

export default React.memo(LinksHotspotsLayer);
