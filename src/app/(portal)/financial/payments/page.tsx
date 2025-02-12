import React from "react";
import PageMaintenance from "@/components/global/pages/PageMaintenance";
import PaymentsUserPage from "@/components/user/balances/pages/PaymentsUserPage";

export const metadata = {
  title: "Payments & Operations",
};

export default function PaymentsUser() {
  return <PaymentsUserPage />;
}
