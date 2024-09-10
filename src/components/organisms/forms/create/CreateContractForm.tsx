import React from "react";
import { MenuItem, InputAdornment, Box, FormControlLabel, Switch } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import TextFieldForm from "../../../atoms/TextFieldForm";
import { contractStatusOptions, CreateClientContractType } from "@/constants/client-enums";
import dayjs from "dayjs";
import DatePickerForm from "@/components/atoms/DatePickerForm";

const ContractDetailsForm: React.FC = () => {
  const { setValue, watch, getValues, control } = useFormContext();

  const contractStatus = watch("contractStatus");
  const contractSigned = watch("contractSigned");
  const isDraft = contractStatus === "DRAFT";

  const handleSigned = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setValue("contractSigned", isChecked); // Actualizar el valor en el formulario
    if (!isChecked) {
      setValue("contractSignedBy", "");
      setValue("contractSignedAt", null);
    }
  };

  return (
    <Box>
      <TextFieldForm required name="contractType" label="Contract Type" select>
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
        <DatePickerForm name="startDate" label="Start Date" disableHighlightToday />
        <DatePickerForm name="endDate" label="End Date" minDate={getValues("startDate")} disableHighlightToday />
      </Box>

      <Controller name="contractSigned" control={control} defaultValue={false} render={({ field }) => <FormControlLabel control={<Switch checked={!isDraft} name="contractSigned" onChange={handleSigned} color="primary" disabled />} label="Contract Signed" />} />

      {!isDraft && (
        <>
          <TextFieldForm name="contractSignedBy" label="Signed By" />
          <DatePickerForm name="contractSignedAt" label="Signed At" disableHighlightToday />
        </>
      )}
    </Box>
  );
};

export default ContractDetailsForm;
