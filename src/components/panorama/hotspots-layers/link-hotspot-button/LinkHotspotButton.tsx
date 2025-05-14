import * as React from "react";
import { createRef, useEffect } from "react";
import "./LinkHotspotButton.css";
import { LinkHotspot } from "../../../../typings/panoramas";

export interface LinkHotspotButtonProps {
  onHotspotClick: (hotspot: LinkHotspot) => void;
  onContextMenuClick: (hotspot: LinkHotspot) => void;
  hotspot: LinkHotspot;
  tooltipName: string;
}

export const LinkHotspotButton: React.FC<LinkHotspotButtonProps> = ({
  onHotspotClick,
  onContextMenuClick,
  hotspot,
  tooltipName,
}) => {
  let nodeRef = createRef<HTMLDivElement>();

  const iconStyles = {
    "&::MsTransform": { rotate: `${hotspot.rotation}deg` },
    "&::WebkitTransform": { rotate: `${hotspot.rotation}deg` },
    transform: `rotate(${hotspot.rotation}deg)`,
  };

  useEffect(() => {
    const currentNodeRef = nodeRef.current;
    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      onContextMenuClick(hotspot);
    };

    currentNodeRef?.addEventListener("contextmenu", handleContextMenu);

    return () => {
      currentNodeRef?.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [hotspot, nodeRef, onContextMenuClick]);

  return (
    <div
      className={"hotspot link-hotspot"}
      onClick={() => onHotspotClick(hotspot)}
      ref={nodeRef}
    >
      <img
        src={"img/link.png"}
        className={"link-hotspot-icon"}
        style={iconStyles}
        alt={""}
      />
      <div className={"hotspot-tooltip link-hotspot-tooltip"}>
        {hotspot.linker ? hotspot.linker.name : tooltipName}
      </div>
    </div>
  );
};
