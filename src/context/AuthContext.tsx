"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import api from "@/lib/axios";
import apiRoutes from "@/lib/apiRoutes";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

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
    const token = Cookies.get("access_token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get(apiRoutes.me)
        .then((response) => setUser(response.data.user))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    const response = await api.post(apiRoutes.login, { username, password });
    const { access_token } = response.data;
    Cookies.set("access_token", access_token, { expires: 1 / 24 }); // Expira en 60 minutos
    api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
    setUser(response.data.user);
    setLoading(false);
    router.push("/");
  };

  const logout = () => {
    Cookies.remove("access_token");
    delete api.defaults.headers.common["Authorization"];
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
