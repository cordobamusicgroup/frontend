import React from "react";
import { Box, CircularProgress } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { VatStatusChip } from "../atoms/ClientChips";
import ActionButtonsClient from "../molecules/ActionsButtonsClient";
import { useTranslations } from "next-intl";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid
import "@styles/grid-cmg.css";
import LoadingSpinner from "../atoms/LoadingSpinner";

interface ClientTableProps {
  clients: any[];
  onEdit: (client: any) => void;
  onView: (client: any) => void;
  onDelete: (client: any) => void;
  loading: boolean;
}

const clientTypeMap: { [key: string]: string } = {
  PERSON: "clientType.PERSON",
  BUSINESS: "clientType.BUSINESS",
};

const clientTaxIdTypeMap: { [key: string]: string } = {
  COMPANY_NUMBER: "clientTaxIdType.COMPANY_NUMBER",
  NATIONAL_ID: "clientTaxIdType.NATIONAL_ID",
  PASSPORT: "clientTaxIdType.PASSPORT",
  RESIDENT_PERMIT: "clientTaxIdType.RESIDENT_PERMIT",
  ID_CARD: "clientTaxIdType.ID_CARD",
  DRIVERS_LICENSE: "clientTaxIdType.DRIVERS_LICENSE",
};

const ClientTable: React.FC<ClientTableProps> = ({ clients, onEdit, onView, onDelete, loading }) => {
  const clientTableIntl = useTranslations("pages.clients.table");
  const enumsIntl = useTranslations("enums");

  const columns = [
    { field: "id", headerName: "ID", width: 50, sortable: false, filter: false, resizable: false },
    { field: "clientName", headerName: clientTableIntl("clientName"), width: 200 },
    { field: "firstName", headerName: clientTableIntl("firstName"), width: 150 },
    { field: "lastName", headerName: clientTableIntl("lastName"), width: 150 },
    {
      field: "type",
      headerName: clientTableIntl("type"),
      width: 100,
      valueFormatter: (params: any) => {
        const key = clientTypeMap[params.value] || params.value;
        return enumsIntl(key);
      },
    },
    {
      field: "taxIdType",
      headerName: clientTableIntl("taxIdType"),
      width: 150,
      valueFormatter: (params: any) => {
        const key = clientTaxIdTypeMap[params.value] || params.value;
        return enumsIntl(key);
      },
    },
    { field: "taxId", headerName: clientTableIntl("taxId"), width: 180 },
    {
      field: "vatRegistered",
      headerName: clientTableIntl("vatRegistered"),
      width: 180,
      cellRenderer: (params: any) => <VatStatusChip isRegistered={params.value} />,
    },
    { field: "vatNumber", headerName: clientTableIntl("vatNumber"), width: 180 },
    {
      field: "actions",
      headerName: clientTableIntl("actions"),
      width: 150,
      sortable: false,
      flex: 1,
      cellRenderer: (params: any) => <ActionButtonsClient onEdit={() => onEdit(params.data)} onView={() => onView(params.data)} onDelete={() => onDelete(params.data)} />,
    },
  ];

  const rowData = clients.map((client) => ({
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
      <div className="ag-grid-theme-builder" style={{ height: "600px", width: "100%" }}>
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          defaultColDef={{
            sortable: true,
            filter: false,
            resizable: false,
          }}
          animateRows={false}
          loading={loading}
          suppressMovableColumns={true}
          pagination={true}
          paginationPageSize={20}
          loadingOverlayComponent={() => <LoadingSpinner size={30} />}
          domLayout="normal"
        />
      </div>
    </Box>
  );
};

export default ClientTable;
