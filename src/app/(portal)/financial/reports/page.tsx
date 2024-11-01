import React from "react";
import PageFinancialReports from "@/components/global/pages/admin/financial/PageFinancialReports";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: "menus" });

  return {
    title: t("financial.title"),
  };
}

export default function FinancialPortal() {
  return <PageFinancialReports />;
}
