import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LockIcon from "@/components/atoms/auth/LockIcon";
import SignInForm from "@/components/molecules/auth/SignInForm";
import ErrorModal from "@/components/molecules/ErrorModal";
import { useAuth } from "@/context/AuthContext";
import FullScreenLoader from "../FullScreenLoader";

function SignInBox() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (username: string, password: string) => {
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError("Failed to log in. Please check your username and password and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh", // Asegura que ocupe al menos toda la altura de la ventana
        padding: 3,
      }}
    >
      <LockIcon />
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <SignInForm handleSubmit={handleSubmit} loading={loading} />
      <ErrorModal open={!!error} onClose={handleClose} errorMessage={error || ""} />
      <FullScreenLoader open={loading} /> {/* Usa el nuevo componente aquí */}
    </Box>
  );
}

export default SignInBox;
