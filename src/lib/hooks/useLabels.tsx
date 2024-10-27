import useSWR, { mutate } from "swr";
import { useState, useCallback } from "react";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import routes from "../routes/routes";
import axios from "axios";
import { set } from "react-hook-form";

type Label = any; // Replace 'any' with your actual client type

// TODO: #Labels, #Clients : Modificar manejo de errores en los hooks de useClients y useLabels

/**
 * Custom hook to handle client data operations, including fetching, creating, updating, and deleting clients.
 *
 * @param {string} [labelId] - Optional client ID to fetch a specific client. If not provided, the hook will fetch all clients.
 *
 * @returns {object} - An object containing the client data, error status, loading status, and methods to create, update, and delete clients.
 */
export const useLabels = (labelId?: string) => {
  const { apiRequest } = useApiRequest();
  const [error, setError] = useState<string | null>(null);
  const [labelFetchLoading, setlabelFetchLoading] = useState<boolean>(false); // Estado de carga para el fetch
  const [labelLoading, setlabelLoading] = useState<boolean>(false); // Estado de carga para create, update, delete

  /**
   * Fetcher function to retrieve client data based on whether a specific clientId is provided or a search term is specified.
   *
   * @returns {Promise<any>} - Returns the client data from the API.
   *
   * @throws {Error} - Throws an error if the fetch request fails.
   */
  const fetcher = useCallback(async () => {
    setlabelFetchLoading(true); // Inicia el estado de carga para el fetch
    try {
      const url = labelId
        ? `${routes.api.labels.root}/${labelId}` // Fetch a specific client by ID
        : routes.api.labels.root; // Fetch all clients

      const response = await apiRequest({
        url,
        method: "get",
        requiereAuth: true,
      });
      return response;
    } catch (err) {
      setError("Error fetching labels");
      throw err;
    } finally {
      setlabelFetchLoading(false); // Termina el estado de carga para el fetch
    }
  }, [apiRequest, labelId]);

  /**
   * SWR hook to handle caching and data fetching.
   * It fetches data using the provided fetcher and manages cache and revalidation automatically.
   */
  const {
    data,
    error: fetchError,
    mutate: dataMutate,
  } = useSWR<Label | Label[]>(labelId ? `label-${labelId}` : "labels", fetcher, {
    revalidateOnFocus: false, // Disable revalidation when window regains focus
    shouldRetryOnError: false, // Disable automatic retries on error
  });

  /**
   * Function to create a new client by sending a POST request to the API.
   * After a successful creation, the client list is revalidated.
   *
   * @param {Label} clientData - The data of the client to be created.
   *
   * @returns {Promise<any>} - Returns the newly created client data.
   *
   * @throws {Error} - Throws an error if the creation request fails.
   */
  const createLabel = useCallback(
    async (labelData: Label) => {
      setError(null);
      setlabelLoading(true);
      try {
        const response = await apiRequest({
          url: routes.api.labels.root,
          method: "post",
          requiereAuth: true,
          data: labelData,
        });

        await mutate("labels");
        return response;
      } catch (err) {
        setError("Error creating label");
        throw err;
      } finally {
        setlabelLoading(false);
      }
    },
    [apiRequest]
  );

  /**
   * Function to update an existing client by sending a PUT request to the API.
   * Requires a valid clientId. After a successful update, the client data is revalidated.
   *
   * @param {Label} clientData - The updated data of the client.
   *
   * @returns {Promise<any>} - Returns the updated client data.
   *
   * @throws {Error} - Throws an error if the update request fails or if no clientId is provided.
   */
  const updateLabel = useCallback(
    async (labelData: Label) => {
      setlabelLoading(true);
      if (!labelId) {
        throw new Error("Label ID is required to update label");
      }
      setError(null);
      try {
        const response = await apiRequest({
          url: `${routes.api.labels.root}/${labelId}`,
          method: "put",
          requiereAuth: true,
          data: labelData,
        });

        // Revalidate the client data
        await dataMutate();
        return response;
      } catch (err) {
        setError("Error updating label");
        throw err;
      } finally {
        setlabelLoading(false);
      }
    },
    [apiRequest, labelId, dataMutate]
  );

  /**
   * Function to delete multiple clients by sending a DELETE request to the API.
   * After successful deletion, the client list is revalidated.
   *
   * @param {number[]} ids - Array of client IDs to be deleted.
   *
   * @returns {Promise<void>} - Returns nothing upon success.
   *
   * @throws {Error} - Throws an error if the deletion request fails.
   */
  const deleteLabels = useCallback(
    async (ids: number[]) => {
      setlabelLoading(true);
      setError(null);
      try {
        await apiRequest({
          url: routes.api.labels.root,
          method: "delete",
          requiereAuth: true,
          data: { ids },
        });

        // Revalidate the list of clients
        await mutate("labels");
      } catch (err) {
        const errorMessage = axios.isAxiosError(err) ? err.response?.data?.message || "Error deleting client" : "Unknown error occurred";
        setError(errorMessage);
        throw err;
      } finally {
        setlabelLoading(false);
      }
    },
    [apiRequest]
  );

  return {
    labelData: data, // Client data fetched from the API
    labelError: error || fetchError, // Error message, if any
    labelFetchLoading, // Loading status for fetching data
    labelLoading,
    createLabel, // Function to create a client
    updateLabel, // Function to update a client
    deleteLabels, // Function to delete clients
    mutate: dataMutate, // Expose mutate to manually trigger revalidation
  };
};
