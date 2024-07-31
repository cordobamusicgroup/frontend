"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReduxProvider from "./ReduxContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface ProviersProps {
  readonly children: React.ReactNode;
}
export default function TanstackQueryProvider({ children }: ProviersProps) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      {children}
    </QueryClientProvider>
  );
}
