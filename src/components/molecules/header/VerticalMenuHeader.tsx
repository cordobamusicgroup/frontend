import React from "react";
import { Box, Button, Chip, Typography } from "@mui/material";
import PortalLogo from "../../atoms/PortalLogo";

interface DrawerHeaderProps {
  isOpen: boolean;
}

const VerticalMenuHeader: React.FC<DrawerHeaderProps> = ({ isOpen }) => (
  <Box display="flex" alignItems={"center"} flexDirection={"column"} justifyContent="center" paddingTop={2} paddingBottom={1}>
    <PortalLogo small={!isOpen} />
    <Chip
      label="BETA"
      color="primary"
      size="small"
      sx={{
        marginTop: "8px",
        fontWeight: "bold",
        borderRadius: "4px",
      }}
    />
  </Box>
);

export default VerticalMenuHeader;
