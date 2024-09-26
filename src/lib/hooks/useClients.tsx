import useSWR, { mutate } from "swr";
import { useState, useCallback } from "react";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import apiRoutes from "@/lib/routes/apiRoutes";

type Client = any; // Replace 'any' with your actual client type

/**
 * Custom hook to handle client data operations, including fetching, creating, updating, and deleting clients.
 *
 * @param {string} [clientId] - Optional client ID to fetch a specific client. If not provided, the hook will fetch all clients.
 *
 * @returns {object} - An object containing the client data, error status, loading status, and methods to create, update, and delete clients.
 */
export const useClients = (clientId?: string) => {
  const { apiRequest } = useApiRequest();
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  /**
   * Fetcher function to retrieve client data based on whether a specific clientId is provided or a search term is specified.
   *
   * @returns {Promise<any>} - Returns the client data from the API.
   *
   * @throws {Error} - Throws an error if the fetch request fails.
   */
  const fetcher = useCallback(async () => {
    try {
      const url = clientId
        ? `${apiRoutes.clients}/${clientId}` // Fetch a specific client by ID
        : searchTerm
        ? apiRoutes.clientsSearch // Search clients by a search term
        : apiRoutes.clients; // Fetch all clients

      const response = await apiRequest({
        url,
        method: "get",
        params: searchTerm ? { searchTerm } : {}, // Pass search parameters if searching
        requiereAuth: true,
      });
      return response.data;
    } catch (err) {
      setError("Error fetching clients");
      throw err;
    }
  }, [apiRequest, clientId, searchTerm]);

  /**
   * SWR hook to handle caching and data fetching.
   * It fetches data using the provided fetcher and manages cache and revalidation automatically.
   */
  const {
    data,
    error: fetchError,
    mutate: dataMutate,
  } = useSWR<Client | Client[]>(clientId ? `client-${clientId}` : "clients", fetcher, {
    revalidateOnFocus: false, // Disable revalidation when window regains focus
    shouldRetryOnError: false, // Disable automatic retries on error
  });

  /**
   * Function to create a new client by sending a POST request to the API.
   * After a successful creation, the client list is revalidated.
   *
   * @param {Client} clientData - The data of the client to be created.
   *
   * @returns {Promise<any>} - Returns the newly created client data.
   *
   * @throws {Error} - Throws an error if the creation request fails.
   */
  const createClient = useCallback(
    async (clientData: Client) => {
      setError(null);
      try {
        const response = await apiRequest({
          url: apiRoutes.clients,
          method: "post",
          requiereAuth: true,
          data: clientData,
        });

        // Revalidate the list of clients
        await mutate("clients");
        return response.data;
      } catch (err) {
        setError("Error creating client");
        throw err;
      }
    },
    [apiRequest]
  );

  /**
   * Function to update an existing client by sending a PUT request to the API.
   * Requires a valid clientId. After a successful update, the client data is revalidated.
   *
   * @param {Client} clientData - The updated data of the client.
   *
   * @returns {Promise<any>} - Returns the updated client data.
   *
   * @throws {Error} - Throws an error if the update request fails or if no clientId is provided.
   */
  const updateClient = useCallback(
    async (clientData: Client) => {
      if (!clientId) {
        throw new Error("Client ID is required to update client");
      }
      setError(null);
      try {
        const response = await apiRequest({
          url: `${apiRoutes.clients}/${clientId}`,
          method: "put",
          requiereAuth: true,
          data: clientData,
        });

        // Revalidate the client data
        await dataMutate();
        return response.data;
      } catch (err) {
        setError("Error updating client");
        throw err;
      }
    },
    [apiRequest, clientId, dataMutate]
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
  const deleteClients = useCallback(
    async (ids: number[]) => {
      setError(null);
      try {
        await apiRequest({
          url: apiRoutes.clients,
          method: "delete",
          requiereAuth: true,
          data: { ids },
        });

        // Revalidate the list of clients
        await mutate("clients");
      } catch (err) {
        setError("Error deleting clients");
        throw err;
      }
    },
    [apiRequest]
  );

  return {
    data, // Client data fetched from the API
    error: error || fetchError, // Error message, if any
    loading: !data && !error, // Loading state: true when data is being fetched
    createClient, // Function to create a client
    updateClient, // Function to update a client
    deleteClients, // Function to delete clients
    mutate: dataMutate, // Expose mutate to manually trigger revalidation
    searchTerm, // Search term for filtering clients
    setSearchTerm, // Function to set the search term
  };
};
