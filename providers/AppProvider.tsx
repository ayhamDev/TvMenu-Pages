import ReduxProvider from "@/store/Provider";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import React, { ReactNode } from "react";
import { PreviewProvider } from "./PreviewProvider";
import { ReactQueryClientProvider } from "./ReactQueryClientProvider";
import { NavigationGuardProvider } from "@/lib/next-navigation-guard";
const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ReduxProvider>
      <PreviewProvider>
        <ReactQueryClientProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            storageKey="theme"
          >
            <NuqsAdapter>
              <NavigationGuardProvider>{children}</NavigationGuardProvider>
            </NuqsAdapter>
          </ThemeProvider>
        </ReactQueryClientProvider>
      </PreviewProvider>
    </ReduxProvider>
  );
};

export default AppProvider;
