"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Box, CircularProgress, Typography, Grid, Paper, useTheme, List, ListItem, ListItemText, Skeleton } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddOutlined, CachedOutlined } from "@mui/icons-material";
import axios from "axios";
import dayjs from "dayjs";
import { useClients } from "@/lib/hooks/admin/hookClientsAdmin";
import BackPageButton from "@/components/global/atoms/BackPageButton";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import FormErrorPopup from "@/components/global/molecules/FormErrorPopUp";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import FormSkeletonLoader from "@/components/global/molecules/FormSkeletonLoader";
import { useUsersAdmin } from "@/lib/hooks/admin/hookUsersAdmin";
import UsersAdminFormLayout from "../organisms/UsersAdminFormLayout";
import { UserAdminValidationSchema } from "../utils/UsersAdminValidationSchema";

type Props = {
  userId: string;
};

const getUpdatedFields = (formData: any, originalData: any) => {
  return Object.keys(formData).reduce((acc: any, key) => {
    if (formData[key] !== originalData[key]) {
      acc[key] = formData[key];
    }
    return acc;
  }, {});
};

const UpdateUserPage: React.FC<Props> = ({ userId }) => {
  const theme = useTheme();
  const { userData, updateUser, userError, userLoading } = useUsersAdmin(userId);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const [originalData, setOriginalData] = useState<any>(null);

  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver(UserAdminValidationSchema),
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  // Load initial values after API Response
  useEffect(() => {
    if (userData && !originalData) {
      const formattedData = {
        userId: userData.id,
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
        clientId: userData.clientId,
      };

      reset(formattedData);
      setOriginalData(formattedData);
    }
  }, [userData, originalData, reset]);

  const onSubmit = async (formData: any) => {
    const updatedFields = getUpdatedFields(formData, originalData);

    const mappedData = {
      username: updatedFields.username,
      email: updatedFields.email,
      fullName: updatedFields.fullName,
      role: updatedFields.role,
      clientId: updatedFields.clientId,
    };

    try {
      await updateUser(mappedData);
      scrollToTop();
      setSuccessMessage("The user was successfully updated.");
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

  if (!userData) {
    return <FormSkeletonLoader />;
  }

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
      <CustomPageHeader background={"linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)"} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontSize: "18px" }}>Edit User</Typography>
        <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
        <BasicButton colorBackground="white" colorText={theme.palette.secondary.main} onClick={handleFormSubmit} color="primary" variant="contained" disabled={userLoading} startIcon={<CachedOutlined />} endIcon={userLoading ? <CircularProgress size={20} /> : null}>
          Update User
        </BasicButton>
      </CustomPageHeader>

      <Box>{successMessage && <SuccessBox>{successMessage}</SuccessBox>}</Box>
      <Box>{apiErrorMessage && <ErrorBox>{apiErrorMessage}</ErrorBox>}</Box>

      <FormProvider {...methods}>
        <UsersAdminFormLayout handleSubmit={handleFormSubmit} onChange={handleInputChange} />
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

export default UpdateUserPage;
