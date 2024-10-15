import React from "react";
import { getTranslations } from "next-intl/server";
import UpdateClientPage from "@/components/admin/clients/pages/UpdateClientPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Client",
};

export default function EditClient({ params }: { params: { clientId: string } }) {
  return <UpdateClientPage clientId={params.clientId} />;
}
