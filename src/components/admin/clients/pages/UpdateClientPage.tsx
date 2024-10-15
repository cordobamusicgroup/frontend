"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Box, CircularProgress, Typography, Grid, Paper, useTheme, List, ListItem, ListItemText, Skeleton } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { AddOutlined, CachedOutlined } from "@mui/icons-material";

import { ClientValidationSchema } from "../utils/ClientValidationSchema";

import axios from "axios";
import dayjs from "dayjs";
import { useClients } from "@/lib/hooks/useClients";
import ClientFormLayout from "../organisms/ClientFormLayout";
import BackPageButton from "@/components/global/atoms/BackPageButton";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import FormErrorPopup from "@/components/global/molecules/FormErrorPopUp";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import FormSkeletonLoader from "@/components/global/molecules/FormSkeletonLoader";

type Props = {
  clientId: string;
};

const getUpdatedFields = (formData: any, originalData: any) => {
  return Object.keys(formData).reduce((acc: any, key) => {
    if (formData[key] !== originalData[key]) {
      acc[key] = formData[key];
    }
    return acc;
  }, {});
};

const UpdateClientPage: React.FC<Props> = ({ clientId }) => {
  const t = useTranslations();
  const theme = useTheme();
  const { clientData, updateClient, clientLoading, clientError } = useClients(clientId);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Estado para guardar los datos originales para comparación
  const [originalData, setOriginalData] = useState<any>(null);

  // Inicializar el formulario sin defaultValues
  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver(ClientValidationSchema),
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  // Guardar los datos originales cuando se cargan
  useEffect(() => {
    if (clientData) {
      const formattedData = {
        clientId: clientData.id,
        clientName: clientData.clientName,
        firstName: clientData.firstName,
        lastName: clientData.lastName,
        type: clientData.type,
        taxIdType: clientData.taxIdType,
        taxId: clientData.taxId,
        vatRegistered: clientData.vatRegistered,
        vatId: clientData.vatId,
        street: clientData.address?.street,
        city: clientData.address?.city,
        state: clientData.address?.state,
        countryId: clientData.address?.countryId,
        zip: clientData.address?.zip,
        contractUUID: clientData.contract.uuid,
        contractType: clientData.contract?.contractType,
        contractStatus: clientData.contract?.status,
        startDate: dayjs(clientData.contract?.startDate),
        endDate: dayjs(clientData.contract?.endDate),
        contractSignedBy: clientData.contract?.signedBy,
        contractSignedAt: dayjs(clientData.contract.signedAt),
        ppd: clientData.contract?.ppd,
        docUrl: clientData.contract?.docUrl,
        dmbAccessType: clientData.dmb?.accessType,
        dmbStatus: clientData.dmb?.status,
        dmbSubclientName: clientData.dmb?.subclientName,
        dmbUsername: clientData.dmb?.username,
      };

      // Establecer los valores en el formulario
      reset(formattedData);

      // Guardar los datos originales para referencia
      setOriginalData(formattedData);
    }
  }, [clientData, reset]);

  const onSubmit = async (formData: any) => {
    const updatedFields = getUpdatedFields(formData, originalData);

    try {
      await updateClient(updatedFields); // Solo los campos actualizados
      scrollToTop();
      setSuccessMessage("The client was successfully updated.");
      setApiErrorMessage(null);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data) {
        setApiErrorMessage(error.response.data.message);
        setSuccessMessage(null);
      } else {
        setApiErrorMessage("An unexpected error occurred.");
      }
    }
  };

  const handleClientSubmit = useCallback(
    handleSubmit(
      (data) => onSubmit(data),
      (errors) => {
        if (Object.keys(errors).length > 0) {
          setErrorOpen(true);
        }
      }
    ),
    [onSubmit]
  );

  const handleInputChange = useCallback(() => setSuccessMessage(null), []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleErrorClose = () => setErrorOpen(false);

  if (clientLoading || !clientData) {
    return <FormSkeletonLoader />;
  }

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
      <CustomPageHeader background={"linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)"} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontWeight: "100", fontSize: "18px" }}>Edit Client</Typography>
        <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
        <BasicButton colorBackground="white" colorText={theme.palette.secondary.main} onClick={handleClientSubmit} color="primary" variant="contained" disabled={clientLoading} startIcon={<CachedOutlined />} endIcon={clientLoading ? <CircularProgress size={20} /> : null}>
          Update Client
        </BasicButton>
      </CustomPageHeader>

      <Box>{successMessage && <SuccessBox>{successMessage}</SuccessBox>}</Box>
      <Box>{apiErrorMessage && <ErrorBox>{apiErrorMessage}</ErrorBox>}</Box>

      <FormProvider {...methods}>
        <ClientFormLayout handleSubmit={handleClientSubmit} onChange={handleInputChange} loading={clientLoading} />
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

export default UpdateClientPage;
