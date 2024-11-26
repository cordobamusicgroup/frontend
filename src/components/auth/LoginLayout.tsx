"use client";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import LoginLogo from "@/components/global/atoms/LoginLogo";
import { useAuth } from "@/lib/hooks/useAuth"; // Actualizar importación
import ErrorModal from "@/components/global/molecules/modals/ErrorModal";
import LoginForm from "./LoginForm";
import FullScreenLoader from "../global/molecules/FullScreenLoader";

/**
 * Renders a sign-in box component.
 */
function LoginLayout() {
  const { login, error, setError } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  const handleSubmit = async (username: string, password: string) => {
    setLoading(true);

    await login(username, password);

    setLoading(false);
  };

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
      <LoginForm handleSubmit={handleSubmit} loading={loading} />
      <ErrorModal open={!!error} onClose={() => setError(null)} errorMessage={error || ""} />
      <FullScreenLoader open={loading} />
    </Box>
  );
}

export default LoginLayout;
