import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, TextField } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { VatStatusChip } from "../../atoms/ClientChips";
import ActionButtonsClient from "../../molecules/ActionsButtonsClient";
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
  const { data = [], loading, deleteLabels, error } = useLabels();

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
    if (error) {
      setNotification({ message: "Failed to load labels", type: "error" });
    }
  }, [error, setNotification]);

  const columns = [
    { field: "id", headerName: "ID", width: 50, sortable: false, filter: false, resizable: false },
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

  const rowData = data.map((apiData: any) => ({
    id: apiData.id,
    clientName: apiData.clientName,
    firstName: apiData.firstName,
    lastName: apiData.lastName,
    type: apiData.type,
    taxIdType: apiData.taxIdType,
    taxId: apiData.taxId,
    vatRegistered: apiData.vatRegistered,
    vatNumber: apiData.vatId,
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
          loading={loading}
          suppressMovableColumns={true}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
    </Box>
  );
};

export default LabelsTable;
