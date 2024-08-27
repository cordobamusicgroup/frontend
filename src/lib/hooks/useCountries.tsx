import useSWR from "swr";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import apiRoutes from "@/lib/routes/apiRoutes";

export const useCountries = () => {
  const { apiRequest } = useApiRequest();

  const fetchCountries = async () => {
    const response = await apiRequest({
      url: apiRoutes.countries,
      method: "get",
      requiereAuth: true,
    });
    return response.data;
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
