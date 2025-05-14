import * as React from "react";
import { createStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import { makeStyles } from "@mui/styles";
import { useHistory } from "react-router-dom";
import { scrollToTop } from "../../utils/scroll-utils";

const useStyles = makeStyles((theme) =>
  createStyles({
    friendlyMessage: {
      textAlign: "center",
      marginTop: "100px",
      fontFamily: theme.typography.fontFamily,
    },
    errorMessage: {
      color: theme.palette.common.black,
      fontSize: "26px",
      backgroundColor: "rgba(255,255,255,0.4)",
      padding: "5px",
      borderRadius: "3px",
      borderColor: theme.palette.secondary.main,
      borderWidth: "1px",
    },
    button: {
      marginTop: theme.spacing(2),
    },
    offer: {
      color: "white",
      fontSize: "30px",
    },
  })
);

export interface FriendlyErrorProps {
  message: string;
  link?: string;
  linkText?: string;
  blank?: boolean;
}

export const FriendlyError: React.FC<FriendlyErrorProps> = ({
  message,
  link,
  linkText,
  blank = false,
}) => {
  const classes = useStyles();
  const history = useHistory();

  scrollToTop();

  const handleClick = () => {
    if (linkText?.includes("information") && link) {
      !blank ? (window.location.href = link) : window.open(link, "_blank");
    } else {
      link && history.push(link);
      if (linkText === "Projects") {
        window.location.reload();
      }
    }
  };

  return (
    <div className={classes.friendlyMessage}>
      <div>
        <span
          className={
            message.includes("activity") ? classes.offer : classes.errorMessage
          }
        >
          {message}
        </span>
      </div>
      {link && link !== "" && (
        <div>
          <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            onClick={handleClick}
          >
            {linkText}
          </Button>
        </div>
      )}
    </div>
  );
};
