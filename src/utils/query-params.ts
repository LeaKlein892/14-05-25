const keysToEncode = ["pdf", "dataUrl"];
const encodePrefix = "https";

const getQueryArgs = (param: string, defVal?: any) => {
  return extractQueryArgFromUrl(window.location.search, param, defVal);
};

const getNumberQueryArgs = (param: string, defVal?: number) => {
  const stringValue = getQueryArgs(param);
  return stringValue ? parseFloat(stringValue) : defVal;
};

const getQueryArgsFromUrl = (url: string, param: string, defVal?: any) => {
  const search = new URL(url).search;
  return extractQueryArgFromUrl(search, param, defVal);
};

const decodeParam = (key: string, value: string) => {
  if (keysToEncode.includes(key)) {
    return value.startsWith(encodePrefix) ? value : atob(value);
  }
  return value;
};
const encodeParam = (key: string, value: string) => {
  if (keysToEncode.includes(key)) {
    return btoa(value);
  }
  return value;
};

const extractQueryArgFromUrl = (url: string, param: string, defVal?: any) => {
  const urlParams = new URLSearchParams(url);
  const paramValue = urlParams.get(param);
  return paramValue ? decodeParam(param, paramValue) : defVal;
};

const getUrlWithoutParam = (param: string) => {
  const url = window.location.href;
  const urlDescriptor = new URL(url);
  urlDescriptor.searchParams.delete(param);
  return urlDescriptor.toString();
};

const setOrReplaceSearchParams = (
  searchUrl: string,
  params: string[],
  newVals: string[]
) => {
  const urlParams = new URLSearchParams(searchUrl);
  params.forEach((param, i) => {
    urlParams.set(param, encodeParam(param, newVals[i]));
  });
  return urlParams.toString();
};

const putParamsInUrl = (
  url: string,
  paramKeys: string[],
  paramValues: string[]
) => {
  const urlDescriptor = new URL(url);
  paramKeys.forEach((e, i) => {
    if (paramValues) {
      urlDescriptor.searchParams.set(e, encodeParam(e, paramValues[i]));
    }
  });
  return urlDescriptor.toString();
};

export {
  getQueryArgs,
  getNumberQueryArgs,
  putParamsInUrl,
  getQueryArgsFromUrl,
  getUrlWithoutParam,
  encodeParam,
  setOrReplaceSearchParams,
};
