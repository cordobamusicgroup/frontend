"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, useTheme, List, ListItem, ListItemText, TextField, Button } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CachedOutlined } from "@mui/icons-material";
import * as Yup from "yup";

import axios from "axios";
import { useProfileUser } from "@/lib/hooks/user/hookProfileUser";
import BackPageButton from "@/components/global/atoms/BackPageButton";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import FormErrorPopup from "@/components/global/molecules/FormErrorPopUp";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import FormSkeletonLoader from "@/components/global/molecules/FormSkeletonLoader";
import LoadingSpinner from "@/components/global/atoms/LoadingSpinner";
import { UserValidationSchema } from "../utils/UserValidationSchema";
import UserFormLayout from "../organisms/UserFormLayout";
import BoxButtonsHeader from "@/components/header/molecules/BoxButtonsHeader";

const getUpdatedFields = (formData: any, originalData: any) => {
  return Object.keys(formData).reduce((acc: any, key) => {
    if (formData[key] !== originalData[key]) {
      acc[key] = formData[key];
    }
    return acc;
  }, {});
};

const passwordValidationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

const ProfileUserPage: React.FC = () => {
  const theme = useTheme();
  const { getCurrentUser, editProfile, error, loading } = useProfileUser();
  const [userData, setUserData] = useState<any>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<string | null>(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null);

  const [originalData, setOriginalData] = useState<any>(null);

  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver(UserValidationSchema),
    reValidateMode: "onChange",
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getCurrentUser();
        setUserData(data);
        const formattedData = {
          email: data.email,
          fullName: data.fullName,
          password: "",
        };
        reset(formattedData);
        setOriginalData(formattedData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [getCurrentUser, reset]);

  const onSubmit = async (formData: any) => {
    const updatedFields = getUpdatedFields(formData, originalData);

    const mappedData: any = {
      email: updatedFields.email,
      fullName: updatedFields.fullName,
    };

    if (updatedFields.currentPassword) {
      mappedData.currentPassword = updatedFields.currentPassword;
    }

    if (updatedFields.newPassword) {
      mappedData.newPassword = updatedFields.newPassword;
    }

    try {
      await editProfile(mappedData);
      scrollToTop();
      setSuccessMessage("The profile was successfully updated.");
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
        <Typography sx={{ flexGrow: 1, fontSize: "18px" }}>Profile</Typography>
        <BoxButtonsHeader>
          <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
          <BasicButton colorBackground="white" colorText={"#164723"} onClick={handleFormSubmit} color="primary" variant="contained" startIcon={<CachedOutlined />} disabled={loading}>
            Update Profile
          </BasicButton>
        </BoxButtonsHeader>
      </CustomPageHeader>

      <Box>{successMessage && <SuccessBox>{successMessage}</SuccessBox>}</Box>
      <Box>{apiErrorMessage && <ErrorBox>{apiErrorMessage}</ErrorBox>}</Box>

      <FormProvider {...methods}>
        <UserFormLayout handleSubmit={handleFormSubmit} onChange={handleInputChange} />
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

export default ProfileUserPage;
