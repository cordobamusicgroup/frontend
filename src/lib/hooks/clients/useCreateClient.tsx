import { useState } from "react";
import { mutate } from "swr";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import apiRoutes from "@/lib/routes/apiRoutes";

export const useCreateClient = () => {
  const { apiRequest } = useApiRequest();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClient = async (clientData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiRequest({
        url: apiRoutes.clients,
        method: "post",
        requiereAuth: true,
        data: clientData,
      });

      // Actualizar el caché de SWR
      mutate("clients");
      setIsLoading(false);
      return response.data;
    } catch (err) {
      setIsLoading(false);
      setError("Error creating client");
      throw err;
    }
  };

  return { createClient, isLoading, error };
};
