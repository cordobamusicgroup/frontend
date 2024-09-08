import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { VatStatusChip } from "../atoms/ClientChips";
import ActionButtonsClient from "../molecules/ActionsButtonsClient";
import { useTranslations } from "next-intl";

interface ClientTableProps {
  clients: any[];
  onEdit: (client: any) => void;
  onView: (client: any) => void;
  onDelete: (client: any) => void;
  loading: boolean;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onEdit, onView, onDelete, loading }) => {
  const clientTableIntl = useTranslations("pages.clients.table");
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "clientName", headerName: clientTableIntl("clientName"), width: 200 },
    { field: "firstName", headerName: clientTableIntl("firstName"), width: 150 },
    { field: "lastName", headerName: clientTableIntl("lastName"), width: 150 },
    { field: "type", headerName: clientTableIntl("type"), width: 150 },
    { field: "taxIdType", headerName: clientTableIntl("taxIdType"), width: 180 },
    { field: "taxId", headerName: clientTableIntl("taxId"), width: 180 },
    {
      field: "vatRegistered",
      headerName: clientTableIntl("vatRegistered"),
      renderCell: (params) => <VatStatusChip isRegistered={params.value} />,
      width: 150,
    },
    { field: "vatNumber", headerName: clientTableIntl("vatNumber"), width: 180 },
    {
      field: "actions",
      headerName: clientTableIntl("actions"),
      width: 150,
      renderCell: (params) => <ActionButtonsClient onEdit={() => onEdit(params.row)} onView={() => onView(params.row)} onDelete={() => onDelete(params.row)} />,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      disableReorder: true,
    },
  ];

  const rows = clients.map((client) => ({
    id: client.id,
    clientName: client.clientName,
    firstName: client.firstName,
    lastName: client.lastName,
    type: client.type,
    taxIdType: client.taxIdType,
    taxId: client.taxId,
    vatRegistered: client.vatRegistered,
    vatNumber: client.vatId,
  }));

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} disableColumnSelector disableColumnResize disableRowSelectionOnClick density="compact" loading={loading} localeText={{ noRowsLabel: clientTableIntl("noRowsLabel") }} />
    </Box>
  );
};

export default ClientTable;
