import { add, cross, multiply, norm } from "mathjs";

const eyeVectorFromPlanLocations = (
  topLocation: number,
  leftLocation: number,
  transformationMatrix: number[],
  floorUpVec: number[]
): number[] => {
  const planLocationVector = [leftLocation, topLocation, 1];
  const planTransformedToBim = add(
    multiply(planLocationVector, transformationMatrix),
    floorUpVec
  ) as number[];
  return planTransformedToBim;
};

const targetAndUpFromOrientation = (
  yaw: number,
  pitch: number,
  northVec: number[],
  eastVec: number[],
  worldUp: number[],
  eye: number[]
) => {
  const pitchToUse = -1 * pitch;
  const yawVec = multiply(
    Math.cos(pitchToUse),
    add(multiply(Math.cos(yaw), northVec), multiply(Math.sin(yaw), eastVec))
  );
  const pitchVec = multiply(Math.sin(pitchToUse), worldUp);
  const viewVector = add(yawVec, pitchVec) as number[];
  const rotationAxis = cross(viewVector, worldUp);
  const up = cross(rotationAxis, viewVector);
  const normalizedUp = multiply(up, 1 / (norm(up) as number));
  const target = add(eye, viewVector);
  return [target, normalizedUp];
};

const planLocationsFromBimState = (
  rotationMatrix: number[],
  inverseMatchMatrix: number[],
  eye: number[]
): number[] => {
  const eyeTag = multiply(eye, rotationMatrix);
  eyeTag[2] = 1;
  const locations = multiply(eyeTag, inverseMatchMatrix);
  const leftLocation = locations[0];
  const topLocation = locations[1];
  return [leftLocation, topLocation];
};

export {
  eyeVectorFromPlanLocations,
  targetAndUpFromOrientation,
  planLocationsFromBimState,
};
