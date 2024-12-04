"use client";

import { themeQuartz } from "@ag-grid-community/theming";

export const royaltiesgrid = themeQuartz.withParams({
  backgroundColor: undefined,
  columnBorder: false,
  fontFamily: {
    googleFont: "Roboto",
  },
  fontSize: "15px",
  headerColumnBorder: false,
  headerFontSize: "15px",
  headerRowBorder: false,
  rowBorder: false,
  sidePanelBorder: false,
  wrapperBorder: true,
});

// to use myTheme in an application, pass it to the theme grid option
export const cmgThemeGrid = themeQuartz.withParams({
  browserColorScheme: "light",
  fontFamily: {
    googleFont: "Roboto",
  },
  headerFontSize: 14,
});
