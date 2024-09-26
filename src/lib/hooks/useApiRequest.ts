import React, { useState, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
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
  data: T | null;
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

  const apiRequest = useCallback(async <T = any>({ url, method, data, params, headers, isFormData = false, requiereAuth = true }: ApiParams): Promise<ApiRequestResponse<T>> => {
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
      return { data: response.data, error: null, loading: false };
    } catch (err: any) {
      console.error(`Error ${method}ing data to ${url}:`, err.message || err);
      setError(err.message || "Unknown error occurred");
      return { data: null, error: err.message, loading: false };
    } finally {
      setLoading(false);
    }
  }, []);

  return { apiRequest, loading, error };
};
