import { useState } from "react";
import { mutate } from "swr";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import apiRoutes from "@/lib/routes/apiRoutes";

export const useCreateClient = () => {
  const { apiRequest } = useApiRequest();
  const [createClientLoading, setCreateClientLoading] = useState(false);
  const [createClientError, setCreateClientError] = useState<string | null>(null);

  const createClient = async (clientData: any) => {
    setCreateClientLoading(true);
    setCreateClientError(null);
    try {
      const response = await apiRequest({
        url: apiRoutes.clients,
        method: "post",
        requiereAuth: true,
        data: clientData,
      });

      mutate("clients");
      setCreateClientLoading(false);
      return response.data;
    } catch (err) {
      setCreateClientLoading(false);
      setCreateClientError("Error creating client");
      throw err;
    }
  };

  return { createClient, createClientLoading, createClientError };
};
