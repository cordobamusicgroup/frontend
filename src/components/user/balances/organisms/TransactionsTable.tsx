import React, { useEffect, useRef } from "react";
import { Box, Tooltip, IconButton, Typography } from "@mui/material";
import GridTables from "@/components/global/molecules/GridTables";
import { useRouter } from "next/navigation";
import DownloadIcon from "@mui/icons-material/Download";
import dayjs from "dayjs";
import { royaltiesgrid } from "@/styles/grid-royalties";
import { AgGridReact } from "@ag-grid-community/react";
import { FiberManualRecord as DotIcon } from "@mui/icons-material";
import { useTransactions } from "@/lib/hooks/user/hookTransactions";
import { isMobile } from "@/theme";

interface TransactionsTableProps {
  setNotification: (notification: { message: string; type: "success" | "error" }) => void;
  currency: "USD" | "EUR";
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ setNotification, currency }) => {
  const gridRef = useRef<AgGridReact>(null);
  const { transactions, transactionsError, transactionsLoading, mutateTransactions } = useTransactions(currency);

  useEffect(() => {
    mutateTransactions();
  }, [currency, mutateTransactions]);

  useEffect(() => {
    if (transactionsError) {
      setNotification({ message: "Error fetching transactions", type: "error" });
    }
  }, [transactionsError, setNotification]);

  const columns = [
    { field: "id", headerName: "ID", width: 80, filter: false },
    { field: "createdAt", headerName: "Created At", sort: "desc", sortingOrder: ["desc"], width: 200, valueFormatter: (params: any) => dayjs(params.value).format("MMMM D, YYYY") },
    { field: "type", headerName: "Type", width: 100 },
    {
      field: "debitState",
      headerName: "Op. Type",
      width: 130,
      cellRenderer: (params: any) => {
        const isCredit = params.data.amount > 0;
        const state = isCredit ? "Credit" : "Debit";
        const color = isCredit ? "#4CAF50" : "#F44336";
        return (
          <Box display="flex" gap={1} alignItems="center">
            <DotIcon sx={{ fontSize: "16px" }} style={{ color }} />
            <span>{state}</span>
          </Box>
        );
      },
    },
    { field: "description", headerName: "Description", width: 350, flex: 1 },
    {
      field: "amount",
      headerName: "Operations",
      width: 250,
      flex: 1,
      valueFormatter: (params: any) => {
        const currencySymbol = currency === "USD" ? "$" : "€";
        const value = params.value % 1 === 0 ? `${params.value}.00` : params.value;
        return `${currencySymbol} ${value}`;
      },
    },
    {
      field: "balanceAmount",
      headerName: "Balance",
      width: 250,
      flex: 1,
      valueFormatter: (params: any) => {
        const currencySymbol = currency === "USD" ? "$" : "€";
        const value = params.value % 1 === 0 ? `${params.value}.00` : params.value;
        return `${currencySymbol} ${value}`;
      },
    },
  ];

  const defaultColDef = {
    flex: 0,
    resizable: false,
    filter: true,
    sortable: false,
  };

  return <GridTables theme={royaltiesgrid} height="400px" ref={gridRef} columns={columns} rowData={transactions ?? []} defaultColDef={defaultColDef} overlayNoRowsTemplate="Transactions not found" loading={transactionsLoading} />;
};

export default TransactionsTable;
