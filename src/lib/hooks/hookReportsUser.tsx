import useSWR, { mutate } from "swr";
import { useState, useCallback } from "react";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import routes from "../routes/routes";
import axios from "axios";

type Report = any;

export const useReportsUser = (distributor: string, reportId?: string) => {
  const { apiRequest } = useApiRequest();
  const [error, setError] = useState<string | null>(null);
  const [reportFetchLoading, setReportFetchLoading] = useState<boolean>(false);
  const [reportLoading, setReportLoading] = useState<boolean>(false);

  const currentReports = useCallback(async () => {
    setError(null); // Limpiar error al iniciar
    setReportFetchLoading(true);
    try {
      const url = `${routes.api.financial.reports.user.currentReports}?distributor=${distributor}`;
      const response = await apiRequest({
        url,
        method: "get",
        requiereAuth: true,
      });
      return response;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error fetching reports" : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setReportFetchLoading(false);
    }
  }, [apiRequest, distributor]);

  const {
    data,
    error: fetchError,
    mutate: dataMutate,
  } = useSWR<Report[]>(`${routes.api.financial.reports.user.currentReports}?distributor=${distributor}`, currentReports, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const downloadReport = useCallback(
    async (reportId: string) => {
      setReportLoading(true);
      setError(null); // Limpiar error al iniciar
      try {
        const url = `${routes.api.financial.reports.user.downloadReport}/${reportId}`;
        const response = await apiRequest({
          url,
          method: "get",
          requiereAuth: true,
        });
        if (response.url === "Pending") {
          throw new Error("CSV file has not been generated yet.");
        }
        return response.url; // Ensure the URL is correctly extracted
      } catch (err) {
        const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error downloading report" : err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setReportLoading(false);
      }
    },
    [apiRequest]
  );

  return {
    reportData: data,
    reportError: error,
    reportFetchLoading,
    reportLoading,
    downloadReport,
    mutate: dataMutate,
  };
};
