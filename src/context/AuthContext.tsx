"use client";

import { createContext, useReducer, useContext, ReactNode, useEffect, useCallback, useState } from "react";
import apiRoutes from "@/lib/routes/apiRoutes";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { apiRequest } from "@/lib/apiHelper";
import { AuthState, User, authReducer, initialState } from "@/lib/reducers/authReducer";
import { useGlobal } from "./GlobalContext";

interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { setLoading, loading } = useGlobal();
  const router = useRouter();

  const getUserData = async () => {
    try {
      const userData = await apiRequest({
        url: apiRoutes.me,
        method: "get",
        requiereAuth: true,
      });
      localStorage.setItem("user", JSON.stringify(userData.data));
      return userData.data;
    } catch (error) {
      console.error("Error getting user data:", error);
      throw new Error("Error getting user data");
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      console.log(loading);
      const response = await apiRequest({
        url: apiRoutes.login,
        method: "post",
        data: { username, password },
        requiereAuth: false,
      });
      const { access_token, refresh_token } = response.data;
      Cookies.set("access_token", access_token, { expires: 1 / 24, secure: true, sameSite: "Strict" }); // Expira en 60 minutos
      const userData = await getUserData();
      router.push("/portal");
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          throw new Error("Invalid username or password. Please try again.");
        } else {
          throw new Error(`Login failed with status code: ${error.response.status}`);
        }
      } else {
        throw new Error("An error occurred while logging in. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    Cookies.remove("access_token");
    router.push("/auth");
  }, [router]);

  return <AuthContext.Provider value={{ login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
