import React, { useState } from "react";
import { Menu, MenuItem, Box, Typography } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import { PopoverProps } from "@mui/material/Popover";
import "./Pano.css";

const useStyles = makeStyles<
  Theme,
  { brightness: number; saturate: number; contrast: number }
>((theme) =>
  createStyles({
    filters: {
      width: "150px",
      color: theme.palette.secondary.main,
      touchAction: "none",
      WebkitAppearance: "none",
      height: "4px",
      opacity: 0.7,
      borderRadius: "7px",
      transition: "background 0.3s ease-in-out",
      "&::-webkit-slider-thumb": {
        WebkitAppearance: "none",
        width: "20px",
        height: "20px",
        background: "#ffb400",
        cursor: "pointer",
        borderRadius: "50%",
      },
      "&::-moz-range-thumb": {
        width: "20px",
        height: "20px",
        background: "#ffb400",
        cursor: "pointer",
        borderRadius: "50%",
      },
    },
    saturate: {
      background: (props) =>
        `linear-gradient(to right, #ffb400 ${
          (props.saturate / 200) * 100
        }%, #ddd ${(props.saturate / 200) * 100}%)`,
    },
    contrast: {
      background: (props) =>
        `linear-gradient(to right, #ffb400 ${
          (props.contrast / 200) * 100
        }%, #ddd ${(props.contrast / 200) * 100}%)`,
    },
    brightness: {
      background: (props) =>
        `linear-gradient(to right, #ffb400 ${
          (props.brightness / 200) * 100
        }%, #ddd ${(props.brightness / 200) * 100}%)`,
    },
  })
);
const anchorStyle = {
  vertical: "top",
  horizontal: "right",
} as any;

interface PanoFiltersProps {
  onBrightnessChange: (newValue: number) => void;
  onSaturateChange: (newValue: number) => void;
  onContrastChange: (newValue: number) => void;
  changePanoFiltersVisible: (event: React.MouseEvent<HTMLElement>) => void;
  anchorEl?: PopoverProps["anchorEl"];
  panoBrightness: number;
  panoSaturate: number;
  panoContrast: number;
}

const PanoFilters: React.FC<PanoFiltersProps> = ({
  onBrightnessChange,
  onSaturateChange,
  onContrastChange,
  changePanoFiltersVisible,
  anchorEl,
  panoBrightness,
  panoSaturate,
  panoContrast,
}) => {
  const [brightness, setBrightness] = useState<number>(panoBrightness);
  const [saturate, setSaturate] = useState<number>(panoSaturate);
  const [contrast, setContrast] = useState<number>(panoContrast);
  const open = Boolean(anchorEl);
  const classes = useStyles({ brightness, saturate, contrast });

  const handleBrightnessChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = Number(event.target.value);
    setBrightness(newValue);
    onBrightnessChange(newValue);
  };

  const handleSaturateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setSaturate(newValue);
    onSaturateChange(newValue);
  };

  const handleContrastChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    setContrast(newValue);
    onContrastChange(newValue);
  };

  return (
    <div>
      <Menu
        open={open}
        onClose={changePanoFiltersVisible}
        anchorEl={anchorEl}
        anchorOrigin={anchorStyle}
        transformOrigin={anchorStyle}
        style={{ top: -50 }}
      >
        <MenuItem>
          <Box>
            <Typography>Brightness</Typography>
            <input
              type="range"
              max={200}
              min={0}
              value={brightness}
              step={2}
              onChange={handleBrightnessChange}
              className={`${classes.filters} ${classes.brightness}`}
            />
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography>Saturate</Typography>
            <input
              type="range"
              max={200}
              min={0}
              value={saturate}
              step={2}
              onChange={handleSaturateChange}
              className={`${classes.filters} ${classes.saturate}`}
            />
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography>Contrast</Typography>
            <input
              type="range"
              max={200}
              min={0}
              value={contrast}
              step={2}
              onChange={handleContrastChange}
              className={`${classes.filters} ${classes.contrast}`}
            />
          </Box>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default PanoFilters;
