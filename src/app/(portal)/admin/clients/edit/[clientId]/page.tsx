import React from "react";
import UpdateClientPage from "@/components/admin-components/clients/pages/UpdateClientPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Client",
};

export default async function EditClient(props: { params: Promise<{ clientId: string }> }) {
  const params = await props.params;
  return <UpdateClientPage clientId={params.clientId} />;
}
