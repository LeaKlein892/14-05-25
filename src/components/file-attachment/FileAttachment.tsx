import * as React from "react";
import { Button, Tooltip } from "@mui/material";
import AttachmentIcon from "@mui/icons-material/Attachment";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

export interface FileAttachmentProps {
  onFileChange: (e: any) => void;
  accept?: string;
  name?: string;
  tooltip?: string;
  disabled?: boolean;
  useImageIcon?: boolean;
}

export const FileAttachment: React.FC<FileAttachmentProps> = ({
  onFileChange,
  accept = "*",
  name = "",
  tooltip = "Attach File",
  disabled = false,
  useImageIcon = false,
}) => {
  return (
    <div>
      <div>
        <input
          color="primary"
          accept={accept}
          type="file"
          onChange={onFileChange}
          id="icon-button-file"
          style={{ display: "none" }}
        />
        <label htmlFor="icon-button-file">
          <Tooltip disableInteractive title={tooltip}>
            <Button
              variant="contained"
              component="span"
              size="small"
              color="inherit"
              disabled={disabled}
            >
              {useImageIcon ? <PhotoCameraIcon /> : <AttachmentIcon />}
            </Button>
          </Tooltip>
        </label>
      </div>
      <div>
        <label>{name}</label>
      </div>
    </div>
  );
};
