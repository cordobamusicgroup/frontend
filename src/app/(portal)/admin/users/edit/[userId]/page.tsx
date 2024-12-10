import React from "react";
import UpdateClientPage from "@/components/admin/clients/pages/UpdateClientPage";
import { Metadata } from "next";
import UpdateUserPage from "@/components/admin/users/pages/UpdateUserPage";

export const metadata: Metadata = {
  title: "Update Client",
};

export default async function EditClient(props: { params: Promise<{ userId: string }> }) {
  const params = await props.params;
  return <UpdateUserPage userId={params.userId} />;
}
