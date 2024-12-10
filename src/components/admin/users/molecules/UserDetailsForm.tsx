import React from "react";
import { Autocomplete, MenuItem } from "@mui/material";
import { useFormContext } from "react-hook-form";
import TextFieldForm from "@/components/global/atoms/TextFieldForm";
import { useClients } from "@/lib/hooks/admin/hookClientsAdmin";

const UserDetailsForm: React.FC = () => {
  const { setValue, watch, control } = useFormContext();
  const { clientData = [], clientLoading, clientError } = useClients();
  const clientId = watch("clientId");
  const selectedClient = clientData?.find((client: any) => client.id === clientId) || null;

  return (
    <>
      <TextFieldForm name="username" label="Username" />
      <TextFieldForm name="email" label="Email" />
      <TextFieldForm name="fullName" label="Full Name" />
      <TextFieldForm name="role" label="Role" select>
        <MenuItem value="ADMIN">Admin</MenuItem>
        <MenuItem value="USER">User</MenuItem>
      </TextFieldForm>
      <Autocomplete options={clientData} getOptionLabel={(option) => `[ID: ${option.id}] ${option.clientName} (${option.firstName} ${option.lastName}) `} loading={clientLoading} onChange={(event, value) => setValue("clientId", value ? value.id : null)} value={selectedClient} isOptionEqualToValue={(option, value) => option.id === value.id} renderInput={(params) => <TextFieldForm {...params} name="clientId" label="Client" />} />
    </>
  );
};

export default UserDetailsForm;
