import React from "react";
import { getTranslations } from "next-intl/server";
import UpdateClientPage from "@/components/admin/clients/pages/UpdateClientPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Client",
};

export default async function EditClient(props: { params: Promise<{ clientId: string }> }) {
  const params = await props.params;
  return <UpdateClientPage clientId={params.clientId} />;
}
