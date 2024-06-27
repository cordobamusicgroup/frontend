"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import apiRoutes from "@/lib/apiRoutes";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { apiRequest } from "@/lib/apiHelper";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const token = Cookies.get("access_token");
    if (token) {
      try {
        const response = await apiRequest({
          url: apiRoutes.me,
          method: "get",
          requiereAuth: true,
        });
        setUser(response.data.user);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const response = await apiRequest({
        url: apiRoutes.login,
        method: "post",
        data: { username, password },
        requiereAuth: false,
      });
      const { access_token } = response.data;
      Cookies.set("access_token", access_token, { expires: 1 / 24 }); // Expira en 60 minutos
      setUser(response.data.user);
      router.push("/");
    } catch (error) {
      throw new Error("Failed to log in. Please check your username and password and try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove("access_token");
    setUser(null);
    router.push("/auth");
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
