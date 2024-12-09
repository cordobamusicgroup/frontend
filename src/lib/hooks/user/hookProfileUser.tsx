import { useState, useCallback } from "react";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import axios from "axios";
import routes from "@/lib/routes/routes";
import useSWR, { mutate } from "swr";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export const useProfileUser = () => {
  const { apiRequest } = useApiRequest();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const editProfile = useCallback(
    async (updateUserPayload: Record<string, any>) => {
      setError(null); // Clear error on start
      setLoading(true);
      try {
        const url = routes.api.users.editProfile;
        const response = await apiRequest({
          url,
          method: "patch",
          data: updateUserPayload,
          requiereAuth: true,
        });
        await mutate("userData"); // Refresh userData after updating profile
        return response;
      } catch (err) {
        const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error updating profile" : "Unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiRequest]
  );

  const getCurrentUser = useCallback(async () => {
    setError(null); // Clear error on start
    setLoading(true);
    try {
      const url = routes.api.users.getCurrent;
      const response = await apiRequest({
        url,
        method: "get",
        requiereAuth: true,
      });
      return response;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error fetching current user" : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  return {
    editProfile,
    getCurrentUser, // New function added to return object
    error,
    loading,
  };
};
