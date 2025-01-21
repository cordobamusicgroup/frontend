import React from "react";
import { Alert, AlertTitle, Box, Typography } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNotificationCleanup } from "@/lib/hooks/useNotificationCleanup";

interface SuccessBoxProps {
  children: React.ReactNode;
}

const SuccessBox: React.FC<SuccessBoxProps> = ({ children }) => {

  return (
    <Box mb={2}>
      <Alert
        severity="success"
        iconMapping={{
          success: <CheckCircleOutlineIcon fontSize="large" />,
        }}
        sx={{
          backgroundColor: "#e7f5e9",
          color: "#2e7d32",
          borderLeft: "6px solid #2e7d32",
          padding: "16px",
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center" }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
            SUCCESS
          </Typography>
        </AlertTitle>
        <Typography variant="body2">{children}</Typography>
      </Alert>
    </Box>
  );
};

export default SuccessBox;
