import { createContext, Dispatch, SetStateAction } from "react";
import { TabValue } from "../components/navbar/NavbarLinks";
import { emptyFn } from "../utils/render-utils";

export enum AppModeEnum {
  tourView = "/tour",
  planView = "/plan",
  projectView = "/project",
}

interface ViewContextData {
  appMode?: AppModeEnum;
  navbarOpen: boolean;
  setNavbarOpen: Dispatch<SetStateAction<boolean>>;
  tabValue: TabValue;
  setTabValue: Dispatch<SetStateAction<TabValue>>;
  planScale?: number | undefined;
  setPlanScale: Dispatch<SetStateAction<number | undefined>>;
  openUploader: (open: boolean) => void;
}

export const ViewContext = createContext<ViewContextData>({
  appMode: AppModeEnum.tourView,
  navbarOpen: false,
  setNavbarOpen: emptyFn,
  tabValue: TabValue.Projects,
  setTabValue: emptyFn,
  planScale: 1,
  setPlanScale: emptyFn,
  openUploader: (open: boolean) => {},
});
