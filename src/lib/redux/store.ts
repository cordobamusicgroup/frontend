import { configureStore, combineReducers } from "@reduxjs/toolkit";
import loaderReducer from "@/lib/redux/slices/loaderSlice";
import userReducer from "@/lib/redux/slices/userSlice";
import menuSlice from "./slices/menuSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Esto utiliza localStorage como almacenamiento

const menuPersistConfig = {
  key: "menu",
  storage,
  whitelist: ["isOpen"], // Asegúrate de que solo el estado `isOpen` persista
};

// Combinar todos los reducers y aplicar persistencia a los necesarios
const rootReducer = combineReducers({
  loader: loaderReducer, // No persistido
  user: userReducer, // Persistir el estado de user
  menu: persistReducer(menuPersistConfig, menuSlice), // Persistir el estado de menu
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
