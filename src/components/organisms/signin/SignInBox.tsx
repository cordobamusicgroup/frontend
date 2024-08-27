import React, { useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import FullScreenLoader from "../../molecules/loaders/FullScreenLoader";
import LoginLogo from "@/components/atoms/logos/LoginLogo";
import ErrorModal from "@/components/molecules/ErrorModal";
import { useAuth } from "@/context/AuthContext";
import SignInForm from "@/components/molecules/SignInForm";

/**
 * Renders a sign-in box component.
 */
function SignInBox() {
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
    try {
      await login(username, password);
      router.push("/portal");
    } catch (err) {
      // Handle error if necessary, the AuthContext should already set the error state
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
        minHeight: "100vh",
        padding: 3,
      }}
    >
      <LoginLogo />
      <SignInForm handleSubmit={handleSubmit} loading={loading} />
      <ErrorModal open={!!error} onClose={handleClose} errorMessage={error || ""} />
      <FullScreenLoader open={loading} />
    </Box>
  );
}

export default SignInBox;
