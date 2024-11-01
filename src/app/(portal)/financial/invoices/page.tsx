import React from "react";
import { getTranslations } from "next-intl/server";
import PageMaintenance from "@/components/global/pages/PageMaintenance";
export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: "menus" });

  return {
    title: t("financial.invoices"),
  };
}

export default function FinancialPortal() {
  return <PageMaintenance />;
}
