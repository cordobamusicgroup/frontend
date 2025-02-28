import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress, Backdrop } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import TextFieldForm from "@/components/global/atoms/TextFieldForm";
import { useLabels } from "@/lib/hooks/admin/hookLabelsAdmin";
import { useLinkReports } from "@/lib/hooks/admin/hookLinkReportsAdmin";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import { useAppStore } from "@/lib/zustand/zustandStore";
import { Autocomplete } from "@mui/material";
import { CheckCircle, DoDisturbOnOutlined } from "@mui/icons-material";
import FullScreenLoader from "@/components/global/molecules/FullScreenLoader";
import axios from "axios";

interface LinkReportDialogProps {
  open: boolean;
  onClose: () => void;
  reportId: number | null;
  reportData: {
    id: number;
    labelName: string;
    distributor: string;
    reportingMonth: string;
    count: number;
  } | null;
}

const LinkReportDialog: React.FC<LinkReportDialogProps> = ({ open, onClose, reportId, reportData }) => {
  const methods = useForm();
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;
  const { labelData = [], labelFetchLoading, labelError } = useLabels();
  const { linkReport, error: linkError, loading: linkLoading } = useLinkReports();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { setNotification } = useAppStore.notification();

  const labelId = watch("labelId");
  const selectedClient = labelData?.find((label: any) => label.id === labelId) || null;

  const handleLinkReport = async (data: any) => {
    if (reportId && labelId) {
      try {
        await linkReport(reportId, labelId);
        setNotification({ message: "Report successfully sent to the processing queue", type: "success" });
        onClose();
        reset();
      } catch (error) {
        console.error("Error linking report:", error);
        const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || "Error linking report" : "An unexpected error occurred";
        setErrorMessage(errorMessage);
      }
    }
  };

  useEffect(() => {
    if (labelError) {
      console.error("Error fetching labels:", labelError);
      setErrorMessage("Error fetching labels");
    } else if (linkError) {
      console.error("Error linking report:", linkError);
      const errorMessage = axios.isAxiosError(linkError) ? linkError.response?.data?.message || "Error linking report" : "An unexpected error occurred";
      setErrorMessage(errorMessage);
    } else {
      setErrorMessage(null);
    }
  }, [labelError, linkError]);

  const handleClose = () => {
    if (!linkLoading) {
      onClose();
      reset();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Link Unlinked Report</DialogTitle>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleLinkReport)}>
            {errorMessage && <ErrorBox>{errorMessage}</ErrorBox>}
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
              renderOption={(props, option) => {
                const { key, ...restProps } = props;
                return (
                  <li key={`${option.id}-${key}`} {...restProps}>
                    {option.status === "ACTIVE" ? <CheckCircle style={{ marginRight: 8, color: "#4caf50" }} /> : <DoDisturbOnOutlined style={{ marginRight: 8, color: "#f44336" }} />}
                    {`[ID: ${option.id}] ${option.name}`}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextFieldForm
                  {...params}
                  required
                  name="labelId"
                  label="Select Label"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {labelFetchLoading ? <CircularProgress color="inherit" size={20} /> : null} {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </form>
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={linkLoading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(handleLinkReport)} disabled={!reportId || !labelId || linkLoading}>
          {linkLoading ? "Linking..." : "Link Report"}
        </Button>
      </DialogActions>
      <FullScreenLoader open={linkLoading} />
    </Dialog>
  );
};

export default LinkReportDialog;
