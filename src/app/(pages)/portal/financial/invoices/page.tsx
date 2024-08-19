import React from "react";
import { Metadata } from "next";
import PageFinancialReports from "@/components/templates/financial/PageFinancialReports";
import { getTranslations } from "next-intl/server";
import PageMaintenance from "@/components/templates/PageMaintenance";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations(params.locale);

  return {
    title: t("portal.pages.financial.invoices"),
  };
}

export default function FinancialPortal() {
  return <PageMaintenance />;
}