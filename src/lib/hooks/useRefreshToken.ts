import { useCallback } from "react";
import { useApiRequest } from "./useApiRequest";
import routes from "../routes/routes";
import Cookies from "js-cookie";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
}

export const useRefreshToken = () => {
  const { apiRequest } = useApiRequest();
  const { api } = routes;

  const refreshToken = useCallback(async () => {
    const currentRefreshToken = Cookies.get("refresh_token");

    if (!currentRefreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await apiRequest<RefreshTokenResponse>({
        url: api.auth.refresh,
        method: "post",
        data: { refreshToken: currentRefreshToken },
        requiereAuth: false,
      });

      const { access_token, refresh_token } = response;

      // Get token expiry from decoded token
      const decodedToken = jwtDecode<JwtPayload>(access_token);
      const expiresAt = decodedToken.exp ? new Date(decodedToken.exp * 1000) : new Date(Date.now() + 3600 * 1000);

      // Store new tokens
      Cookies.set("access_token", access_token, {
        expires: expiresAt,
        secure: true,
        sameSite: "Strict",
      });

      Cookies.set("refresh_token", refresh_token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      return { access_token, refresh_token };
    } catch (error) {
      // If refresh fails, clear tokens
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
      Cookies.set("isAuthenticated", "false", { secure: true, sameSite: "Strict" });
      throw error;
    }
  }, [apiRequest, api.auth.refresh]);

  return { refreshToken };
};
