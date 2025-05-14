export interface SceneFrame {
  yaw: number;
  pitch: number;
  fov: number;
}

export interface SelectedScene extends SceneFrame {
  sceneId: string;
}

export type DialogMode = "CREATE" | "CREATE_WITHOUT_LOCATION" | "EDIT";
export interface SceneView {
  sceneId: string;
  yaw?: number;
  pitch?: number;
  fov?: number;
}
