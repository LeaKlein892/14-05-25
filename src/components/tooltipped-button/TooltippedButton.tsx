import { withStyles } from "@mui/styles";
import MuiButton from "@mui/material/Button";

export const TooltippedButton = withStyles({
  root: {
    "&.Mui-disabled": {
      pointerEvents: "auto",
    },
  },
})(MuiButton);
