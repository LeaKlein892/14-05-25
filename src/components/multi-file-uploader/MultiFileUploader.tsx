import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  ReactNode,
} from "react";
import { DialogLayout } from "../dialogs/dialog-layout/DialogLayout";
import { DialogProps } from "../types/DialogProps";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  IconButton,
  Theme,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import { createStyles } from "@mui/styles";
import { AddCircle, Publish, CheckCircle, Cancel } from "@mui/icons-material";
import { Loader } from "../loader/Loader";
import { API, Storage } from "aws-amplify";
import { analyticsError, analyticsEvent } from "../../utils/analytics";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { ProjectInformationContext } from "../../context/ProjectInformationContext";
import { showMessage } from "../../utils/messages-manager";
import theme from "../../ui/theme";
import { useDropzone } from "react-dropzone";
import { DragOverlay } from "../photo-documentation/DragOverlay";
import { dateAsYMD } from "../../utils/date-utils";
import { publishZoomableImage, sendEmail } from "../../graphql/mutations";
import { validateFileInLocation } from "../../graphql/queries";
import { GRAPHQL_AUTH_MODE, graphqlOperation } from "@aws-amplify/api-graphql";
import { emptyArray } from "../../utils/render-utils";
import NoSleep from "nosleep.js";
import {
  getFilePath,
  getFloorName,
  getPhotoDirName,
  getProjectDetailsFromPlanUrl,
} from "../../utils/projects-utils";
import { makeStyles } from "@mui/styles";
import { APP_HOME } from "../../utils/site-routes";
import { PUBLIC_BUCKET } from "../../utils/aws-utils";

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

const noSleep = new NoSleep();
let imagesIndex = 1;
const MAX_UPLOAD_RETRIES = 6;
const delay = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    errorLabel: {
      color: theme.palette.error.main,
    },
  })
);
const getLastThreeDigits = (path: string): number => {
  const match = path.match(/(\d{3})\.\w+$/);
  const result = match ? parseInt(match[1], 10) : 0;
  return isNaN(result) ? 0 : result;
};

const MultiFileUploader: React.FC<DialogProps> = ({
  open = false,
  handleClose,
}) => {
  const classes = useStyles();
  const mobileMode = useMediaQuery(theme.breakpoints.down("lg"), {
    noSsr: true,
  });
  const [files, setFiles] = useState<any[]>(emptyArray);
  const [fileIsUploading, setFileIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>(emptyArray);
  const [uploadStatus, setUploadStatus] =
    useState<("success" | "error" | "uploading" | "")[]>(emptyArray);
  const [is360, setIs360] = useState<boolean>(false);
  const { loggedUser } = useContext(LoggedUserContext);
  const { currentProject } = useContext(ProjectInformationContext);
  const [showUploadConfirmation, setShowUploadConfirmation] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [completionMessage, setCompletionMessage] = useState("");
  const [failedFiles, setFailedFiles] = useState<string[]>([]);
  const userMail = loggedUser.email;

  useEffect(() => {
    const confirmExit = (e: any) => {
      e.returnValue = "Are you sure you want to leave this page?";

      return "Are you sure you want to leave this page?";
    };

    window.addEventListener("beforeunload", confirmExit);

    return () => {
      window.removeEventListener("beforeunload", confirmExit);
    };
  }, []);

  useEffect(() => {
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

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      setShowUploadConfirmation(true);

      // Initialize progress and status for new files
      const newProgressArray = [...uploadProgress];
      const newStatusArray = [...uploadStatus];

      newFiles.forEach(() => {
        newProgressArray.push(0);
        newStatusArray.push("uploading");
      });

      setUploadProgress(newProgressArray);
      setUploadStatus(newStatusArray);
    }
  };

  // Upload image files with retry mechanism
  const uploadImageWithRetry = async (file: File, retryCount: number = 0) => {
    try {
      const fileName = file.name;
      const plan = currentProject?.defaultPlan || "";
      const projectId = currentProject?.id || "UNKNOWN";
      const photoDirName = getPhotoDirName(plan, projectId);
      const s3Path = `images/${photoDirName}/${fileName}`;

      // Upload the file to S3
      await Storage.put(s3Path, file, {
        level: "public",
        progressCallback(progress: any) {
          const fileIndex = files.indexOf(file);
          setUploadProgress((prevProgress) => {
            const updatedProgress = [...prevProgress];
            updatedProgress[fileIndex] = progress.loaded / progress.total;
            return updatedProgress;
          });
        },
      });

      // Update status to success and set progress to 100%
      const fileIndex = files.indexOf(file);
      setUploadStatus((prevStatus) => {
        const updatedStatus = [...prevStatus];
        updatedStatus[fileIndex] = "success";
        return updatedStatus;
      });

      // Ensure progress bar shows 100% for successful uploads
      setUploadProgress((prevProgress) => {
        const updatedProgress = [...prevProgress];
        updatedProgress[fileIndex] = 1; // 1 = 100%
        return updatedProgress;
      });

      // Process image for plan display
      const radius = 0.1 + Math.random() * 0.1;
      const startingAngle = Math.random() * (Math.PI / 9);
      let angle = 0;
      const numberOfImages =
        currentProject?.defaultPlan && !is360 ? numberOfNormalImages() : 1;

      const angleIncrement = (Math.PI * 2) / numberOfImages;
      const centerX = 0.5;
      const centerY = 0.5;

      angle += angleIncrement;

      if (imagesIndex === 1) {
        angle += startingAngle;
      }
      const updatedLeftLocation = centerX + radius * Math.cos(angle);
      let updatedTopLocation = centerY + radius * Math.sin(angle);

      updatedTopLocation = Math.max(updatedTopLocation, 0);
      imagesIndex++;
      // Handle potential undefined values with defaults
      const { building = "", floor = "" } = getProjectDetailsFromPlanUrl(plan);
      const floorToSet = getFloorName(floor);
      const project = currentProject?.id || "";
      const filePath = getFilePath(plan, project) + fileName;
      const publishRes = API.graphql(
        graphqlOperation(publishZoomableImage, {
          project,
          area: "fl" + floorToSet,
          building: building,
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

      showMessage("Image was uploaded", "success");
      if (numberOfImages > 1) {
        analyticsEvent(
          "Plan",
          "Multiple Images Uploaded From The Main Plan",
          loggedUser.username
        );
      }
    } catch (e: any) {
      if (retryCount < MAX_UPLOAD_RETRIES) {
        // Subtract 1 to account for zero-based indexing
        const retryDelay = Math.pow(2, retryCount) * 1000;
        console.error(
          `Upload failed for ${file.name}. Retrying after ${
            retryDelay / 1000
          } seconds... (Attempt ${retryCount + 1} of ${MAX_UPLOAD_RETRIES})`
        );

        // Reset progress bar to 0 for this specific file before retry
        const fileIndex = files.indexOf(file);
        setUploadProgress((prevProgress) => {
          const updatedProgress = [...prevProgress];
          updatedProgress[fileIndex] = 0; // Only reset this specific file's progress
          return updatedProgress;
        });

        await delay(retryDelay);
        await uploadImageWithRetry(file, retryCount + 1);
      } else {
        console.error(`Max retries reached for ${file.name}. Upload failed.`);

        // Update status to error using functional update
        const fileIndex = files.indexOf(file);
        setUploadStatus((prevStatus) => {
          const updatedStatus = [...prevStatus];
          updatedStatus[fileIndex] = "error";
          return updatedStatus;
        });

        showMessage(
          "Failed to upload image, check your internet connection and try again",
          "error"
        );
        analyticsError("Failed to upload image: " + JSON.stringify(e), true);

        // Add file to failed files list
        setFailedFiles((prevFailedFiles) => [...prevFailedFiles, file.name]);
      }
    }
  };

  const uploadFileWithRetry = async (
    file: File,
    retryCount: number = 0,
    isSecondAttempt: boolean = false
  ) => {
    try {
      const photoDirName = `${currentProject?.id || "UNKNOWN"}/${dateAsYMD()}`;
      const s3Path = `videos/${photoDirName}/${file.name}`;
      const fileIndex = files.indexOf(file);
      const bucketLocation = `${PUBLIC_BUCKET}public/videos/${photoDirName}`;

      // Upload the file to S3
      await Storage.put(s3Path, file, {
        level: "public",
        progressCallback(progress: any) {
          setUploadProgress((prevProgress) => {
            const updatedProgress = [...prevProgress];
            updatedProgress[fileIndex] = progress.loaded / progress.total;
            return updatedProgress;
          });
        },
      });

      // Set progress to 100% after upload
      setUploadProgress((prevProgress) => {
        const updatedProgress = [...prevProgress];
        updatedProgress[fileIndex] = 1; // 1 = 100%
        return updatedProgress;
      });

      // Validate that the file exists in the bucket
      await delay(2000); // Add 2 second delay before validation
      const isValidated = await validateUploadedFile(file.name, bucketLocation);

      if (isValidated) {
        // Update status to success
        setUploadStatus((prevStatus) => {
          const updatedStatus = [...prevStatus];
          updatedStatus[fileIndex] = "success";
          return updatedStatus;
        });

        showMessage("File was uploaded and validated", "success");
        return true; // Upload successful
      } else if (retryCount < MAX_UPLOAD_RETRIES) {
        // File validation failed, retry with exponential backoff if under max retries
        const retryDelay = Math.pow(2, retryCount) * 1000;

        console.error(
          `Validation failed for ${file.name}. Retrying after ${
            retryDelay / 1000
          } seconds... (Attempt ${retryCount + 1} of ${MAX_UPLOAD_RETRIES})`
        );

        // Reset progress bar to 0 for this specific file before retry
        setUploadProgress((prevProgress) => {
          const updatedProgress = [...prevProgress];
          updatedProgress[fileIndex] = 0; // Only reset this specific file's progress
          return updatedProgress;
        });

        await delay(retryDelay);
        return await uploadFileWithRetry(file, retryCount + 1, isSecondAttempt);
      } else {
        // Max retries reached
        console.error(`Max retries reached for ${file.name}. Upload failed.`);

        // Update status to error
        setUploadStatus((prevStatus) => {
          const updatedStatus = [...prevStatus];
          updatedStatus[fileIndex] = "error";
          return updatedStatus;
        });

        // Only add to failed files if this isn't already a second attempt
        if (!isSecondAttempt) {
          setFailedFiles((prevFailedFiles) => [...prevFailedFiles, file.name]);
        }

        return false; // Upload failed
      }
    } catch (e: any) {
      // Handle upload errors
      if (retryCount < MAX_UPLOAD_RETRIES) {
        const retryDelay = Math.pow(2, retryCount) * 1000;

        console.error(
          `Upload failed for ${file.name}. Retrying after ${
            retryDelay / 1000
          } seconds... (Attempt ${retryCount + 1} of ${MAX_UPLOAD_RETRIES})`
        );

        // Reset progress bar to 0 for this specific file before retry
        const fileIndex = files.indexOf(file);
        setUploadProgress((prevProgress) => {
          const updatedProgress = [...prevProgress];
          updatedProgress[fileIndex] = 0; // Only reset this specific file's progress
          return updatedProgress;
        });

        await delay(retryDelay);
        return await uploadFileWithRetry(file, retryCount + 1, isSecondAttempt);
      } else {
        console.error(`Max retries reached for ${file.name}. Upload failed.`);

        // Update status to error
        const fileIndex = files.indexOf(file);
        setUploadStatus((prevStatus) => {
          const updatedStatus = [...prevStatus];
          updatedStatus[fileIndex] = "error";
          return updatedStatus;
        });

        analyticsError("Failed to upload file: " + JSON.stringify(e), true);

        // Only add to failed files if this isn't already a second attempt
        if (!isSecondAttempt) {
          setFailedFiles((prevFailedFiles) => [...prevFailedFiles, file.name]);
        }

        return false; // Upload failed
      }
    }
  };

  // Function to validate if a file exists in the specified bucket location
  const validateUploadedFile = async (
    fileName: string,
    bucketLocation: string
  ) => {
    try {
      const result = (await API.graphql(
        graphqlOperation(validateFileInLocation, {
          fileName,
          bucketLocation,
        })
      )) as { data: { validateFileInLocation: boolean } };

      return result.data.validateFileInLocation;
    } catch (error) {
      console.error("Error validating file:", error);
      return false;
    }
  };

  const isImage = (file: any) => /\.(png|jpg|jpeg)$/i.test(file.name);

  const numberOfNormalImages = () => {
    return files.filter((file) => isImage(file)).length;
  };

  const onUpload = async () => {
    setFileIsUploading(true);

    // Ensure all files have an initial upload status and progress
    if (
      uploadStatus.length < files.length ||
      uploadProgress.length < files.length
    ) {
      const newStatusArray = [...uploadStatus];
      const newProgressArray = [...uploadProgress];

      while (newStatusArray.length < files.length) {
        newStatusArray.push("uploading");
      }

      while (newProgressArray.length < files.length) {
        newProgressArray.push(0);
      }

      setUploadStatus(newStatusArray);
      setUploadProgress(newProgressArray);
    }

    const sortedFiles = [...files].sort((a, b) => {
      const lastThreeDigitsComparison =
        getLastThreeDigits(a.path) - getLastThreeDigits(b.path);
      if (lastThreeDigitsComparison !== 0) {
        return lastThreeDigitsComparison;
      }
      return a.name.localeCompare(b.name);
    });
    const fileNames = sortedFiles.map((obj) => obj.name).join(", ");
    const text = `User is uploading files: ${loggedUser.username}, project: ${currentProject?.name} , ${files.length} files:
    \n ${fileNames}`;
    await API.graphql({
      query: sendEmail,
      variables: {
        to: ["tomyitav@gmail.com"],
        text: text,
        link: window.location.origin,
        subject: `Castory Developers Info`,
        templateType: "developersInfo",
      },
      authMode: GRAPHQL_AUTH_MODE.API_KEY,
    });
    noSleep.enable();

    // Clear failed files list before starting
    setFailedFiles([]);

    // Process each file
    for (const file of sortedFiles) {
      // Check if each file ends with .png or .jpg or jpeg
      const isFileNormalImage = isImage(file);

      if (isFileNormalImage && currentProject?.defaultPlan && !is360) {
        await uploadImageWithRetry(file);
      } else {
        await uploadFileWithRetry(file);
      }
    }

    // If there are failed files, retry them
    const failedFilesToRetry = [...failedFiles];
    if (failedFilesToRetry.length > 0) {
      console.log(`Retrying ${failedFilesToRetry.length} failed files...`);

      // Clear the failed files list before second attempt
      setFailedFiles([]);

      // Find the actual File objects for the failed files
      const failedFileObjects = sortedFiles.filter((file) =>
        failedFilesToRetry.includes(file.name)
      );

      // Retry each failed file
      for (const file of failedFileObjects) {
        if (!isImage(file) || !(currentProject?.defaultPlan && !is360)) {
          await uploadFileWithRetry(file, 0, true); // Start with retry count 0, but mark as second attempt
        }
      }
    }

    setFileIsUploading(false);
    noSleep.disable();

    // Show completion dialog with appropriate message
    let message = "";
    let emailSubject = "";

    if (failedFiles.length > 0) {
      message = `Failed to upload file after you check your internet connection and try to upload the following files again:\n${failedFiles.join(
        "\n"
      )}`;
      emailSubject = "Some of your files failed to upload";
    } else {
      message = "All files were uploaded!";
      emailSubject = "Your file upload was successful";
    }

    setCompletionMessage(message);
    setShowCompletionDialog(true);

    // Send email to user if email is available
    if (userMail && message) {
      try {
        await API.graphql({
          query: sendEmail,
          variables: {
            to: [userMail],
            text: message,
            link: APP_HOME,
            subject: emailSubject,
            templateType: "developersInfo",
          },
          authMode: GRAPHQL_AUTH_MODE.API_KEY,
        });
      } catch (error) {
        console.error("Failed to send email to user:", error);
      }
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      setFiles([...files, ...acceptedFiles]);
      setShowUploadConfirmation(true);
      setUploadProgress([...uploadProgress, 0]);
    },
    [files, uploadProgress]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  // Handler for completion dialog close
  const handleCompletionClose = async () => {
    setShowCompletionDialog(false);
    // Reset failed files list
    setFailedFiles([]);
    // Close the main dialog
    await handleClose();
  };

  return (
    <DialogLayout
      title="Upload files"
      handleClose={handleClose}
      open={open}
      maxWidth="xl"
      showCloseButton
      disableBackdropClick={fileIsUploading}
    >
      <DialogContent
        {...getRootProps()}
        style={{
          height: "100vh",
          border: "2px dashed gray",
        }}
      >
        <input {...getInputProps()} />
        <DialogContentText>
          {isDragActive ? (
            <DragOverlay />
          ) : (
            "Drag & drop files here, or click to select"
          )}
        </DialogContentText>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Tooltip title="Click to select files" placement="top">
              <IconButton size="large" style={{ color: "gray" }}>
                <AddCircle fontSize="large" />
              </IconButton>
            </Tooltip>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={onFileChange}
            />
          </Grid>
          <Grid item xs={6}>
            {files.map((file, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                {file && (
                  <>
                    <span style={{ marginRight: "8px" }}>{file.name}</span>
                    <img
                      src="img/apple-share.png"
                      alt={`preview-${index}`}
                      width={mobileMode ? "15px" : "20px"}
                      style={{ marginRight: "8px" }}
                    />
                    <progress
                      value={uploadProgress[index] * 100}
                      max="100"
                      style={{ marginRight: "8px" }}
                    />
                    {uploadStatus[index] === "success" && (
                      <CheckCircle color="success" fontSize="small" />
                    )}
                    {uploadStatus[index] === "error" && (
                      <Cancel color="error" fontSize="small" />
                    )}
                  </>
                )}
              </div>
            ))}
          </Grid>
          <Grid item xs={3}>
            <Loader loading={fileIsUploading} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Tooltip disableInteractive title="Upload photos">
          <Button
            variant="text"
            component="span"
            size="small"
            color="primary"
            disabled={!files.length || fileIsUploading}
            onClick={onUpload}
          >
            <Publish color="primary" />
          </Button>
        </Tooltip>
      </DialogActions>
      <DialogLayout
        title="Upload Confirmation"
        handleClose={() => setShowUploadConfirmation(false)}
        open={showUploadConfirmation}
        maxWidth="sm"
        showCloseButton
      >
        <DialogContent>Upload {files.length} files?</DialogContent>
        <DialogActions>
          <Button
            className={classes.errorLabel}
            onClick={() => {
              setShowUploadConfirmation(false);
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() => {
              setShowUploadConfirmation(false);
              onUpload();
            }}
          >
            Upload
          </Button>
        </DialogActions>
      </DialogLayout>

      {/* Completion Dialog */}
      <DialogLayout
        title={failedFiles.length > 0 ? "Upload Failed" : "Upload Complete"}
        handleClose={handleCompletionClose}
        open={showCompletionDialog}
        maxWidth="sm"
        showCloseButton
      >
        <DialogContent>
          <DialogContentText style={{ whiteSpace: "pre-line" }}>
            {completionMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleCompletionClose}>
            OK
          </Button>
        </DialogActions>
      </DialogLayout>
    </DialogLayout>
  );
};

export default MultiFileUploader;
