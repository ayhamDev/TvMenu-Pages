import ReduxProvider from "@/store/Provider";
import { ThemeProvider, ThemeProviderProps } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React, { ReactNode } from "react";
import { PreviewProvider } from "./PreviewProvider";
import { ReactQueryClientProvider } from "./ReactQueryClientProvider";
import { NavigationGuardProvider } from "@/lib/next-navigation-guard";
import { Toaster } from "@/components/ui/toaster";
const AppProvider = ({
  children,
  ThemeProviderProps,
}: {
  children: ReactNode;
  ThemeProviderProps: ThemeProviderProps;
}) => {
  return (
    <ReduxProvider>
      <PreviewProvider>
        <ReactQueryClientProvider>
          <ThemeProvider {...ThemeProviderProps}>
            <NuqsAdapter>
              <NavigationGuardProvider>{children}</NavigationGuardProvider>
              <Toaster />
            </NuqsAdapter>
          </ThemeProvider>
        </ReactQueryClientProvider>
      </PreviewProvider>
    </ReduxProvider>
  );
};

export default AppProvider;
