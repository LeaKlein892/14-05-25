import * as React from "react";
import { useCallback, useState } from "react";
import { CompareTourProps } from "./CompareTourProps";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import CompareIcon from "@mui/icons-material/Compare";
import { Fab, Menu, MenuItem, Tooltip } from "@mui/material";
import { showMessage } from "../../../utils/messages-manager";
import { Info } from "../../../models";
import { horizontalScreen } from "../../../utils/screen-status";

const ITEM_HEIGHT = 48;

const paperProps: any = {
  style: {
    maxHeight: ITEM_HEIGHT * 4.5,
    width: "20ch",
  },
};

const menuStyling: any = {
  vertical: "top",
  horizontal: "right",
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    compareTourButton: {
      position: "fixed",
      zIndex: 1,
      bottom: theme.spacing(14),
      right: theme.spacing(2),
    },
  })
);

export const CompareTourButton: React.FC<CompareTourProps> = ({
  options,
  onCompareClick,
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedDate, setSelectedDate] = useState("");

  const handleMenu = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const open = Boolean(anchorEl);

  const onClickCompareButton = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!horizontalScreen()) {
        showMessage("Rotate screen horizontally to compare views", "warning");
      } else {
        handleMenu(e);
      }
    },
    [handleMenu]
  );

  const onClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const onDateClick = useCallback(
    (option: Info) => {
      setSelectedDate(option.date);
      onCompareClick(option);
      onClose();
    },
    [onCompareClick, onClose]
  );

  return (
    <div>
      <Tooltip
        disableInteractive
        title="Compare views"
        placement={"left"}
        enterDelay={400}
        enterNextDelay={400}
      >
        <Fab
          className={classes.compareTourButton}
          size="small"
          color="primary"
          variant="extended"
          id="compare"
          onClick={onClickCompareButton}
        >
          <CompareIcon />
        </Fab>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={menuStyling}
        keepMounted
        transformOrigin={menuStyling}
        open={open}
        onClose={onClose}
        PaperProps={paperProps}
      >
        {options.map(
          (option, index) =>
            option.date !== "blueprint" && (
              <MenuItem
                onClick={() => onDateClick(option)}
                key={index}
                selected={option.date === selectedDate}
              >
                {option.date}
              </MenuItem>
            )
        )}
      </Menu>
    </div>
  );
};
