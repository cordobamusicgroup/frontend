import React, { useState, useCallback } from "react";
import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

// Configuración global de Axios
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

interface ApiParams {
  url: string;
  method: "get" | "post" | "put" | "delete";
  data?: any;
  params?: any;
  headers?: any;
  isFormData?: boolean;
  requiereAuth?: boolean;
}

interface ApiRequestResponse<T = any> {
  result: T | null;
  error: string | null;
  loading: boolean;
}

/**
 * Custom hook to make an API request using Axios and manage loading, error, and data state.
 *
 * @returns An object containing apiRequest function, loading state, and error state.
 */
export const useApiRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiRequest = useCallback(async <T = any>({ url, method, data, params, headers, isFormData = false, requiereAuth = true }: ApiParams): Promise<T> => {
    setLoading(true);
    setError(null);

    const token = requiereAuth ? Cookies.get("access_token") : null;

    const config: AxiosRequestConfig = {
      url,
      method,
      data,
      params,
      headers: {
        "Content-Type": isFormData ? undefined : "application/json",
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      withCredentials: true,
    };

    try {
      const response = await api.request<T>(config);
      // Retorna solo los datos de la respuesta, sin encapsular en otro objeto
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "An error occurred");
        throw err;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { apiRequest, loading, error };
};
