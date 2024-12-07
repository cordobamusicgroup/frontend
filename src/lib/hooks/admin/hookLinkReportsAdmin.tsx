import useSWR, { mutate } from "swr";
import { useState, useCallback } from "react";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import routes from "@/lib/routes/routes";

type UnlinkedReport = any; // Replace 'any' with your actual unlinked report type

export const useLinkReports = () => {
  const { apiRequest } = useApiRequest();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUnlinkedReports = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest({
        url: routes.api.financial.reports.admin.unlinked.get,
        method: "get",
        requiereAuth: true,
      });
      return response;
    } catch (err) {
      setError("Error fetching unlinked reports");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  const {
    data: unlinkedReports,
    error: fetchError,
    mutate: dataMutate,
  } = useSWR<UnlinkedReport[]>("unlinked-reports", fetchUnlinkedReports, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const linkReport = useCallback(
    async (unlinkedReportId: number, labelId: number) => {
      setError(null);
      setLoading(true);
      try {
        const response = await apiRequest({
          url: routes.api.financial.reports.admin.unlinked.linkMissing,
          method: "post",
          requiereAuth: true,
          data: { unlinkedReportId, labelId },
        });
        return response;
      } catch (err) {
        setError("Error linking report");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest]
  );

  return {
    unlinkedReports,
    unlinkedReportsError: error || fetchError,
    unlinkedReportsLoading: loading,
    linkReport,
    error,
    loading,
    mutate: dataMutate,
  };
};
