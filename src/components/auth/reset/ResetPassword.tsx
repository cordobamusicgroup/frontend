"use client";
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { TextField, Button, Box } from "@mui/material";
import SuccessModal from "@/components/global/molecules/modals/SucessModal";
import routes from "@/lib/routes/routes";
import { Cancel, Check, Close, Visibility, VisibilityOff } from "@mui/icons-material";

interface IFormInput {
  newPassword: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required("New password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetLayout: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword, error, setError } = useAuth();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [showSuccess, setShowSuccess] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [countdown, setCountdown] = React.useState<number>(5);

  const methods = useForm<IFormInput>({
    mode: "all",
    resolver: yupResolver(validationSchema),
    reValidateMode: "onChange",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    return () => {
      setError(null);
    };
  }, [setError]);

  useEffect(() => {
    if (showSuccess) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            router.push(routes.web.login);
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [showSuccess, router]);

  const onSubmit: SubmitHandler<IFormInput> = async ({ newPassword }) => {
    setLoading(true);
    try {
      await resetPassword(token as string, newPassword);
      setShowSuccess(true);
      setTimeout(() => {
        router.push(routes.web.login);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const passwordCriteria = {
    isLengthValid: {
      test: (password: string) => password.length >= 8,
      message: "At least 8 characters",
    },
    hasUpperCase: {
      test: (password: string) => /[A-Z]/.test(password),
      message: "At least one uppercase letter",
    },
    hasLowerCase: {
      test: (password: string) => /[a-z]/.test(password),
      message: "At least one lowercase letter",
    },
    hasNumber: {
      test: (password: string) => /\d/.test(password),
      message: "At least one number",
    },
  };

  const isFormValid = Object.values(passwordCriteria).every((criteria) => criteria.test(password)) && !errors.confirmPassword;

  return (
    <AuthLayout error={error} setError={setError} loading={loading}>
      <FormProvider {...methods}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} mt={3} sx={{ width: "100%", maxWidth: 400, mx: "auto" }}>
          <TextField
            margin="normal"
            fullWidth
            id="newPassword"
            label="New Password"
            type={showPassword ? "text" : "password"}
            {...register("newPassword")}
            error={!!errors.newPassword && errors.newPassword.type !== "oneOf"}
            helperText={errors.newPassword?.type !== "oneOf" ? errors.newPassword?.message : ""}
            autoFocus
            disabled={loading}
            onChange={handlePasswordChange}
            InputProps={{
              endAdornment: <Button onClick={handleClickShowPassword}>{showPassword ? <VisibilityOff /> : <Visibility />}</Button>,
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            disabled={loading}
            InputProps={{
              endAdornment: <Button onClick={handleClickShowPassword}>{showPassword ? <VisibilityOff /> : <Visibility />}</Button>,
            }}
          />
          <Box mt={2}>
            {Object.entries(passwordCriteria).map(([key, criteria]) => (
              <Box display="flex" alignItems="center" key={key}>
                {criteria.test(password) ? <Check color="success" /> : <Close color="error" />}
                <Box component="span" ml={1}>
                  {criteria.message}
                </Box>
              </Box>
            ))}
          </Box>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading || !isFormValid}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </Box>
      </FormProvider>
      <SuccessModal open={showSuccess} onClose={() => {}} title="Password Reset Successful" message={`Your password has been reset successfully. You will be redirected to the login page in ${countdown} seconds.`} showCloseButton={false} />
    </AuthLayout>
  );
};

export default ResetLayout;
