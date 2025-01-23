import React from "react";
import ClientListPage from "@/components/admin/clients/pages/ListClientsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients",
};

export default function ManageClients() {
  return <ClientListPage />;
}
