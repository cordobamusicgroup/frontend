import React from "react";
import { Alert, AlertTitle, Box, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNotificationCleanup } from "@/lib/hooks/useNotificationCleanup";

interface ErrorBoxProps {
  children: React.ReactNode;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ children }) => {

  return (
    <Box mb={2}>
      <Alert
        severity="error"
        iconMapping={{
          error: <ErrorOutlineIcon fontSize="large" />,
        }}
        sx={{
          backgroundColor: "#fdecea",
          color: "#d32f2f",
          borderLeft: "6px solid #d32f2f",
          padding: "16px",
        }}
      >
        <AlertTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center" }}>
          <Typography variant="h6" component="span" sx={{ fontWeight: "bold" }}>
            ERROR
          </Typography>
        </AlertTitle>
        <Typography variant="body2">{children}</Typography>
      </Alert>
    </Box>
  );
};

export default ErrorBox;
