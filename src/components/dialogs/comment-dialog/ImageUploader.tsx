import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { Storage } from "aws-amplify";
import { dateAsExactTime } from "../../../utils/date-utils";
import { analyticsEvent } from "../../../utils/analytics";
import { LoggedUserContext } from "../../../context/LoggedUserContext";
import { FileAttachment } from "../../file-attachment/FileAttachment";
import { commentImageStorageLocation } from "../../../utils/comments-utils";
import { showMessage } from "../../../utils/messages-manager";

export interface ImageUploaderProps {
  onReplyClicked: (reply: string, isFile?: boolean) => void;
  onUploadStart?: () => void;
  onUploadComplete?: () => void;
  tooltip?: string;
  disabled?: boolean;
}

const getImageFileName = (fileName: string) =>
  dateAsExactTime() + "_" + fileName;

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onReplyClicked,
  onUploadStart = () => {},
  onUploadComplete = () => {},
  tooltip = "Attach File",
  disabled = false,
}) => {
  const [file, setFile] = useState<any>(undefined);
  const { loggedUser } = useContext(LoggedUserContext);

  const onUpload = async () => {
    if (!file) {
      return;
    }
    try {
      onUploadStart();
      const fileName = getImageFileName(file.name);
      await Storage.put(commentImageStorageLocation(fileName), file, {
        contentType: "image/png",
        level: "public",
      });
      onReplyClicked(fileName, true);
      analyticsEvent("Tasks", "Task Image Uploaded", loggedUser.username);
      showMessage(
        "Image uploaded successfully- and saved as a reply",
        "success"
      );
    } catch (e: any) {
      showMessage("Failed to upload image: " + e.toString(), "error");
    } finally {
      onUploadComplete();
    }
  };

  const onFileChange = (e: any) => {
    const file = e.target.files[0];
    setFile(file);
  };

  useEffect(() => {
    onUpload();
  }, [file]);

  return (
    <FileAttachment
      onFileChange={onFileChange}
      accept="image/*"
      name={file ? file.name : ""}
      disabled={disabled}
      tooltip={tooltip}
      useImageIcon
    />
  );
};
