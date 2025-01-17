"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import loaderReducer from "@/lib/redux/slices/loaderSlice";
import userReducer from "@/lib/redux/slices/userSlice";
import pageDataSlice from "./slices/pageDataSlice";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Función para crear un storage condicionalmente solo en el cliente
const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

// Crear un almacenamiento de noop en el servidor y localStorage en el cliente
const storage = typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const pageDataPersistConfig = {
  key: "pageData",
  storage,
};

// Combinar todos los reducers y aplicar persistencia a los necesarios
const rootReducer = combineReducers({
  loader: loaderReducer, // No persistido
  user: userReducer, // Persistir el estado de user
  pageData: persistReducer(pageDataPersistConfig, pageDataSlice), // Persistir el estado de pageData
});

// Configurar la store sin envolver el root reducer completo en persistReducer
const store = configureStore({
  reducer: rootReducer, // Solo persistimos los reducers específicos
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Necesario para evitar advertencias con redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

export default store;
