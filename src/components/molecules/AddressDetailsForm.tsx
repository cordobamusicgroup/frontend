import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { ErrorMessage, Field, useFormikContext } from "formik";
import TextFieldForm from "../atoms/TextFieldForm";
import { useCountries } from "@/lib/hooks/useCountries";


interface AddressFormValues {
  street: string;
  city: string;
  state: string;
  countryId: number | null;
  zip: string;
}

const AddressDetailsForm: React.FC = () => {
  const { setFieldValue, errors, touched } = useFormikContext<AddressFormValues>();
  const { countries, countriesLoading } = useCountries();

  return (
    <>
      <Field name="street" label="Street" component={TextFieldForm} />
      <Field name="city" label="City" component={TextFieldForm} />
      <Field name="state" label="State" component={TextFieldForm} />
      <Autocomplete options={countries || []} getOptionLabel={(option) => option.name} loading={countriesLoading} onChange={(event, value) => setFieldValue("countryId", value ? value.id : null)} renderInput={(params) => <TextField {...params} label="Country" margin="normal" fullWidth error={touched.countryId && Boolean(errors.countryId)} helperText={<ErrorMessage name="countryId" />} />} />
      <Field name="zip" label="Zip" component={TextFieldForm} />
    </>
  );
};

export default AddressDetailsForm;
