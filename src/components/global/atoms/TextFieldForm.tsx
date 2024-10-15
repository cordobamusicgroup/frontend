import React from "react";
import { BaseTextFieldProps, TextField, TextFieldProps } from "@mui/material";
import { Control, Controller, FieldError, useFormContext } from "react-hook-form";

interface TextFieldFormProps extends Omit<TextFieldProps, "error"> {
  name: string; // Nombre del campo
  label: string;
  defaultValue?: string; // Valor por defecto
  rules?: object; // Reglas opcionales de validación
}

const TextFieldForm: React.FC<TextFieldFormProps> = ({ name, label, defaultValue = "", rules, ...props }) => {
  const { control } = useFormContext();

  return <Controller name={name} control={control} defaultValue={defaultValue} rules={rules} render={({ field, fieldState: { error } }) => <TextField {...field} {...props} label={label} fullWidth sx={{ marginBottom: 2, marginTop: 2 }} error={Boolean(error)} helperText={error?.message} variant="standard" />} />;
};

export default TextFieldForm;