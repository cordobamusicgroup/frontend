import React from "react";
import { FormControlLabel, Input, MenuItem, Switch, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import TextFieldForm from "@/components/atoms/TextFieldForm";
import { typeOptions, taxIdTypeOptions } from "@/constants/backend.enums";

const ClientDetailsForm: React.FC = () => {
  const { setValue, watch, control } = useFormContext();
  const vatRegistered = watch("vatRegistered");

  const handleVatToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue("vatRegistered", event.target.checked);
    if (!event.target.checked) {
      setValue("vatId", "");
    }
  };

  return (
    <>
      <TextFieldForm name="clientId" label="Client ID" disabled />

      <TextFieldForm name="clientName" label="Client Name" />
      <TextFieldForm name="firstName" label="First Name" />

      <TextFieldForm name="lastName" label="Last Name" />
      <TextFieldForm name="type" label="Type" select>
        {typeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>

      <TextFieldForm name="taxIdType" label="Tax ID Type" select>
        {taxIdTypeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>

      <TextFieldForm name="taxId" label="Tax ID" />

      <Controller name="vatRegistered" control={control} defaultValue={false} render={({ field }) => <FormControlLabel control={<Switch checked={vatRegistered} onChange={handleVatToggle} color="primary" />} label="VAT Registered" />} />

      {vatRegistered && <TextFieldForm name="vatId" label="VAT ID" />}
    </>
  );
};

export default ClientDetailsForm;
