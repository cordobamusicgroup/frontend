import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CreateClientPage from "@/components/pages/CreateClientPage";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations(params.locale);

  return {
    title: t("portal.admin.pages.createClient"),
  };
}

export default function CreateClient() {
  return <CreateClientPage />;
}
