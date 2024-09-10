"use client";
import React, { useState } from "react";
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, useTheme, Grid, Paper } from "@mui/material";
import { useForm, FormProvider, set } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateClient } from "@/lib/hooks/clients/useCreateClient";
import BackPageButton from "../atoms/BackPageButton";
import { useTranslations } from "next-intl";
import { AddOutlined } from "@mui/icons-material";
import SuccessBox from "../molecules/SuccessBox";
import ContractDetailsForm from "../organisms/forms/create/CreateContractForm";
import ClientDetailsForm from "../organisms/forms/create/CreateClientForm";
import AddressDetailsForm from "../organisms/forms/create/CreateAddressForm";
import BasicButton from "../atoms/BasicButton";
import FormErrorPopup from "../molecules/FormErrorPopUp";
import CustomPageHeader from "../molecules/header/CustomPageHeader";
import { CreateClientFormHandlerSubmit } from "../utils/forms/CreateClientFormHandler";
import { CreateClientValidationSchema } from "../utils/forms/CreateClientValidationSchema";
import { CreateClientInitialValues } from "../utils/forms/CreateClientInitialValues";
import ErrorBox from "../molecules/ErrorBox";
import axios, { AxiosError } from "axios";

const CreateClientPage: React.FC = () => {
  const t = useTranslations();
  const theme = useTheme();
  const { createClient, createClientLoading } = useCreateClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null); // Un solo mensaje de error de la API

  // Configuración de useForm con yupResolver para validación
  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver(CreateClientValidationSchema),
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const onSubmit = async (data: any) => {
    const payload = {
      clientName: data.clientName,
      firstName: data.firstName,
      lastName: data.lastName,
      type: data.type,
      taxIdType: data.taxIdType,
      taxId: data.taxId,
      vatRegistered: data.vatRegistered,
      vatId: data.vatId,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        countryId: data.countryId,
        zip: data.zip,
      },
      contract: {
        contractType: data.contractType,
        status: data.contractStatus,
        signed: data.contractSigned,
        signedBy: data.contractSignedBy,
        signedAt: data.contractSignedAt,
        startDate: data.startDate,
        endDate: data.endDate,
        ppd: parseFloat(data.ppd),
        docUrl: data.docUrl,
      },
    };
    try {
      await createClient(payload);
      setSuccessMessage("The client was successfully created.");
      setApiErrorMessage(null); // Limpiar errores de la API al éxito

      //reset();
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data) {
        scrollToTop();
        setApiErrorMessage(error.response.data.message);
        setSuccessMessage(null);
      } else {
        setApiErrorMessage("An unexpected error occurred.");
      }
    }

    console.log("Form Submitted with data:", payload);
  };

  const handleClientSubmit = handleSubmit(
    (data) => {
      onSubmit(data); // Llama a la función onSubmit si no hay errores
    },
    (errors) => {
      if (Object.keys(errors).length > 0) {
        setErrorOpen(true); // Abre el popup si hay errores
      }
    }
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleErrorClose = () => setErrorOpen(false);

  const handleInputChange = () => setSuccessMessage(null);

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
      <CustomPageHeader background={"linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)"} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontWeight: "100", fontSize: "18px" }}>Creating New Client</Typography>
        <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
        <BasicButton colorBackground="white" colorText={theme.palette.secondary.main} onClick={handleClientSubmit} color="primary" variant="contained" disabled={createClientLoading} startIcon={<AddOutlined />} endIcon={createClientLoading ? <CircularProgress size={20} /> : null}>
          Create Client
        </BasicButton>
      </CustomPageHeader>

      <Box>{successMessage && <SuccessBox>{successMessage}</SuccessBox>}</Box>
      <Box>{apiErrorMessage && <ErrorBox>{apiErrorMessage}</ErrorBox>}</Box>

      <FormProvider {...methods}>
        <form onChange={handleInputChange} onSubmit={handleSubmit(onSubmit)}>
          <Paper elevation={1} variant="outlined" square={false} sx={{ paddingX: 2, paddingY: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ width: "fit-content", color: "secondary.main", borderBottom: "2px solid", borderColor: "primary.main", borderRadius: "2px" }} variant="h6" mb={1}>
                  Personal Details
                </Typography>
                <ClientDetailsForm />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ width: "fit-content", color: "secondary.main", borderBottom: "2px solid", borderColor: "primary.main", borderRadius: "2px" }} variant="h6" mb={1}>
                  Address
                </Typography>
                <AddressDetailsForm />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography sx={{ width: "fit-content", color: "secondary.main", borderBottom: "2px solid", borderColor: "primary.main", borderRadius: "2px" }} variant="h6" mb={1}>
                  Contract Details
                </Typography>
                <ContractDetailsForm />
              </Grid>
            </Grid>
          </Paper>
        </form>
      </FormProvider>
      <FormErrorPopup open={errorOpen} onClose={handleErrorClose}>
        <List sx={{ padding: 0, margin: 0 }}>
          {Object.values(errors).map((error) => (
            <ListItem key={error.ref?.toString()} disableGutters sx={{ padding: "1px 0" }}>
              <ListItemText primary={`• ${error.message}`} sx={{ margin: 0, padding: 0 }} />
            </ListItem>
          ))}
        </List>
      </FormErrorPopup>
    </Box>
  );
};

export default CreateClientPage;
