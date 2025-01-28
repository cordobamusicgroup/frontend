"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { AddOutlined, PersonAdd } from "@mui/icons-material";
import theme from "@/theme";
import routes from "@/lib/routes/routes";
import ClientTable from "../organisms/ClientTable";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";

const ClientListPage: React.FC = () => {
  const router = useRouter();

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleCreateClient = (): void => {
    router.push(routes.web.admin.clients.create);
  };

  return (
    <>
      <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
        <CustomPageHeader background={"linear-gradient(90deg, #062E52 0%, #005C99 50%, #007BE6 100%)"} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontSize: "18px" }}>Manage Clients</Typography>
        <BasicButton colorBackground="white" colorText={"#164723"} onClick={handleCreateClient} color="primary" variant="contained" startIcon={<PersonAdd />}>
          Create Client
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
    </>
  );
};

export default ClientListPage;
