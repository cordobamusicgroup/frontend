"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Box, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Autocomplete } from "@mui/material";
import { AddOutlined, PersonAdd, Refresh } from "@mui/icons-material";
import theme from "@/theme";
import routes from "@/lib/routes/routes";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import UnlinkedReportsTable from "../organisms/UnlinkedReportsTable";

const UnlinkedReportsPage: React.FC = () => {
  const router = useRouter();

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);

  const handleOpen = (reportId: number) => {
    setSelectedReportId(reportId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReportId(null);
  };

  return (
    <>
      <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
        <CustomPageHeader background={"linear-gradient(90deg, #062E52 0%, #005C99 50%, #007BE6 100%)"} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontWeight: "100", fontSize: "18px" }}>Link Missing Reports</Typography>
        </CustomPageHeader>

        <Box>
          {notification?.type === "success" && <SuccessBox>{notification.message}</SuccessBox>}
          {notification?.type === "error" && <ErrorBox>{notification.message}</ErrorBox>}
        </Box>

        <Box sx={{ display: "flex", height: "600px", width: "100%" }}>
          <UnlinkedReportsTable setNotification={setNotification} />
        </Box>
      </Box>
    </>
  );
};

export default UnlinkedReportsPage;
