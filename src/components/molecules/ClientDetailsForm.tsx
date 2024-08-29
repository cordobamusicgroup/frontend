import React from "react";
import { FormControlLabel, MenuItem, Switch } from "@mui/material";
import { Field, useFormikContext } from "formik";
import TextFieldForm from "../atoms/TextFieldForm";
import { taxIdTypeOptions, typeOptions } from "@/constants/client-enums";

const ClientDetailsForm: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<any>();

  const handleVatToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue("vatRegistered", event.target.checked);
    if (!event.target.checked) {
      setFieldValue("vatId", "");
    }
  };
  return (
    <>
      <Field name="clientName" label="Client Nickname" component={TextFieldForm} />
      <Field name="firstName" label="First Name" component={TextFieldForm} />
      <Field name="lastName" label="Last Name" component={TextFieldForm} />
      <Field name="type" label="Type" select component={TextFieldForm}>
        {typeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Field>
      <Field name="taxIdType" label="Tax ID Type" select component={TextFieldForm}>
        {taxIdTypeOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Field>
      <Field name="taxId" label="Tax ID" component={TextFieldForm} />
      <FormControlLabel control={<Switch checked={values.vatRegistered} onChange={handleVatToggle} color="primary" />} label="VAT Registered" />

      {values.vatRegistered && <Field name="vatId" label="VAT ID" component={TextFieldForm} />}
    </>
  );
};

export default ClientDetailsForm;
