import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Info } from "../models";
import { analyticsError } from "../utils/analytics";
import { Data } from "../typings/panoramas";
import { ProjectInformationContext } from "../context/ProjectInformationContext";
import { getComparableToursFromArea } from "../utils/compare-tour-utils";

export function useTourInfo(
  tourDataUrl: string,
  tourDate: string,
  shouldChooseProject: boolean = false,
  tourToCompare?: Info
) {
  let data: Data;
  let setData: Dispatch<SetStateAction<any>>;

  [data, setData] = useState({
    scenes: [],
    name: "",
    settings: {
      mouseViewMode: "drag",
    },
  });

  let compareToTourData: Data;
  let setCompareToTourData: Dispatch<SetStateAction<any>>;
  [compareToTourData, setCompareToTourData] = useState({
    scenes: [],
    name: "",
    settings: {
      mouseViewMode: "drag",
    },
  });

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [comparableTours, setComparableTours] = useState<Info[]>([]);

  const { currentArea } = useContext(ProjectInformationContext);

  const refetch = useCallback(
    async (url: string) => {
      try {
        const jsonData = await fetch(url + "/data.json");
        const data = await jsonData.json();
        setErrorMsg("");
        document.title = data.name;
        return data;
      } catch (e: any) {
        if (!shouldChooseProject) {
          analyticsError(
            "Failed to load in useTourInfo: " + JSON.stringify(e),
            true
          );
          setErrorMsg(e.toString());
        }
      }
    },
    [shouldChooseProject, setErrorMsg]
  );

  const fetchTourData = useCallback(async () => {
    refetch(tourDataUrl).then((d) => {
      setData(d);
    });
  }, [tourDataUrl, refetch, setData]);

  const fetchCompareTourData = useCallback(async () => {
    tourToCompare?.tour &&
      refetch(tourToCompare?.tour).then((d) => {
        setCompareToTourData(d);
      });
  }, [tourToCompare, refetch, setCompareToTourData]);

  const getComparableTours = useCallback(async () => {
    if (!shouldChooseProject) {
      if (currentArea) {
        const compareTour = getComparableToursFromArea(currentArea);
        if (compareTour) {
          setComparableTours([...compareTour]);
        }
      }
    }
  }, [setComparableTours, shouldChooseProject, currentArea]);

  useEffect(() => {
    if (tourDataUrl && tourDataUrl !== "") {
      fetchTourData().then((d) => {
        getComparableTours().then(() => {});
      });
    }
    if (tourToCompare?.tour && tourToCompare.tour !== "") {
      fetchCompareTourData().then((d) => {});
    }
  }, [
    fetchTourData,
    fetchCompareTourData,
    getComparableTours,
    tourDataUrl,
    setData,
    setErrorMsg,
    tourToCompare,
  ]);

  return {
    tourData: data,
    errorMsg: errorMsg,
    comparableTours: comparableTours,
    compareToTourData: compareToTourData,
  };
}
