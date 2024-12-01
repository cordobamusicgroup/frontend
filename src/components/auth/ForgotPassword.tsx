import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useAuth } from "@/context/AuthContext";

interface ForgotPasswordProps {
  open: boolean;
  onClose: () => void;
}

interface IFormInput {
  email: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format").required("Email is required"),
});

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ open, onClose }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      await forgotPassword(data.email);
      setSuccessMessage("If a user account exists with the entered email, we will send an email with further instructions to reset the password.");
    } catch (error) {
      setErrorMessage("An error occurred while trying to send the reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Forgotten Password</DialogTitle>
      <DialogContent>
        <Typography>Please enter your email address associated with your account. We will email instructions on how to reset your password.</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
            autoFocus
            disabled={isLoading} // Deshabilitar mientras la solicitud está en progreso
          />
          {successMessage && (
            <Typography variant="body2" color="success" align="center" sx={{ mt: 2 }}>
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? "Sending..." : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ForgotPassword;
