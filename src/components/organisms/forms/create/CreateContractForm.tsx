import React from "react";
import { MenuItem, InputAdornment, Box, FormControlLabel, Switch } from "@mui/material";
import { Field, FormikValues, useFormikContext } from "formik";
import TextFieldForm from "../../../atoms/TextFieldForm";
import { contractStatusOptions, CreateClientContractType } from "@/constants/client-enums";
import BasicDatePicker from "../../../atoms/BasicDatePicker";
import dayjs from "dayjs";

const ContractDetailsForm: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();

  const handleDateChange = (name: string, value: FormikValues) => {
    setFieldValue(name, value);
  };

  const handleSigned = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue("contractSigned", event.target.checked);
    if (!event.target.checked) {
      setFieldValue("vatId", "");
    }
  };

  // Condición que verifica si el contractStatus es "Active"
  const isContractActive = values.contractStatus === "Active";

  return (
    <Box>
      <Field required name="contractType" label="Contract Type" select component={TextFieldForm}>
        {CreateClientContractType.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Field>
      <Field required name="contractStatus" label="Contract Status" select component={TextFieldForm}>
        {contractStatusOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Field>

      <Field
        name="ppd"
        label="Published Price to Dealer"
        component={TextFieldForm}
        type="number"
        InputProps={{
          startAdornment: <InputAdornment position="start">%</InputAdornment>,
        }}
        // Condicional para el campo "required"
        required={isContractActive}
      />
      <Field
        name="docUrl"
        label="Document URL"
        component={TextFieldForm}
        required={isContractActive} // Condicional para el campo "required"
      />
      <Box sx={{ display: "flex", gap: 5 }}>
        <Field
          name="startDate"
          label="Start Date"
          component={BasicDatePicker}
          onChange={(value: FormikValues) => handleDateChange("startDate", value)}
          format="DD/MM/YYYY"
          disableHighlightToday
          views={["year", "month", "day"]}
          required={isContractActive} // Condicional para el campo "required"
        />

        <Field
          name="endDate"
          minDate={values.startDate ? dayjs(values.startDate) : undefined}
          label="End Date"
          component={BasicDatePicker}
          onChange={(value: FormikValues) => handleDateChange("endDate", value)}
          disableHighlightToday
          views={["year", "month", "day"]}
          required={isContractActive} // Condicional para el campo "required"
        />
      </Box>
      <FormControlLabel
        control={
          <Switch
            checked={values.contractSigned}
            onChange={handleSigned}
            color="primary"
            required={isContractActive} // Condicional para el campo "required"
          />
        }
        label="Contract Signed"
      />

      {values.contractSigned && (
        <>
          <Field
            name="contractSignedBy"
            label="Signed By"
            component={TextFieldForm}
            required={isContractActive} // Condicional para el campo "required"
          />
          <Field
            name="contractSignedAt"
            label="Signed At"
            component={BasicDatePicker}
            format="DD/MM/YYYY"
            onChange={(value: FormikValues) => handleDateChange("contractSignedAt", value)}
            disableHighlightToday
            required={isContractActive} // Condicional para el campo "required"
          />
        </>
      )}
    </Box>
  );
};

export default ContractDetailsForm;
