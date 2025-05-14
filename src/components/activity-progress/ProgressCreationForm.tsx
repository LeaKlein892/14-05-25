import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  TextField,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CheckIcon from "@mui/icons-material/Check";
import { useStyles } from "./ActivityStyles";
import { useProgress } from "../../hooks/useProgress";
import { Activity, ProgressArea, Project } from "../../models";
import { ActivityStatus } from "../../models";
import { showMessage } from "../../utils/messages-manager";
import { getProjectDetailsFromPlanUrl } from "../../utils/projects-utils";
import { styled } from "@mui/styles";
import { usePlanAnchors } from "../../hooks/usePlanAnchors";
import { emptyArray } from "../../utils/render-utils";

interface ProgressCreationFormProps {
  currentProject: Project;
}

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const ProgressCreationForm = ({
  currentProject,
}: ProgressCreationFormProps) => {
  const classes = useStyles();
  const { addNewProgressRecord } = useProgress(currentProject.id || "");

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setActivities(emptyArray);
    setProgressAreas(emptyArray);
    setPlanUrls(emptyArray);
  };

  const activity = useRef<any>("");
  const [activities, setActivities] =
    React.useState<readonly string[]>(emptyArray);

  const handleEnterActivity = () => {
    if (activity.current.value) {
      setActivities([...activities, activity.current.value]);
      activity.current.value = "";
    }
  };
  const handleDeleteActivity = (chipToDelete: string) => () => {
    setActivities((chips) => chips.filter((chip) => chip !== chipToDelete));
  };

  const inputPlanUrl = useRef<any>("");
  const [planUrls, setPlanUrls] = React.useState<readonly string[]>(emptyArray);
  const [planUrl, setPlanUrl] = useState("");
  const { planAnchors } = usePlanAnchors(planUrl);
  const [progressAreas, setProgressAreas] =
    useState<ProgressArea[]>(emptyArray);
  const [numOfAnchors, setNumOfAnchors] = useState(new Map<string, number>());

  const handleEnterPlan = () => {
    if (inputPlanUrl.current.value) {
      setPlanUrl(inputPlanUrl.current.value);
      setPlanUrls([...planUrls, inputPlanUrl.current.value]);
      inputPlanUrl.current.value = "";
    }
  };

  const handleDeletePlan = (planToDelete: string) => () => {
    setPlanUrls((plans) => plans.filter((plan) => plan !== planToDelete));
    setProgressAreas((progresAreas) =>
      progresAreas.filter(
        (progressArea) => progressArea.anchor !== planToDelete
      )
    );
  };

  useEffect(() => {
    if (
      planAnchors &&
      planAnchors.photoRecords &&
      planAnchors.photoRecords?.length > 0
    ) {
      setNumOfAnchors((map) =>
        map.set(planUrl, planAnchors.photoRecords?.length ?? 0)
      );
    }
  }, [planAnchors]);

  const handleSubmit = () => {
    if (!activities || activities.length === 0) return;

    const myActivities: Activity[] = activities.map((activity) => ({
      activityName: activity,
      status: ActivityStatus.NOT_STARTED,
    }));

    let newProgressAreas: ProgressArea[] = []; // Create a new array

    planUrls.forEach((plan) => {
      let { building, floor: floorNum } = getProjectDetailsFromPlanUrl(plan);
      if (floorNum?.startsWith("fl")) {
        floorNum = floorNum.substring(2);
      }
      const numMyAnchors = numOfAnchors.get(plan) ?? 0;
      if (!!building && !!floorNum) {
        for (let i = 0; i < numMyAnchors; i++) {
          const progressArea: ProgressArea = {
            anchor:
              "https://castory-app.com/location?pdf=" +
              plan +
              "&anchorId=" +
              i +
              "&client=jm",
            building: building,
            floor: floorNum,
            activities: myActivities,
          };
          newProgressAreas.push(progressArea); // Push new progress area to new array
        }
      }
    });

    if (newProgressAreas.length > 0) {
      setProgressAreas(newProgressAreas);
      addNewProgressRecord(currentProject.id, newProgressAreas);
      showMessage("created");
      handleClose();
    }
  };

  return (
    <>
      <Button
        variant="contained"
        className={classes.button}
        color="primary"
        onClick={handleClickOpen}
      >
        create progress table
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth
        scroll="body"
        PaperProps={{
          component: "form",
        }}
      >
        <DialogTitle className={classes.title}>
          <AddBoxIcon className={classes.addBoxIcon} />
          create progress table
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a table insert activities.
          </DialogContentText>
          <Paper className={classes.paper} component="ul">
            {activities.map((activity) => {
              return (
                <ListItem key={activity}>
                  <Chip
                    label={activity}
                    onDelete={handleDeleteActivity(activity)}
                  />
                </ListItem>
              );
            })}
          </Paper>
          <Box style={{ display: "flex", alignItems: "flex-end" }}>
            <Button onClick={handleEnterActivity}>
              <CheckIcon className={classes.checkIcon} />
            </Button>
            <TextField
              autoFocus
              size="small"
              id="activity"
              name="activity"
              label="add activity"
              fullWidth
              type="input"
              variant="standard"
              inputRef={activity}
            />
          </Box>
        </DialogContent>
        <DialogContent>
          <DialogContentText>Insert Plan urls.</DialogContentText>
          <Paper className={classes.paper} component="ul">
            {planUrls.map((floor) => {
              return (
                <ListItem key={floor}>
                  <Chip label={floor} onDelete={handleDeletePlan(floor)} />
                </ListItem>
              );
            })}
          </Paper>
          <Box style={{ display: "flex", alignItems: "flex-end" }}>
            <Button onClick={handleEnterPlan}>
              <CheckIcon className={classes.checkIcon} />
            </Button>
            <TextField
              autoFocus
              size="small"
              id="plan"
              name="plan"
              label="add plan url"
              fullWidth
              type="input"
              variant="standard"
              inputRef={inputPlanUrl}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            color="primary"
            onClick={handleSubmit}
            disabled={activities.length == 0 || planUrls.length == 0}
          >
            create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProgressCreationForm;
