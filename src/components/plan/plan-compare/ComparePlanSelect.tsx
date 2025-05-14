import * as React from "react";
import { memo, useCallback, useEffect, useState, useContext } from "react";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import { TextField } from "@mui/material";
import CompareIcon from "@mui/icons-material/Compare";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import { ComparePlanProps } from "./ComparePlanProps";
import { ProjectInformationContext } from "../../../context/ProjectInformationContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    comparePlanSelect: {
      position: "absolute",
      display: "flex",
      zIndex: 3,
      right: theme.spacing(7),
      bottom: theme.spacing(1),
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

export const ComparePlanSelect: React.FC<ComparePlanProps> = memo(
  ({ options, onCompareClick }) => {
    const { pastDate } = useContext(ProjectInformationContext);
    const classes = useStyles();
    const [dateToCompare, setDateToCompare] = useState<string | undefined>();
    const [openAutocomplete, setOpenAutocomplete] = useState<boolean>(false);

    useEffect(() => {
      onCompareClick(dateToCompare);
    }, [dateToCompare]);

    const onMirrorIconClick = useCallback(() => {
      if (dateToCompare) {
        onCompareClick(dateToCompare);
      } else {
        setOpenAutocomplete(!openAutocomplete);
      }
    }, [dateToCompare, onCompareClick, openAutocomplete]);

    const closeAutocomplete = useCallback(() => setOpenAutocomplete(false), []);
    const showAutocomplete = useCallback(() => setOpenAutocomplete(true), []);

    const onChange = useCallback((event: any, newValue: string | null) => {
      setDateToCompare(newValue || undefined);
    }, []);

    return (
      <div className={classes.comparePlanSelect}>
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
          options={options.filter((option) => option !== "blueprint")}
          getOptionLabel={(option) => option}
          style={autocompleteStyle}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label={pastDate ? pastDate : "Compare with"}
                variant="outlined"
                InputLabelProps={inputLabelProps}
              />
            );
          }}
          className={classes.input}
          onClickCapture={showAutocomplete}
          onClose={closeAutocomplete}
          onChange={onChange}
        />
      </div>
    );
  }
);
