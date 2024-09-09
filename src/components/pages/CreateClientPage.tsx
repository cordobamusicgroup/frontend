"use client";
import React, { useState } from "react";
import { Box, CircularProgress, Typography, List, ListItem, ListItemText, useTheme, Grid, Paper } from "@mui/material";
import { Formik, Form, FormikValues } from "formik";
import * as Yup from "yup";
import { useCreateClient } from "@/lib/hooks/clients/useCreateClient";
import BackPageButton from "../atoms/BackPageButton";
import { useTranslations } from "next-intl";
import { AddOutlined } from "@mui/icons-material";
import SuccessBox from "../molecules/SuccessBox";
import ContractDetailsForm from "../organisms/forms/create/CreateContractForm";
import ClientDetailsForm from "../organisms/forms/create/CreateClientForm";
import { contractStatusOptions, contractTypeOptions, taxIdTypeOptions, typeOptions } from "@/constants/client-enums";
import dayjs from "dayjs";
import AddressDetailsForm from "../organisms/forms/create/CreateAddressForm";
import axios from "axios";
import BasicButton from "../atoms/BasicButton";
import FormErrorPopup from "../molecules/FormErrorPopUp";

const validationSchema = Yup.object({
  clientName: Yup.string().required("Client nickname is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  type: Yup.string()
    .oneOf(
      typeOptions.map((option) => option.value),
      "Invalid type"
    )
    .required("Type is required"),
  taxIdType: Yup.string()
    .oneOf(
      taxIdTypeOptions.map((option) => option.value),
      "Invalid Tax ID Type"
    )
    .required("Tax ID Type is required"),
  taxId: Yup.string().required("Tax ID is required"),
  vatRegistered: Yup.boolean().required(),
  vatId: Yup.string().when("vatRegistered", {
    is: true,
    then: (schema) => schema.required("VAT ID is required when VAT Registered is true"),
    otherwise: (schema) => schema.nullable().notRequired(),
  }),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  countryId: Yup.number().required("Country is required"),
  zip: Yup.string().required("Zip is required"),
  contractType: Yup.string()
    .oneOf(
      contractTypeOptions.map((option) => option.value),
      "Invalid contract type"
    )
    .required("Contract type is required"),
  contractStatus: Yup.string()
    .oneOf(
      contractStatusOptions.map((option) => option.value),
      "Invalid contract status"
    )
    .required("Contract Status is required"),

  // Conditional validations based on contract status
  ppd: Yup.string().when("contractStatus", {
    is: "ACTIVE",
    then: (schema) => schema.required("PPD is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  docUrl: Yup.string().when("contractStatus", {
    is: "ACTIVE",
    then: (schema) => schema.required("Document URL is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  startDate: Yup.date().when("contractStatus", {
    is: "ACTIVE",
    then: (schema) =>
      schema
        .required("Start date is required")
        .test("isValidDate", "Invalid date", (value) => {
          return value ? dayjs(value).isValid() : false;
        })
        .test("isFutureDate", "Start date cannot be in the past", (value) => {
          return value ? dayjs(value).isAfter(dayjs().subtract(1, "day")) : false;
        }),
    otherwise: (schema) => schema.nullable(),
  }),

  endDate: Yup.date().when("contractStatus", {
    is: (value: string | undefined) => value === "TERMINATED" || value === "EXPIRED",
    then: (schema) =>
      schema
        .required("End date is required")
        .test("isAfterStartDate", "End date must be after start date", function (value) {
          const { startDate } = this.parent;
          return value && startDate ? dayjs(value).isAfter(dayjs(startDate)) : false;
        })
        .test("isFutureDate", "End date cannot be in the past", (value) => {
          return value ? dayjs(value).isAfter(dayjs().subtract(1, "day")) : false;
        }),
    otherwise: (schema) => schema.nullable(),
  }),

  contractSigned: Yup.boolean().when("contractStatus", {
    is: "ACTIVE",
    then: (schema) => schema.required("Contract signed is required"),
    otherwise: (schema) => schema.nullable(),
  }),
});

const initialValues = {
  clientName: "",
  firstName: "",
  lastName: "",
  type: "",
  taxIdType: "",
  taxId: "",
  vatRegistered: false,
  vatId: "",
  street: "",
  city: "",
  state: "",
  countryId: null,
  zip: "",
  contractType: "",
  contractStatus: "",
  ppd: "",
  docUrl: "",
  startDate: dayjs(Date.now()),
};

const CreateClientPage: React.FC = () => {
  const t = useTranslations();
  const theme = useTheme();
  const { createClient, createClientLoading } = useCreateClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleSubmit = async (values: FormikValues, { setSubmitting, resetForm }: any) => {
    try {
      const payload = {
        clientName: values.clientName,
        firstName: values.firstName,
        lastName: values.lastName,
        type: values.type,
        taxIdType: values.taxIdType,
        taxId: values.taxId,
        vatRegistered: values.vatRegistered,
        vatId: values.vatId,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          countryId: values.countryId,
          zip: values.zip,
        },
        contract: {
          contractType: values.contractType,
          status: values.contractStatus,
          signed: values.contractSigned,
          signedBy: values.contractSignedBy,
          signedAt: values.contractSignedAt,
          startDate: values.startDate,
          endDate: values.endDate,
          ppd: values.ppd,
          docUrl: values.docUrl,
        },
      };

      await createClient(payload);
      setSuccessMessage("The client was successfully created.");
      scrollToTop();
      resetForm();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.message) {
          const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
          setErrorMessages([errorMessage]); // Guarda el error como un array
        } else {
          setErrorMessages(["An unexpected error occurred."]);
        }
        setErrorOpen(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  const handleInputChange = () => {
    setSuccessMessage(null);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Desplazamiento suave
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      initialTouched={{
        field: true,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnMount={true}
    >
      {({ isSubmitting, submitForm, errors }) => (
        <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            sx={(theme) => ({
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              gap: 2,
              background: "linear-gradient(58deg, rgba(0,124,233,1) 0%, rgba(0,79,131,1) 85%)",
              color: theme.palette.primary.contrastText,
              boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
              padding: "13px",
              borderRadius: "5px",
              position: "sticky",
              top: "80px",
              zIndex: "50",
            })}
          >
            <Typography sx={{ flexGrow: 1, fontWeight: "100", fontSize: "18px" }}>Creating New Client</Typography>
            <BackPageButton colorBackground="white" colorText={theme.palette.secondary.main} />
            <BasicButton
              colorBackground="white"
              colorText={theme.palette.secondary.main}
              onClick={async () => {
                // Envía el formulario
                await submitForm();

                if (errors) {
                  setErrorOpen(true);
                  setErrorMessages(Object.values(errors) as string[]);
                }
              }}
              color="primary"
              variant="contained"
              disabled={createClientLoading || isSubmitting}
              startIcon={<AddOutlined />}
              endIcon={createClientLoading || isSubmitting ? <CircularProgress size={20} /> : null}
            >
              Create Client
            </BasicButton>
          </Box>
          <Box>{successMessage && <SuccessBox>{successMessage}</SuccessBox>}</Box>
          <Form onChange={handleInputChange}>
            <Paper elevation={1} variant="outlined" square={false} sx={{ paddingX: 2, paddingY: 3 }}>
              <Grid container spacing={4}>
                {/* Personal Details */}
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ width: "fit-content", color: "secondary.main", borderBottom: "2px solid", borderColor: "primary.main", borderRadius: "2px" }} variant="h6" mb={1}>
                    Personal Details
                  </Typography>
                  <ClientDetailsForm />
                </Grid>

                {/* Address */}
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ width: "fit-content", color: "secondary.main", borderBottom: "2px solid", borderColor: "primary.main", borderRadius: "2px" }} variant="h6" mb={1}>
                    Address
                  </Typography>
                  <AddressDetailsForm />
                </Grid>

                {/* Contract Details */}
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ width: "fit-content", color: "secondary.main", borderBottom: "2px solid", borderColor: "primary.main", borderRadius: "2px" }} variant="h6" mb={1}>
                    Contract Details
                  </Typography>
                  <ContractDetailsForm />
                </Grid>
              </Grid>
            </Paper>
          </Form>
          <FormErrorPopup open={errorOpen} onClose={handleErrorClose}>
            <List sx={{ padding: 0, margin: 0 }}>
              {errorMessages.map((error, index) => (
                <ListItem key={index} disableGutters sx={{ padding: "1px 0" }}>
                  <ListItemText primary={`• ${error}`} sx={{ margin: 0, padding: 0 }} />
                </ListItem>
              ))}
            </List>
          </FormErrorPopup>
        </Box>
      )}
    </Formik>
  );
};

export default CreateClientPage;
