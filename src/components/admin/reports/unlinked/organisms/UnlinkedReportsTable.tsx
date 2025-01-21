import React, { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import GridTables from "@/components/global/molecules/GridTables";
import useQuickFilter from "@/lib/hooks/useQuickFilter";
import { AgGridReact } from "@ag-grid-community/react";
import { useLinkReports } from "@/lib/hooks/admin/hookLinkReportsAdmin";
import { Refresh } from "@mui/icons-material";
import { mutate } from "swr";
import "@/styles/ag-grid.css"; // Add this line to import the CSS file
import LinkReportDialog from "../molecules/LinkReportDialog";
import { useAppStore } from "@/lib/zustand/zustandStore";
import SearchBoxTable from "@/components/global/molecules/SearchBoxTable";

const UnlinkedReportsTable: React.FC = () => {
  const { unlinkedReports, unlinkedReportsLoading, unlinkedReportsError } = useLinkReports();
  const gridRef = useRef<AgGridReact>(null);

  const { searchTextRef, quickFilterText, applyFilter, resetFilter } = useQuickFilter();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);
  const [selectedReportData, setSelectedReportData] = useState<any>(null);
  const { setNotification } = useAppStore.notification();

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
