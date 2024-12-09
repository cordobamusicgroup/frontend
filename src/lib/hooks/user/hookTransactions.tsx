import useSWR from "swr";
import { useCallback, useState } from "react";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import axios from "axios";
import routes from "@/lib/routes/routes";

type Transaction = {
  id: number;
  createdAt: string;
  updatedAt: string;
  type: string;
  description: string;
  amount: number;
  balanceAmount: number;
  balanceId: number;
  baseReportId: number;
  userReportId: number;
};

export const useTransactions = (currency: string) => {
  const { apiRequest } = useApiRequest();
  const [error, setError] = useState<string | null>(null);
  const [transactionLoading, setTransactionLoading] = useState<boolean>(false);

  const getTransactions = useCallback(
    async (currency: string) => {
      setTransactionLoading(true);
      setError(null); // Clear error on start
      try {
        const url = routes.api.financial.balances.transactions;
        const response = await apiRequest({
          url,
          method: "get",
          requiereAuth: true,
          params: { currency }, // Use params to send the currency value correctly
        });
        console.log(currency);
        return response;
      } catch (err) {
        const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error fetching transactions" : err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setTransactionLoading(false);
      }
    },
    [apiRequest]
  );

  const {
    data,
    error: fetchError,
    mutate,
  } = useSWR<Transaction[]>(currency ? `${routes.api.financial.balances.transactions}?currency=${currency}` : null, () => getTransactions(currency), {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    transactions: data,
    transactionsError: fetchError,
    transactionsLoading: !fetchError && !data,
    mutateTransactions: mutate,
  };
};
