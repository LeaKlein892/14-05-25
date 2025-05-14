import { createTheme } from "@mui/material/styles";
import { SimplePaletteColorOptions } from "@mui/material/styles/createPalette";
import { getQueryArgs } from "../utils/query-params";
import { JM, RAMDOR } from "../utils/clients";

const clientArg = getQueryArgs("client");

const primaryByClient = (client?: string): SimplePaletteColorOptions => {
  if (client === RAMDOR) {
    return {
      light: "#5DA2EFFF",
      main: "#229bd1",
      dark: "#1b5176",
    };
  } else if (client === JM) {
    return {
      light: "#28ca96",
      main: "#23445a",
      dark: "#1c384b",
    };
  } else {
    return {
      light: "#0078ff",
      main: "#0054ff",
      dark: "#00165e",
    };
  }
};

const getPrimaryPalette = (): SimplePaletteColorOptions => {
  const { light, main, dark } = primaryByClient(clientArg);
  const contrastText = "#fff";

  return {
    light,
    main,
    dark,
    contrastText,
  };
};

const theme = createTheme({
  palette: {
    primary: getPrimaryPalette(),
    secondary: {
      light: "#fac455",
      main: "#ffb400",
      dark: "#e3a000",
      contrastText: "#fff",
    },
    error: {
      light: "#ffd2d2",
      main: "#f44336",
      dark: "#d8000c",
      contrastText: "#fff",
    },
    info: {
      main: "#0078ff",
      light: "rgba(255,255,255,0.9)",
    },
  },
  typography: {
    fontFamily: "Mukta, sans-serif",
    fontSize: 16,
  },
});

export default theme;
