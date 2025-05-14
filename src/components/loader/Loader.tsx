import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";

export interface LoaderProps {
  loading: boolean;
  color?: "primary" | "secondary";
  current?: number;
  total?: number;
}

export const Loader = ({
  loading,
  color = "primary",
  current,
  total,
}: LoaderProps) => {
  return loading ? (
    <span>
      <CircularProgress color={color} />
      {current && total && `${current} / ${total}`}
    </span>
  ) : (
    <div />
  );
};
