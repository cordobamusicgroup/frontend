import React from "react";
import PageFinancialReports from "@/components/pages/admin/financial/PageFinancialReports";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "menus" });

  return {
    title: t("financial.title"),
  };
}

export default function FinancialPortal() {
  return <PageFinancialReports />;
}
