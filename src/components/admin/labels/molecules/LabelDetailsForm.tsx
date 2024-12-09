import React from "react";
import { Autocomplete, FormControlLabel, Input, MenuItem, Switch, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import TextFieldForm from "@/components/global/atoms/TextFieldForm";
import { typeOptions, taxIdTypeOptions, LabelStatus } from "@/constants/backend.enums";
import { useClients } from "@/lib/hooks/admin/hookClientsAdmin";
import { Block, BlockOutlined, CheckCircle, CheckCircleOutline, DoDisturbOnOutlined } from "@mui/icons-material";

const LabelDetailsForm: React.FC = () => {
  const { setValue, watch, control } = useFormContext();
  const { clientData = [], clientLoading, clientError } = useClients();

  const clientId = watch("clientId");
  const selectedClient = clientData?.find((client: any) => client.id === clientId) || null;

  return (
    <>
      <TextFieldForm name="labelId" label="Label ID" disabled />

      <Autocomplete options={clientData} getOptionLabel={(option) => `[ID: ${option.id}] ${option.clientName} (${option.firstName} ${option.lastName}) `} loading={clientLoading} onChange={(event, value) => setValue("clientId", value ? value.id : null)} value={selectedClient} isOptionEqualToValue={(option, value) => option.id === value.id} renderInput={(params) => <TextFieldForm {...params} required name="clientId" label="Client" />} />

      <TextFieldForm name="labelName" label="Label Name" />

      <TextFieldForm name="labelStatus" label="Label Status" select>
        {LabelStatus.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.value === "ACTIVE" ? <CheckCircleOutline fontSize="small" color="success" style={{ marginRight: "8px" }} /> : <DoDisturbOnOutlined fontSize="small" color="error" style={{ marginRight: "8px" }} />}
            {option.label}
          </MenuItem>
        ))}
      </TextFieldForm>
    </>
  );
};

export default LabelDetailsForm;
