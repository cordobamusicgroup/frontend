import React from "react";
import { Metadata } from "next";
import PageFinancialReports from "@/components/pages/admin/financial/PageFinancialReports";
import { getTranslations } from "next-intl/server";
import PageMaintenance from "@/components/pages/PageMaintenance";
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "menus" });

  return {
    title: t("financial.invoices"),
  };
}

export default function FinancialPortal() {
  return <PageMaintenance />;
}
