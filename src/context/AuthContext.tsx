"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import useSWR, { mutate } from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { clearUserData, setUserData } from "@/lib/redux/slices/userSlice";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { useTranslations } from "next-intl";
import { useAppDispatch } from "@/lib/redux/hooks";
import axios from "axios";
import routes from "@/lib/routes/routes";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface AuthContextType {
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { apiRequest } = useApiRequest();
  const t = useTranslations("pages.auth");
  const { api, web } = routes;

  const isAuthenticated = Cookies.get("isAuthenticated") === "true";
  const accessToken = Cookies.get("access_token");

  useEffect(() => {
    if (accessToken) {
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
  }, [accessToken]);

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
          setError(t("errors.invalidCredentials"));
          break;
        case 500:
          setError(t("errors.internalServerError"));
          break;
        default:
          setError(error.message === "Network Error" ? t("errors.networkError") : t("errors.defaultError"));
      }
    }
  };

  return <AuthContext.Provider value={{ error, login, logout, setError }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
