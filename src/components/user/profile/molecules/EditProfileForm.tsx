import React from "react";
import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

const EditProfileForm: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <TextField margin="normal" fullWidth id="email" label="Email" {...register("email")} error={!!errors.email} helperText={errors.email?.message?.toString()} />
      <TextField margin="normal" fullWidth id="fullName" label="Full Name" {...register("fullName")} error={!!errors.fullName} helperText={errors.fullName?.message?.toString()} />
    </>
  );
};

export default EditProfileForm;
