import React, { useState } from "react";
import Box from "@mui/material/Box";
import { useAuth } from "@/context/AuthContext";
import FullScreenLoader from "../../molecules/loaders/FullScreenLoader";
import { useGlobal } from "@/context/GlobalContext";
import LoginLogo from "@/components/atoms/logos/LoginLogo";
import ErrorModal from "@/components/molecules/modals/ErrorModal";
import SignInForm from "@/components/molecules/signin/SignInForm";

function SignInBox() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { loading, setLoading } = useGlobal();

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
        minHeight: "100vh", //
        padding: 3,
      }}
    >
      <LoginLogo />
      <SignInForm handleSubmit={handleSubmit} loading={loading} />
      <ErrorModal open={!!error} onClose={handleClose} errorMessage={error || ""} />
      <FullScreenLoader open={loading}></FullScreenLoader>
    </Box>
  );
}

export default SignInBox;
