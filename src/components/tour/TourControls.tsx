import * as React from "react";
import { useCallback, useMemo } from "react";
import { Info } from "../../models";
import { CompareTourSelect } from "./compare-tour/CompareTourSelect";
import { COMPARE_3D } from "../../utils/compare-tour-utils";
import { useMediaQuery } from "@mui/material";
import { CompareTourButton } from "./compare-tour/CompareTourButton";

const addBimRecordToOptions = (options: Info[], hasBim = false): Info[] => {
  return hasBim
    ? [{ date: COMPARE_3D, plan: "", tour: "" }, ...options]
    : options;
};

export interface TourControlsProps {
  comparableTours: Info[];
  onCompareTour: (tourToCompare: Info | undefined) => void;
  hasBim?: boolean;
}

export const TourControls: React.FC<TourControlsProps> = ({
  comparableTours,
  onCompareTour,
  hasBim = false,
}) => {
  const mobileMode = useMediaQuery("(max-width: 1224px)", { noSsr: true });

  const onCompareClick = useCallback(
    (tourToCompare: Info | undefined) => {
      onCompareTour(tourToCompare);
    },
    [onCompareTour]
  );

  const options = useMemo(() => {
    return addBimRecordToOptions(comparableTours, hasBim);
  }, [comparableTours, hasBim]);

  return (
    <React.Fragment>
      {!mobileMode ? (
        <CompareTourSelect options={options} onCompareClick={onCompareClick} />
      ) : (
        <CompareTourButton options={options} onCompareClick={onCompareClick} />
      )}
    </React.Fragment>
  );
};
