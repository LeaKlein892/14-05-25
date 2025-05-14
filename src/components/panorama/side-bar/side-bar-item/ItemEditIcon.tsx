import * as React from "react";
import { useState } from "react";
import {
  IconButton,
  Input,
  ListItemSecondaryAction,
  Popper,
  Theme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { makeStyles, createStyles } from "@mui/styles";

export interface ItemEditIconProps {
  open: boolean;
  toggleEdit: (editMode: boolean) => void;
  setNewSceneName: (newName: string) => void;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      border: "1px solid",
      padding: theme.spacing(1),
      zIndex: 1000000,
      backgroundColor: theme.palette.background.paper,
    },
  })
);

export const ItemEditIcon: React.FC<ItemEditIconProps> = ({
  open,
  toggleEdit,
  setNewSceneName,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [newName, setNewName] = useState("");

  const popperOpen = Boolean(anchorEl);

  const onItemClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    toggleEdit(true);
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const clearPopper = () => {
    setAnchorEl(null);
    setNewSceneName("");
    toggleEdit(false);
  };

  const onPopperApprove = () => {
    if (newName !== "") {
      setNewSceneName(newName);
    }
    clearPopper();
  };

  const onPopperClose = () => {
    clearPopper();
  };

  const onChangePopperInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  return (
    <div>
      {open || popperOpen ? (
        <ListItemSecondaryAction onClick={onItemClick}>
          <IconButton edge="end" aria-label="comments" size="large">
            <EditIcon />
          </IconButton>
        </ListItemSecondaryAction>
      ) : (
        <div />
      )}
      <Popper open={popperOpen} anchorEl={anchorEl} className={classes.paper}>
        <Input
          placeholder="New name..."
          inputProps={{ "aria-label": "Popper input" }}
          onChange={onChangePopperInput}
        />
        <IconButton edge="end" onClick={onPopperApprove} size="large">
          <DoneIcon />
        </IconButton>
        <IconButton edge="end" onClick={onPopperClose} size="large">
          <CloseIcon />
        </IconButton>
      </Popper>
    </div>
  );
};
