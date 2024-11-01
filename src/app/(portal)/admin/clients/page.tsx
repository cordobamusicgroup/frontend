import React from "react";
import ClientListPage from "@/components/admin/clients/pages/ClientListPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients",
};

export default function ManageClients() {
  return <ClientListPage />;
}
