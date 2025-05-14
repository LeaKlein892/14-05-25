import * as React from "react";
import { useContext, useState } from "react";
import { DraggableData, Position, Rnd } from "react-rnd";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { analyticsEvent } from "../../utils/analytics";

export interface FloatingPanelProps {
  hide?: boolean;
  initialHeight: number;
  initialWidth: number;
  minHeight?: number;
  minWidth?: number;
  preventResize?: boolean;
  preventDrag?: boolean;
  children?: React.ReactNode;
}

const style = {
  zIndex: 1000,
  border: "1px solid black",
};

let lastX = 62;
let lastY = 73;
let lastWidth: number | string | undefined = undefined;
let lastHeight: number | string | undefined = undefined;

export const FloatingPanel: React.FC<FloatingPanelProps> = ({
  hide = false,
  children,
  initialHeight,
  initialWidth,
  minHeight = 0,
  minWidth = 0,
  preventResize = false,
  preventDrag = false,
}) => {
  const { loggedUser } = useContext(LoggedUserContext);
  const [x, setX] = useState(lastX);
  const [y, setY] = useState(lastY);
  const [height, setHeight] = useState<string | number>(
    preventResize ? initialHeight : lastHeight ? lastHeight : initialHeight
  );
  const [width, setWidth] = useState<string | number>(
    preventResize ? initialWidth : lastWidth ? lastWidth : initialWidth
  );

  const onDragStop = (e: any, d: DraggableData) => {
    analyticsEvent("Plan", "Plan Map Dragged", loggedUser.username);
    setX(d.x);
    setY(d.y);
    lastX = d.x;
    lastY = d.y;
  };

  const onResizeStop = (
    e: MouseEvent | TouchEvent,
    direction: any,
    ref: HTMLElement,
    delta: any,
    position: Position
  ) => {
    analyticsEvent("Plan", "Plan Map Resized", loggedUser.username);
    setWidth(ref.style.width);
    setHeight(ref.style.height);
    lastWidth = ref.style.width;
    lastHeight = ref.style.height;
    setX(position.x);
    setY(position.y);
    lastX = position.x;
    lastY = position.y;
  };

  return !hide ? (
    <Rnd
      size={{ height, width }}
      position={{ x, y }}
      onDragStop={onDragStop}
      onResizeStop={onResizeStop}
      bounds="window"
      style={style}
      minWidth={minWidth}
      minHeight={minHeight}
      enableResizing={!preventResize}
      disableDragging={preventDrag}
      cancel=".close-map"
    >
      {children}
    </Rnd>
  ) : (
    <div />
  );
};
