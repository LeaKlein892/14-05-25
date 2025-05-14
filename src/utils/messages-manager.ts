import { toast } from "react-toastify";
import { AlertColor } from "@mui/lab";

const showMessage = (
  message: string,
  severity?: AlertColor,
  duration: number = 3000
) => {
  const methodToRun = severity ? toast[severity] : toast.info;
  methodToRun(message, { autoClose: duration });
};

export { showMessage };
