"use client";
import React, { useState } from "react";
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, useTheme, Grid, Paper } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddOutlined } from "@mui/icons-material";
import axios from "axios";
import BackPageButton from "@/components/global/atoms/BackPageButton";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import FormErrorPopup from "@/components/global/molecules/FormErrorPopUp";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import LabelFormLayout from "../organisms/LabelFormLayout";
import { LabelValidationSchema } from "../utils/LabelValidationSchema";
import { useLabels } from "@/lib/hooks/admin/hookLabelsAdmin";

const CreateLabelPage: React.FC = () => {
  const theme = useTheme();
  const { createLabel, labelLoading } = useLabels(); // Usamos el hook combinado

  const [errorOpen, setErrorOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Configuración de useForm con yupResolver para validación
  const methods = useForm({
    mode: "all",
    resolver: yupResolver(LabelValidationSchema),
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const onSubmit = async (formData: any) => {
    const payload = {
      clientId: formData.clientId,
      name: formData.labelName,
      status: formData.labelStatus,
      website: formData.website,
      countryId: formData.countryId,
      beatportStatus: formData.beatportStatus,
      traxsourceStatus: formData.traxsourceStatus,
      beatportUrl: formData.beatportUrl,
      traxsourceUrl: formData.traxsourceUrl,
    };
    try {
      await createLabel(payload); // Usamos el método del hook combinado
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

  const handleFormSubmit = handleSubmit(
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
      <CustomPageHeader background={"#24793B"} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontWeight: "100", fontSize: "18px" }}>Creating New Label</Typography>
        <BackPageButton colorBackground="white" colorText={"#164723"} />
        <BasicButton colorBackground="white" colorText={"#164723"} onClick={handleFormSubmit} color="primary" variant="contained" disabled={labelLoading} startIcon={<AddOutlined />} endIcon={labelLoading ? <CircularProgress size={20} /> : null}>
          Create Label
        </BasicButton>
      </CustomPageHeader>

      <Box>{successMessage && <SuccessBox>{successMessage}</SuccessBox>}</Box>
      <Box>{apiErrorMessage && <ErrorBox>{apiErrorMessage}</ErrorBox>}</Box>

      <FormProvider {...methods}>
        <LabelFormLayout handleSubmit={handleFormSubmit} onChange={handleInputChange} loading={labelLoading} />
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

export default CreateLabelPage;
