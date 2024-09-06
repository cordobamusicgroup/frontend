import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { ErrorMessage, Field, useFormikContext } from "formik";
import { useCountries } from "@/lib/hooks/useCountries";
import TextFieldForm from "@/components/atoms/TextFieldForm";

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
      <Field required name="street" label="Street" component={TextFieldForm} />
      <Field required name="city" label="City" component={TextFieldForm} />
      <Field required name="state" label="State" component={TextFieldForm} />
      <Autocomplete options={countries || []} getOptionLabel={(option) => option.name} loading={countriesLoading} onChange={(event, value) => setFieldValue("countryId", value ? value.id : null)} renderInput={(params) => <TextField required {...params} label="Country" margin="normal" fullWidth error={touched.countryId && Boolean(errors.countryId)} variant="standard" />} />
      <Field required name="zip" label="Zip" component={TextFieldForm} />
    </>
  );
};

export default AddressDetailsForm;
