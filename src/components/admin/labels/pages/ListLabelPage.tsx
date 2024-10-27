"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { AddOutlined, PersonAdd } from "@mui/icons-material";
import theme from "@/theme";
import routes from "@/lib/routes/routes";
import LabelsTable from "@/components/admin/labels/organisms/LabelsTable";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";

const LabelsListPage: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("pages.labels");

  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleCreateLabel = (): void => {
    router.push(routes.web.admin.labels.create);
  };

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
      <CustomPageHeader background={"#24793B"} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontWeight: "100", fontSize: "18px" }}>Manage Labels</Typography>
        <BasicButton colorBackground="white" colorText={"#164723"} onClick={handleCreateLabel} color="primary" variant="contained" startIcon={<PersonAdd />}>
          "Create Label"
        </BasicButton>
      </CustomPageHeader>

      <Box>
        {notification?.type === "success" && <SuccessBox>{notification.message}</SuccessBox>}
        {notification?.type === "error" && <ErrorBox>{notification.message}</ErrorBox>}
      </Box>

      <Box sx={{ display: "flex", height: "600px", width: "100%" }}>
        <LabelsTable setNotification={setNotification} />
      </Box>
    </Box>
  );
};

export default LabelsListPage;
