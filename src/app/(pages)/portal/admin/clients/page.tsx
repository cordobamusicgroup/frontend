import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ClientListPage from "@/components/pages/ClientListPage";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations(params.locale);

  return {
    title: t("portal.admin.pages.manageClients"),
  };
}

export default function ManageClients() {
  return <ClientListPage />;
}
