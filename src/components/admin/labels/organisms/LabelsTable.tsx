import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Skeleton, TextField, InputAdornment, IconButton } from "@mui/material";
import { LabelSpecialStoreStatus, LabelStatusChip, VatStatusChip } from "../../../global/atoms/ClientChips";
import ActionButtonsClient from "../../../global/molecules/ActionsButtonsClient";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useClients } from "@/lib/hooks/admin/hookClientsAdmin";
import routes from "@/lib/routes/routes";
import LoadingSpinner from "@/components/global/atoms/LoadingSpinner";
import Loading from "@/app/(portal)/loading";
import TableSkeletonLoader from "@/components/global/molecules/TableSkeletonLoader";
import useQuickFilter from "@/lib/hooks/useQuickFilter";
import Search from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import SearchBoxTable from "@/components/global/molecules/SearchBoxTable";
import GridTables from "@/components/global/molecules/GridTables";
import { ColDef, ModuleRegistry } from "@ag-grid-community/core";
import { useLabels } from "@/lib/hooks/admin/hookLabelsAdmin";

interface LabelsTableProps {
  setNotification: (notification: { message: string; type: "success" | "error" }) => void;
}

const LabelsTable: React.FC<LabelsTableProps> = ({ setNotification }) => {
  const router = useRouter();
  const web = routes.web;
  const { labelData = [], labelFetchLoading, deleteLabels, labelError } = useLabels();
  const { clientData = [], clientLoading, deleteClients, clientError } = useClients();

  const gridRef = useRef<any>(null);
  const { searchTextRef, quickFilterText, applyFilter, resetFilter } = useQuickFilter();
  const handleEdit = (label: any): void => {
    router.push(`${web.admin.labels.edit}/${label.id}`);
  };

  const handleDelete = async (labelId: number): Promise<void> => {
    try {
      await deleteLabels([labelId]);
      setNotification({ message: "Label deleted successfully", type: "success" });
    } catch (error: any) {
      const errorMessage = error?.response.data.message || "An error occurred while deleting the client.";
      setNotification({ message: errorMessage, type: "error" });
    }
  };

  useEffect(() => {
    if (labelError) {
      setNotification({ message: labelError, type: "error" });
    }
    if (clientError) {
      setNotification({ message: clientError, type: "error" });
    }
  }, [labelError, clientError, setNotification]);

  const columns: ColDef[] = [
    {
      field: "id",
      filter: "agNumberColumnFilter",
      headerName: "ID",
      width: 70,
      sortable: false,
      resizable: false,
    },
    { field: "labelName", headerName: "Label Name", width: 400 },
    {
      field: "client",
      headerName: "Client Name",
      width: 300,
      cellRenderer: (params: any) => {
        // Si el valor es "loading", renderiza el componente de React con el spinner
        if (clientLoading) {
          return <TableSkeletonLoader />;
        }

        const client = clientData.find((client: any) => client.id === params.data.clientId);
        return client ? `${client.clientName} (${client.id})` : "loading";
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
      <SearchBoxTable searchTextRef={searchTextRef} applyFilter={applyFilter} resetFilter={resetFilter} />
      <GridTables ref={gridRef} columns={columns} rowData={rowData} loading={labelFetchLoading} quickFilterText={quickFilterText} />
    </Box>
  );
};

export default LabelsTable;
