import BasicButton from "@/components/global/atoms/BasicButton";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import { Block, MoneyOff, Pending, ScheduleSend, WarningAmber } from "@mui/icons-material";
import { usePaymentsUser } from "@/lib/hooks/user/hookPaymentsUser";

interface BalancesBlockProps {
  paymentMethod?: string;
  balance?: number;
  currency?: "USD" | "EUR";
}

const DisabledButton = styled(BasicButton)({
  backgroundColor: "#c4c6cc",
  color: "white",
  pointerEvents: "none",
  boxShadow: "none",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#e0e0e0",
  },
});

export default function BalancesBlock({ paymentMethod = "N/A", balance = 0.0, currency = "EUR" }: BalancesBlockProps) {
  const date = dayjs().format("DD MMMM YYYY");
  const currencySymbol = currency === "USD" ? "$" : "€";
  const { withdrawalAuthorized } = usePaymentsUser();

  const isBlocked = withdrawalAuthorized?.isBlocked;
  const isPaymentInProgress = withdrawalAuthorized?.isPaymentInProgress;
  const isPaymentDataInValidation = withdrawalAuthorized?.isPaymentDataInValidation;

  const showRequestPaymentButton = balance >= 100 && !isBlocked && !isPaymentInProgress && !isPaymentDataInValidation;

  return (
    <Box
      id="balance"
      sx={{
        display: "flex",
        backgroundColor: "#f6f7fa",
        borderRadius: "4px",
        border: "1px solid #e9e9e9",
        width: "100%",
        justifyContent: "center",
        padding: "25px",
        color: "#444444",
        flexDirection: { xs: "column-reverse", md: "row" }, // Responsive layout
      }}
    >
      <Box
        id="balance_info_text"
        sx={{
          display: "flex",
          width: { xs: "100%", md: "50%" }, // Responsive width
          alignItems: "start",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography color={"#444444"}>
          <b>Payment Method:</b> {paymentMethod}
        </Typography>
        {showRequestPaymentButton ? <BasicButton>Request Payment</BasicButton> : <DisabledButton>Payment Not Available</DisabledButton>}
        {balance >= 100 && (
          <Typography color={"#444444"}>
            Your royalties have reached the <b>$100 threshold</b>, and you can now request a withdrawal in your chosen payment method.
          </Typography>
        )}
        {balance < 100 && (
          <Box sx={{ display: "flex", alignItems: "start", color: "#444444" }}>
            <MoneyOff sx={{ fontSize: 18, marginRight: 1, color: "#09365F" }} />
            <Typography sx={{ fontSize: 16 }}>The amount of royalties due is inferior to the minimum required by your distribution contract.</Typography>
          </Box>
        )}
        {isPaymentInProgress && (
          <Box sx={{ display: "flex", alignItems: "start", color: "#444444" }}>
            <ScheduleSend sx={{ fontSize: 18, marginRight: 1, color: "#09365F" }} />
            <Typography sx={{ fontSize: 16 }}>You have a payment in progress, when it is completed you can request a new payment.</Typography>
          </Box>
        )}
        {isPaymentDataInValidation && (
          <Box sx={{ display: "flex", alignItems: "start", color: "#444444" }}>
            <Pending sx={{ fontSize: 18, marginRight: 1, color: "#2196F3" }} />
            <Typography sx={{ fontSize: 16 }}>Your payment details are being validated. The average processing time is 3 days.</Typography>
          </Box>
        )}
        {isBlocked && (
          <Box sx={{ display: "flex", alignItems: "start", color: "#444444" }}>
            <Block sx={{ fontSize: 18, marginRight: 1, color: "#F44336" }} />
            <Typography sx={{ fontSize: 16 }}>Your royalty withdrawals, method updates are blocked, contact us for more information.</Typography>
          </Box>
        )}
        {balance < 0 && (
          <Box sx={{ display: "flex", alignItems: "start", color: "#444444" }}>
            <WarningAmber sx={{ fontSize: 18, marginRight: 1, color: "#FF9800" }} />
            <Typography sx={{ fontSize: 16 }}>Your balance is negative, the outstanding balance will be deducted from your next royalty payment.</Typography>
          </Box>
        )}
      </Box>

      <Box
        id="balance_amount"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          width: { xs: "100%", md: "50%" }, // Responsive width
          alignItems: { xs: "flex-start", md: "flex-end" }, // Responsive alignment
          marginTop: { xs: 0, md: 0 }, // Add margin for spacing on mobile
        }}
      >
        <Typography color={"#444444"}>Available balance on {date}</Typography>
        <Typography color={"#444444"}>
          <b>Currency:</b> {currency}
        </Typography>
        <Typography color={"#1E73BE"} id="current_balance" sx={{ fontSize: "30px", fontWeight: "600" }}>
          {currencySymbol} {balance.toFixed(2)}
        </Typography>
      </Box>
    </Box>
  );
}
