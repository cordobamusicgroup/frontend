import useSWR from "swr";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import routes from "../routes/routes";

export const useCountries = () => {
  const { apiRequest } = useApiRequest();
  const api = routes.api;

  const fetchCountries = async () => {
    const response = await apiRequest({
      url: api.countries,
      method: "get",
      requiereAuth: true,
    });
    return response;
  };

  const {
    data,
    error: countriesError,
    isLoading: countriesLoading,
  } = useSWR<any[], Error>("countries", fetchCountries, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    countries: data,
    countriesLoading, // Aquí se usa `loading` en lugar de `isLoading`
    countriesError,
  };
};
