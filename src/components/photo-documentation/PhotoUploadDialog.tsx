import * as React from "react";
import { ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { DialogLayout } from "../dialogs/dialog-layout/DialogLayout";
import { DialogProps } from "../types/DialogProps";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { Publish } from "@mui/icons-material";
import { Loader } from "../loader/Loader";
import { FileAttachment } from "../file-attachment/FileAttachment";
import { API, Storage, graphqlOperation } from "aws-amplify";
import {
  analyticsError,
  analyticsEvent,
  analyticsPlanActions,
} from "../../utils/analytics";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import {
  getArea,
  getBuilding,
  getFilePath,
  getFloorName,
  getPhotoDirName,
  getProjectDetailsFromPlanUrl,
} from "../../utils/projects-utils";
import { showMessage } from "../../utils/messages-manager";
import theme from "../../ui/theme";
import { useDropzone } from "react-dropzone";
import { DragOverlay } from "./DragOverlay";
import { emptyArray } from "../../utils/render-utils";
import {
  publishVideoOnPlan,
  publishZoomableImage,
} from "../../graphql/mutations";
import { ScanRecord } from "../../models";

const accept = {
  "image/png": [".png"],
  "image/jpg": [".jpg"],
  "image/jpeg": [".jpeg"],
  "video/mp4": [".mp4"],
};

interface WrapWithDropzoneProps {
  wrapInDropzone: boolean;
  getRootProps?: () => React.HTMLAttributes<HTMLDivElement>;
  children: ReactNode;
}

const WrapWithDropzone: React.FC<WrapWithDropzoneProps> = ({
  wrapInDropzone,
  getRootProps,
  children,
}) => {
  if (wrapInDropzone && getRootProps) {
    return <div {...getRootProps()}>{children}</div>;
  }
  return <>{children}</>;
};

export interface PhotoUploadDialogProps extends DialogProps {
  onPhotoAdded: (fileName: string) => void;
  getScanRecord: () => ScanRecord;
  plan: string;
}
let isFirstTime = true;
const PhotoUploadDialog: React.FC<PhotoUploadDialogProps> = ({
  onPhotoAdded,
  open = false,
  handleClose,
  getScanRecord,
  plan,
}) => {
  const mobileMode = useMediaQuery(theme.breakpoints.down("lg"), {
    noSsr: true,
  });
  const [files, setFiles] = useState<File[]>(emptyArray);
  const [fileIsUploading, setFileIsUploading] = useState(false);
  const [is360, setIs360] = useState<boolean>(false);
  const { loggedUser } = useContext(LoggedUserContext);
  const { currentPlan } = useContext(ProjectInformationContext);
  const [uploadProgress, setUploadProgress] = useState<number[]>(emptyArray);
  const { currentProject, currentBuilding, currentFloor, currentArea } =
    useContext(ProjectInformationContext);
  useEffect(() => {
    if (files.length > 15) {
      showMessage("please only upload 15 photos at a time", "error");
      setFiles(emptyArray);
    }
    if (files) {
      files.forEach((file) => {
        const url = URL.createObjectURL(file);
        const img = new Image();

        img.onload = () => {
          if (img.width !== 2 * img.height) {
            setIs360(false);
          } else {
            setIs360(true);
          }
        };

        img.src = url;
      });
    }
  }, [files]);

  useEffect(() => {
    if (files && isFirstTime) {
      setUploadProgress([...uploadProgress, 0]);
      isFirstTime = false;
    }
  }, [files]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    isFirstTime = true;
  };
  let i = 1;
  const onUpload = async () => {
    setFileIsUploading(true);
    for (const file of files) {
      const photoDirName = getPhotoDirName(currentPlan, currentProject?.id);
      const fileName = file.name;

      try {
        await Storage.put(`images/${photoDirName}/${fileName}`, file, {
          level: "public",
          progressCallback(progress: any) {
            const updatedProgress = [...uploadProgress];
            updatedProgress[files.indexOf(file)] =
              progress.loaded / progress.total;
            setUploadProgress(updatedProgress);
          },
        });
        const isVideo = file.type.startsWith("video/");
        const analyticAction: analyticsPlanActions =
          is360 && files.length === 1
            ? "360 image uploaded"
            : isVideo && files.length === 1
            ? "Video uploaded"
            : "Normal image uploaded";
        analyticsEvent("Plan", analyticAction, loggedUser.username);
        if (is360) {
          onPhotoAdded(fileName);
          const message = `Image was uploaded${
            is360 ? "- add another one or publish tour" : ""
          }`;
          showMessage(message, "success");
        } else {
          let updatedLeftLocation = 0;
          let updatedTopLocation = 0;

          const recordToAdd = getScanRecord();
          let angleIncrement = 0;
          let radius = 0.01;
          updatedLeftLocation = recordToAdd.leftLocation;
          updatedTopLocation = recordToAdd.topLocation;
          angleIncrement = (Math.PI * 2) / files.length;
          if (files.length > 2) radius = 0.02;
          if (files.length > 8) radius = 0.03;
          if (files.length > 12) radius = 0.04;
          if (
            recordToAdd.leftLocation + radius * Math.cos(angleIncrement * i) >=
              1 ||
            recordToAdd.leftLocation + radius * Math.cos(angleIncrement * i) <=
              0
          ) {
            updatedLeftLocation = Math.max(
              Math.min(
                recordToAdd.leftLocation +
                  radius * Math.cos(angleIncrement * i),
                1
              ),
              0
            );
          } else {
            updatedLeftLocation =
              recordToAdd.leftLocation + radius * Math.cos(angleIncrement * i);
          }
          if (
            recordToAdd.topLocation + radius * Math.sin(angleIncrement * i) <=
            0
          ) {
            updatedTopLocation = Math.max(
              recordToAdd.topLocation + radius * Math.sin(angleIncrement * i),
              0
            );
          } else {
            updatedTopLocation =
              recordToAdd.topLocation +
              radius * Math.sin(angleIncrement * i) -
              (radius + radius + radius);
          }
          i++;
          const { building, floor } = getProjectDetailsFromPlanUrl(plan);
          const floorToSet = currentFloor?.name
            ? currentFloor?.name
            : getFloorName(floor);
          const project = currentProject?.id || "";
          const filePath = getFilePath(plan, project) + fileName;
          if (isVideo) {
            const publishVideoRes = API.graphql(
              graphqlOperation(publishVideoOnPlan, {
                project,
                building: getBuilding(currentBuilding, building),
                area: getArea(currentArea, floorToSet),
                filePath,
                topLocation: updatedTopLocation,
                leftLocation: updatedLeftLocation,
                isVideo: true,
              })
            ) as Promise<any>;

            publishVideoRes.catch((err) => {
              analyticsError("Failed to publish video: " + JSON.stringify(err));
            });
          } else {
            const publishRes = API.graphql(
              graphqlOperation(publishZoomableImage, {
                project,
                area: getArea(currentArea, floorToSet),
                building: getBuilding(currentBuilding, building),
                filePath,
                topLocation: updatedTopLocation,
                leftLocation: updatedLeftLocation,
              })
            ) as Promise<any>;
            publishRes.catch((err) => {
              analyticsError(
                "Failed to publish zooming image: " + JSON.stringify(err)
              );
            });
          }
        }
        if (i > files.length) {
          i = 1;
          await handleClose();
          const message = "Media was uploaded";
          showMessage(message, "success");
          if (files.length > 1)
            analyticsEvent(
              "Plan",
              "Multiple Media Uploaded",
              loggedUser.username
            );
        }
      } catch (e: any) {
        showMessage(
          "Failed to upload image, check your internet connection and try again",
          "error"
        );
        analyticsError("Failed to upload image: " + JSON.stringify(e), true);
      }
    }

    i = 1;
    setFiles(emptyArray);
    setFileIsUploading(false);
  };

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      setFiles([...files, ...acceptedFiles]);
      setUploadProgress([...uploadProgress, 0]);
    },
    [files, uploadProgress]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });
  useEffect(() => {
    return () => {
      isFirstTime = true;
    };
  }, []);

  return (
    <DialogLayout
      title="Upload media to location"
      handleClose={handleClose}
      open={open}
      showCloseButton
    >
      <DialogContent>
        <WrapWithDropzone
          wrapInDropzone={!mobileMode}
          getRootProps={getRootProps}
        >
          <DialogContentText>
            Take photos or videos, or import them from your phone library, and
            attach them here.
          </DialogContentText>
          <br />
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <DragOverlay />
              ) : (
                <FileAttachment
                  onFileChange={onFileChange}
                  accept="image/png,image/jpeg,image/jpg,video/mp4"
                />
              )}
            </Grid>
            <Grid item xs={6}>
              {files.map((file, index) => {
                const uploadProgressValue = uploadProgress[index];
                const uploadToDisplay =
                  uploadProgressValue !== undefined &&
                  uploadProgressValue !== null &&
                  !isNaN(uploadProgressValue)
                    ? uploadProgressValue * 100
                    : 0;

                return (
                  <div key={index}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      width={mobileMode ? "100px" : "150px"}
                    />
                    <div>
                      {file.name}
                      <progress value={uploadToDisplay} max="100">
                        {uploadToDisplay}%
                      </progress>
                    </div>
                  </div>
                );
              })}
            </Grid>
            <Grid item xs={3}>
              <Loader loading={fileIsUploading} />
            </Grid>
          </Grid>
        </WrapWithDropzone>
      </DialogContent>
      <DialogActions>
        <Tooltip disableInteractive title="Upload photo">
          <Button
            variant="text"
            component="span"
            size="small"
            color="primary"
            disabled={files.length === 0 || fileIsUploading}
            onClick={onUpload}
          >
            <Publish />
          </Button>
        </Tooltip>
      </DialogActions>
    </DialogLayout>
  );
};

export default React.memo(PhotoUploadDialog);
