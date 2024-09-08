"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";
import useSWR, { mutate } from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { clearUserData, setUserData } from "@/lib/redux/slices/userSlice";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import apiRoutes from "@/lib/routes/apiRoutes";
import { useTranslations } from "next-intl";
import webRoutes from "@/lib/routes/webRoutes";
import { useAppDispatch } from "@/lib/redux/hooks";
import axios from "axios";

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

  const isAuthenticated = Cookies.get("isAuthenticated") === "true";

  const fetchUserData = async () => {
    const response = await apiRequest({
      url: apiRoutes.me,
      method: "get",
      requiereAuth: true,
    });
    return response.data;
  };

  useSWR(isAuthenticated ? "userData" : null, fetchUserData, {
    onSuccess: (data) => {
      dispatch(setUserData(data));
    },
    onError: (error) => {
      console.error("Error fetching user data:", error);
    },
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const login = async (username: string, password: string) => {
    try {
      const response = await apiRequest({
        url: apiRoutes.login,
        method: "post",
        data: { username, password },
        requiereAuth: false,
      });
      const { access_token } = response.data;
      Cookies.set("access_token", access_token, { expires: 1 / 24, secure: true, sameSite: "Strict" });
      Cookies.set("isAuthenticated", "true", { secure: true, sameSite: "Strict" });
      await mutate("userData");
      router.push(webRoutes.portal.overview);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 401) {
          setError(t("errors.invalidCredentials"));
        } else if (error.response && error.response.status === 500) {
          setError(t("errors.internalServerError"));
        } else if (error.message === "Network Error") {
          setError(t("errors.networkError"));
        } else {
          setError(t("errors.defaultError"));
        }
      }
    }
  };

  const logout = async () => {
    await mutate("userData", null, { revalidate: false });
    dispatch(clearUserData());
    Cookies.remove("access_token");
    Cookies.set("isAuthenticated", "false", { secure: true, sameSite: "Strict" });
    router.push(apiRoutes.login);
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
