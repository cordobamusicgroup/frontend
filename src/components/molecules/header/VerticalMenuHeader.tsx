import React from "react";
import { Box } from "@mui/material";
import PortalLogo from "../../atoms/header/PortalLogo";

interface DrawerHeaderProps {
  isOpen: boolean;
}

const VerticalMenuHeader: React.FC<DrawerHeaderProps> = ({ isOpen }) => (
  <Box display="flex" justifyContent="center" paddingTop={2} paddingBottom={2}>
    <PortalLogo small={!isOpen} />
  </Box>
);

export default VerticalMenuHeader;
