import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { styled } from "@mui/styles";

import { ScreenClose } from "../../../screen-close/ScreenClose";
import { analyticsError } from "../../../../utils/analytics";
import { BimViewport, PlanBimTransformation } from "../../../../models";
import { ProjectInformationContext } from "../../../../context/ProjectInformationContext";
import {
  eyeVectorFromPlanLocations,
  targetAndUpFromOrientation,
} from "../../../../utils/bim-calculations";

const ViewerDiv = styled("div")({
  width: "100%",
  height: "100%",
  margin: 0,
  backgroundColor: "#f0f8ff",
  position: "relative",
});

const getURN = (embedURLFromA360: string, onURNCallback: any) => {
  fetch(
    embedURLFromA360.replace("public", "metadata").replace("mode=embed", ""),
    {
      method: "get",
    }
  )
    .then((res) => res.json())
    .then((parsedRes) => {
      if (onURNCallback) {
        let urn = btoa(parsedRes.success.body.urn)
          .replace("/", "_")
          .replace("=", "");
        onURNCallback(urn);
      }
    });
};

const getForgeToken = (embedURLFromA360: string) => (onTokenCallback: any) => {
  fetch(
    embedURLFromA360
      .replace("public", "sign")
      .replace("mode=embed", "oauth2=true"),
    {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "bim",
      }),
    }
  )
    .then((res) => res.json())
    .then((oauth) => {
      if (onTokenCallback)
        onTokenCallback(oauth.accessToken, oauth.validitySeconds);
    });
};

const onDocumentLoadError = (errorCode: Autodesk.Viewing.ErrorCodes) => {
  const loadErrorMessage =
    "Failed to load document- " + JSON.stringify(errorCode);
  analyticsError(loadErrorMessage);
};

let showedBimWalkPopup = false;
let allowBimStateSubscribe = true;
let oldTop = 0;
let oldLeft = 0;
let oldYaw = 0;
let oldPlanYaw = 0;
let oldPitch = 0;
let loadedViewport = false;

const BIM_WALK_EXTENSION = "Autodesk.BimWalk";

export interface BimModelProps {
  planBimTransformation: PlanBimTransformation;
  onClose: () => void;
  subscribeToBimState?: (state: BimViewport) => void;
  syncToSceneChanges?: boolean;
  forceFirstPerson?: boolean;
}

const BimModel: React.FC<BimModelProps> = ({
  planBimTransformation,
  onClose,
  subscribeToBimState,
  syncToSceneChanges = true,
  forceFirstPerson = false,
}) => {
  const {
    bimUrl,
    transformationMatrix,
    floorUpVec,
    northVec,
    eastVec,
    viewport,
    preventFirstPerson,
  } = planBimTransformation;

  const [viewer, setViewer] = useState<
    Autodesk.Viewing.GuiViewer3D | undefined
  >(undefined);

  const { lastTopLocation, lastLeftLocation, lastYaw, lastPitch, lastPlanYaw } =
    useContext(ProjectInformationContext);

  const [textureLoaded, setTextureLoaded] = useState(false);

  useEffect(() => {
    if (
      viewer &&
      textureLoaded &&
      transformationMatrix &&
      floorUpVec &&
      northVec &&
      eastVec &&
      viewport &&
      syncToSceneChanges
    ) {
      if (
        lastTopLocation === oldTop &&
        lastLeftLocation === oldLeft &&
        lastYaw === oldYaw &&
        lastPitch === oldPitch &&
        lastPlanYaw === oldPlanYaw &&
        !(
          lastTopLocation === 0 &&
          lastLeftLocation === 0 &&
          lastYaw === 0 &&
          lastPitch === 0 &&
          lastPlanYaw === 0
        )
      )
        return;
      const stateToSet = { ...viewer.getState() } as any;
      if (!loadedViewport) {
        stateToSet.viewport = viewport;
        loadedViewport = true;
      }
      if (!(lastTopLocation === 0 && lastLeftLocation === 0)) {
        const eyeForModel = eyeVectorFromPlanLocations(
          lastTopLocation,
          lastLeftLocation,
          transformationMatrix,
          floorUpVec
        );
        if (!(lastTopLocation === oldTop && lastLeftLocation === oldLeft)) {
          stateToSet.viewport.eye = eyeForModel;
        }
        const [target, up] = targetAndUpFromOrientation(
          lastYaw + lastPlanYaw,
          lastPitch,
          northVec,
          eastVec,
          stateToSet.viewport.worldUpVector,
          stateToSet.viewport.eye
        );
        stateToSet.viewport.target = target;
        stateToSet.viewport.up = up;
      }
      oldLeft = lastLeftLocation;
      oldTop = lastTopLocation;
      oldYaw = lastYaw;
      oldPlanYaw = lastPlanYaw;
      oldPitch = lastPitch;
      viewer.restoreState(stateToSet);
    }
  }, [
    lastTopLocation,
    lastLeftLocation,
    viewer,
    textureLoaded,
    syncToSceneChanges,
    floorUpVec,
    northVec,
    eastVec,
    transformationMatrix,
    viewport,
    lastYaw,
    lastPitch,
    lastPlanYaw,
  ]);

  const onDocumentLoadSuccess = useCallback(
    (doc: Autodesk.Viewing.Document) => {
      // A document contains references to 3D and 2D viewables.
      const defaultGeometry = doc.getRoot().getDefaultGeometry();
      if (defaultGeometry.length === 0) {
        const errMessage = "Bim document contains no viewable layers.";
        analyticsError(errMessage + ` ${bimUrl}`);
        return;
      }

      const config = {
        extensions: [
          "Autodesk.AEC.LevelsExtension",
          "Autodesk.AEC.Minimap3DExtension",
        ],
      };

      const viewerDiv: any = document.getElementById("MyViewerDiv");
      const viewerToSet = new Autodesk.Viewing.GuiViewer3D(viewerDiv, config);
      if (showedBimWalkPopup) {
        viewerToSet.setBimWalkToolPopup(false);
      }
      setViewer(viewerToSet);
      viewerToSet.start();

      viewerToSet
        .loadDocumentNode(doc, defaultGeometry)
        .then(function (model1: Autodesk.Viewing.Model) {
          viewerToSet.addEventListener(
            Autodesk.Viewing.TEXTURES_LOADED_EVENT,
            async () => {
              setTextureLoaded(true);
              if (forceFirstPerson || !preventFirstPerson) {
                const bimWalk = viewerToSet.getExtension(BIM_WALK_EXTENSION);
                bimWalk && bimWalk.activate && bimWalk.activate("");
              }
            }
          );
          if (subscribeToBimState) {
            viewerToSet.addEventListener(
              Autodesk.Viewing.CAMERA_CHANGE_EVENT,
              () => {
                if (!allowBimStateSubscribe) return;
                allowBimStateSubscribe = false;
                subscribeToBimState(
                  (viewerToSet as any).viewerState.getState().viewport
                );
                setTimeout(() => (allowBimStateSubscribe = true), 3000);
              }
            );
          }
        });
    },
    [bimUrl, subscribeToBimState, forceFirstPerson, preventFirstPerson]
  );

  const onScriptLoaded = useCallback(() => {
    getURN(bimUrl, (urn: string) => {
      const options = {
        env: "AutodeskProduction",
        getAccessToken: getForgeToken(bimUrl),
      };
      const documentId: string = "urn:" + urn;
      Autodesk.Viewing.Initializer(options, function onInitialized() {
        Autodesk.Viewing.Document.load(
          documentId,
          onDocumentLoadSuccess,
          onDocumentLoadError
        );
      });
    });
  }, [bimUrl, onDocumentLoadSuccess]);

  useEffect(() => {
    if (!viewer) {
      if (!window.Autodesk) {
        loadCss(
          "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.58/style.min.css"
        );

        loadScript(
          "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.58/viewer3D.min.js"
        ).onload = () => {
          onScriptLoaded();
        };
      } else {
        onScriptLoaded();
      }
    }

    return () => {
      if (viewer) {
        const bimWalkExtension = viewer.getExtension(BIM_WALK_EXTENSION);
        bimWalkExtension &&
          bimWalkExtension.deactivate &&
          bimWalkExtension.deactivate();
        viewer.removeEventListener(
          Autodesk.Viewing.TEXTURES_LOADED_EVENT,
          () => {}
        );
        if (subscribeToBimState) {
          viewer.removeEventListener(
            Autodesk.Viewing.CAMERA_CHANGE_EVENT,
            () => {}
          );
        }
        viewer.finish();
        setViewer(undefined);
        Autodesk.Viewing.shutdown();
      }
    };
  }, [viewer, onScriptLoaded, subscribeToBimState]);

  useEffect(() => {
    return () => {
      showedBimWalkPopup = true;
      oldLeft = 0;
      oldTop = 0;
      oldYaw = 0;
      oldPitch = 0;
      oldPlanYaw = 0;
      loadedViewport = false;
    };
  }, []);

  const loadCss = (src: string): HTMLLinkElement => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = src;
    link.type = "text/css";
    document.head.appendChild(link);
    return link;
  };

  const loadScript = (src: string): HTMLScriptElement => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return script;
  };

  return (
    <>
      <ViewerDiv id="MyViewerDiv" />
      <ScreenClose onClose={onClose} />
    </>
  );
};

export default React.memo(BimModel);
