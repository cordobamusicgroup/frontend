import useSWR, { mutate } from "swr";
import { useState, useCallback } from "react";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import routes from "../../routes/routes";
import axios from "axios";

type User = any;

export const useUsersAdmin = (userId?: string) => {
  const { apiRequest } = useApiRequest();
  const [error, setError] = useState<string | null>(null);
  const [userFetchLoading, setUserFetchLoading] = useState<boolean>(false);
  const [userLoading, setUserLoading] = useState<boolean>(false);

  const fetcher = useCallback(async () => {
    setError(null); // Clear error on start
    setUserFetchLoading(true);
    try {
      const url = userId ? `${routes.api.users.admin.root}/${userId}` : routes.api.users.admin.root;
      const response = await apiRequest({
        url,
        method: "get",
        requiereAuth: true,
      });
      return response;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error fetching users" : "Unknown error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setUserFetchLoading(false);
    }
  }, [apiRequest, userId]);

  const {
    data,
    error: fetchError,
    mutate: userMutate,
  } = useSWR<User | User[]>(userId ? `admin-user-${userId}` : "admin-users", fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const createUser = useCallback(
    async (userData: User) => {
      setUserLoading(true);
      setError(null); // Clear error on start
      try {
        const response = await apiRequest({
          url: routes.api.users.admin.register,
          method: "post",
          requiereAuth: true,
          data: userData,
        });
        await mutate("admin-users");
        return response;
      } catch (err) {
        const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error creating user" : "Unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setUserLoading(false);
      }
    },
    [apiRequest]
  );

  const updateUser = useCallback(
    async (userData: User) => {
      if (!userId) {
        throw new Error("User ID is required to update user");
      }
      setUserLoading(true);
      setError(null); // Clear error on start
      try {
        const response = await apiRequest({
          url: `${routes.api.users.admin.root}/${userId}`,
          method: "put",
          requiereAuth: true,
          data: userData,
        });
        await userMutate();
        return response;
      } catch (err) {
        const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error updating user" : "Unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setUserLoading(false);
      }
    },
    [apiRequest, userId, userMutate]
  );

  const deleteUsers = async (ids: number[]): Promise<boolean> => {
    setUserLoading(true);
    setError(null); // Clear error on start
    try {
      await apiRequest({
        url: routes.api.users.admin.root,
        method: "delete",
        requiereAuth: true,
        data: { ids },
      });
      await mutate("admin-users");
      return true;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error deleting users" : "Unknown error occurred";
      setError(errorMessage);
      return false;
    } finally {
      setUserLoading(false);
    }
  };

  const changeClientId = useCallback(
    async (clientId: number) => {
      setUserLoading(true);
      setError(null); // Clear error on start
      try {
        const response = await apiRequest({
          url: routes.api.users.admin.viewAs,
          method: "patch",
          requiereAuth: true,
          data: { clientId },
        });
        await userMutate();
        return response;
      } catch (err) {
        const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error changing client ID" : "Unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setUserLoading(false);
      }
    },
    [apiRequest, userMutate]
  );

  const getUserById = useCallback(
    async (id: number) => {
      setUserFetchLoading(true);
      setError(null); // Clear error on start
      try {
        const response = await apiRequest({
          url: routes.api.users.admin.getById(id),
          method: "get",
          requiereAuth: true,
        });
        return response;
      } catch (err) {
        const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error fetching user" : "Unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setUserFetchLoading(false);
      }
    },
    [apiRequest]
  );

  const resendWelcomeEmail = useCallback(
    async (email: string) => {
      setUserLoading(true);
      setError(null); // Clear error on start
      try {
        const response = await apiRequest({
          url: routes.api.users.admin.resendAccountInfo,
          method: "post",
          requiereAuth: true,
          data: { email },
        });
        return response;
      } catch (err) {
        const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error resending welcome email" : "Unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setUserLoading(false);
      }
    },
    [apiRequest]
  );

  return {
    userData: data,
    userError: error,
    userFetchLoading,
    userLoading,
    createUser,
    updateUser,
    deleteUsers,
    changeClientId,
    getUserById,
    resendWelcomeEmail,
    mutate: userMutate,
  };
};
