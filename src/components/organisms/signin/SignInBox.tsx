import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import { useRouter } from "next/navigation";
import FullScreenLoader from "../../molecules/loaders/FullScreenLoader";
import LoginLogo from "@/components/atoms/logos/LoginLogo";
import ErrorModal from "@/components/molecules/modals/ErrorModal";
import SignInForm from "@/components/molecules/signin/SignInForm";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { login, clearError } from "@/lib/redux/slices/authSlice";

/**
 * Renders a sign-in box component.
 */
function SignInBox() {
  const loading = useAppSelector((state) => state.loader.loading);
  const error = useAppSelector((state) => state.auth.error);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (username: string, password: string) => {
    await dispatch(login({ username, password, router })).unwrap();
  };

  const handleClose = () => {
    dispatch(clearError());
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
