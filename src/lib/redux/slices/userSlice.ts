import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiRoutes from "@/lib/routes/apiRoutes";
import { apiRequest } from "@/lib/apiHelper";
import { AppDispatch } from "../store";
import { setLoading } from "./loaderSlice";

interface UserState {
  userData: any | null;
}

const initialState: UserState = {
  userData: null,
};

/**
 * Fetches user data asynchronously.
 *
 * @param _ - The payload (not used in this case).
 * @param dispatch - The Redux dispatch function.
 * @param rejectWithValue - The Redux rejectWithValue function.
 * @returns A promise that resolves to the fetched user data.
 */
export const fetchUserData = createAsyncThunk("user/fetchUserData", async (_, { dispatch, rejectWithValue }) => {
  dispatch(setLoading(true));
  try {
    const userData = await apiRequest({
      url: apiRoutes.me,
      method: "get",
      requiereAuth: true,
    });
    return userData.data;
  } catch (error: any) {
    return rejectWithValue("Failed to fetch user data.");
  } finally {
    dispatch(setLoading(false));
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.userData = null;
      });
  },
});

export default userSlice.reducer;
