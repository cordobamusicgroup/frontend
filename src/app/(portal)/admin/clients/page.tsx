import React from "react";
import ClientListPage from "@/components/admin-components/clients/pages/ListClientsPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients",
};

export default function ManageClients() {
  return <ClientListPage />;
}
