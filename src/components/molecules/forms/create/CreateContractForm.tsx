import React from "react";
import { MenuItem, InputAdornment, Box, FormControlLabel, Switch } from "@mui/material";
import { Field, useFormikContext } from "formik";
import TextFieldForm from "../../../atoms/TextFieldForm";
import { contractStatusOptions, contractTypeOptions } from "@/constants/client-enums";
import BasicDatePicker from "../../../atoms/BasicDatePicker";
import dayjs from "dayjs";

const ContractDetailsForm: React.FC = () => {
  const { values, setFieldValue } = useFormikContext<any>();

  const handleDateChange = (name: string, value: any) => {
    setFieldValue(name, value);
  };

  const handleSigned = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue("contractSigned", event.target.checked);
    if (!event.target.checked) {
      setFieldValue("vatId", "");
    }
  };
  return (
    <Box>
      <Field required name="contractType" label="Contract Type" select component={TextFieldForm}>
        {contractTypeOptions.map((option) => (
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
        required
        name="ppd"
        label="Published Price to Dealer"
        component={TextFieldForm}
        type="number"
        InputProps={{
          startAdornment: <InputAdornment position="start">%</InputAdornment>,
        }}
      />
      <Field required name="docUrl" label="Document URL" component={TextFieldForm} />
      <Box sx={{ display: "flex", gap: 5 }}>
        <Field required name="startDate" label="Start Date" component={BasicDatePicker} onChange={(value: any) => handleDateChange("startDate", value)} format="DD/MM/YYYY" disableHighlightToday views={["year", "month", "day"]} />

        <Field name="endDate" minDate={values.startDate ? dayjs(values.startDate) : undefined} label="End Date" component={BasicDatePicker} onChange={(value: any) => handleDateChange("endDate", value)} disableHighlightToday views={["year", "month", "day"]} />
      </Box>
      <FormControlLabel control={<Switch required checked={values.contractSigned} onChange={handleSigned} color="primary" />} label="Contract Signed" />

      {values.contractSigned && (
        <>
          <Field required name="contractSignedBy" label="Signed By" component={TextFieldForm} />
          <Field name="contractSignedAt" label="Signed At" component={BasicDatePicker} format="DD/MM/YYYY" onChange={(value: any) => handleDateChange("contractSignedAt", value)} disableHighlightToday />
        </>
      )}
    </Box>
  );
};

export default ContractDetailsForm;
