"use client";
import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Grid, Paper, useTheme, List, ListItem, ListItemText } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BackPageButton from "../../../atoms/BackPageButton";
import { useTranslations } from "next-intl";
import { AddOutlined, CachedOutlined } from "@mui/icons-material";
import SuccessBox from "../../../molecules/SuccessBox";
import AddressDetailsForm from "../../../molecules/forms/AddressDetailsForm";
import BasicButton from "../../../atoms/BasicButton";
import FormErrorPopup from "../../../molecules/FormErrorPopUp";
import CustomPageHeader from "../../../molecules/header/CustomPageHeader";
import { ClientValidationSchema } from "../../../utils/forms/ClientValidationSchema";
import ErrorBox from "../../../molecules/ErrorBox";
import axios from "axios";
import dayjs from "dayjs";
import ClientDetailsForm from "../../../molecules/forms/ClientDetailsForm";
import ContractDetailsForm from "../../../molecules/forms/ContractDetailsForm";
import ClientFormLayout from "../../../organisms/clients/ClientFormLayout";
import { useClients } from "@/lib/hooks/useClients";

type Props = {
  clientId: string;
};

const UpdateClientPage: React.FC<Props> = ({ clientId }) => {
  const t = useTranslations();
  const theme = useTheme();
  const { clientData, updateClient, loading, error } = useClients(clientId);
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
    // Aquí enviamos todos los datos sin comparación, ya que el backend se encargará de procesarlos
    const payload = {
      clientName: formData.clientName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      type: formData.type,
      taxIdType: formData.taxIdType,
      taxId: formData.taxId,
      vatRegistered: formData.vatRegistered,
      vatId: formData.vatId,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        countryId: formData.countryId,
        zip: formData.zip,
      },
      contract: {
        contractType: formData.contractType,
        status: formData.contractStatus,
        signed: formData.contractSigned,
        signedBy: formData.contractSignedBy,
        signedAt: formData.contractSignedAt,
        startDate: formData.startDate,
        endDate: formData.endDate,
        ppd: formData.ppd ? parseFloat(formData.ppd) : null,
        docUrl: formData.docUrl,
      },
      dmb: {
        accessType: formData.dmbAccessType,
        status: formData.dmbStatus,
        subclientName: formData.dmbSubclientName,
        username: formData.dmbUsername,
      },
    };

    try {
      await updateClient(payload);
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

    console.log("Form Submitted with payload:", payload);
  };

  const handleClientSubmit = handleSubmit(
    (data) => {
      onSubmit(data);
    },
    (errors) => {
      if (Object.keys(errors).length > 0) {
        setErrorOpen(true);
      }
    }
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleErrorClose = () => setErrorOpen(false);

  const handleInputChange = () => setSuccessMessage(null);

  // Mostrar loader mientras los datos están cargando
  if (loading || !clientData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
      <CustomPageHeader background={"linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)"} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontWeight: "100", fontSize: "18px" }}>Edit Client</Typography>
        <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
        <BasicButton colorBackground="white" colorText={theme.palette.secondary.main} onClick={handleClientSubmit} color="primary" variant="contained" disabled={loading} startIcon={<CachedOutlined />} endIcon={loading ? <CircularProgress size={20} /> : null}>
          Update Client
        </BasicButton>
      </CustomPageHeader>

      <Box>{successMessage && <SuccessBox>{successMessage}</SuccessBox>}</Box>
      <Box>{apiErrorMessage && <ErrorBox>{apiErrorMessage}</ErrorBox>}</Box>

      <FormProvider {...methods}>
        <ClientFormLayout handleSubmit={handleClientSubmit} onChange={handleInputChange} loading={loading} />
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
