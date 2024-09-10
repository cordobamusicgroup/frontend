import React from "react";
import { Autocomplete } from "@mui/material";
import { useCountries } from "@/lib/hooks/useCountries";
import { useFormContext } from "react-hook-form";
import TextFieldForm from "@/components/atoms/TextFieldForm";

const AddressDetailsForm: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const { countries, countriesLoading } = useCountries();

  return (
    <>
      <TextFieldForm required name="street" label="Street" />
      <TextFieldForm required name="city" label="City" />
      <TextFieldForm required name="state" label="State" />
      <Autocomplete options={countries || []} getOptionLabel={(option) => option.name} loading={countriesLoading} onChange={(event, value) => setValue("countryId", value ? value.id : null)} renderInput={(params) => <TextFieldForm {...params} required name="countryId" label="Country" />} />
      <TextFieldForm required name="zip" label="Zip" />
    </>
  );
};

export default AddressDetailsForm;
