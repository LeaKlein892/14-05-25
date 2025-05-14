import * as React from "react";
import { useState, useContext } from "react";
import { IconButton, Theme, Tooltip } from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import { lazy, Suspense } from "react";
import { LoggedUserContext } from "../../context/LoggedUserContext";
import { AppModeEnum } from "../../context/ViewContext";

const SearchDialog = lazy(() => import("./dialogs/SearchDialog"));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchButton: ({
      projectsCount,
    }: {
      loggedUser: { username: string };
      projectsCount: number;
      appMode: AppModeEnum;
    }) => ({
      marginRight: projectsCount >= 5 ? "" : theme.spacing(1),
      marginLeft: projectsCount >= 5 ? "auto" : "",
    }),
  })
);
interface SearchInputProps {
  style?: React.CSSProperties;
  projectsCount: number;
  appMode: AppModeEnum;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  projectsCount,
  appMode,
}) => {
  const { loggedUser } = useContext(LoggedUserContext);
  const classes = useStyles({ loggedUser, projectsCount, appMode });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSearchClick = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <>
      <Tooltip title="Search">
        <IconButton
          onClick={handleSearchClick}
          className={classes.searchButton}
          size="large"
          color="inherit"
        >
          {projectsCount >= 5 && <SearchIcon />}
        </IconButton>
      </Tooltip>
      <Suspense fallback={null}>
        {isDialogOpen && (
          <SearchDialog open={isDialogOpen} handleClose={handleClose} />
        )}
      </Suspense>
    </>
  );
};
