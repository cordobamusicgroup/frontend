import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { VatStatusChip } from "../atoms/ClientChips";
import ActionButtonsClient from "../molecules/ActionsButtonsClient";

interface ClientTableProps {
  clients: any[];
  onEdit: (client: any) => void;
  onView: (client: any) => void;
  onDelete: (client: any) => void;
  loading: boolean;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onEdit, onView, onDelete, loading }) => {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "clientName", headerName: "Client Nickname", width: 200 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "taxIdType", headerName: "Tax ID Type", width: 180 },
    { field: "taxId", headerName: "Tax ID", width: 180 },
    {
      field: "vatRegistered",
      headerName: "VAT Registered",
      renderCell: (params) => <VatStatusChip isRegistered={params.value} />,
      width: 150,
    },
    { field: "vatId", headerName: "VAT ID", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
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
    vatId: client.vatId,
  }));

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} disableColumnSelector disableColumnResize disableRowSelectionOnClick density="compact" loading={loading} localeText={{ noRowsLabel: "No clients found" }} />
    </Box>
  );
};

export default ClientTable;
