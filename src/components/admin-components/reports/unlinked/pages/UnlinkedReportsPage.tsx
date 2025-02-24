"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { AddOutlined, PersonAdd, Refresh } from "@mui/icons-material";
import theme from "@/theme";
import routes from "@/lib/routes/routes";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import UnlinkedReportsTable from "../organisms/UnlinkedReportsTable";
import { useAppStore } from "@/lib/zustand/zustandStore";
import { useNotificationCleanup } from "@/lib/hooks/useNotificationCleanup";

const UnlinkedReportsPage: React.FC = () => {
  const { notification, setNotification } = useAppStore.notification();

  useNotificationCleanup();

  return (
    <>
      <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
        <CustomPageHeader background={"linear-gradient(90deg, #062E52 0%, #005C99 50%, #007BE6 100%)"} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: "18px" }}>Link Missing Reports</Typography>
        </CustomPageHeader>

        <Box>
          {notification?.type === "success" && <SuccessBox>{notification.message}</SuccessBox>}
          {notification?.type === "error" && <ErrorBox>{notification.message}</ErrorBox>}
        </Box>

        <Box sx={{ display: "flex", height: "600px", width: "100%" }}>
          <UnlinkedReportsTable />
        </Box>
      </Box>
    </>
  );
};

export default UnlinkedReportsPage;
