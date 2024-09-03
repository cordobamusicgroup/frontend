"use client";
import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography, Grid, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useCreateClient } from "@/lib/hooks/clients/useCreateClient";
import ErrorModal from "../molecules/modals/ErrorModal";
import AddressDetailsForm from "../molecules/AddressDetailsForm";
import BackPageButton from "../atoms/BackPageButton";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slices/pageDataSlice";
import { useTranslations } from "next-intl";
import { AddOutlined, ErrorOutline, FiberManualRecord } from "@mui/icons-material";
import SuccessBox from "../atoms/SuccessBox";
import ContractDetailsForm from "../molecules/ContractDetailsForm";
import ClientDetailsForm from "../molecules/ClientDetailsForm";
import { contractStatusOptions, contractTypeOptions, taxIdTypeOptions, typeOptions } from "@/constants/client-enums";
import dayjs from "dayjs";
import ErrorBox from "../atoms/ErrorBox";

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
  startDate: Yup.date()
    .required("Start date is required")
    .test("isValidDate", "Invalid date", (value) => {
      return value ? dayjs(value).isValid() : false;
    })
    .test("isFutureDate", "Start date cannot be in the past", (value) => {
      return value ? dayjs(value).isAfter(dayjs().subtract(1, "day")) : false;
    }),
  endDate: Yup.date()
    .required("End date is required")
    .test("isValidDate", "Invalid date", (value) => {
      return value ? dayjs(value).isValid() : false;
    })
    .test("isAfterStartDate", "End date must be after start date", function (value) {
      const { startDate } = this.parent;
      return value && startDate ? dayjs(value).isAfter(dayjs(startDate)) : false;
    })
    .test("isFutureDate", "End date cannot be in the past", (value) => {
      return value ? dayjs(value).isAfter(dayjs().subtract(1, "day")) : false;
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
  endDate: dayjs(Date.now()),
};

const CreateClientPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  dispatch(setPageTitle(t("portal.admin.pages.createClient")));
  const { createClient, createClientLoading } = useCreateClient();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
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
          signed: true, //change
          signedBy: "Admin", //change
          signedAt: values.startDate, //change
          startDate: values.startDate,
          endDate: values.endDate,
          ppd: values.ppd,
          docUrl: values.docUrl,
        },
      };

      await createClient(payload);
      setSuccessMessage("The client was successfully created.");
      resetForm();
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
      setErrorOpen(true);
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

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {({ isSubmitting, submitForm, errors, handleChange }) => (
        <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "right", alignItems: "center", marginBottom: "20px", gap: 2 }}>
            <BackPageButton />
            <Button
              onClick={() => {
                submitForm();
                setSubmitAttempted(true);
              }}
              color="primary"
              variant="contained"
              disabled={createClientLoading || isSubmitting}
              startIcon={<AddOutlined />}
              endIcon={createClientLoading || isSubmitting ? <CircularProgress size={20} /> : null}
            >
              Create Client
            </Button>
          </Box>

          {submitAttempted && Object.keys(errors).length > 0 && (
            <ErrorBox>
              <List sx={{ padding: 0, margin: 0 }}>
                {Object.values(errors)
                  .filter((error) => typeof error === "string")
                  .map((error, index) => (
                    <ListItem key={index} disableGutters sx={{ padding: "1px 0" }}>
                      <ListItemText primary={`• ${error}`} sx={{ margin: 0, padding: 0 }} />
                    </ListItem>
                  ))}
              </List>
            </ErrorBox>
          )}

          <Box>{successMessage && <SuccessBox>{successMessage}</SuccessBox>}</Box>

          <Form onChange={handleInputChange}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ width: "fit-content", color: "secondary.main", borderBottom: "4px solid", borderColor: "primary.main", borderRadius: "2px" }} variant="h6" mb={1}>
                  Personal Details
                </Typography>
                <ClientDetailsForm />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ width: "fit-content", color: "secondary.main", borderBottom: "4px solid", borderColor: "primary.main", borderRadius: "2px" }} variant="h6" mb={1}>
                  Address
                </Typography>
                <AddressDetailsForm />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ width: "fit-content", color: "secondary.main", borderBottom: "4px solid", borderColor: "primary.main", borderRadius: "2px" }} variant="h6" mb={1}>
                  Contract
                </Typography>
                <ContractDetailsForm />
              </Grid>
            </Grid>
          </Form>

          <ErrorModal open={errorOpen} onClose={handleErrorClose} errorMessage={errorMessage} />
        </Box>
      )}
    </Formik>
  );
};

export default CreateClientPage;
