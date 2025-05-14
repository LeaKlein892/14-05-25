import * as React from "react";
import { memo, useCallback, useEffect, useState } from "react";
import { Info } from "../../../models";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import { TextField } from "@mui/material";
import CompareIcon from "@mui/icons-material/Compare";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import { CompareTourProps } from "./CompareTourProps";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    compareTourSelect: {
      position: "fixed",
      zIndex: 1,
      bottom: theme.spacing(2),
      right: theme.spacing(10),
      display: "flex",
    },
    input: {
      fontWeight: "bold",
      color: "black",
      fontSize: "1.5rem",
      textShadow:
        "-0.5px 0 #ffb400, 0 0.5px #ffb400, 0.5px 0 #ffb400, 0 -0.5px #ffb400",
      "& .MuiAutocomplete-inputFocused": {
        fontSize: "1.5rem",
        textShadow:
          "-0.5px 0 #ffb400, 0 0.5px #ffb400, 0.5px 0 #ffb400, 0 -0.5px #ffb400",
      },
    },
  })
);

const autocompleteStyle = { width: 200 };
const inputLabelProps: any = {
  style: {
    fontSize: "1.3rem",
    color: "black",
    fontWeight: "bold",
  },
};

export const CompareTourSelect: React.FC<CompareTourProps> = memo(
  ({ options, onCompareClick }) => {
    const classes = useStyles();
    const [tourToCompare, setTourToCompare] = useState<Info | undefined>();
    const [openAutocomplete, setOpenAutocomplete] = useState<boolean>(false);

    useEffect(() => {
      onCompareClick(tourToCompare);
    }, [tourToCompare]);

    const onMirrorIconClick = useCallback(() => {
      if (tourToCompare) {
        onCompareClick(tourToCompare);
      } else {
        setOpenAutocomplete(!openAutocomplete);
      }
    }, [tourToCompare, onCompareClick, openAutocomplete]);

    const closeAutocomplete = useCallback(() => setOpenAutocomplete(false), []);
    const showAutocomplete = useCallback(() => setOpenAutocomplete(true), []);
    const { setInCompareMode } = React.useContext(ProjectInformationContext);

    const onChange = useCallback((event: any, newValue: Info | null) => {
      setTourToCompare(newValue || undefined);
      setInCompareMode(true);
    }, []);

    React.useEffect(() => {
      return () => {
        setInCompareMode(false);
      };
    }, []);

    return (
      <div className={classes.compareTourSelect}>
        <IconButton
          aria-label="compare"
          color="secondary"
          onBlur={closeAutocomplete}
          onClick={onMirrorIconClick}
          size="large"
        >
          <CompareIcon />
        </IconButton>
        <Autocomplete
          open={openAutocomplete}
          options={options.filter((option) => option.date !== "blueprint")}
          getOptionLabel={(option) => option.date}
          style={autocompleteStyle}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label={"Compare with"}
                variant="outlined"
                InputLabelProps={inputLabelProps}
              />
            );
          }}
          className={classes.input}
          onOpen={showAutocomplete}
          onClose={closeAutocomplete}
          onChange={onChange}
        />
      </div>
    );
  }
);
