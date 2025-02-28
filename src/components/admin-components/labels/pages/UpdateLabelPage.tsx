"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Box, CircularProgress, Typography, List, ListItem, ListItemText } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CachedOutlined } from "@mui/icons-material";
import axios from "axios";
import { useClients } from "@/lib/hooks/admin/hookClientsAdmin";
import BackPageButton from "@/components/global/atoms/BackPageButton";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import FormErrorPopup from "@/components/global/molecules/FormErrorPopUp";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import { LabelValidationSchema, LabelFormValues } from "../utils/LabelValidationSchema";
import LabelFormLayout from "../organisms/LabelFormLayout";
import FormSkeletonLoader from "@/components/global/molecules/FormSkeletonLoader";
import { useLabels } from "@/lib/hooks/admin/hookLabelsAdmin";
import { useTheme } from "@mui/material";

type Props = {
  labelId: string;
};

const getUpdatedFields = (formData: any, originalData: any) => {
  return Object.keys(formData).reduce((acc: any, key) => {
    if (formData[key] !== originalData[key]) {
      acc[key] = formData[key];
    }
    return acc;
  }, {});
};

const UpdateLabelPage: React.FC<Props> = ({ labelId }) => {
  const theme = useTheme();
  const { labelData, updateLabel, labelError, labelLoading } = useLabels(labelId);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const [originalData, setOriginalData] = useState<any>(null);

  // Update useEffect to follow the title template format
  useEffect(() => {
    if (labelData?.name) {
      // Follow the template format: "%s - Córdoba Music Group"
      document.title = `${labelData.name} - Córdoba Music Group`;
    }
  }, [labelData]);

  const methods = useForm<LabelFormValues>({
    mode: "onSubmit",
    resolver: zodResolver(LabelValidationSchema),
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  // Load initial values after API Response
  useEffect(() => {
    if (labelData && !originalData) {
      const formattedData = {
        labelId: labelData.id,
        clientId: labelData.clientId,
        labelName: labelData.name,
        labelStatus: labelData.status,
        labelWebsite: labelData.website,
        countryId: labelData.countryId,
        beatportStatus: labelData.beatportStatus,
        traxsourceStatus: labelData.traxsourceStatus,
        beatportUrl: labelData.beatportUrl,
        traxsourceUrl: labelData.traxsourceUrl,
      };

      reset(formattedData);
      setOriginalData(formattedData);
    }
  }, [labelData, originalData, reset]);

  const onSubmit = async (formData: LabelFormValues) => {
    // Mapea los datos del formulario a la estructura que espera la API
    const updatedFields = getUpdatedFields(formData, originalData);

    const mappedData = {
      name: updatedFields.labelName,
      clientId: updatedFields.clientId,
      status: updatedFields.labelStatus,
      website: updatedFields.labelWebsite,
      countryId: updatedFields.countryId,
      beatportStatus: updatedFields.beatportStatus,
      traxsourceStatus: updatedFields.traxsourceStatus,
      beatportUrl: updatedFields.beatportUrl,
      traxsourceUrl: updatedFields.traxsourceUrl,
    };

    try {
      await updateLabel(mappedData);
      scrollToTop();
      setSuccessMessage("The label was successfully updated.");
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

  const handleFormSubmit = handleSubmit(
    (data) => onSubmit(data),
    (errors) => {
      if (Object.keys(errors).length > 0) {
        setErrorOpen(true);
      }
    }
  );

  const handleInputChange = useCallback(() => setSuccessMessage(null), []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleErrorClose = () => setErrorOpen(false);

  if (!labelData) {
    return <FormSkeletonLoader />;
  }

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
      <CustomPageHeader background={"linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)"} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontSize: "18px" }}>Edit Label</Typography>
        <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
        <BasicButton colorBackground="white" colorText={theme.palette.secondary.main} onClick={handleFormSubmit} color="primary" variant="contained" disabled={labelLoading} startIcon={<CachedOutlined />} endIcon={labelLoading ? <CircularProgress size={20} /> : null}>
          Update Label
        </BasicButton>
      </CustomPageHeader>

      <Box>{successMessage && <SuccessBox>{successMessage}</SuccessBox>}</Box>
      <Box>{apiErrorMessage && <ErrorBox>{apiErrorMessage}</ErrorBox>}</Box>

      <FormProvider {...methods}>
        <LabelFormLayout handleSubmit={handleFormSubmit} onChange={handleInputChange} loading={labelLoading} />
      </FormProvider>
      <FormErrorPopup open={errorOpen} onClose={handleErrorClose}>
        <List sx={{ padding: 0, margin: 0 }}>
          {Object.entries(errors).map(([field, error]) => (
            <ListItem key={field} disableGutters sx={{ padding: "1px 0" }}>
              <ListItemText primary={`• ${error.message}`} sx={{ margin: 0, padding: 0 }} />
            </ListItem>
          ))}
        </List>
      </FormErrorPopup>
    </Box>
  );
};

export default UpdateLabelPage;
