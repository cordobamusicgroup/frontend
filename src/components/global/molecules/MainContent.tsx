import React, { ReactNode } from "react";
import { styled } from "@mui/material/styles";

interface MainContentProps {
  open: boolean;
  children: ReactNode;
  isMobile: boolean;
}

/**
 * Represents the main content component.
 * @component
 */
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" && prop !== "isMobile" })<{ open?: boolean; isMobile?: boolean }>(({ theme, open, isMobile }) => ({
  flexGrow: 1,
  backgroundColor: "#fcfcfc",
  padding: theme.spacing(3),
  minHeight: "calc(100vh - 64px)",
  marginTop: 64,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: isMobile ? 0 : `60px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: isMobile ? 0 : `240px`,
  }),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const MainContent: React.FC<MainContentProps> = ({ open, children, isMobile }) => (
  <Main open={open} isMobile={isMobile}>
    {children}
  </Main>
);

export default MainContent;
