import React from "react";
import PageMaintenance from "@/components/global/pages/PageMaintenance";
import BalancesUserPage from "@/components/user/balances/pages/BalancesUserPage";

export const metadata = {
  title: "Payments & Operations",
};

export default function PaymentsUser() {
  return <BalancesUserPage />;
}
