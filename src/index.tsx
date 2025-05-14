import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  ThemeProvider,
  Theme,
  StyledEngineProvider,
} from "@mui/material/styles";
import theme from "./ui/theme";
import Amplify from "aws-amplify";
import "@aws-amplify/ui/styles.css";
import config from "./aws-exports";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundry";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

Amplify.configure(config);

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  </StyledEngineProvider>
);

// Service worker is now handled by VitePWA plugin
// Manual registration removed to avoid conflicts
