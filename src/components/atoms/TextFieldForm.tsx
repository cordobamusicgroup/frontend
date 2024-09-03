import React from "react";
import { BaseTextFieldProps, TextField } from "@mui/material";
import { FieldProps, ErrorMessage } from "formik";

interface TextFieldFormProps extends FieldProps, BaseTextFieldProps {
  label: string;
}

const TextFieldForm: React.FC<TextFieldFormProps> = ({ field, form, label, ...props }) => {
  return <TextField {...field} {...props} label={label} fullWidth error={Boolean(form.touched[field.name] && form.errors[field.name])} helperText={<ErrorMessage name={field.name} />} sx={{ marginBottom: 2, marginTop: 2 }} />;
};

export default TextFieldForm;
