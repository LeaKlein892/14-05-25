import { putParamsInUrl } from "./query-params";

const PREVIEW_PRELOAD_BUFFER = 5;

const cacheSinglePreview = (urlPrefix: string, idToCache: string) => {
  const cachedImage = new Image();
  cachedImage.crossOrigin = "anonymous";
  cachedImage.src = urlPrefix + "/" + idToCache + "/preview.jpg";
};

const preLoadPreviewImages = (
  urlPrefix: string,
  sceneId: string,
  maxPossibleId: number
) => {
  const splitId = sceneId.split("_");
  const sceneIdAsNumber = parseInt(splitId[splitId.length - 1]);
  const idPrefix =
    splitId.length > 1 ? splitId[0] + "_" + splitId[1] + "_" : "";

  const minLoadId = Math.max(0, sceneIdAsNumber - PREVIEW_PRELOAD_BUFFER);
  const maxLoadId = Math.min(
    sceneIdAsNumber + PREVIEW_PRELOAD_BUFFER,
    maxPossibleId
  );
  cacheSinglePreview(urlPrefix, idPrefix + sceneIdAsNumber);
  for (let idToCache = minLoadId; idToCache < maxLoadId; idToCache++) {
    if (idToCache !== sceneIdAsNumber) {
      cacheSinglePreview(urlPrefix, idPrefix + idToCache);
    }
  }
};

const getOppositeDirectionYaw: (yaw: number) => number = (yaw: number) => {
  const yawToUse = modulo2PI(yaw);
  return yawToUse > Math.PI ? yawToUse - Math.PI : yawToUse + Math.PI;
};

const getAnglesDifference = (yaw1: number, yaw2: number) => {
  const anglesDiff = Math.abs(modulo2PI(yaw1) - modulo2PI(yaw2));
  return anglesDiff > Math.PI ? 2 * Math.PI - anglesDiff : anglesDiff; // get small angle
};

const modulo2PI = (angle: number) => (angle + 10 * Math.PI) % (Math.PI * 2);

const shouldLazyLoad = (numberOfScenes: number, isMobile: boolean) => {
  return isMobile ? numberOfScenes > 200 : numberOfScenes > 400;
};

const getFullTourUrl = (
  sceneFrame: { pitch: number; fov: number; yaw: number },
  dataUrl: string,
  sceneIdStr: string,
  baseUrl?: string
) => {
  const yaw = sceneFrame.yaw?.toString();
  const pitch = sceneFrame.pitch?.toString();
  const fov = sceneFrame.fov?.toString();
  const url = baseUrl || window.location.href;
  const urlWithParams = putParamsInUrl(
    url,
    ["dataUrl", "sceneId", "yaw", "pitch", "fov"],
    [dataUrl, sceneIdStr, yaw, pitch, fov]
  );
  return urlWithParams;
};

export {
  preLoadPreviewImages,
  getOppositeDirectionYaw,
  getAnglesDifference,
  shouldLazyLoad,
  modulo2PI,
  getFullTourUrl,
};
