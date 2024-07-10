"use client";

import { createTheme } from "@mui/material/styles";

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
    fontFamily: "Roboto, Arial, sans-serif", // Tipografía
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

export default theme;
