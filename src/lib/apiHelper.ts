import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

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

/**
 * Makes an API request using Axios.
 *
 * @param url - The URL to send the request to.
 * @param method - The HTTP method to use for the request.
 * @param data - The data to send with the request.
 * @param params - The query parameters to include in the request URL.
 * @param headers - The headers to include in the request.
 * @param isFormData - Indicates whether the request data is of type FormData.
 * @param requiereAuth - Indicates whether the request requires authentication.
 * @returns A Promise that resolves to the AxiosResponse containing the response data.
 * @throws If an error occurs during the request.
 */
export const apiRequest = async ({ url, method, data, params, headers, isFormData = false, requiereAuth = true }: ApiParams): Promise<AxiosResponse<any>> => {
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
    const response = await api.request(config);
    return response;
  } catch (error) {
    console.error(`Error ${method}ing data to ${url}:`, error);
    throw error;
  }
};

export default api;
