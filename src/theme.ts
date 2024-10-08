"use client";

import { createTheme } from "@mui/material/styles";
import { esES } from "@mui/x-data-grid/locales";

const theme = createTheme({
  palette: {
    primary: {
      main: "#09365F", // Color primario
    },
    secondary: {
      main: "#001B33", // Color secundario
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

theme.typography.h1 = {
  fontSize: "2rem",
  "@media (min-width:600px)": {
    fontSize: "2.5rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "3rem",
  },
};

theme.typography.h2 = {
  fontSize: "1.75rem",
  "@media (min-width:600px)": {
    fontSize: "2rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2.5rem",
  },
};

theme.typography.h3 = {
  fontSize: "1.5rem",
  "@media (min-width:600px)": {
    fontSize: "1.75rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "2rem",
  },
};

theme.typography.h6 = {
  fontSize: "18px",
};

export default theme;
