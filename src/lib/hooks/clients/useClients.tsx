import useSWR from "swr";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import apiRoutes from "@/lib/routes/apiRoutes";

export const useClients = () => {
  const { apiRequest } = useApiRequest();

  const fetchClients = async () => {
    const response = await apiRequest({
      url: apiRoutes.clients,
      method: "get",
      requiereAuth: true,
    });
    return response.data;
  };

  const { data, error, isLoading, mutate } = useSWR("clients", fetchClients, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    clients: data,
    isLoading,
    error,
    mutate,
  };
};
