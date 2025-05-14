import * as React from "react";
import { UploadBar } from "../notification-bars/upload-bar/UploadBar";
import { UploadDialog } from "../account/dialogs/UploadDialog";
import { useState } from "react";

interface VideosUploaderProps {
  hide?: boolean;
}

const VideosUploader: React.FC<VideosUploaderProps> = ({ hide = true }) => {
  const [showDialog, setShowDialog] = useState(false);

  const toggleDialog = () => setShowDialog(!showDialog);
  return (
    <>
      {!hide && <UploadBar onUploadAction={toggleDialog} />}
      <UploadDialog handleClose={toggleDialog} open={showDialog} />
    </>
  );
};

export default VideosUploader;
