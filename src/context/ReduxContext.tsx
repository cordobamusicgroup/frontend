"use client";

import { Provider } from "react-redux";
import { ReactNode } from "react";
import store, { persistor } from "@/lib/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Fullscreen } from "@mui/icons-material";
import FullScreenLoader from "@/components/molecules/loaders/FullScreenLoader";

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
  return (
    <Provider store={store}>
      <PersistGate loading={<FullScreenLoader open/>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
