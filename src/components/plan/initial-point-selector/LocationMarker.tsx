import * as React from "react";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { createStyles } from "@mui/styles";
import { makeStyles } from "@mui/styles";

export interface LocationMarkerProps {
  open: boolean;
  top?: string | number;
  left?: string | number;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    locationMarker: {
      position: "fixed",
      color: theme.palette.error.main,
      bottom: "50%",
      right: "50%",
    },
  })
);

export const LocationMarker: React.FC<LocationMarkerProps> = ({
  open,
  top = "50%",
  left = "50%",
}) => {
  const classes = useStyles();
  return (
    <div>
      {open ? (
        <MyLocationIcon
          className={classes.locationMarker}
          style={{ top, left }}
        />
      ) : (
        <div />
      )}
    </div>
  );
};
