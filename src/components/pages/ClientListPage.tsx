"use client";
import { useRouter } from "next/navigation";
import { useClients } from "@/lib/hooks/clients/useClients";
import ClientListTemplate from "../templates/ClientListTemplate";
import webRoutes from "@/lib/routes/webRoutes";

const ClientListPage: React.FC = () => {
  const router = useRouter();
  const { clients = [], clientsLoading, clientsError } = useClients();

  if (clientsError) return <div>Error loading clients</div>;

  const handleCreateClient = (): void => {
    router.push(webRoutes.admin.createClient);
  };

  const handleEdit = (client: any): void => {
    console.log("Edit", client);
  };

  const handleView = (client: any): void => {
    console.log("View", client);
  };

  const handleDelete = (client: any): void => {
    console.log("Delete", client);
  };

  return <ClientListTemplate clients={clients} onCreate={handleCreateClient} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} loading={clientsLoading} />;
};

export default ClientListPage;
