import React from "react";
import { getTranslations } from "next-intl/server";
import ClientListPage from "@/components/pages/ClientListPage";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "pages.clients" });

  return {
    title: t("title"),
  };
}

export default function ManageClients() {
  return <ClientListPage />;
}
