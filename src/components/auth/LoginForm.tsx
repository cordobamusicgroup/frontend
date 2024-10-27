import React, { useState } from "react";
import { Box, TextField, Button, Link, Grid, Typography } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import ForgotPassword from "./ForgotPassword"; // Importa el componente ForgotPassword

interface LoginFormProps {
  handleSubmit: (username: string, password: string) => void;
  loading: boolean;
}

interface IFormInput {
  username: string;
  password: string;
}

// Validación de Yup
const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LoginForm: React.FC<LoginFormProps> = ({ handleSubmit, loading }) => {
  const [error, setError] = useState<string | null>(null);
  const [openForgotPassword, setOpenForgotPassword] = useState<boolean>(false); // Estado para manejar la apertura del Dialog de forgot password

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = ({ username, password }) => {
    setError(null);
    handleSubmit(username, password);
  };

  // Función para manejar la apertura del dialog de Forgot Password
  const handleOpenForgotPassword = () => {
    setOpenForgotPassword(true);
  };

  // Función para manejar el cierre del dialog de Forgot Password
  const handleCloseForgotPassword = () => {
    setOpenForgotPassword(false);
  };

  return (
    <>
      <Box component="form" onSubmit={handleFormSubmit(onSubmit)} sx={{ mt: 3 }}>
        <TextField margin="normal" fullWidth id="username" label="Username" {...register("username")} error={!!errors.username} helperText={errors.username?.message} autoFocus />
        <TextField margin="normal" fullWidth id="password" label="Password" type="password" {...register("password")} error={!!errors.password} helperText={errors.password?.message} />
        {error && (
          <Typography variant="body2" color="error" align="center">
            {error}
          </Typography>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Link href="#" variant="body2" onClick={handleOpenForgotPassword}>
              Forgot password?
            </Link>
          </Grid>
        </Grid>
      </Box>

      {/* Componente ForgotPassword */}
      <ForgotPassword open={openForgotPassword} onClose={handleCloseForgotPassword} />
    </>
  );
};

export default LoginForm;
