import React, { useEffect, useState } from "react";
import { MenuItem, InputAdornment, Box, FormControlLabel, Switch } from "@mui/material";
import { Controller, set, useFormContext } from "react-hook-form";
import DatePickerForm from "@/components/global/atoms/DatePickerForm";
import { contractStatusOptions, CreateClientContractType } from "@/constants/backend.enums";
import TextFieldForm from "@/components/global/atoms/TextFieldForm";

const ContractDetailsForm: React.FC = () => {
  const { setValue, watch, getValues, control } = useFormContext();

  // Estado local para isDraft
  const [isDraft, setIsDraft] = useState(false);

  // Función para actualizar el estado de contractSigned
  const updateContractSigned = (contractStatus: string, contractSigned: boolean) => {
    const shouldBeDraft = contractStatus === "DRAFT";

    if (shouldBeDraft && contractSigned !== false) {
      setValue("contractSigned", false);
      setIsDraft(true); // Actualizamos isDraft solo aquí
    } else if (!shouldBeDraft && contractSigned !== true) {
      setValue("contractSigned", true);
      setIsDraft(false); // Actualizamos isDraft solo aquí
    }
  };

  useEffect(() => {
    // Suscripción a los cambios en los valores del formulario usando watch
    const subscription = watch((value) => {
      const { contractStatus, contractSigned } = value;

      // Llamamos a la función para actualizar el valor
      updateContractSigned(contractStatus, contractSigned);
    });

    // Cleanup para cancelar la suscripción cuando el componente se desmonta
    return () => subscription.unsubscribe();
  }, [watch]); // Dependencia: watch

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
