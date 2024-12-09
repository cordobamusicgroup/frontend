import React from "react";
import PageFinancialReports from "@/components/global/pages/admin/financial/PageFinancialReports";
import ReportsPage from "@/components/user/reports/pages/ReportsUserPage";

export const metadata = {
  title: "Financial Reports",
  description: "View and manage financial reports",
};

export default function FinancialPortal() {
  return <ReportsPage />;
}
