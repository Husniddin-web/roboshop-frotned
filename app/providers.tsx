"use client";

import type React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store, persistor } from "@/lib/store";
import { useState } from "react";
import { Toaster } from "sonner";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <I18nextProvider i18n={i18n}>
            <>
              {children}
              <Toaster position="top-right" richColors closeButton />
            </>
          </I18nextProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}
