import React from "react";
import { getTranslations } from "next-intl/server";
import CreateClientPage from "@/components/pages/CreateClientPage";
import UpdateClientPage from "@/components/pages/UpdateClientPage";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "pages.clients" });

  return {
    title: t("createClient"),
  };
}

export default function EditClient({ params }: { params: { clientId: string } }) {
  return <UpdateClientPage clientId={params.clientId} />;
}
