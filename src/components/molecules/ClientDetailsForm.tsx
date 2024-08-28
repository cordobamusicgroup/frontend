import React from "react";
import { MenuItem } from "@mui/material";
import { Field } from "formik";
import TextFieldForm from "../atoms/TextFieldForm";
import { taxIdTypeOptions, typeOptions } from "@/constants/client-enums";

const ClientDetailsForm: React.FC = () => {
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
    </>
  );
};

export default ClientDetailsForm;
