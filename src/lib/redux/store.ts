import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "@/lib/redux/slices/loaderSlice";
import userReducer from "@/lib/redux/slices/userSlice";
import languageReducer from "@/lib/redux/slices/languageSlice";

/**
 * The Redux store that holds the complete state tree of the application.
 */
const store = configureStore({
  reducer: {
    loader: loaderReducer,
    language: languageReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
