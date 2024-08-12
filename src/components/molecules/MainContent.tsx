import React, { ReactNode } from "react";
import { styled } from "@mui/material/styles";
import VerticalMenuHeader from "./header/VerticalMenuHeader";

interface MainContentProps {
  open: boolean;
  children: ReactNode;
}

/**
 * Represents the main content component.
 * @component
 */
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{ open?: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginTop: 64,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `60px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: `240px`,
  }),
}));

const MainContent: React.FC<MainContentProps> = ({ open, children }) => <Main open={open}>{children}</Main>;

export default MainContent;
