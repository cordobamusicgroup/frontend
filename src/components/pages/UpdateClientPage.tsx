"use client";
import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, Grid, Paper, useTheme, List, ListItem, ListItemText } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useClients } from "@/lib/hooks/clients/useClients";
import BackPageButton from "../atoms/BackPageButton";
import { useTranslations } from "next-intl";
import { AddOutlined } from "@mui/icons-material";
import SuccessBox from "../molecules/SuccessBox";
import ContractDetailsForm from "../organisms/forms/create/ContractDetailsForm";
import ClientDetailsForm from "../organisms/forms/create/ClientDetailsForm";
import AddressDetailsForm from "../organisms/forms/create/AddressDetailsForm";
import BasicButton from "../atoms/BasicButton";
import FormErrorPopup from "../molecules/FormErrorPopUp";
import CustomPageHeader from "../molecules/header/CustomPageHeader";
import { CreateClientValidationSchema } from "../utils/forms/CreateClientValidationSchema";
import ErrorBox from "../molecules/ErrorBox";
import axios from "axios";
import dayjs from "dayjs";

type Props = {
  clientId: string;
};

const UpdateClientPage: React.FC<Props> = ({ clientId }) => {
  const t = useTranslations();
  const theme = useTheme();
  const { data, updateClient, loading, error } = useClients(clientId);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Estado para guardar los datos originales para comparación
  const [originalData, setOriginalData] = useState<any>(null);

  // Inicializar el formulario sin defaultValues
  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver(CreateClientValidationSchema),
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  // Guardar los datos originales cuando se cargan
  useEffect(() => {
    if (data) {
      const formattedData = {
        clientId: data.id,
        clientName: data.clientName,
        firstName: data.firstName,
        lastName: data.lastName,
        type: data.type,
        taxIdType: data.taxIdType,
        taxId: data.taxId,
        vatRegistered: data.vatRegistered,
        vatId: data.vatId,
        street: data.address?.street,
        city: data.address?.city,
        state: data.address?.state,
        countryId: data.address?.countryId,
        zip: data.address?.zip,
        contractUUID: data.contract.uuid,
        contractType: data.contract?.contractType,
        contractStatus: data.contract?.status,
        startDate: dayjs(data.contract?.startDate),
        endDate: dayjs(data.contract?.endDate),
        contractSignedBy: data.contract?.signedBy,
        contractSignedAt: dayjs(data.contract?.signedAt),
        ppd: data.contract?.ppd,
        docUrl: data.contract?.docUrl,
      };

      // Establecer los valores en el formulario
      reset(formattedData);

      // Guardar los datos originales para referencia
      setOriginalData(formattedData);
    }
  }, [data, reset]);

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
    };

    try {
      await updateClient(payload);
      setSuccessMessage("The client was successfully updated.");
      setApiErrorMessage(null);
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data) {
        scrollToTop();
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
  if (loading || !data) {
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
        <BasicButton colorBackground="white" colorText={theme.palette.secondary.main} onClick={handleClientSubmit} color="primary" variant="contained" disabled={loading} startIcon={<AddOutlined />} endIcon={loading ? <CircularProgress size={20} /> : null}>
          Update Client
        </BasicButton>
      </CustomPageHeader>

      <Box>{successMessage && <SuccessBox>{successMessage}</SuccessBox>}</Box>
      <Box>{apiErrorMessage && <ErrorBox>{apiErrorMessage}</ErrorBox>}</Box>

      <FormProvider {...methods}>
        <form onChange={handleInputChange} onSubmit={handleSubmit(onSubmit)}>
          <Paper elevation={1} variant="outlined" square={false} sx={{ paddingX: 2, paddingY: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography
                  sx={{
                    width: "fit-content",
                    color: "secondary.main",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    borderRadius: "2px",
                  }}
                  variant="h6"
                  mb={1}
                >
                  Personal Details
                </Typography>
                <ClientDetailsForm />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  sx={{
                    width: "fit-content",
                    color: "secondary.main",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    borderRadius: "2px",
                  }}
                  variant="h6"
                  mb={1}
                >
                  Address
                </Typography>
                <AddressDetailsForm />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography
                  sx={{
                    width: "fit-content",
                    color: "secondary.main",
                    borderBottom: "2px solid",
                    borderColor: "primary.main",
                    borderRadius: "2px",
                  }}
                  variant="h6"
                  mb={1}
                >
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

export default UpdateClientPage;
