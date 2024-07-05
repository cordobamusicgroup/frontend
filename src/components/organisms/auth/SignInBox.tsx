import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SignInForm from "@/components/molecules/auth/SignInForm";
import { useAuth } from "@/context/AuthContext";
import FullScreenLoader from "../../molecules/loader/FullScreenLoader";
import LoginLogo from "@/components/atoms/auth/LoginLogo";
import { useGlobal } from "@/context/GlobalContext";
import ErrorModal from "@/components/molecules/modals/ErrorModal";

function SignInBox() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { loading, setLoading } = useGlobal(); // Usar el estado y la función de loading del contexto global

  const handleSubmit = async (username: string, password: string) => {
    setLoading(true);
    try {
      await login(username, password);
    } catch (err: any) {
      setError(err.message);
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
      <LoginLogo />
      <SignInForm handleSubmit={handleSubmit} loading={loading} />
      <ErrorModal open={!!error} onClose={handleClose} errorMessage={error || ""} />
      <FullScreenLoader open={loading} /> {/* Usa el nuevo componente aquí */}
    </Box>
  );
}

export default SignInBox;
