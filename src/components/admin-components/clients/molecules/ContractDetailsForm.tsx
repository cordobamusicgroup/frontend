import React, { useEffect, useState, useCallback } from "react";
import { MenuItem, InputAdornment, Box, FormControlLabel, Switch } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import DatePickerForm from "@/components/global/atoms/DatePickerForm";
import { contractStatusOptions, CreateClientContractType } from "@/constants/backend.enums";
import TextFieldForm from "@/components/global/atoms/TextFieldForm";

const ContractDetailsForm: React.FC = () => {
  const { setValue, watch, getValues, control } = useFormContext();
  const [isDraft, setIsDraft] = useState(false);

  const updateContractSigned = useCallback(
    (contractStatus: string, contractSigned: boolean) => {
      const shouldBeDraft = contractStatus === "DRAFT";

      if (shouldBeDraft && contractSigned !== false) {
        setValue("contractSigned", false);
        setIsDraft(true);
      } else if (!shouldBeDraft && contractSigned !== true) {
        setValue("contractSigned", true);
        setIsDraft(false);
      }
    },
    [setValue, setIsDraft]
  );

  useEffect(() => {
    const subscription = watch((value) => {
      const { contractStatus, contractSigned } = value;
      updateContractSigned(contractStatus, contractSigned);
    });

    return () => subscription.unsubscribe();
  }, [watch, updateContractSigned]);

  return (
    <Box>
      <TextFieldForm name="contractUUID" label="Contract UUID" disabled />

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
        <DatePickerForm name="startDate" label="Start Date" />
        <DatePickerForm name="endDate" label="End Date" minDate={getValues("startDate")} />
      </Box>

      <Controller name="contractSigned" control={control} render={({ field }) => <FormControlLabel control={<Switch checked={field.value} name="contractSigned" color="primary" disabled />} label="Contract Signed" />} />

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
