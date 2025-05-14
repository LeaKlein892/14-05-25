export interface Data {
  scenes: Scene[];
  name: string;
  settings: Setting;
}

export interface Scene {
  id: string;
  name: string;
  levels: Level[];
  faceSize: number;
  initialViewParameters: Location3D;
  linkHotspots: LinkHotspot[];
  infoHotspots: InfoHotspot[];
}

export interface PanoScene {
  data: Scene;
  scene: any;
  view: any;
}

export interface Level {
  tileSize: number;
  size: number;
  fallbackOnly?: boolean;
}

export interface LinkHotspot extends LocationBase {
  id: string;
  rotation: number;
  target: string;
  linker?: ExternalLink;
  targetYaw?: number;
  targetPitch?: number;
  targetFov?: number;
}

export interface ExternalLink {
  target: string;
  name: string;
}

export interface InfoHotspot extends LocationBase {
  id: string;
  title: string;
  text: string;
}

export interface Location3D extends LocationBase {
  fov: number;
}

export interface LocationBase {
  pitch: number;
  yaw: number;
}

export interface Setting {
  mouseViewMode?: string;
  autorotateEnabled?: boolean;
  fullscreenButton?: boolean;
  viewControlButtons?: boolean;
}
