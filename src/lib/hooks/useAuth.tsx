import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearUserData, setUserData } from "@/lib/redux/slices/userSlice";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { useAppDispatch } from "@/lib/redux/hooks";
import axios from "axios";
import routes from "@/lib/routes/routes";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import { useAuthContext } from "@/context/AuthContext";

export interface ForgotPasswordResponse {
  message: string;
}

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch(); // Agregar dispatch
  const { apiRequest } = useApiRequest();
  const { api, web } = routes;
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuthCookies = (token: string) => {
    Cookies.set("access_token", token, { secure: true, sameSite: "Strict", expires: 1 / 24 });
    Cookies.set("isAuthenticated", "true", { secure: true, sameSite: "Strict" });
    setIsAuthenticated(true);
  };

  const handleAuthError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      setError("Invalid credentials");
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await apiRequest({
        url: api.auth.login,
        method: "post",
        data: { username, password },
        requiereAuth: false,
      });
      const { access_token } = response;
      setAuthCookies(access_token);
      router.push(web.portal.overview);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const logout = async () => {
    dispatch(clearUserData());
    Cookies.remove("access_token");
    Cookies.set("isAuthenticated", "false", { secure: true, sameSite: "Strict" });
    setIsAuthenticated(false);
    router.push(web.login);
  };

  const forgotPassword = async (email: string): Promise<ForgotPasswordResponse> => {
    try {
      const response = await apiRequest({
        url: api.auth.forgotPassword,
        method: "post",
        data: { email },
        requiereAuth: false,
      });
      return response;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  return {
    error,
    setError,
    login,
    logout,
    isAuthenticated,
    forgotPassword,
  };
};
