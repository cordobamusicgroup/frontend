import React, { ReactNode } from "react";
import { Box } from "@mui/material";
import LoginLogo from "../global/atoms/LoginLogo";
import FullScreenLoader from "../global/molecules/FullScreenLoader";
import ErrorModal from "../global/molecules/modals/ErrorModal";

interface AuthLayoutProps {
  children: ReactNode;
  error: string | null;
  setError: (error: string | null) => void;
  loading: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, error, setError, loading }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 3,
      }}
    >
      <LoginLogo />
      {children}
      <ErrorModal open={!!error} onClose={() => setError(null)} errorMessage={error || ""} />
      <FullScreenLoader open={loading} />
    </Box>
  );
};

export default AuthLayout;
