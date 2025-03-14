"use client";
import React, { useState } from "react";
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, useTheme, Grid, Paper } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddOutlined } from "@mui/icons-material";

import axios from "axios";
import ClientFormLayout from "../organisms/ClientFormLayout";
import BackPageButton from "@/components/global/atoms/BackPageButton";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import FormErrorPopup from "@/components/global/molecules/FormErrorPopUp";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import { useClients } from "@/lib/hooks/admin/hookClientsAdmin";
import { ClientValidationSchema } from "../utils/ClientValidationSchema";

const CreateClientPage: React.FC = () => {
  const theme = useTheme();
  const { createClient, clientLoading } = useClients(); // Usamos el hook combinado

  const [errorOpen, setErrorOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Configuración de useForm con yupResolver para validación
  const methods = useForm({
    mode: "all",
    resolver: yupResolver(ClientValidationSchema),
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
      dmb: {
        accessType: data.dmbAccessType,
        status: data.dmbStatus,
        subclientName: data.dmbSubclientName,
        username: data.dmbUsername,
      },
    };
    try {
      await createClient(payload); // Usamos el método del hook combinado
      setSuccessMessage("The client was successfully created.");
      setApiErrorMessage(null); // Limpiar errores de la API al éxito
      reset(); // Reseteamos el formulario
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
        <Typography sx={{ flexGrow: 1, fontSize: "18px" }}>Creating New Client</Typography>
        <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
        <BasicButton colorBackground="white" colorText={theme.palette.secondary.main} onClick={handleClientSubmit} color="primary" variant="contained" disabled={clientLoading} startIcon={<AddOutlined />} endIcon={clientLoading ? <CircularProgress size={20} /> : null}>
          Create Client
        </BasicButton>
      </CustomPageHeader>

      <Box>{successMessage && <SuccessBox>{successMessage}</SuccessBox>}</Box>
      <Box>{apiErrorMessage && <ErrorBox>{apiErrorMessage}</ErrorBox>}</Box>

      <FormProvider {...methods}>
        <ClientFormLayout handleSubmit={handleClientSubmit} onChange={handleInputChange} />
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
