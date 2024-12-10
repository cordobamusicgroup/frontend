"use client";
import React, { useState } from "react";
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, useTheme, Paper } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AddOutlined } from "@mui/icons-material";

import axios from "axios";
import UsersAdminFormLayout from "../organisms/UsersAdminFormLayout";
import BackPageButton from "@/components/global/atoms/BackPageButton";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import FormErrorPopup from "@/components/global/molecules/FormErrorPopUp";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import { useUsersAdmin } from "@/lib/hooks/admin/hookUsersAdmin";
import { UserAdminValidationSchema } from "../utils/UsersAdminValidationSchema";

const CreateUserPage: React.FC = () => {
  const theme = useTheme();
  const { createUser, userLoading } = useUsersAdmin(); // Use the hook for users

  const [errorOpen, setErrorOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Configuración de useForm con yupResolver para validación
  const methods = useForm({
    mode: "all",
    resolver: yupResolver(UserAdminValidationSchema),
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const onSubmit = async (data: any) => {
    try {
      await createUser(data); // Use the method from the hook
      setSuccessMessage("The user was successfully created.");
      setApiErrorMessage(null); // Clear API errors on success
      reset(); // Reset the form
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.data) {
        scrollToTop();
        setApiErrorMessage(error.response?.data?.message || "An unexpected error occurred.");
        setSuccessMessage(null);
      } else {
        setApiErrorMessage("An unexpected error occurred.");
      }
    }

    console.log("Form Submitted with data:", data);
  };

  const handleUserSubmit = handleSubmit(
    (data) => {
      onSubmit(data); // Call the onSubmit function if there are no errors
    },
    (errors) => {
      if (Object.keys(errors).length > 0) {
        setErrorOpen(true); // Open the popup if there are errors
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
        <Typography sx={{ flexGrow: 1, fontSize: "18px" }}>Creating New User</Typography>
        <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
        <BasicButton colorBackground="white" colorText={theme.palette.secondary.main} onClick={handleUserSubmit} color="primary" variant="contained" disabled={userLoading} startIcon={<AddOutlined />} endIcon={userLoading ? <CircularProgress size={20} /> : null}>
          Create User
        </BasicButton>
      </CustomPageHeader>

      <Box>{successMessage && <SuccessBox>{successMessage}</SuccessBox>}</Box>
      <Box>{apiErrorMessage && <ErrorBox>{apiErrorMessage}</ErrorBox>}</Box>

      <FormProvider {...methods}>
        <UsersAdminFormLayout handleSubmit={handleUserSubmit} onChange={handleInputChange} />
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

export default CreateUserPage;
