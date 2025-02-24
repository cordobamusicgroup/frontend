import React from "react";
import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

const ChangePasswordForm: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <TextField margin="normal" fullWidth id="currentPassword" label="Current Password" type="password" {...register("currentPassword")} error={!!errors.currentPassword} helperText={errors.currentPassword?.message ? String(errors.currentPassword.message) : ""} />
      <TextField margin="normal" fullWidth id="newPassword" label="New Password" type="password" {...register("newPassword")} error={!!errors.newPassword} helperText={errors.newPassword?.message ? String(errors.newPassword.message) : ""} />
      <TextField margin="normal" fullWidth id="confirmPassword" label="Confirm Password" type="password" {...register("confirmPassword")} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message ? String(errors.confirmPassword.message) : ""} />
    </>
  );
};

export default ChangePasswordForm;
