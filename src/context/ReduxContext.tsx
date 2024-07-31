"use client";

import { Provider } from "react-redux";
import { ReactNode } from "react";
import store from "@/lib/redux/store";

interface ReduxProviderProps {
  children: ReactNode;
}

/**
 * ReduxProvider component.
 * 
 * @component
 * @param {ReduxProviderProps} props - The props for the ReduxProvider component.
 * @param {React.ReactNode} props.children - The children elements to be wrapped by the ReduxProvider.
 * @returns {React.ReactElement} The rendered ReduxProvider component.
 */
const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
