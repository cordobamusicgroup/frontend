import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import ClientDetailsForm from "../molecules/ClientDetailsForm";
import AddressDetailsForm from "../molecules/AddressDetailsForm";

interface CreateClientFormProps {
  isLoading: boolean;
  error?: any; // Optional error prop if needed
}

const CreateClientForm: React.FC<CreateClientFormProps> = ({ isLoading }) => {
  return (
    <Box>
      <ClientDetailsForm />
      {isLoading && <CircularProgress />}
    </Box>
  );
};

export default CreateClientForm;
