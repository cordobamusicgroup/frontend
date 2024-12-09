import useSWR, { mutate } from "swr";
import { useState, useCallback, useEffect } from "react";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import routes from "../../routes/routes";
import axios from "axios";

type Client = any;

export const useClients = (clientId?: string) => {
  const { apiRequest } = useApiRequest();
  const [error, setError] = useState<string | null>(null);
  const [clientFetchLoading, setClientFetchLoading] = useState<boolean>(false);
  const [clientLoading, setClientLoading] = useState<boolean>(false);

  const fetcher = useCallback(async () => {
    setError(null); // Limpiar error al iniciar
    setClientFetchLoading(true);
    try {
      const url = clientId ? `${routes.api.clients.root}/${clientId}` : routes.api.clients.root;
      const response = await apiRequest({
        url,
        method: "get",
        requiereAuth: true,
      });
      return response;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error fetching clients" : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setClientFetchLoading(false);
    }
  }, [apiRequest, clientId]);

  const {
    data,
    error: fetchError,
    mutate: dataMutate,
  } = useSWR<Client | Client[]>(clientId ? `client-${clientId}` : "clients", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const createClient = useCallback(
    async (clientData: Client) => {
      setClientLoading(true);
      setError(null); // Limpiar error al iniciar
      try {
        const response = await apiRequest({
          url: routes.api.clients.root,
          method: "post",
          requiereAuth: true,
          data: clientData,
        });
        await mutate("clients");
        return response;
      } catch (err) {
        const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error creating client" : "Unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setClientLoading(false);
      }
    },
    [apiRequest]
  );

  const updateClient = useCallback(
    async (clientData: Client) => {
      if (!clientId) {
        throw new Error("Client ID is required to update client");
      }
      setClientLoading(true);
      setError(null); // Limpiar error al iniciar
      try {
        const response = await apiRequest({
          url: `${routes.api.clients.root}/${clientId}`,
          method: "put",
          requiereAuth: true,
          data: clientData,
        });
        await dataMutate();
        return response;
      } catch (err) {
        const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error updating client" : "Unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setClientLoading(false);
      }
    },
    [apiRequest, clientId, dataMutate]
  );

  const deleteClients = async (ids: number[]): Promise<boolean> => {
    setClientLoading(true);
    setError(null); // Limpiar error al iniciar
    try {
      await apiRequest({
        url: routes.api.clients.root,
        method: "delete",
        requiereAuth: true,
        data: { ids },
      });
      await mutate("clients");
      return true;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error deleting clients" : "Unknown error occurred";
      setError(errorMessage);
      return false;
    } finally {
      setClientLoading(false);
    }
  };

  return {
    clientData: data,
    clientError: error,
    clientFetchLoading,
    clientLoading,
    createClient,
    updateClient,
    deleteClients,
    mutate: dataMutate,
  };
};
