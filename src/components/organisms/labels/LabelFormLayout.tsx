import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import AddressDetailsForm from "../../molecules/forms/AddressDetailsForm";
import ClientDetailsForm from "../../molecules/forms/ClientDetailsForm";
import ContractDetailsForm from "../../molecules/forms/ContractDetailsForm";
import DmbDetailsForm from "../../molecules/forms/DmbDetailsForm";
import LabelDetailsForm from "../../molecules/forms/LabelDetailsForm";

type Props = {
  handleSubmit: () => void;
  onChange: () => void;
  loading: boolean;
};

const LabelFormLayout: React.FC<Props> = ({ handleSubmit, onChange, loading }) => {
  return (
    <form onChange={onChange} onSubmit={handleSubmit}>
      <Paper elevation={0} variant="outlined" square={false} sx={{ paddingX: 2, paddingY: 2 }}>
        <LabelDetailsForm />
      </Paper>
    </form>
  );
};

export default LabelFormLayout;