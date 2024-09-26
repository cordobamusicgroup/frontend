import React, { useEffect } from "react";
import { MenuItem, InputAdornment, Box, FormControlLabel, Switch } from "@mui/material";
import { Controller, set, useFormContext } from "react-hook-form";
import { AccessTypeDMB, contractStatusOptions, CreateClientContractType, StatusDMB } from "@/constants/client-enums";
import DatePickerForm from "@/components/atoms/DatePickerForm";
import TextFieldForm from "@/components/atoms/TextFieldForm";

const DmbDetailsForm: React.FC = () => {
  const { setValue, watch, getValues, control } = useFormContext();

  return (
    <Box>
      <TextFieldForm required name="dmbAccessType" label="DMB Access Type" select>
        {AccessTypeDMB.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>

      <TextFieldForm required name="dmbStatus" label="DMB Status" select>
        {StatusDMB.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>

      <TextFieldForm name="dmbSubclientName" label="DMB Client Name" />

      <TextFieldForm name="dmbUsername" label="DMB Username" />
    </Box>
  );
};

export default DmbDetailsForm;
