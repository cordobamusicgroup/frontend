"use client";
import BasicButton from "@/components/global/atoms/BasicButton";
import ErrorBox from "@/components/global/molecules/ErrorBox";
import SuccessBox from "@/components/global/molecules/SuccessBox";
import CustomPageHeader from "@/components/header/molecules/CustomPageHeader";
import theme from "@/theme";
import { Box, Typography, Select, MenuItem, SelectChangeEvent, FormControl, InputLabel } from "@mui/material";
import { useState } from "react";
import BalancesBlock from "../organisms/BalancesBlock";
import { usePaymentsUser } from "@/lib/hooks/user/hookPaymentsUser";
import TransactionsTable from "../organisms/TransactionsTable";

export default function PaymentsUserPage() {
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const { balances, balanceFetchLoading, balanceError, mutate } = usePaymentsUser();
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "EUR" | null>(null);

  const handleBalanceChange = (event: SelectChangeEvent<string>) => {
    const currency = event.target.value;
    setSelectedCurrency(currency as "USD" | "EUR");
    setNotification(null); // Clear any existing notifications
    mutate(); // Refresh the balance
  };

  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column" }}>
      <CustomPageHeader background={"#0173C2"} color={theme.palette.primary.contrastText}>
        <Typography sx={{ flexGrow: 1, fontSize: "18px" }}>Payments & Operations</Typography>
      </CustomPageHeader>

      <Box>
        {notification?.type === "success" && <SuccessBox>{notification.message}</SuccessBox>}
        {notification?.type === "error" && <ErrorBox>{notification.message}</ErrorBox>}
      </Box>

      <>
        <FormControl sx={{ minWidth: 200, marginBottom: 2 }}>
          <InputLabel>Select Balance</InputLabel>
          <Select value={selectedCurrency ?? ""} onChange={handleBalanceChange} label="Select Balance">
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
          </Select>
        </FormControl>
        {selectedCurrency && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {balances && <BalancesBlock balance={balances.find((balance) => balance.currency === selectedCurrency)?.total} currency={selectedCurrency} />}
            <TransactionsTable setNotification={setNotification} currency={selectedCurrency} />
          </Box>
        )}
      </>

      {balanceError && <ErrorBox>{balanceError}</ErrorBox>}
    </Box>
  );
}
