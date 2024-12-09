import useSWR from "swr";
import { useState, useCallback } from "react";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import axios from "axios";
import routes from "@/lib/routes/routes";

type WithdrawalAuthorized = {
  id: string;
  amount: number;
  status: string;
  isBlocked: boolean;
  isPaymentInProgress: boolean;
  isPaymentDataInValidation: boolean;
};

export const usePaymentsUser = () => {
  const { apiRequest } = useApiRequest();
  const [error, setError] = useState<string | null>(null);
  const [withdrawalFetchLoading, setWithdrawalFetchLoading] = useState<boolean>(false);

  const getWithdrawalAuthorized = useCallback(async () => {
    setError(null); // Clear error on start
    setWithdrawalFetchLoading(true);
    try {
      const url = routes.api.financial.payments.withdrawalAuthorized;
      const response = await apiRequest({
        url,
        method: "get",
        requiereAuth: true,
      });
      return response.data;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error fetching withdrawal authorized" : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setWithdrawalFetchLoading(false);
    }
  }, [apiRequest]);

  const {
    data: withdrawalAuthorized,
    error: fetchError,
    mutate: withdrawalMutate,
  } = useSWR<WithdrawalAuthorized>(routes.api.financial.payments.withdrawalAuthorized, getWithdrawalAuthorized, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    withdrawalAuthorized,
    withdrawalError: error,
    withdrawalFetchLoading,
    mutate: withdrawalMutate,
  };
};
