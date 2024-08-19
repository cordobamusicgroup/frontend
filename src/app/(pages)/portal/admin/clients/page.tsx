import React from "react";
import { Metadata } from "next";
import PageManageClients from "@/components/templates/admin/PageManageClients";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations(params.locale);

  return {
    title: t("portal.admin.pages.manageClients"),
  };
}

export default function ManageClients() {
  return <PageManageClients />;
}
