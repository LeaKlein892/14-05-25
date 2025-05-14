import * as XLSX from "xlsx-js-style";
import { saveAs } from "file-saver";
import { Comment } from "../models";
import { NON_LOCATED } from "./tasks-issue-types-utils";
import {
  getFloorName,
  getProjectDetailsFromDataUrl,
  getProjectDetailsFromPlanUrl,
} from "./projects-utils";
import { APP_TOUR } from "./site-routes";

const xlsFileType =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const xlsFileExtension = ".xlsx";

const DEFAULT_COLUMN_WIDTH = 20;

const setColumnWidthsAndBorders = (workSheet: XLSX.WorkSheet, data: any[]) => {
  if (!data.length) return;
  const columnWidths = Object.keys(data[0]).map(() => ({
    wch: DEFAULT_COLUMN_WIDTH,
  }));
  workSheet["!cols"] = columnWidths;
  const borderStyle = {
    top: { style: "thick", color: { rgb: "000000" } },
    bottom: { style: "thick", color: { rgb: "000000" } },
    left: { style: "thick", color: { rgb: "000000" } },
    right: { style: "thick", color: { rgb: "000000" } },
  };
  const range = XLSX.utils.decode_range(workSheet["!ref"] || "");
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = { c: C, r: R };
      const cellRef = XLSX.utils.encode_cell(cellAddress);
      if (!workSheet[cellRef]) workSheet[cellRef] = { t: "s", v: "" };
      if (!workSheet[cellRef].s) workSheet[cellRef].s = {};
      workSheet[cellRef].s.border = borderStyle;
    }
  }
};

const exportExcel = (
  data: any[],
  workSheetName: string,
  fileName: string,
  setCellStyles?: setCellStyles
) => {
  const workBook = XLSX.utils.book_new();
  const workSheet = XLSX.utils.json_to_sheet(data);
  if (setCellStyles) {
    setCellStyles(workSheet, data);
  }
  setColumnWidthsAndBorders(workSheet, data);
  XLSX.utils.book_append_sheet(workBook, workSheet, workSheetName);
  const excelBuffer = XLSX.write(workBook, { bookType: "xlsx", type: "array" });
  const exportData = new Blob([excelBuffer], { type: xlsFileType });
  saveAs(exportData, fileName + xlsFileExtension);
};

const createLinkForTour = (
  dataUrl: string,
  sceneId: string,
  yaw: number = 0,
  pitch: number = 0
) =>
  APP_TOUR +
  "?dataUrl=" +
  encodeURIComponent(dataUrl) +
  "&sceneId=" +
  sceneId +
  "&yaw=" +
  yaw +
  "&pitch=" +
  pitch;
type setCellStyles = (workSheet: XLSX.WorkSheet, data: any[]) => void;
const exportCommentsToXlsx = (comments: Comment[] = []) => {
  const commentsExportedFields = comments.map((comment) => {
    let building, floor;
    const dataUrl = comment.dataUrl;
    if (dataUrl === NON_LOCATED) {
      building = getProjectDetailsFromPlanUrl(
        comment.record?.planUrl || ""
      ).building;
      floor = getProjectDetailsFromPlanUrl(comment.record?.planUrl || "").floor;
    } else {
      building = getProjectDetailsFromDataUrl(dataUrl).building;
      floor = getProjectDetailsFromDataUrl(dataUrl).floor;
    }
    const linkTitle = dataUrl !== NON_LOCATED ? "link" : "";
    return {
      reporter: comment.writtenBy,
      role: comment.role,
      location: {
        t: linkTitle,
        v: linkTitle,
        l: {
          Target: createLinkForTour(
            comment.dataUrl,
            comment.scene.sceneId || "1_0_0",
            comment.scene.yaw,
            comment.scene.pitch
          ),
          Tooltip: "Not SheetJS :(",
        },
      },
      description: comment.description,
      building,
      floor: getFloorName(floor),
      DateOpened: (comment as any).createdAt.split("T")[0],
      status: comment.resolved ? "Completed" : "Open",
      type: comment.issueTypes?.toString(),
    };
  });

  exportExcel(commentsExportedFields, "Tasks", "Tasks");
};

export interface ExportsProgressData {
  Date: string;
  Area: string;
  Anchor?: string;
  [key: string]: any;
}

const exportProgressTableToXlsx = (
  progressData: ExportsProgressData[] = [],
  setCellStyles: setCellStyles,
  date = "",
  name = ""
) => {
  exportExcel(
    progressData,

    date !== "" ? date : "Progress Table",
    name !== "" ? name : "Progress Table",
    setCellStyles
  );
};

export { exportCommentsToXlsx, exportProgressTableToXlsx };
