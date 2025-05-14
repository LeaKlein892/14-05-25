import * as React from "react";
import { DialogContent } from "@mui/material";
import { DialogLayout } from "../dialog-layout/DialogLayout";
import { DialogProps } from "../../types/DialogProps";
import { ScanRecord } from "../../../models";
import PlanViewer from "../../plan/plan-viewer/PlanViewer";
import { emptyMap } from "../../../utils/render-utils";
import { planLinkFromScanRecord } from "../../../utils/plan-utils";

const contentStyle = { height: "500px" };

export interface PlanLocationDialogProps extends DialogProps {
  record: ScanRecord | undefined;
}

export const PlanLocationDialog: React.FC<PlanLocationDialogProps> = ({
  record,
  open = false,
  handleClose,
}) => {
  return (
    <DialogLayout
      title="Location in plan"
      handleClose={handleClose}
      open={open}
      maxWidth="md"
      showCloseButton
    >
      <DialogContent style={contentStyle}>
        {record?.planUrl && (
          <PlanViewer
            plan={record?.planUrl || ""}
            scale={1.0}
            planLinks={planLinkFromScanRecord(record)}
            embeddedMode
            formViewMode
            sceneIdToNumberOfComments={emptyMap}
            sceneIdToDefaultComment={emptyMap}
          />
        )}
      </DialogContent>
    </DialogLayout>
  );
};
