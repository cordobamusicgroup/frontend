import React from "react";
import { getTranslations } from "next-intl/server";
import CreateClientPage from "@/components/admin/clients/pages/CreateClientPage";


export async function generateMetadata(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;

  const {
    locale
  } = params;

  const t = await getTranslations({ locale, namespace: "pages.clients" });

  return {
    title: t("createClient"),
  };
}

export default function CreateClient() {
  return <CreateClientPage />;
}
