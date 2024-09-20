import React, { useEffect } from "react";
import { MenuItem, InputAdornment, Box, FormControlLabel, Switch } from "@mui/material";
import { Controller, set, useFormContext } from "react-hook-form";
import TextFieldForm from "../../../atoms/TextFieldForm";
import { contractStatusOptions, CreateClientContractType } from "@/constants/client-enums";
import DatePickerForm from "@/components/atoms/DatePickerForm";

const DmbDetailsForm: React.FC = () => {
  const { setValue, watch, getValues, control } = useFormContext();

  return (
    <Box>
      <TextFieldForm required name="dmbAccessType" label="Contract Type" select>
        {CreateClientContractType.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>

      <TextFieldForm required name="contractStatus" label="Contract Status" select>
        {contractStatusOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>

      <TextFieldForm
        name="ppd"
        label="Published Price to Dealer"
        type="number"
        InputProps={{
          startAdornment: <InputAdornment position="start">%</InputAdornment>,
        }}
      />

      <TextFieldForm name="docUrl" label="Document URL" />

      <Box sx={{ display: "flex", gap: 5 }}>
        <DatePickerForm name="startDate" label="Start Date" />
        <DatePickerForm name="endDate" label="End Date" minDate={getValues("startDate")} />
      </Box>

      <Controller
        name="contractSigned"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value} // El valor se establece automáticamente
                name="contractSigned"
                color="primary"
                disabled // El switch está deshabilitado para que no sea editable por el usuario
              />
            }
            label="Contract Signed"
          />
        )}
      />

      {!isDraft && (
        <>
          <TextFieldForm name="contractSignedBy" label="Signed By" />
          <DatePickerForm name="contractSignedAt" label="Signed At" />
        </>
      )}
    </Box>
  );
};

export default ContractDetailsForm;
