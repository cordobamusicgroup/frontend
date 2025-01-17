import React from "react";
import { Box, Chip } from "@mui/material";
import PortalLogo from "../../global/atoms/PortalLogo";
import { useAppStore } from "@/lib/zustand/zustandStore";

const VerticalMenuHeader: React.FC = () => {
  const isOpen = useAppStore.pageData((state) => state.openMenu);

  return (
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
};

export default VerticalMenuHeader;
