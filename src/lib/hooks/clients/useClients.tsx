import useSWR from "swr";
import { useState } from "react";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import apiRoutes from "@/lib/routes/apiRoutes";

export const useClients = () => {
  const { apiRequest } = useApiRequest();
  const [isDeleting, setIsDeleting] = useState(false); // Estado para manejar la eliminación

  // Function to fetch clients
  const fetchClients = async () => {
    const response = await apiRequest({
      url: apiRoutes.clients,
      method: "get",
      requiereAuth: true,
    });
    return response.data;
  };

  // Function to delete multiple clients
  const deleteClients = async (ids: number[]): Promise<void> => {
    try {
      setIsDeleting(true); // Activar estado de eliminación
      await apiRequest({
        url: apiRoutes.clients,
        method: "delete",
        requiereAuth: true,
        data: { ids }, // Pass the array of IDs as data
      });

      // Optimistically update the client list after deletion
      clientsMutate(); // Re-fetch the clients list to reflect the changes
    } catch (error) {
      console.error("Failed to delete clients", error);
      throw error;
    } finally {
      setIsDeleting(false); // Desactivar estado de eliminación
    }
  };

  const {
    data,
    error: clientsError,
    isLoading: clientsLoading,
    mutate: clientsMutate,
  } = useSWR<any[], Error>("clients", fetchClients, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    clients: data,
    clientsLoading: clientsLoading || isDeleting,
    clientsError,
    clientsMutate,
    deleteClients,
  };
};
