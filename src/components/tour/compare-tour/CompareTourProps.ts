import { Info } from "../../../models";

export interface CompareTourProps {
  options: Info[];
  onCompareClick: (tourToCompare: Info | undefined) => void;
}
