import * as React from "react";
import { useState } from "react";
import { PublishPhotosConfirmation } from "./PublishPhotosConfirmation";
import { PublishBar } from "../notification-bars/publish-bar/PublishBar";
import { text } from "../../utils/translation";

export interface PublishPhotoTourProps {
  open: boolean;
  onPublish: () => void;
}

export const PublishPhotoTour: React.FC<PublishPhotoTourProps> = ({
  open,
  onPublish,
}) => {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const message = text("publish_tour");

  const handleClosePublishConfirmation = () => {
    setShowPublishDialog(false);
  };

  const onClickPublishButton = () => {
    setShowPublishDialog(true);
  };

  const onPublishApproved = () => {
    setShowPublishDialog(false);
    onPublish();
  };

  return (
    <div>
      <PublishBar
        open={open}
        message={message}
        onPublish={onClickPublishButton}
      />
      <PublishPhotosConfirmation
        open={showPublishDialog}
        handlePhotosPublish={onPublishApproved}
        handleClose={handleClosePublishConfirmation}
      />
    </div>
  );
};
