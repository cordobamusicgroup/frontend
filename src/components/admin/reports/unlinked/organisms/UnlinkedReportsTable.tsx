import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Autocomplete } from "@mui/material";
import routes from "@/lib/routes/routes";
import GridTables from "@/components/global/molecules/GridTables";
import { useRouter } from "next/navigation";
import useQuickFilter from "@/lib/hooks/useQuickFilter";
import SearchBoxTable from "@/components/global/molecules/SearchBoxTable";
import { AgGridReact } from "@ag-grid-community/react";
import { useLabels } from "@/lib/hooks/admin/hookLabelsAdmin";
import { useLinkReports } from "@/lib/hooks/admin/hookLinkReportsAdmin";
import { Refresh } from "@mui/icons-material";
import { mutate } from "swr";
import "@/styles/ag-grid.css"; // Add this line to import the CSS file
import LinkUnlinkedReportForm from "@/components/admin/reports/unlinked/molecules/LinkUnlinkedReportForm";
import LinkReportDialog from "../molecules/LinkReportDialog";

interface UnlinkedReportsTableProps {
  setNotification: (notification: { message: string; type: "success" | "error" }) => void;
}

const UnlinkedReportsTable: React.FC<UnlinkedReportsTableProps> = ({ setNotification }) => {
  const router = useRouter();
  const { unlinkedReports, unlinkedReportsLoading, unlinkedReportsError } = useLinkReports();
  const gridRef = useRef<AgGridReact>(null);

  const { searchTextRef, quickFilterText, applyFilter, resetFilter } = useQuickFilter();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [selectedReportData, setSelectedReportData] = useState<any>(null);

  useEffect(() => {
    if (unlinkedReportsError) {
      setNotification({ message: unlinkedReportsError, type: "error" });
    }
  }, [unlinkedReportsError, setNotification]);

  const handleOpenLinkDialog = (report: any) => {
    setSelectedReportId(report.id);
    setSelectedReportData(report);
    setOpenLinkDialog(true);
  };

  const handleCloseLinkDialog = () => {
    setOpenLinkDialog(false);
    setSelectedReportId(null);
    setSelectedReportData(null);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80, sortable: false, filter: false, resizable: false, cellStyle: { textAlign: "center" }, headerClass: "center-header" },
    { field: "labelName", headerName: "Label Name", width: 200, cellStyle: { textAlign: "center" }, headerClass: "center-header" },
    { field: "distributor", headerName: "Distributor", width: 150, cellStyle: { textAlign: "center" }, headerClass: "center-header" },
    { field: "reportingMonth", headerName: "Reporting Month", width: 150, cellStyle: { textAlign: "center" }, headerClass: "center-header" },
    { field: "count", headerName: "Count", width: 100, cellStyle: { textAlign: "center" }, headerClass: "center-header" },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      cellRenderer: (params: any) => <Button onClick={() => handleOpenLinkDialog(params.data)}>Link</Button>,
      cellStyle: { textAlign: "center" },
      headerClass: "center-header",
    },
  ];

  const rowData =
    unlinkedReports?.map((report: any) => ({
      id: report.id,
      labelName: report.labelName,
      distributor: report.distributor,
      reportingMonth: report.reportingMonth,
      count: report.count,
    })) || [];

  const handleRefresh = () => {
    mutate("unlinked-reports");
  };

  return (
    <>
      <Box sx={{ height: 600, width: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <SearchBoxTable searchTextRef={searchTextRef} applyFilter={applyFilter} resetFilter={resetFilter} />
          </Box>
          <Button onClick={handleRefresh} startIcon={<Refresh />} sx={{ marginLeft: 2 }}>
            Refresh
          </Button>
        </Box>
        <GridTables ref={gridRef} columns={columns} rowData={rowData} loading={unlinkedReportsLoading} quickFilterText={quickFilterText} defaultColDef={{ filter: true, headerClass: "center-header", flex: 1 }} />
      </Box>
      <LinkReportDialog open={openLinkDialog} onClose={handleCloseLinkDialog} reportId={selectedReportId} reportData={selectedReportData} />
    </>
  );
};

export default UnlinkedReportsTable;
