import React from "react";
import { Metadata } from "next";
import PageFinancialReports from "@/components/pages/admin/financial/PageFinancialReports";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations(params.locale);

  return {
    title: t("portal.pages.financial.reports"),
  };
}

export default function FinancialPortal() {
  return <PageFinancialReports />;
}
