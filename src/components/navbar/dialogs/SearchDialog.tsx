import * as React from "react";
import { useContext, useState, useEffect } from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Theme,
  DialogContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { makeStyles, createStyles } from "@mui/styles";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";
import { Project } from "../../../models";
import { DialogProps } from "../../types/DialogProps";
import { DialogLayout } from "../../dialogs/dialog-layout/DialogLayout";
import { useHistory } from "react-router-dom";
import { TabValue } from "../NavbarLinks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchInput: {
      width: "100%",
      marginBottom: theme.spacing(2),
    },
    resultList: {
      width: "100%",
    },
    noResults: {
      padding: theme.spacing(2),
      textAlign: "center",
    },
    projectImage: {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
    dialogContent: (props: { isMobile: boolean }) => ({
      minWidth: props.isMobile ? 300 : 600,
      minHeight: 400,
      maxHeight: 600,
    }),
    listItem: {
      cursor: "pointer",
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  })
);

const SearchDialog: React.FC<DialogProps> = ({ open, handleClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles({ isMobile });
  const { projects } = useContext(ProjectInformationContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (searchTerm.length >= 3 && projects) {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = projects.filter((project) => {
        const name = project.name?.toLowerCase() || "";
        const description = project.description?.toLowerCase() || "";
        return (
          name.includes(searchTermLower) ||
          description.includes(searchTermLower)
        );
      });
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects([]);
    }
  }, [searchTerm, projects]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const history = useHistory();

  const { setCurrentProject } = useContext(ProjectInformationContext);

  const handleProjectSelect = (project: Project) => {
    setCurrentProject(project);
    history.push(TabValue.Projects);
    handleClose();
  };

  return (
    <DialogLayout
      open={open}
      handleClose={handleClose}
      title="Search Projects"
      maxWidth="md"
      showCloseButton
    >
      <DialogContent className={classes.dialogContent}>
        <TextField
          autoFocus
          placeholder="Search projects..."
          variant="outlined"
          className={classes.searchInput}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm.length < 3 ? (
          <Typography variant="body2" className={classes.noResults}>
            Type at least 3 characters to search
          </Typography>
        ) : filteredProjects.length === 0 ? (
          <Typography variant="body2" className={classes.noResults}>
            No projects found
          </Typography>
        ) : (
          <List className={classes.resultList}>
            {filteredProjects.map((project) => (
              <ListItem
                key={project.id}
                onClick={() => handleProjectSelect(project)}
                className={classes.listItem}
              >
                <ListItemAvatar>
                  <Avatar
                    src={project.imageURL}
                    className={classes.projectImage}
                    variant="rounded"
                  >
                    {project.name?.[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={project.name}
                  secondary={project.description}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </DialogLayout>
  );
};

export default SearchDialog;
