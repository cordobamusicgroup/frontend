"use client";

import { Add, CancelOutlined, CheckCircleOutline, Delete, Edit, ErrorOutline, Visibility } from "@mui/icons-material";
import { DataGrid, gridClasses, GridColDef } from "@mui/x-data-grid";

import { Box, Button, Chip, CircularProgress, IconButton, Typography } from "@mui/material";
import { useClients } from "@/lib/hooks/clients/useClients";
import { useState } from "react";

function ClientList() {
  const { clients, clientsLoading, clientsError } = useClients();
  const [open, setOpen] = useState(false);

  if (clientsError) return <div>Error loading clients</div>;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleClientCreated = () => {
    // Aquí puedes añadir lógica adicional después de crear el cliente
  };

  const renderVatStatus = (params: any) => {
    if (params.value) {
      return <Chip label="Registered" color="success" icon={<CheckCircleOutline style={{ color: "white" }} />} size="small" />;
    }
    return <Chip label="Not Registered" color="default" icon={<CancelOutlined style={{ color: "gray" }} />} size="small" />; // If not registered, show nothing or customize this as needed
  };

  const renderActions = (params: any) => (
    <Box>
      <IconButton sx={{ color: "#8e8e8e" }} onClick={() => handleEdit(params.row)}>
        <Edit />
      </IconButton>
      <IconButton sx={{ color: "#8e8e8e" }} onClick={() => handleView(params.row)}>
        <Visibility />
      </IconButton>
      <IconButton sx={{ color: "#8e8e8e" }} onClick={() => handleDelete(params.row)}>
        <Delete />
      </IconButton>
    </Box>
  );

  const handleEdit = (row: any) => {
    // Implement edit functionality
    console.log("Edit", row);
  };

  const handleView = (row: any) => {
    // Implement view functionality
    console.log("View", row);
  };

  const handleDelete = (row: any) => {
    // Implement delete functionality
    console.log("Delete", row);
  };

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
      renderCell: renderVatStatus,
      width: 150,
    },
    { field: "vatId", headerName: "VAT ID", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: renderActions, // Custom rendering for action buttons
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      disableReorder: true,
    },
  ];

  const rows = clients?.map((client: any) => ({
    id: client.id,
    clientName: client.clientName,
    firstName: client.firstName,
    lastName: client.lastName,
    type: client.type,
    taxIdType: client.taxIdType,
    taxId: client.taxId,
    vatRegistered: client.vatRegistered,
    vatId: client.vatId,
    address: client.address,
  }));
  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", justifyContent: "right", marginBottom: "20px" }}>
        <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpen}>
          Add new client
        </Button>
      </Box>
      <Box sx={{ display: "flex", height: "400px", width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnSelector
          disableColumnResize
          disableRowSelectionOnClick
          density="compact"
          sx={{
            [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
              outline: "none",
            },
            [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]: {
              outline: "none",
            },
          }}
          slotProps={{
            loadingOverlay: {
              variant: "linear-progress",
              noRowsVariant: "linear-progress",
            },
          }}
          loading={clientsLoading}
          localeText={{
            noRowsLabel: "No clients found",
          }}
        />
      </Box>
    </Box>
  );
}
export default ClientList;
