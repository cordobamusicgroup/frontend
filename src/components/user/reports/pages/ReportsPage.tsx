"use client";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import theme from "@/theme";
import { FileUpload, PersonAdd } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import ReportsTable from "../organisms/ReportsTable";

export default function ReportsPage() {
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
      <CustomPageHeader background={"#0A5F33"} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontWeight: "100", fontSize: "18px" }}>Financial Reports</Typography>
        {/* <BasicButton colorBackground="white" colorText={"#0A5F33"} color="primary" variant="contained" startIcon={<FileUpload />}>
          Export Reports
        </BasicButton> */}
      </CustomPageHeader>

      <Box>
        {notification?.type === "success" && <SuccessBox>{notification.message}</SuccessBox>}
        {notification?.type === "error" && <ErrorBox>{notification.message}</ErrorBox>}
      </Box>

      <Box sx={{ display: "flex", height: "600px", width: "100%", justifyContent: "center" }}>
        <ReportsTable setNotification={setNotification} />
      </Box>
    </Box>
  );
}
