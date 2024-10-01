import React, { useState } from "react";
import { Box, TextField, Button, Link, Grid, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

interface SignInFormProps {
  handleSubmit: (username: string, password: string) => void;
  loading: boolean;
}

interface IFormInput {
  username: string;
  password: string;
}

// Validación de Yup
const validationSchema = Yup.object().shape({
  username: Yup.string().required("El nombre de usuario es requerido"),
  password: Yup.string().required("La contraseña es requerida"),
});

const SignInForm: React.FC<SignInFormProps> = ({ handleSubmit, loading }) => {
  const t = useTranslations("pages.auth");
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Box component="form" onSubmit={handleFormSubmit(onSubmit)} sx={{ mt: 3 }}>
      <TextField margin="normal" required fullWidth id="username" label={t("username")} {...register("username")} error={!!errors.username} helperText={errors.username?.message} autoFocus />
      <TextField margin="normal" required fullWidth id="password" label={t("password")} type="password" {...register("password")} error={!!errors.password} helperText={errors.password?.message} />
      {error && (
        <Typography variant="body2" color="error" align="center">
          {error}
        </Typography>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
          {loading ? t("signIng") : t("signIn")}
        </Button>
      </Box>
      <Grid container justifyContent="center" sx={{ mt: 2 }}>
        <Grid item>
          <Link href="#" variant="body2">
            {t("forgot")}
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignInForm;
