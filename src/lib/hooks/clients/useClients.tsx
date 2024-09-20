import useSWR, { mutate } from "swr";
import { useState } from "react";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import apiRoutes from "@/lib/routes/apiRoutes";

type Client = any; // Replace 'any' with your actual Client type

export const useClients = (clientId?: string) => {
  const { apiRequest } = useApiRequest();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch clients or a single client depending on whether clientId is provided
  const fetcher = async () => {
    const url = clientId ? `${apiRoutes.clients}/${clientId}` : apiRoutes.clients;
    const response = await apiRequest({
      url,
      method: "get",
      requiereAuth: true,
    });
    return response.data;
  };

  const {
    data,
    error: fetchError,
    mutate: dataMutate,
  } = useSWR<Client | Client[]>(clientId ? `client-${clientId}` : "clients", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  // Create client
  const createClient = async (clientData: Client) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest({
        url: apiRoutes.clients,
        method: "post",
        requiereAuth: true,
        data: clientData,
      });

      // Revalidate the list of clients
      mutate("clients");
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError("Error creating client");
      throw err;
    }
  };

  // Update client
  const updateClient = async (clientData: Client) => {
    if (!clientId) {
      throw new Error("Client ID is required to update client");
    }
    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest({
        url: `${apiRoutes.clients}/${clientId}`,
        method: "put",
        requiereAuth: true,
        data: clientData,
      });

      // Revalidate the client data
      dataMutate();
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      setError("Error updating client");
      throw err;
    }
  };

  // Delete client(s)
  const deleteClients = async (ids: number[]) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest({
        url: apiRoutes.clients,
        method: "delete",
        requiereAuth: true,
        data: { ids },
      });

      // Revalidate the list of clients
      mutate("clients");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Error deleting clients");
      throw err;
    }
  };

  return {
    data, // Contains client data or list of clients
    loading,
    error: error || fetchError,
    createClient,
    updateClient,
    deleteClients,
    mutate: dataMutate, // Expose mutate function if needed
  };
};
