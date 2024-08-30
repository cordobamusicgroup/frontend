import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slices/pageDataSlice";
import { Box, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import ClientTable from "../organisms/ClientTable";
import { Add } from "@mui/icons-material";

interface ClientListTemplateProps {
  clients: any[];
  onCreate: () => void;
  onEdit: (row: any) => void;
  onView: (row: any) => void;
  onDelete: (row: any) => void;
  loading: boolean;
}

const ClientListTemplate: React.FC<ClientListTemplateProps> = ({ clients, onCreate, onEdit, onView, onDelete, loading }) => {
  const dispatch = useAppDispatch();
  const t = useTranslations();
  dispatch(setPageTitle(t("portal.admin.pages.manageClients")));

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "right", marginBottom: "20px" }}>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={onCreate}>
          Add new client
        </Button>
      </Box>
      <Box sx={{ display: "flex", height: "600px", width: "100%" }}>
        <ClientTable clients={clients} onEdit={onEdit} onView={onView} onDelete={onDelete} loading={loading} />
      </Box>
    </Box>
  );
};

export default ClientListTemplate;
