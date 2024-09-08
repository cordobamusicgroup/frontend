"use client";
import { useRouter } from "next/navigation";
import { useClients } from "@/lib/hooks/clients/useClients";
import ClientListTemplate from "../templates/ClientListTemplate";
import webRoutes from "@/lib/routes/webRoutes";
import { useTranslations } from "next-intl";

const ClientListPage: React.FC = () => {
  const router = useRouter();
  const t = useTranslations("pages.clients");
  const { clients = [], clientsLoading, clientsError, deleteClients } = useClients();

  if (clientsError) return <div>{t("listError")}</div>;

  const handleCreateClient = (): void => {
    router.push(webRoutes.admin.createClient);
  };

  const handleEdit = (client: any): void => {
    console.log("Edit", client);
  };

  const handleView = (client: any): void => {
    console.log("View", client);
  };

  // TODO - Add sucess and error boxes
  const handleDelete = async (client: any): Promise<void> => {
    try {
      await deleteClients([client.id]);
    } catch (error) {
      console.error("Failed to delete client", error);
    }
  };

  return <ClientListTemplate clients={clients} onCreate={handleCreateClient} onEdit={handleEdit} onView={handleView} onDelete={handleDelete} loading={clientsLoading} />;
};

export default ClientListPage;
