"use client";

import { createTheme } from "@mui/material/styles";

// Define los colores y la tipografía de tu tema
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Color primario
    },
    secondary: {
      main: "#dc004e", // Color secundario
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif", // Tipografía
  },
});

export default theme;
