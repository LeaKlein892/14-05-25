import * as React from "react";
import { useCallback, useContext, useEffect, useRef } from "react";
import "./Pano.css";
import { Data, PanoScene } from "../../../typings/panoramas";
import Marzipano from "marzipano";
import { SelectedScene } from "../types";
import { DataLink } from "../hotspots-layers/LinksHotspotsLayer";
import { ScreenClose } from "../../screen-close/ScreenClose";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { useMediaQuery } from "@mui/material";
import { isNil } from "lodash-es";

const panoStyle = { cursor: "context-menu" };
let booleanValue = true;

function rotateView(view: any, yaw?: number, pitch?: number, fov?: number) {
  const rotatedView = { ...view };
  if (yaw) {
    rotatedView.yaw = yaw;
  }
  if (pitch) {
    rotatedView.pitch = pitch;
  }
  if (fov) {
    rotatedView.fov = fov;
  }
  return rotatedView;
}

export interface PastPanoProps {
  data: Data;
  dataUrl: string;
  onSceneChange: (sceneId: string) => void;
  handleClose: () => void;
  locked: boolean;
  selectedScene?: SelectedScene;
}

const velocity = 0.7;
const friction = 3;

// Last scene
let lastSceneId: string | undefined;
let lastDataUrl: string | undefined;
let lastSceneFrame: { yaw: number; pitch: number; fov: number } | undefined;

let lastSceneIdToSceneIndexMap = new Map<string, number>();

// Pano viewer
let viewer: any = undefined;
let previousYaw = 0;
let previousPitch = 0;

const PastPano: React.FC<PastPanoProps> = ({
  data,
  dataUrl,
  onSceneChange,
  handleClose,
  locked,
  selectedScene,
}) => {
  const {
    settings: { mouseViewMode },
    scenes,
  } = data;

  const panorama = useRef(null);

  const mobileMode = useMediaQuery("(max-width: 1224px)", { noSsr: true });

  //Setup pano ref
  const panoScenes = useRef<PanoScene[]>([]);

  const { lastYaw, lastPitch } = useContext(ProjectInformationContext);

  const switchScene = useCallback(
    (scene: any, yaw?: number, pitch?: number, fov?: number) => {
      // stopAutorotate();
      const rotatedView = rotateView(
        scene.data.initialViewParameters,
        yaw,
        pitch,
        fov
      );
      scene.view.setParameters(rotatedView);
      scene.scene.switchTo();
      lastSceneId = scene.data.id;
      onSceneChange(scene.data.id);
    },
    [onSceneChange]
  );

  const doesSceneIdExist = (id: string) => {
    return lastSceneIdToSceneIndexMap.has(id);
  };

  useEffect(() => {
    if (lastPitch !== previousPitch && lastYaw !== previousYaw) {
      if (locked) {
        const yawDiff = lastYaw - previousYaw;
        const pitchDiff = lastPitch - previousPitch;
        if (viewer && viewer.view && viewer.view() !== null) {
          const yawToSet = viewer.view()._yaw + yawDiff;
          const pitchToSet = viewer.view()._pitch + pitchDiff;
          viewer.view().setYaw(yawToSet);
          viewer.view().setPitch(pitchToSet);
        }
      }
      previousPitch = lastPitch;
      previousYaw = lastYaw;
    }
  }, [lastPitch, lastYaw, locked]);

  useEffect(() => {
    const viewerOpts = {
      controls: { mouseViewMode },
    };
    if (scenes.length === 0) return;
    const urlPrefix = dataUrl + "/tiles";
    const viewInElement = document.querySelector("#viewIn");
    const viewOutElement = document.querySelector("#viewOut");
    const panoElement = panorama.current;
    viewer = new Marzipano.Viewer(panoElement, viewerOpts);
    const onMouseUp = (e: any) => {
      lastSceneFrame = {
        yaw: viewer?.view()?._yaw,
        pitch: viewer?.view()?._pitch,
        fov: viewer?.view()?._fov,
      };
    };
    (panoElement as unknown as HTMLElement).addEventListener(
      "mouseup",
      onMouseUp
    );
    const controls = viewer.controls();
    if (!mobileMode && !isNil(viewInElement) && !isNil(viewOutElement)) {
      controls.registerMethod(
        "inElement",
        new Marzipano.ElementPressControlMethod(
          viewInElement,
          "zoom",
          -velocity,
          friction
        ),
        true
      );
      controls.registerMethod(
        "outElement",
        new Marzipano.ElementPressControlMethod(
          viewOutElement,
          "zoom",
          velocity,
          friction
        ),
        true
      );
    }

    panoScenes.current = scenes.map((data) => {
      const { id, initialViewParameters, levels, faceSize } = data;
      const source = Marzipano.ImageUrlSource.fromString(
        urlPrefix + "/" + id + "/{z}/{f}/{y}/{x}.jpg",
        { cubeMapPreviewUrl: urlPrefix + "/" + id + "/preview.jpg" }
      );
      const limiter = Marzipano.RectilinearView.limit.traditional(
        2.5 * faceSize,
        (100 * Math.PI) / 180,
        (120 * Math.PI) / 180
      );
      const view = new Marzipano.RectilinearView(
        initialViewParameters,
        limiter
      );
      const geometry = new Marzipano.CubeGeometry(levels);

      const scene = viewer.createScene({
        source: source,
        geometry: geometry,
        view: view,
        pinFirstLevel: true,
      });

      return {
        data,
        scene,
        view,
      };
    });

    let idToIndexMap = new Map<string, number>();
    panoScenes.current.forEach((scene, index) =>
      idToIndexMap.set(scene.data.id, index)
    );
    lastSceneIdToSceneIndexMap = idToIndexMap;

    const dataLinks: DataLink[] = [];
    panoScenes.current.forEach((panoScene) => {
      const { data } = panoScene;
      const sceneId = panoScene.data.id;

      data.linkHotspots.forEach((hotspot, index) => {
        dataLinks.push({
          hotspot: { ...hotspot, id: `${sceneId}_${index}` },
          sceneId: sceneId,
        });
      });
    });

    const sceneToSwitch = selectedScene
      ? selectedScene
      : { sceneId: "0", yaw: 0, pitch: 0, fov: undefined };
    if (sceneToSwitch.sceneId === lastSceneId) {
      sceneToSwitch.yaw = lastSceneFrame?.yaw || sceneToSwitch.yaw;
      sceneToSwitch.pitch = lastSceneFrame?.pitch || sceneToSwitch.pitch;
      sceneToSwitch.fov = lastSceneFrame?.fov || sceneToSwitch.fov;
    }

    const sceneExists = doesSceneIdExist(sceneToSwitch.sceneId);
    const scene = sceneExists
      ? panoScenes.current[idToIndexMap.get(sceneToSwitch.sceneId) || 0]
      : panoScenes.current[0];
    switchScene(
      scene,
      sceneToSwitch.yaw,
      sceneToSwitch.pitch,
      sceneToSwitch.fov
    );

    return () => {
      panoScenes.current = [];
      (panoElement as unknown as HTMLElement).removeEventListener(
        "mouseup",
        onMouseUp
      );
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [data, dataUrl, selectedScene, mouseViewMode, mobileMode, booleanValue]);

  useEffect(() => {
    if (dataUrl !== lastDataUrl) {
      lastDataUrl = dataUrl;
      lastSceneId = undefined;
      lastSceneFrame = undefined;
    }
  }, [dataUrl]);

  useEffect(() => {
    // fix the issue with the first scene not being displayed
    booleanValue = !booleanValue;
  }, []);

  return (
    <React.Fragment>
      <ScreenClose onClose={handleClose} />
      <div style={panoStyle} className="pano-container" ref={panorama} />
    </React.Fragment>
  );
};

export default React.memo(PastPano);
