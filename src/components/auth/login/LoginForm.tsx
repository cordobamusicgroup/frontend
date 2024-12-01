"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { Box, TextField, Button, Link, Grid } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ForgotPassword from "./ForgotPassword";

interface IFormInput {
  username: string;
  password: string;
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

function LoginLayout() {
  const { login, error, setError } = useAuth();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openForgotPassword, setOpenForgotPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    return () => setError(null);
  }, [setError]);

  const onSubmit: SubmitHandler<IFormInput> = async ({ username, password }) => {
    setLoading(true);
    try {
      await login(username, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout error={error} setError={setError} loading={loading}>
      <Box component="form" onSubmit={handleFormSubmit(onSubmit)} sx={{ mt: 3 }}>
        <TextField margin="normal" fullWidth id="username" label="Username / Email" {...register("username")} error={!!errors.username} helperText={errors.username?.message} autoFocus />
        <TextField margin="normal" fullWidth id="password" label="Password" type="password" {...register("password")} error={!!errors.password} helperText={errors.password?.message} />
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Link href="#" variant="body2" onClick={() => setOpenForgotPassword(true)}>
              Forgot password?
            </Link>
          </Grid>
        </Grid>
      </Box>

      <ForgotPassword open={openForgotPassword} onClose={() => setOpenForgotPassword(false)} />
    </AuthLayout>
  );
}

export default LoginLayout;
