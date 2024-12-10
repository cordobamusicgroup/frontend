"use client";

import { Box, Typography } from "@mui/material";
import { PersonAdd } from "@mui/icons-material";
import theme from "@/theme";
import routes from "@/lib/routes/routes";
import UsersTable from "../organisms/UsersTable";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";

const UserListPage: React.FC = () => {
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  const handleCreateUser = (): void => {
    router.push(routes.web.admin.users.create);
  };

  return (
    <>
      <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
        <CustomPageHeader background={"linear-gradient(90deg, #062E52 0%, #005C99 50%, #007BE6 100%)"} color={theme.palette.primary.contrastText}>
          <Typography sx={{ flexGrow: 1, fontSize: "18px" }}>Manage Users</Typography>
          <BasicButton colorBackground="white" colorText={"#164723"} onClick={handleCreateUser} color="primary" variant="contained" startIcon={<PersonAdd />}>
            Create Users
          </BasicButton>
        </CustomPageHeader>

        <Box>
          {notification?.type === "success" && <SuccessBox>{notification.message}</SuccessBox>}
          {notification?.type === "error" && <ErrorBox>{notification.message}</ErrorBox>}
        </Box>

        <Box sx={{ display: "flex", height: "600px", width: "100%" }}>
          <UsersTable setNotification={setNotification} />
        </Box>
      </Box>
    </>
  );
};

export default UserListPage;
