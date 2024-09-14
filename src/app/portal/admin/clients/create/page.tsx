import React from "react";
import { getTranslations } from "next-intl/server";
import CreateClientPage from "@/components/pages/CreateClientPage";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "pages.clients" });

  return {
    title: t("createClient"),
  };
}

export default function CreateClient() {
  return <CreateClientPage />;
}
