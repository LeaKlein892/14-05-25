import * as React from "react";
import { useTask } from "../../../hooks/useTask";
import { CenterPageLoader } from "../../loader/CenterPageLoader";
import CommentDialog from "../../dialogs/comment-dialog/CommentDialog";
import { TaskNotFound } from "./TaskNotFound";
import { APP_HOME } from "../../../utils/site-routes";

const emptyScene = { sceneId: "0", yaw: 0, pitch: 0, fov: 0 };

export interface TaskFormProps {
  taskId: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ taskId }) => {
  const task = useTask(taskId);

  const handleClose = () => {
    window.location.replace(APP_HOME);
  };

  return !task ? (
    <CenterPageLoader loading={true} />
  ) : task.id === "" ? (
    <TaskNotFound />
  ) : (
    <CommentDialog
      scene={emptyScene}
      lastSelectedComment={task}
      handleClose={handleClose}
      open={true}
      mode={"EDIT"}
    />
  );
};

export default React.memo(TaskForm);
