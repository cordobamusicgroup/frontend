import useSWR, { mutate } from "swr";
import { useState, useCallback } from "react";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import axios from "axios";
import routes from "@/lib/routes/routes";

type Balance = {
  currency: string;
  total: number;
};

export const usePaymentsUser = () => {
  const { apiRequest } = useApiRequest();
  const [error, setError] = useState<string | null>(null);
  const [balanceFetchLoading, setBalanceFetchLoading] = useState<boolean>(false);

  const getBalances = useCallback(async () => {
    setError(null); // Clear error on start
    setBalanceFetchLoading(true);
    try {
      const url = routes.api.financial.balances.root;
      const response = await apiRequest({
        url,
        method: "get",
        requiereAuth: true,
      });
      return response;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error fetching balances" : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setBalanceFetchLoading(false);
    }
  }, [apiRequest]);

  const {
    data: balances,
    error: fetchError,
    mutate: balancesMutate,
  } = useSWR<Balance[]>(routes.api.financial.balances.root, getBalances, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    balances,
    balanceError: error,
    balanceFetchLoading,
    mutate: balancesMutate,
  };
};
