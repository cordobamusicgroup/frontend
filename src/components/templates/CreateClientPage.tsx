"use client";
import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography, Grid } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useCreateClient } from "@/lib/hooks/clients/useCreateClient";
import { useCountries } from "@/lib/hooks/useCountries";
import CreateClientForm from "../organisms/CreateClientForm";
import SuccessModal from "../molecules/modals/SucessModal";
import ErrorModal from "../molecules/modals/ErrorModal";
import AddressDetailsForm from "../molecules/AddressDetailsForm";
import BackPageButton from "../atoms/BackPageButton";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slices/pageDataSlice";
import { useTranslations } from "next-intl";
import { AddOutlined, PlusOneRounded } from "@mui/icons-material";

const validationSchema = Yup.object({
  clientName: Yup.string().required("Client nickname is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  type: Yup.string().oneOf(["PERSON", "BUSINESS"], "Invalid type").required("Type is required"),
  taxIdType: Yup.string().oneOf(["COMPANY_NUMBER", "NATIONAL_ID", "PASSPORT", "RESIDENT_PERMIT", "ID_CARD", "DRIVERS_LICENSE"], "Invalid Tax ID Type").required("Tax ID Type is required"),
  taxId: Yup.string().required("Tax ID is required"),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  countryId: Yup.number().required("Country is required"),
  zip: Yup.string().required("Zip is required"),
});

const CreateClientPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  dispatch(setPageTitle(t("portal.admin.pages.createClient")));
  const { createClient, createClientLoading } = useCreateClient();
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      const { street, city, state, countryId, zip, ...clientData } = values;

      const payload = {
        ...clientData,
        address: {
          street,
          city,
          state,
          countryId,
          zip,
        },
      };

      await createClient(payload);
      setSuccessOpen(true);
      resetForm();
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred while creating the client.");
      setErrorOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const handleErrorClose = () => {
    setErrorOpen(false);
  };

  return (
    <Formik
      initialValues={{
        clientName: "",
        firstName: "",
        lastName: "",
        type: "",
        taxIdType: "",
        taxId: "",
        vatRegistered: false,
        street: "",
        city: "",
        state: "",
        countryId: null,
        zip: "",
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, submitForm }) => (
        <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "right", alignItems: "center", marginBottom: "20px", gap: 2 }}>
            <BackPageButton />
            <Button
              onClick={submitForm} // Llama a submitForm para enviar el formulario
              color="primary"
              variant="contained"
              disabled={createClientLoading || isSubmitting}
              startIcon={<AddOutlined />}
              endIcon={createClientLoading || isSubmitting ? <CircularProgress size={20} /> : null}
            >
              Create Client
            </Button>
          </Box>
          <Form>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ width: "fit-content", color: "secondary.main", borderBottom: "4px solid", borderColor: "primary.main", borderRadius: "2px" }} variant="h6" mb={1}>
                  Personal Details
                </Typography>
                <CreateClientForm isLoading={createClientLoading || isSubmitting} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography sx={{ width: "fit-content", color: "secondary.main", borderBottom: "4px solid", borderColor: "primary.main", borderRadius: "2px" }} variant="h6" mb={1}>
                  Address
                </Typography>
                <AddressDetailsForm />
              </Grid>
            </Grid>
          </Form>

          <SuccessModal open={successOpen} onClose={handleSuccessClose} title="Client Created" message="The client was successfully created." />

          <ErrorModal open={errorOpen} onClose={handleErrorClose} errorMessage={errorMessage} />
        </Box>
      )}
    </Formik>
  );
};

export default CreateClientPage;
