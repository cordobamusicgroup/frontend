"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";
import ClientTable from "../organisms/ClientTable";
import CustomPageHeader from "../molecules/header/CustomPageHeader";
import BasicButton from "../atoms/BasicButton";
import SuccessBox from "../molecules/SuccessBox";
import ErrorBox from "../molecules/ErrorBox";
import theme from "@/theme";
import routes from "@/lib/routes/routes";

const ClientListPage: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("pages.clients");

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleCreateClient = (): void => {
    router.push(routes.web.admin.clients.create);
  };

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
      <CustomPageHeader background={"linear-gradient(90deg, #062E52 0%, #005C99 50%, #007BE6 100%)"} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontWeight: "100", fontSize: "18px" }}>Manage Clients</Typography>
        <BasicButton colorBackground="white" colorText={theme.palette.secondary.main} onClick={handleCreateClient} color="primary" variant="contained" startIcon={<AddOutlined />}>
          {t("createClient")}
        </BasicButton>
      </CustomPageHeader>

      <Box>
        {notification?.type === "success" && <SuccessBox>{notification.message}</SuccessBox>}
        {notification?.type === "error" && <ErrorBox>{notification.message}</ErrorBox>}
      </Box>

      <Box sx={{ display: "flex", height: "600px", width: "100%" }}>
        <ClientTable setNotification={setNotification} />
      </Box>
    </Box>
  );
};

export default ClientListPage;
