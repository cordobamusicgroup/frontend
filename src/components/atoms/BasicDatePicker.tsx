import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import React from "react";
import { TextField } from "@mui/material";
import { FieldProps, ErrorMessage, useFormikContext } from "formik";

const BasicDatePicker: React.FC = ({ field, form, label, ...props }: any) => {
  const { setFieldValue } = useFormikContext<any>();
  const error = Boolean(form.touched[field.name] && form.errors[field.name]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        {...field}
        {...props}
        label={label}
        fullWidth
        format="DD/MM/YYYY"
        slotProps={{ textField: { variant: "standard", helperText: "DD/MM/YYYY" } }}
        onChange={(value) => {
          setFieldValue(field.name, value);
        }}
        sx={{ marginBottom: 2, marginTop: 2 }}
      />
    </LocalizationProvider>
  );
};

export default BasicDatePicker;
