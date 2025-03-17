"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback, useRef } from "react";
import useSWR, { mutate } from "swr";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import axios from "axios";
import routes from "@/lib/routes/routes";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useAppStore } from "@/lib/zustand/zustandStore";

interface AuthContextType {
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
}

interface TokenPayload extends JwtPayload {
  role?: string;
}

interface TokensResponse {
  access_token: string;
  refresh_token: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { apiRequest } = useApiRequest();
  const { api, web } = routes;
  const [isClient, setIsClient] = useState(false);
  const refreshing = useRef(false);
  // Change from NodeJS.Timeout to number for browser compatibility
  const refreshTokenTimeoutRef = useRef<number | null>(null);

  // Initialize the client-side flag on component mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  const isAuthenticated = Cookies.get("isAuthenticated") === "true";
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  const setupTokenRefresh = useCallback((token: string) => {
    if (!token) return;

    try {
      // Clear any existing timeout
      if (refreshTokenTimeoutRef.current) {
        window.clearTimeout(refreshTokenTimeoutRef.current);
        refreshTokenTimeoutRef.current = null;
      }

      const decodedToken = jwtDecode<TokenPayload>(token);
      const expirationTime = decodedToken?.exp ? decodedToken.exp * 1000 : 0;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      // If the token is expired, refresh immediately
      if (timeUntilExpiry <= 0) {
        refreshTokens();
        return;
      }

      // Set a timeout to refresh the token 1 minute before it expires
      const refreshTime = Math.max(timeUntilExpiry - 60000, 0);
      // Use window.setTimeout instead of setTimeout directly for type clarity
      refreshTokenTimeoutRef.current = window.setTimeout(refreshTokens, refreshTime);

      console.log(`Token refresh scheduled in ${refreshTime / 1000} seconds`);
    } catch (error) {
      console.error("Error setting up token refresh:", error);
    }
  }, []);

  // Set up token refresh on mount and when token changes
  useEffect(() => {
    if (isClient && accessToken) {
      setupTokenRefresh(accessToken);
    }

    return () => {
      if (refreshTokenTimeoutRef.current) {
        window.clearTimeout(refreshTokenTimeoutRef.current);
        refreshTokenTimeoutRef.current = null;
      }
    };
  }, [accessToken, isClient, setupTokenRefresh]);

  const refreshTokens = async () => {
    if (refreshing.current || !refreshToken) return;

    refreshing.current = true;

    try {
      console.log("Refreshing tokens...");
      const response = await apiRequest<TokensResponse>({
        url: api.auth.refresh,
        method: "post",
        data: { refreshToken },
        requiereAuth: false,
      });

      setAuthCookies(response.access_token, response.refresh_token);
      console.log("Tokens refreshed successfully");

      // Setup the next refresh
      setupTokenRefresh(response.access_token);
    } catch (error) {
      console.error("Failed to refresh tokens:", error);
      await logout(false); // Silent logout
    } finally {
      refreshing.current = false;
    }
  };

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
        // Try refreshing the token first
        try {
          await refreshTokens();
          // Try fetching user data again after refreshing
          return await apiRequest({
            url: api.auth.me,
            method: "get",
            requiereAuth: true,
          });
        } catch (refreshError) {
          // If refresh fails, logout
          await logout(false);
        }
      }
      throw error;
    }
  };

  useSWR(isAuthenticated ? "userData" : null, fetchUserData, {
    onSuccess: (data) => {
      const { setUserData } = useAppStore.user.getState();
      setUserData(data);
    },
    onError: (error) => console.error("Error fetching user data:", error),
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest<TokensResponse>({
        url: api.auth.login,
        method: "post",
        data: { username, password },
        requiereAuth: false,
      });

      const { access_token, refresh_token } = response;
      setAuthCookies(access_token, refresh_token);
      await mutate("userData");
      router.push(web.portal.overview);
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (sendRequest = true) => {
    setIsLoading(true);
    try {
      // Clear any refresh token timeouts
      if (refreshTokenTimeoutRef.current) {
        window.clearTimeout(refreshTokenTimeoutRef.current);
        refreshTokenTimeoutRef.current = null;
      }

      if (sendRequest && refreshToken) {
        // Send a request to revoke the server-side refresh token
        await apiRequest({
          url: api.auth.logout,
          method: "post",
          data: { refreshToken },
          requiereAuth: true,
        }).catch((error) => console.error("Error during logout:", error));
      }

      // Reset client-side state regardless of API call success
      await mutate("userData", null, { revalidate: false });
      const { clearUserData } = useAppStore.user.getState();
      clearUserData();
      clearAuthCookies();
      router.push(web.login);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const response = await apiRequest({
        url: api.auth.resetPassword,
        method: "post",
        data: { token, newPassword },
        requiereAuth: false,
      });
      return response;
    } catch (error) {
      handleAuthError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const setAuthCookies = (accessToken: string, refreshToken: string) => {
    // Get access token expiry from decoded token
    const decodedToken = jwtDecode<JwtPayload>(accessToken);
    const expiresAt = decodedToken.exp ? new Date(decodedToken.exp * 1000) : new Date(Date.now() + 3600 * 1000);

    Cookies.set("access_token", accessToken, {
      expires: expiresAt,
      secure: true,
      sameSite: "Strict",
    });

    // Store refresh token with longer expiry (7 days)
    Cookies.set("refresh_token", refreshToken, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
    });

    Cookies.set("isAuthenticated", "true", {
      secure: true,
      sameSite: "Strict",
    });
  };

  const clearAuthCookies = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    Cookies.set("isAuthenticated", "false", { secure: true, sameSite: "Strict" });
  };

  const handleAuthError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const errorCode = error.response?.data?.code;
      switch (errorCode) {
        case 1001:
          setError("User not found");
          break;
        case 1002:
          setError("Invalid username or password");
          break;
        case 1012:
          setError("Password is too weak");
          break;
        case 1013:
          setError("Invalid or expired token");
          break;
        case 1015:
          setError("Unauthorized access");
          break;
        case 1016:
          setError(error.response?.data?.message || "Validation error");
          break;
        case 1017: // Client Blocked
          setError("The client related to your user is blocked, contact us for more details.");
          break;
        default:
          setError("An unexpected error occurred");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        error,
        login,
        logout,
        setError,
        forgotPassword,
        resetPassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
