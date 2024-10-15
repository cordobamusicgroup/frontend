"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Box, CircularProgress, Typography, Grid, Paper, useTheme, List, ListItem, ListItemText, Skeleton } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { AddOutlined, CachedOutlined } from "@mui/icons-material";
import axios from "axios";
import dayjs from "dayjs";
import { useClients } from "@/lib/hooks/useClients";
import BackPageButton from "@/components/global/atoms/BackPageButton";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import FormErrorPopup from "@/components/global/molecules/FormErrorPopUp";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import { LabelValidationSchema } from "../utils/LabelValidationSchema";
import { useLabels } from "@/lib/hooks/useLabels";
import LabelFormLayout from "../organisms/LabelFormLayout";
import FormSkeletonLoader from "@/components/global/molecules/FormSkeletonLoader";

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
  const t = useTranslations();
  const theme = useTheme();
  const { labelData, updateLabel, labelError, labelLoading } = useLabels(labelId);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const [originalData, setOriginalData] = useState<any>(null);

  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver(LabelValidationSchema),
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

  const onSubmit = async (formData: any) => {
    const updatedFields = getUpdatedFields(formData, originalData);

    try {
      await updateLabel(updatedFields); // Lógica para actualizar el label
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

  const handleLabelSubmit = useCallback(
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

  if (labelLoading || !labelData) {
    return <FormSkeletonLoader />;
  }

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
      <CustomPageHeader background={"linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)"} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontWeight: "100", fontSize: "18px" }}>Edit Client</Typography>
        <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
        <BasicButton colorBackground="white" colorText={theme.palette.secondary.main} onClick={handleLabelSubmit} color="primary" variant="contained" disabled={labelLoading} startIcon={<CachedOutlined />} endIcon={labelLoading ? <CircularProgress size={20} /> : null}>
          Update Client
        </BasicButton>
      </CustomPageHeader>

      <Box>{successMessage && <SuccessBox>{successMessage}</SuccessBox>}</Box>
      <Box>{apiErrorMessage && <ErrorBox>{apiErrorMessage}</ErrorBox>}</Box>

      <FormProvider {...methods}>
        <LabelFormLayout handleSubmit={handleLabelSubmit} onChange={handleInputChange} loading={labelLoading} />
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

export default UpdateLabelPage;
