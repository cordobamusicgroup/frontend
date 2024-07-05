"use client";

import { globalReducer, initialState } from "@/lib/reducers/globalReducer";
import { Global } from "@emotion/react";
import { createContext, useContext, useReducer } from "react";

interface GlobalContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  const setLoading = (loading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  };

  return <GlobalContext.Provider value={{ ...state, setLoading }}>{children}</GlobalContext.Provider>;
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};
