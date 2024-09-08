import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoaderState {
  loading: boolean;
}

const initialState: LoaderState = {
  loading: false,
};

/**
 * Represents the loader slice of the Redux store.
 */
const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const selectLoading = (state: { loader: LoaderState }) => state.loader.loading;
export const { setLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
