"use client";

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (params: { username: string; password: string; router: any }) => Promise<any>;
  logout: () => void;
  authError: string | null;
  isLoading: boolean;
}
