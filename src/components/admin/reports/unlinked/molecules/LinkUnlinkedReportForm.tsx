import React, { useEffect, useState } from "react";
import { Autocomplete, FormControlLabel, Input, MenuItem, Switch, TextField, Button } from "@mui/material";
import { Controller, useFormContext, useForm, FormProvider } from "react-hook-form";
import TextFieldForm from "@/components/global/atoms/TextFieldForm";
import { typeOptions, taxIdTypeOptions, LabelStatus } from "@/constants/backend.enums";
import { useClients } from "@/lib/hooks/admin/hookClientsAdmin";
import { Block, BlockOutlined, CheckCircle, CheckCircleOutline, DoDisturbOnOutlined } from "@mui/icons-material";
import { useLabels } from "@/lib/hooks/admin/hookLabelsAdmin";
import { useLinkReports } from "@/lib/hooks/admin/hookLinkReportsAdmin";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import SuccessBox from "@/components/global/molecules/SuccessBox";

interface LinkUnlinkedReportFormProps {
  reportId: number | null;
  onClose: () => void;
  reportData: {
    id: number;
    labelName: string;
    distributor: string;
    reportingMonth: string;
    count: number;
  } | null;
}

const LinkUnlinkedReportForm: React.FC<LinkUnlinkedReportFormProps> = ({ reportId, onClose, reportData }) => {
  const methods = useForm();
  const { setValue, watch, handleSubmit, formState: { errors }, reset } = methods;
  const { labelData = [], labelFetchLoading, labelError } = useLabels();
  const { linkReport, error: linkError, loading: linkLoading } = useLinkReports();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const labelId = watch("labelId");
  const selectedClient = labelData?.find((label: any) => label.id === labelId) || null;

  const handleLinkReport = async (data: any) => {
    if (reportId && labelId) {
      try {
        await linkReport(reportId, labelId);
        setSuccessMessage("Report linked successfully");
        onClose();
        reset();
      } catch (error) {
        console.error("Error linking report:", error);
        setErrorMessage("Error linking report");
      }
    }
  };

  useEffect(() => {
    if (labelError) {
      console.error("Error fetching labels:", labelError);
      setErrorMessage("Error fetching labels");
    } else if (linkError) {
      console.error("Error linking report:", linkError);
      setErrorMessage("Error linking report");
    } else {
      setErrorMessage(null);
    }
  }, [labelError, linkError]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleLinkReport)}>
        {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
        {successMessage && <SuccessBox>{successMessage}</SuccessBox>}
        {reportData && (
          <>
            <TextFieldForm name="id" label="Unlinked Report ID" value={reportData.id} disabled />
            <TextFieldForm name="labelName" label="Label Name" value={reportData.labelName} disabled />
            <TextFieldForm name="distributor" label="Distributor" value={reportData.distributor} disabled />
            <TextFieldForm name="reportingMonth" label="Reporting Month" value={reportData.reportingMonth} disabled />
            <TextFieldForm name="count" label="Count" value={reportData.count} disabled />
          </>
        )}
        <Autocomplete
          options={labelData}
          getOptionLabel={(option) => `[ID: ${option.id}] ${option.name} (${option.status}) `}
          loading={labelFetchLoading}
          onChange={(event, value) => setValue("labelId", value ? value.id : null)}
          value={selectedClient}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderOption={(props, option) => (
            <li {...props}>
              {option.status === "ACTIVE" ? <CheckCircle style={{ marginRight: 8 }} /> : <DoDisturbOnOutlined style={{ marginRight: 8 }} />}
              {`[ID: ${option.id}] ${option.name} (${option.status})`}
            </li>
          )}
          renderInput={(params) => <TextFieldForm {...params} required name="labelId" label="Correct Label" />}
        />

        <Button type="submit" disabled={!reportId || !labelId || linkLoading}>
          Link Report
        </Button>
      </form>
    </FormProvider>
  );
};

export default LinkUnlinkedReportForm;