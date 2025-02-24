import React from "react";
import { Autocomplete } from "@mui/material";
import { useCountries } from "@/lib/hooks/useCountries";
import { useFormContext } from "react-hook-form";
import TextFieldForm from "@/components/global/atoms/TextFieldForm";

const AddressDetailsForm: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const { countries, countriesLoading } = useCountries();

  // Watch the 'countryId' field to detect external changes
  const countryId = watch("countryId");

  // Find the selected country based on 'countryId'
  const selectedCountry = countries?.find((country) => country.id === countryId) || null;

  return (
    <>
      <TextFieldForm required name="street" label="Street" />
      <TextFieldForm required name="city" label="City" />
      <TextFieldForm required name="state" label="State" />
      <Autocomplete options={countries || []} getOptionLabel={(option) => option.name} loading={countriesLoading} onChange={(event, value) => setValue("countryId", value ? value.id : null)} value={selectedCountry} isOptionEqualToValue={(option, value) => option.id === value.id} renderInput={(params) => <TextFieldForm {...params} required name="countryId" label="Country" />} />
      <TextFieldForm required name="zip" label="Zip" />
    </>
  );
};

export default AddressDetailsForm;
