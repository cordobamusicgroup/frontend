import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, IconButton, InputAdornment, Menu, MenuItem, Skeleton, TextField, Typography } from "@mui/material";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "@styles/grid-cmg.css";
import axios from "axios";
import { useClients } from "@/lib/hooks/useClients";
import routes from "@/lib/routes/routes";
import { VatStatusChip } from "@/components/global/atoms/ClientChips";
import ActionButtonsClient from "@/components/global/molecules/ActionsButtonsClient";
import FormSkeletonLoader from "@/components/global/molecules/FormSkeletonLoader";
import { Form } from "react-hook-form";
import LoadingSpinner from "@/components/global/atoms/LoadingSpinner";
import FullScreenLoader from "@/components/global/molecules/FullScreenLoader";
import GridTables from "@/components/global/molecules/GridTables";
import { ClearIcon } from "@mui/x-date-pickers/icons";
import { MoreVert, Search } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { RowSelectedEvent, SelectionChangedEvent } from "@ag-grid-community/core";
import { AgGridReact } from "ag-grid-react";

interface ClientTableProps {
  setNotification: (notification: { message: string; type: "success" | "error" }) => void;
}

const ClientTable: React.FC<ClientTableProps> = ({ setNotification }) => {
  const router = useRouter();
  const web = routes.web;
  const { clientData = [], clientFetchLoading, deleteClients, clientError, clientLoading } = useClients();
  const gridRef = useRef<AgGridReact>(null);

  const searchTextRef = useRef<HTMLInputElement | null>(null); // Ref para el valor del TextField
  const [quickFilterText, setQuickFilterText] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<any[]>([]); // Almacena las filas seleccionadas
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // Controla el menú desplegable

  const handleEdit = (client: any): void => {
    router.push(`${web.admin.clients.edit}/${client.id}`);
  };

  const handleDelete = async (clientId: number): Promise<void> => {
    if (await deleteClients([clientId])) {
      setNotification({ message: "Client deleted successfully", type: "success" });
    }
  };

  const handleBulkDelete = async () => {
    if (gridRef.current) {
      // Verificación de existencia de gridRef.current
      const selectedData = gridRef.current.api.getSelectedRows();
      const selectedIds = selectedData.map((row) => row.id);
      if (selectedIds.length && (await deleteClients(selectedIds))) {
        setNotification({ message: `${selectedIds.length} clients deleted successfully`, type: "success" });
        setSelectedRows([]);
        gridRef.current.api.deselectAll(); // Deselecciona después de eliminar
      }
    }
  };

  useEffect(() => {
    if (clientError) {
      setNotification({ message: clientError, type: "error" });
    }
  }, [clientError, setNotification]);

  const columns = [
    { field: "id", headerName: "ID", width: 80, sortable: false, filter: false, resizable: false },
    { field: "clientName", headerName: "Client Name", width: 200 },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    {
      field: "type",
      headerName: "Type",
      width: 100,
    },
    {
      field: "taxIdType",
      headerName: "Tax ID Type",
      width: 150,
    },
    { field: "taxId", headerName: "Tax ID", width: 180 },
    {
      field: "vatRegistered",
      headerName: "VAT Registered",
      width: 180,
      cellRenderer: (params: any) => <VatStatusChip isRegistered={params.value} />,
    },
    { field: "vatNumber", headerName: "VAT Number", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      minWidth: 100,
      sortable: false,
      filter: false,
      resizable: false,
      flex: 1,
      cellRenderer: (params: any) => <ActionButtonsClient onEdit={() => handleEdit(params.data)} onDelete={() => handleDelete(params.data.id)} />,
    },
  ];

  const rowData = clientData.map((client: any) => ({
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

  const applyFilter = () => {
    setQuickFilterText(searchTextRef.current?.value || ""); // Aplica el filtro usando el valor del ref
  };

  const resetFilter = () => {
    if (searchTextRef.current) {
      searchTextRef.current.value = ""; // Limpia el valor visible del TextField sin cambiar el estado
    }
    setQuickFilterText(""); // Restablece el filtro
  };

  // Abre el menú de acciones
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Cierra el menú de acciones
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Box mt={2} mb={2}>
        <TextField
          size="medium" // Tamaño más compacto
          variant="outlined"
          placeholder="Search"
          inputRef={searchTextRef}
          onKeyDown={(e) => e.key === "Enter" && applyFilter()} // Aplica filtro al presionar Enter
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={applyFilter} aria-label="search">
                  <Search />
                </IconButton>
                <IconButton onClick={resetFilter} aria-label="clear">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button onClick={handleBulkDelete}>Delete</Button>
      </Box>
      <GridTables ref={gridRef} columns={columns} rowData={rowData} loading={clientFetchLoading || clientLoading} quickFilterText={quickFilterText} />
    </Box>
  );
};

export default ClientTable;
