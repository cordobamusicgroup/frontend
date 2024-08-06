"use client";

import FullScreenLoader from "@/components/molecules/loaders/FullScreenLoader";
import { selectLoading, setLoading } from "@/lib/redux/slices/loaderSlice";
import React, { createContext, useContext, ReactNode } from "react";
import { useSelector, useDispatch } from "react-redux";

interface LoaderContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const loading = useSelector(selectLoading);

  return (
    <LoaderContext.Provider value={{ loading, setLoading }}>
      {loading && <FullScreenLoader open={loading} />}
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};
