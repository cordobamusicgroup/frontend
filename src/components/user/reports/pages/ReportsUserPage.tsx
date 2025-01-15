"use client";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import theme from "@/theme";
import { FileUpload, PersonAdd } from "@mui/icons-material";
import { Box, Typography, Select, MenuItem, SelectChangeEvent, FormControl, InputLabel } from "@mui/material";
import { useState } from "react";
import ReportsTable from "../organisms/ReportsUserTable";

export default function ReportsPage() {
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [selectedDistributor, setSelectedDistributor] = useState<string | null>(null);

  const handleDistributorChange = (event: SelectChangeEvent<string>) => {
    const distributor = event.target.value;
    setSelectedDistributor(distributor);
    setNotification(null); // Clear any existing notifications
  };

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
      <CustomPageHeader background={"#0A5F33"} color={theme.palette.primary.contrastText}>
        <Typography sx={{ fontSize: "18px" }}>Financial Reports</Typography>
        {/* <BasicButton colorBackground="white" colorText={"#0A5F33"} color="primary" variant="contained" startIcon={<FileUpload />}>
          Export Reports
        </BasicButton> */}
      </CustomPageHeader>

      <FormControl sx={{ minWidth: 200, marginBottom: 2 }}>
        <InputLabel>Select Distributor</InputLabel>
        <Select value={selectedDistributor ?? ""} onChange={handleDistributorChange} label="Select Distributor">
          <MenuItem value="KONTOR">Kontor New Media</MenuItem>
          <MenuItem value="BELIEVE">Believe Digital</MenuItem>
        </Select>
      </FormControl>

      <Box>
        {notification?.type === "success" && <SuccessBox>{notification.message}</SuccessBox>}
        {notification?.type === "error" && <ErrorBox>{notification.message}</ErrorBox>}
      </Box>

      <Box my={2} p={2} sx={{ backgroundColor: "#e3f2fd", color: "#1976d2", borderLeft: "6px solid #1976d2" }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          FAQ
        </Typography>
        <Typography variant="body2">
          This page displays financial reports. The "Debit State" column indicates whether the report has impacted your balance. <b>"Paid"</b> means the report has impacted your balance, while <b>"Unpaid"</b> means it has not yet impacted your balance but will do so when the funds are available. Payment times are not fixed and are relative to the receipt of the reports.
        </Typography>
      </Box>

      {selectedDistributor && (
        <Box sx={{ display: "flex", height: "600px", width: "100%", justifyContent: "center" }}>
          <ReportsTable setNotification={setNotification} distributor={selectedDistributor} />
        </Box>
      )}
    </Box>
  );
}
