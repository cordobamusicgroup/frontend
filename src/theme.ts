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
});

export default theme;
