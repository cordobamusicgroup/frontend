import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import React from "react";
import { ErrorMessage, useFormikContext, FormikValues } from "formik";
import { DateValidationError } from "@mui/x-date-pickers/models";

const BasicDatePicker: React.FC = ({ field, form, label, ...props }: any) => {
  const { setFieldValue } = useFormikContext<FormikValues>();
  const [error, setError] = React.useState<DateValidationError | null>(null);

  // Directly calculate the error message without useMemo
  let errorMessage = "";
  if (form.touched[field.name] && form.errors[field.name]) {
    errorMessage = form.errors[field.name] as string;
  } else if (error) {
    switch (error) {
      case "maxDate":
      case "minDate":
        errorMessage = "Please select a valid date within the allowed range.";
        break;
      case "invalidDate":
        errorMessage = "The date format is not valid.";
        break;
      default:
        errorMessage = "";
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        {...field}
        {...props}
        label={label}
        fullWidth
        format="DD/MM/YYYY"
        onError={(newError) => setError(newError)}
        slotProps={{ textField: { error: Boolean(form.touched[field.name] && form.errors[field.name]) || Boolean(error), variant: "standard", helperText: errorMessage || <ErrorMessage name={field.name} /> } }}
        onChange={(value) => {
          setFieldValue(field.name, value);
        }}
        sx={{ marginBottom: 2, marginTop: 2 }}
      />
    </LocalizationProvider>
  );
};

export default BasicDatePicker;
