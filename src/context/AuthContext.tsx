"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { clearUserData, setUserData } from "@/lib/redux/slices/userSlice";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { useAppDispatch } from "@/lib/redux/hooks";
import axios from "axios";
import routes from "@/lib/routes/routes";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface AuthContextType {
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { apiRequest } = useApiRequest();
  const { api, web } = routes;
  const [isClient, setIsClient] = useState(false); // Nuevo estado para manejar la carga del cliente

  useEffect(() => {
    setIsClient(true); // Cambia a true cuando el componente está montado en el cliente
  }, []);

  const isAuthenticated = isClient && Cookies.get("isAuthenticated") === "true";
  const accessToken = isClient ? Cookies.get("access_token") : null;

  useEffect(() => {
    if (isClient && accessToken) {
      const decodedToken = jwtDecode<JwtPayload>(accessToken);
      const expirationTime = decodedToken?.exp ? decodedToken.exp * 1000 : 0;
      const timeRemaining = expirationTime - Date.now();

      if (timeRemaining > 0) {
        const timeoutId = setTimeout(logout, timeRemaining);
        return () => clearTimeout(timeoutId);
      } else {
        logout();
      }
    }
  }, [accessToken, isClient]);

  const fetchUserData = async () => {
    try {
      const response = await apiRequest({
        url: api.auth.me,
        method: "get",
        requiereAuth: true,
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        logout();
      }
      throw error;
    }
  };

  useSWR(isAuthenticated ? "userData" : null, fetchUserData, {
    onSuccess: (data) => dispatch(setUserData(data)),
    onError: (error) => console.error("Error fetching user data:", error),
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

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
      await mutate("userData");
      router.push(web.portal.overview);
    } catch (error) {
      handleAuthError(error);
    }
  };

  const logout = async () => {
    await mutate("userData", null, { revalidate: false });
    dispatch(clearUserData());
    clearAuthCookies();
    router.push(web.login);
  };

  const forgotPassword = async (email: string) => {
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

  const setAuthCookies = (token: string) => {
    Cookies.set("access_token", token, { secure: true, sameSite: "Strict", expires: 1 / 24 });
    Cookies.set("isAuthenticated", "true", { secure: true, sameSite: "Strict" });
  };

  const clearAuthCookies = () => {
    Cookies.remove("access_token");
    Cookies.set("isAuthenticated", "false", { secure: true, sameSite: "Strict" });
  };

  const handleAuthError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      switch (error.response?.status) {
        case 401:
          setError("Invalid credentials");
          break;
        case 500:
          setError("Internal Server Error");
          break;
        default:
          setError("Unknow error");
      }
    }
  };

  return <AuthContext.Provider value={{ error, login, logout, setError, forgotPassword }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
