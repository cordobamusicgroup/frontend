import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, TextField } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { LabelSpecialStoreStatus, LabelStatusChip, VatStatusChip } from "../../../global/atoms/ClientChips";
import ActionButtonsClient from "../../../global/molecules/ActionsButtonsClient";
import { useTranslations } from "next-intl";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "@styles/grid-cmg.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useClients } from "@/lib/hooks/useClients";
import routes from "@/lib/routes/routes";
import { useLabels } from "@/lib/hooks/useLabels";

interface LabelsTableProps {
  setNotification: (notification: { message: string; type: "success" | "error" }) => void;
}

const LabelsTable: React.FC<LabelsTableProps> = ({ setNotification }) => {
  const router = useRouter();
  const web = routes.web;
  const { labelData = [], labelLoading, deleteLabels, labelError } = useLabels();
  const { clientData = [], clientLoading, deleteClients, clientError } = useClients();

  const gridRef = useRef<any>(null);
  const [quickFilterText, setQuickFilterText] = useState<string>("");

  const onQuickFilterChange = useCallback(() => {
    gridRef.current!.api.setGridOption("quickFilterText", quickFilterText);
  }, [quickFilterText]);

  const handleEdit = (label: any): void => {
    router.push(`${web.admin.labels.edit}/${label.id}`);
  };

  const handleDelete = async (labelId: number): Promise<void> => {
    try {
      await deleteLabels([labelId]);
      setNotification({ message: "Label deleted successfully", type: "success" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setNotification({ message: error.response?.data.message, type: "error" });
      }
    }
  };

  useEffect(() => {
    if (labelError) {
      setNotification({ message: "Failed to load labels", type: "error" });
    }
    if (clientError) {
      setNotification({ message: "Failed to load client data", type: "error" });
    }
  }, [labelError, clientError, setNotification]);

  const columns = [
    { field: "id", headerName: "ID", width: 70, sortable: false, filter: true, resizable: false },
    { field: "labelName", headerName: "Label Name", width: 200 },
    {
      field: "client",
      headerName: "Client Name",
      width: 300,
      valueFormatter: (params: any) => {
        // Encuentra el cliente correspondiente usando el clientId
        const client = clientData.find((client: any) => client.id === params.data.clientId);
        return client ? `${client.clientName} (${client.id})` : "Unknown Client"; // Devuelve el nombre o un valor por defecto
      },
    },
    {
      field: "labelStatus",
      headerName: "Status",
      width: 180,
      filter: false,
      cellRenderer: (params: any) => <LabelStatusChip status={params.value} />,
    },
    {
      field: "beatportStatus",
      headerName: "Beatport Status",
      width: 180,
      filter: false,
      cellRenderer: (params: any) => <LabelSpecialStoreStatus status={params.value} />,
    },
    {
      field: "traxsourceStatus",
      headerName: "Traxsource Status",
      width: 180,
      filter: false,
      cellRenderer: (params: any) => <LabelSpecialStoreStatus status={params.value} />,
    },
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

  const rowData = labelData.map((apiData: any) => ({
    id: apiData.id,
    clientId: apiData.clientId,
    labelName: apiData.name,
    labelStatus: apiData.status,
    countryId: apiData.countryId,
    labelWebsite: apiData.website,
    beatportStatus: apiData.beatportStatus,
    traxsourceStatus: apiData.traxsourceStatus,
    beatportUrl: apiData.beatportUrl,
    traxsourceUrl: apiData.traxsourceUrl,
  }));

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Box mt={2} mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search" // Traducción adecuada según corresponda
          value={quickFilterText} // Vincular con el estado
          onChange={(e) => {
            setQuickFilterText(e.target.value); // Actualiza el estado al escribir
            onQuickFilterChange(); // Aplica el filtro cuando cambia
          }}
        />
      </Box>
      <div className="ag-grid-theme-builder" style={{ height: "600px", width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          columnDefs={columns}
          rowData={rowData}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: false,
          }}
          animateRows={false}
          loading={labelLoading}
          suppressMovableColumns={true}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </Box>
  );
};

export default LabelsTable;