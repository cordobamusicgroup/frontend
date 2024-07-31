import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import apiRoutes from "../../routes/apiRoutes";
import { apiRequest } from "../../apiHelper";
import { setLoading } from "./loaderSlice";
import { fetchUserData } from "./userSlice";

interface AuthState {
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  error: null,
};

/**
 * Logs in the user asynchronously.
 *
 * @param {Object} params - The login parameters.
 * @param {string} params.username - The username.
 * @param {string} params.password - The password.
 * @param {any} params.router - The router object.
 * @param {Object} options - The options for the async thunk.
 * @param {Function} options.dispatch - The dispatch function.
 * @param {Function} options.rejectWithValue - The rejectWithValue function.
 * @returns {Promise<any>} - A promise that resolves to the response data.
 */
export const login = createAsyncThunk("auth/login", async ({ username, password, router }: { username: string; password: string; router: any }, { dispatch, rejectWithValue }) => {
  dispatch(setLoading(true));
  try {
    const response = await apiRequest({
      url: apiRoutes.login,
      method: "post",
      data: { username, password },
      requiereAuth: false,
    });
    const { access_token } = response.data;
    Cookies.set("access_token", access_token, { expires: 1 / 24, secure: true, sameSite: "Strict" });
    router.push("/portal");
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      return rejectWithValue("Invalid username or password. Please try again.");
    } else if (error.response && error.response.status === 500) {
      return rejectWithValue("Internal server error. Please try again later.");
    } else if (error.message === "Network Error") {
      return rejectWithValue("Network error. Please check your connection.");
    }
    return rejectWithValue("An error occurred while logging in. Please try again later.");
  } finally {
    dispatch(fetchUserData());
    dispatch(setLoading(false));
  }
});

/**
 * Logs out the user asynchronously.
 *
 * @param {Object} params - The logout parameters.
 * @param {any} params.router - The router object.
 * @param {Object} options - The options for the async thunk.
 * @param {Function} options.dispatch - The dispatch function.
 * @param {Function} options.rejectWithValue - The rejectWithValue function.
 * @returns {Promise<void>} - A promise that resolves when the logout is complete.
 */
export const logout = createAsyncThunk("auth/logout", async ({ router }: { router: any }, { dispatch }) => {
  dispatch(setLoading(true));
  try {
    Cookies.remove("access_token");
    router.push(apiRoutes.login);
  } catch (error: any) {
    console.error("An error occurred while logging out:", error);
  } finally {
    dispatch(setIsAuthenticated(false));
    dispatch(setLoading(false));
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state) => {
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;
