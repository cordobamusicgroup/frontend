"use client";

import { useRouter } from "next/navigation";
import { useClients } from "@/lib/hooks/clients/useClients";
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
import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slices/pageDataSlice";
import webRoutes from "@/lib/routes/webRoutes";
import axios from "axios";

const ClientListPage: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("pages.clients");
  const { clients = [], clientsLoading, clientsError, deleteClients } = useClients();

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  if (clientsError) return <ErrorBox>{t("listError")}</ErrorBox>;

  const handleCreateClient = (): void => {
    router.push(webRoutes.admin.createClient);
  };

  const handleEdit = (client: any): void => {
    console.log("Edit", client);
  };

  const handleView = (client: any): void => {
    console.log("View", client);
  };

  const handleDelete = async (client: any): Promise<void> => {
    try {
      await deleteClients([client.id]);
      setNotification({ message: "Client deleted success", type: "success" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setNotification({ message: error.response?.data.message, type: "error" });
      }
    }
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
        <ClientTable clients={clients} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} loading={clientsLoading} />
      </Box>
    </Box>
  );
};

export default ClientListPage;
