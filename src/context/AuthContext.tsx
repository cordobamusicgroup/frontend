"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setUserData, clearUserData } from "@/lib/redux/slices/userSlice";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { useRouter } from "next/navigation";
import routes from "@/lib/routes/routes";
import useSWR from "swr";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Cookies from "js-cookie";
import { useAuth } from "@/lib/hooks/useAuth"; // Agregar esta importación

interface AuthContextType {
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType>({ isInitialized: false });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { apiRequest } = useApiRequest();
  const { logout } = useAuth(); // Usar logout del hook
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Validación de expiración del token
  useEffect(() => {
    if (isClient) {
      const token = Cookies.get("access_token");
      if (token) {
        const decodedToken = jwtDecode<JwtPayload>(token);
        const expirationTime = decodedToken?.exp ? decodedToken.exp * 1000 : 0;
        const timeRemaining = expirationTime - Date.now();

        if (timeRemaining > 0) {
          const timeoutId = setTimeout(logout, timeRemaining);
          return () => clearTimeout(timeoutId);
        } else {
          logout();
        }
      }
    }
  }, [isClient, logout]);

  // Carga inicial del usuario
  const fetchUserData = async () => {
    try {
      const response = await apiRequest({
        url: routes.api.auth.me,
        method: "get",
        requiereAuth: true,
      });
      return response;
    } catch (error) {
      logout();
      throw error;
    }
  };

  const { data: userData } = useSWR("initialUserData", fetchUserData, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  useEffect(() => {
    if (userData) {
      dispatch(setUserData(userData));
    }
  }, [userData, dispatch]);

  return <AuthContext.Provider value={{ isInitialized: true }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};
