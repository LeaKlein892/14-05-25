import * as React from "react";
import { alpha } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import {
  Button,
  Checkbox,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Popper,
  PropTypes,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useCallback, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { ChangeEvent } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import SelectAllIcon from "@mui/icons-material/SelectAll";

export interface FilterSortButtonProps {
  title: string;
  onSort: () => void;
  onSortDesc: () => void;
  filterOptions: string[];
  onFilter: (value: string[]) => void;
  initialChecked?: string[];
  activeSort?: "asc" | "desc";
  variant?: "text" | "outlined" | "contained";
  color?: PropTypes.Color;
  noSortMode?: boolean;
  noSearchMode?: boolean;
  sortFn?: (value: string, otherValue: string) => number;
  mobileFilter?: boolean;
}

const useStyles = makeStyles((theme) =>
  createStyles({
    filterSortButtonContainer: {
      display: "inline",
      paddingTop: theme.spacing(1),
    },
    filterSortButton: {
      "& span": {
        paddingRight: theme.spacing(1),
        paddingLeft: theme.spacing(1),
      },
      marginTop: "-8px",
      marginLeft: "8px",
      paddingRight: "5px",
      paddingLeft: "5px",
    },
    mobileFilter: {
      maxWidth: "32%",
    },
    filterButton: {
      color: "black",
    },
    iconLeft: {
      width: theme.spacing(2),
      marginRight: theme.spacing(1),
    },
    iconRight: {
      width: theme.spacing(2),
      marginLeft: theme.spacing(1),
    },
    iconBuffer: {
      width: theme.spacing(1),
    },
    popper: {
      "&::-webkit-scrollbar": {
        width: "0.4em",
      },
      "&::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0,0,0,.1)",
        outline: "1px solid slategrey",
      },
      backgroundColor: theme.palette.grey.A200,
      borderRadius: theme.shape.borderRadius,
      maxHeight: theme.spacing(50),
      overflow: "auto",
    },
    popperMenu: {
      zIndex: 10,
    },
    topButtons: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      paddingTop: theme.spacing(1),
    },
    search: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(2),
      paddingTop: theme.spacing(1),
    },
    inputRoot: {
      width: "100%",
    },
    inputInput: {
      paddingLeft: theme.spacing(2),
      "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.3),
        borderRadius: theme.shape.borderRadius,
      },
    },
  })
);

export const FilterSortButton: React.FC<FilterSortButtonProps> = ({
  title,
  onSort,
  onSortDesc,
  filterOptions,
  onFilter,
  activeSort,
  noSortMode,
  noSearchMode,
  initialChecked,
  variant,
  color = "primary",
  sortFn = (value, otherValue) => value.localeCompare(otherValue),
  mobileFilter = false,
}) => {
  const classes = useStyles();
  const [isPopperOpen, setIsPopperOpen] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [checked, setChecked] = React.useState<string[]>(filterOptions);
  const [filterOptionsList, setFilterOptionsList] =
    React.useState<string[]>(filterOptions);

  const closeAndResetPopper = () => {
    setIsPopperOpen(false);
    setFilterOptionsList([...filterOptions]);
  };

  const handlePopperClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsPopperOpen(!isPopperOpen);
  };

  const handleSort = () => {
    onSort();
    closeAndResetPopper();
  };

  const handleSelectAll = () => {
    const newChecked = [...filterOptionsList];
    setChecked(newChecked);
    onFilter(newChecked);
  };

  const handleClearAll = () => {
    setChecked([]);
    onFilter([]);
  };

  const handleSortDesk = () => {
    onSortDesc();
    closeAndResetPopper();
  };

  const handleSearchFilter = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const filter = event.currentTarget.value;

      setFilterOptionsList(
        filterOptions.filter((option) =>
          option.toLowerCase().includes(filter.toLowerCase())
        )
      );
    },
    [filterOptions, setFilterOptionsList]
  );

  const handleToggleFilter = (value: string) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

    onFilter(newChecked);
  };

  const handleClickAway = () => {
    closeAndResetPopper();
  };

  const isOptionsFiltered = useCallback(() => {
    return checked.length !== filterOptionsList.length;
  }, [checked, filterOptionsList]);

  useEffect(() => {
    if (checked.length === filterOptionsList.length) {
      setChecked(filterOptions);
    } else {
      const newChecked = checked.filter((chk) =>
        filterOptions.some((fo) => fo === chk)
      );
      setChecked(newChecked);
    }
    if (initialChecked) {
      setChecked(initialChecked);
    } else {
      setChecked(filterOptions);
    }

    setFilterOptionsList(filterOptions);
  }, [filterOptions, initialChecked]); // DO NOT INCLUDE CHECK!

  const renderPopperContent = () => {
    const isSelectAll = checked.length !== filterOptions.length;
    const isFiltered = filterOptions.length !== filterOptionsList.length;
    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <div className={classes.popper}>
          <div className={classes.topButtons} hidden={noSortMode}>
            <Button onClick={handleSort}>
              sort asc <ArrowDropUpIcon />
            </Button>
            <Button onClick={handleSortDesk}>
              sort desc <ArrowDropDownIcon />
            </Button>
          </div>
          {!noSearchMode ? (
            <React.Fragment>
              <div className={classes.search}>
                <SearchIcon />
                <InputBase
                  placeholder="Filter…"
                  onChange={handleSearchFilter}
                  classes={{
                    input: classes.inputInput,
                    root: classes.inputRoot,
                  }}
                  inputMode="search"
                />
              </div>
              <div
                className={classes.topButtons}
                hidden={filterOptionsList.length === 0}
              >
                <Button
                  onClick={isSelectAll ? handleSelectAll : handleClearAll}
                >
                  <SelectAllIcon />{" "}
                  {`\u00A0 ${
                    isSelectAll
                      ? `select all ${isFiltered ? "filtered" : ""}`
                      : "clear all"
                  }`}
                </Button>
              </div>
            </React.Fragment>
          ) : (
            <div />
          )}
          <List>
            {filterOptionsList.sort(sortFn).map((value) => {
              const labelId = `checkbox-list-label-${value}`;

              return (
                <ListItem key={value} role={undefined} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(value) !== -1}
                      onChange={() => handleToggleFilter(value)}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                      color="secondary"
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value} />
                </ListItem>
              );
            })}
          </List>
        </div>
      </ClickAwayListener>
    );
  };

  return (
    <div className={classes.filterSortButtonContainer}>
      <Button
        onClick={handlePopperClick}
        className={`${classes.filterSortButton} ${
          mobileFilter ? classes.mobileFilter : ""
        }${title != "Scans" ? classes.filterButton : ""}`}
        variant={variant}
        size="small"
        color={color == "default" ? "primary" : color}
      >
        {isOptionsFiltered() ? (
          <FilterListIcon className={classes.iconLeft} />
        ) : (
          <div className={classes.iconBuffer} />
        )}
        {title}
        {activeSort === "asc" ? (
          <ArrowDropUpIcon className={classes.iconRight} />
        ) : activeSort === "desc" ? (
          <ArrowDropDownIcon className={classes.iconRight} />
        ) : (
          <div className={classes.iconBuffer} />
        )}
      </Button>
      <Popper
        open={isPopperOpen}
        placement="bottom-end"
        disablePortal={false}
        anchorEl={anchorEl}
        className={classes.popperMenu}
      >
        {renderPopperContent()}
      </Popper>
    </div>
  );
};
