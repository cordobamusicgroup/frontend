import React, { useEffect, useRef } from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import { useReportsUser } from "@/lib/hooks/hookReportsUser";
import routes from "@/lib/routes/routes";
import GridTables from "@/components/global/molecules/GridTables";
import { useRouter } from "next/navigation";
import DownloadIcon from "@mui/icons-material/Download";
import dayjs from "dayjs";
import { royaltiesgrid } from "@/styles/grid-royalties";
import { themeQuartz } from "@ag-grid-community/theming";
import { AgGridReact } from "@ag-grid-community/react";
import { FiberManualRecord as DotIcon } from "@mui/icons-material";
import { isMobile } from "@/theme";

interface ReportsTableProps {
  setNotification: (notification: { message: string; type: "success" | "error" }) => void;
}

const ReportsTable: React.FC<ReportsTableProps> = ({ setNotification }) => {
  const router = useRouter();
  const { reportData = [], reportFetchLoading, downloadReport, reportError, reportLoading } = useReportsUser();
  const gridRef = useRef<AgGridReact>(null);

  useEffect(() => {
    if (reportError) {
      setNotification({ message: reportError, type: "error" });
    }
  }, [reportError, setNotification]);

  const handleDownload = async (reportId: number): Promise<void> => {
    try {
      const url = await downloadReport(reportId.toString());
      window.open(url, "_blank");
      setNotification({ message: "Report downloaded successfully", type: "success" });
    } catch (error) {
      setNotification({ message: "Error downloading report", type: "error" });
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 80, filter: false, flex: 0 },
    { field: "createdAt", headerName: "Date", sort: "desc", width: 250, valueFormatter: (params: any) => dayjs(params.value).format("MMMM D, YYYY") },
    { field: "currency", headerName: "Currency", width: 150 },
    { field: "distributor", headerName: "Distributor", width: 150 },
    {
      field: "reportingMonth",
      headerName: "Reporting Month",
      width: 150,
      valueFormatter: (params: any) => dayjs(params.value).format("YYYY.MM"),
    },
    {
      field: "totalRoyalties",
      headerName: "Total Royalties",
      width: 200,
      valueFormatter: (params: any) => {
        const currency = params.data.currency === "EUR" ? "EUR" : "USD";
        return params.value.toLocaleString("en-GB", {
          style: "currency",
          currency: currency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 20,
        });
      },
    },
    {
      field: "debitState",
      headerName: "Debit State",
      width: 200,
      cellRenderer: (params: any) => {
        const isPaid = params.value === "PAID";
        const color = isPaid ? "#b6c92f" : "#F5364D";
        const state = isPaid ? "Paid" : "Unpaid";
        const date = isPaid && params.data.paidOn ? ` (${dayjs(params.data.paidOn).format("YYYY-MM-DD")})` : "";
        return (
          <Box display="flex" gap={1} alignItems="center">
            <DotIcon sx={{ fontSize: "16px" }} style={{ color }} />
            <span>
              {state}
              {date}
            </span>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      minWidth: 200,
      sortable: false,
      filter: false,
      resizable: false,
      flex: 1,
      cellRenderer: (params: any) => (
        <Tooltip title="Download Report">
          <IconButton onClick={() => handleDownload(params.data.id)}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const rowData = reportData.map((report: any) => ({
    id: report.id,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    currency: report.currency,
    distributor: report.distributor,
    reportingMonth: report.reportingMonth,
    totalRoyalties: report.totalRoyalties,
    debitState: report.debitState,
    paidOn: report.paidOn,
  }));

  const defaultColDef = {
    flex: isMobile() ? 0 : 1,
    sortable: false,
    resizable: false,
    filter: true,
  };

  return <GridTables theme={royaltiesgrid} height="400px" ref={gridRef} columns={columns} rowData={rowData} loading={reportFetchLoading || reportLoading} defaultColDef={defaultColDef} overlayNoRowsTemplate="Reports not found" />;
};

export default ReportsTable;
