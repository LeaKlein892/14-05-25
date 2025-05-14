import React, { useState, useRef } from "react";
import {
  Button,
  MenuItem,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  Paper,
  Popper,
  MenuList,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useStyles } from "./ActivityStyles";
import { activityLabel } from "./progress-operations";

interface ProgressSelectorLayoutProps {
  selectors: Array<{
    options: string[] | undefined;
    selectedOption: string;
    handleOptionSelect: (option: string) => void;
    label?: string;
    isDate?: boolean;
  }>;
  isActivitySelector?: boolean;
  labels?: string[];
}

const ProgressSelectorLayout: React.FC<ProgressSelectorLayoutProps> = ({
  selectors,
  isActivitySelector = false,
  labels,
}) => {
  const classes = useStyles();
  const [open, setOpen] = useState<number | null>(null);

  const anchorRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleToggle = (index: number) => {
    setOpen(open === index ? null : index);
  };

  const handleClose = (
    event: React.MouseEvent<Document> | TouchEvent | MouseEvent,
    index: number
  ) => {
    if (anchorRefs.current[index]?.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(null);
  };

  return (
    <div className={classes.inlineContainer}>
      {selectors.map((selector, index) => (
        <ButtonGroup
          key={index}
          variant="contained"
          aria-label="basic button group"
          className={
            isActivitySelector
              ? classes.activitySelector
              : selector.isDate
              ? classes.OutersplitButton
              : classes.splitButton
          }
          ref={(ref) => {
            // Use a type assertion to ensure compatibility
            anchorRefs.current[index] = ref as HTMLDivElement | null;
          }}
        >
          <Button
            aria-controls={open === index ? "menu-list-grow" : undefined}
            aria-haspopup="menu"
            onClick={() => handleToggle(index)}
            className={`${classes.clearButton}`}
          >
            {selector.label
              ? `${selector.label} ${selector.selectedOption}`
              : labels
              ? activityLabel(selector.selectedOption, labels)
              : selector.selectedOption}
            {selector.options?.length ? <ArrowDropDownIcon /> : null}
          </Button>

          <Popper
            open={open === index}
            anchorEl={anchorRefs.current[index]}
            transition
            disablePortal
            className={classes.popper}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener
                    onClickAway={(event) => handleClose(event, index)}
                  >
                    <MenuList id="menu-list-grow" className={classes.menuList}>
                      {selector.options?.map((option, i) => (
                        <MenuItem
                          key={i}
                          selected={option === selector.selectedOption}
                          onClick={() => {
                            selector.handleOptionSelect(option);
                            setOpen(null);
                          }}
                        >
                          {activityLabel(option, labels)}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </ButtonGroup>
      ))}
    </div>
  );
};

export default ProgressSelectorLayout;
